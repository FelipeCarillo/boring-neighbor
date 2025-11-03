from typing import Optional
from sqlalchemy.orm import Session
from fastapi import UploadFile

from src.entities.construction import ProgressCreate, ProgressResponse
from src.repositories.repositories.construction_progress_repo.construction_progress_repo import ConstructionProgressRepository
from src.repositories.repositories.construction_repo.construction_repo import ConstructionRepository
from src.repositories.models.construction import BIMReference
from src.helpers.errors import NotFoundException, ForbiddenException, BadRequestException
from src.infra.s3_manager import s3_service
from src.services.deviation_calculator import deviation_service


class ProgressService:
    """
    Service layer for construction progress business logic.
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.progress_repo = ConstructionProgressRepository(db)
        self.construction_repo = ConstructionRepository(db)
    
    async def register_progress(
        self,
        progress_data: ProgressCreate,
        file: UploadFile,
        user_id: str,
    ) -> ProgressResponse:
        """
        Register construction progress with photo.
        Automatically calculates deviation if BIM references exist.
        """
        construction = self.construction_repo.get_by_id(progress_data.construction_id)
        if not construction:
            raise NotFoundException(detail="Construction not found")
        
        is_assigned = self.construction_repo.is_user_assigned(
            progress_data.construction_id,
            user_id,
        )
        if not is_assigned:
            raise ForbiddenException(detail="User not assigned to this construction")
        
        if not file.content_type or not file.content_type.startswith("image/"):
            raise BadRequestException(detail="File must be an image")
        
        file_content = await file.read()
        
        folder = f"constructions/{progress_data.construction_id}/progress"
        s3_key = s3_service.upload_file(
            file_content=file_content,
            file_name=file.filename or "progress.jpg",
            content_type=file.content_type,
            folder=folder,
        )
        
        deviation_score = None
        bim_references = self._get_bim_references(
            progress_data.construction_id,
            progress_data.phase_id,
        )
        
        if bim_references:
            deviation_score = await self._calculate_deviation(
                bim_references,
                file_content,
            )
        
        progress = self.progress_repo.create(
            construction_id=progress_data.construction_id,
            phase_id=progress_data.phase_id,
            s3_photo_key=s3_key,
            registered_by=user_id,
            notes=progress_data.notes,
            deviation_score=deviation_score,
        )
        
        presigned_url = s3_service.generate_presigned_url(s3_key)
        
        response = ProgressResponse.model_validate(progress)
        response.presigned_url = presigned_url
        
        return response
    
    def get_progress(self, progress_id: str) -> ProgressResponse:
        """
        Get specific progress entry with deviation analysis.
        """
        progress = self.progress_repo.get_by_id(progress_id)
        if not progress:
            raise NotFoundException(detail="Progress entry not found")
        
        presigned_url = s3_service.generate_presigned_url(progress.s3_photo_key)
        
        response = ProgressResponse.model_validate(progress)
        response.presigned_url = presigned_url
        
        return response
    
    def list_progress_by_construction(
        self,
        construction_id: str,
    ) -> list[ProgressResponse]:
        """
        List all progress entries for a construction.
        """
        construction = self.construction_repo.get_by_id(construction_id)
        if not construction:
            raise NotFoundException(detail="Construction not found")
        
        progress_entries = self.progress_repo.list_by_construction(construction_id)
        
        results = []
        for progress in progress_entries:
            presigned_url = s3_service.generate_presigned_url(progress.s3_photo_key)
            response = ProgressResponse.model_validate(progress)
            response.presigned_url = presigned_url
            results.append(response)
        
        return results
    
    def _get_bim_references(
        self,
        construction_id: str,
        phase_id: Optional[str],
    ) -> list[BIMReference]:
        """
        Get BIM references for deviation calculation.
        """
        query = self.db.query(BIMReference).filter(
            BIMReference.construction_id == construction_id,
            BIMReference.deleted_at.is_(None),
        )
        
        if phase_id:
            query = query.filter(BIMReference.phase_id == phase_id)
        
        return query.all()
    
    async def _calculate_deviation(
        self,
        bim_references: list[BIMReference],
        progress_image: bytes,
    ) -> float:
        """
        Calculate deviation score against BIM references.
        """
        bim_images = []
        for bim_ref in bim_references:
            bim_image = s3_service.download_file(bim_ref.s3_key)
            bim_images.append(bim_image)
        
        if not bim_images:
            return None
        
        best_score, _ = deviation_service.calculate_best_match(
            bim_images,
            progress_image,
        )
        
        return best_score
    
    async def recalculate_deviations(
        self,
        construction_id: str,
        phase_id: Optional[str] = None,
    ) -> int:
        """
        Recalculate deviation scores for progress entries without scores.
        Called when new BIM references are uploaded.
        """
        progress_entries = self.progress_repo.list_without_deviation_score(
            construction_id,
            phase_id,
        )
        
        if not progress_entries:
            return 0
        
        bim_references = self._get_bim_references(construction_id, phase_id)
        if not bim_references:
            return 0
        
        updated_count = 0
        for progress in progress_entries:
            try:
                progress_image = s3_service.download_file(progress.s3_photo_key)
                deviation_score = await self._calculate_deviation(
                    bim_references,
                    progress_image,
                )
                
                if deviation_score is not None:
                    self.progress_repo.update(
                        progress.id,
                        deviation_score=deviation_score,
                    )
                    updated_count += 1
            except Exception:
                continue
        
        return updated_count



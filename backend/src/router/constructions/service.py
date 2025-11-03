from typing import Optional

from fastapi import UploadFile
from sqlalchemy.orm import Session

from src.entities.construction import (
    ConstructionCreate,
    ConstructionUpdate,
    ConstructionResponse,
    ConstructionDetail,
    BIMReferenceResponse,
    BIMModelResponse,
)
from src.entities.user import UserResponse
from src.helpers.enums import UserRole
from src.helpers.errors import NotFoundException, BadRequestException
from src.infra.s3_manager import s3_service
from src.repositories.models.construction import BIMReference
from src.repositories.repositories.bim_model_repo.bim_model_repo import BIMModelRepository
from src.repositories.repositories.construction_repo.construction_repo import ConstructionRepository
from src.repositories.repositories.construction_progress_repo.construction_progress_repo import ConstructionProgressRepository


class ConstructionService:
    """
    Service layer for construction business logic.
    """

    def __init__(self, db: Session):
        self.db = db
        self.construction_repo = ConstructionRepository(db)
        self.progress_repo = ConstructionProgressRepository(db)

    def create_construction(
            self,
            construction_data: ConstructionCreate,
            user_id: str,
    ) -> ConstructionResponse:
        """
        Create a new construction project.
        """
        construction = self.construction_repo.create(
            name=construction_data.name,
            description=construction_data.description,
            location=construction_data.location,
            start_date=construction_data.start_date,
            end_date=construction_data.end_date,
            created_by=user_id,
        )

        return ConstructionResponse.model_validate(construction)

    def get_construction(self, construction_id: str) -> ConstructionDetail:
        """
        Get construction details with relationships.
        """
        construction = self.construction_repo.get_by_id(construction_id)
        if not construction:
            raise NotFoundException(detail="Construction not found")

        progress_percentage = self._calculate_overall_progress(construction_id)

        model_3d_presigned_url = None
        if construction.model_3d_s3_key:
            model_3d_presigned_url = s3_service.generate_presigned_url(construction.model_3d_s3_key)

        bim_refs_with_urls = []
        for bim_ref in construction.bim_references:
            presigned_url = s3_service.generate_presigned_url(bim_ref.s3_key)
            bim_ref_response = BIMReferenceResponse.model_validate(bim_ref)
            bim_ref_response.presigned_url = presigned_url
            bim_refs_with_urls.append(bim_ref_response)

        return ConstructionDetail(
            id=construction.id,
            created_at=construction.created_at,
            updated_at=construction.updated_at,
            name=construction.name,
            description=construction.description,
            location=construction.location,
            start_date=construction.start_date,
            end_date=construction.end_date,
            status=construction.status,
            created_by=construction.created_by,
            assigned_users=[UserResponse.model_validate(u) for u in construction.assigned_users],
            bim_references=bim_refs_with_urls,
            model_3d_presigned_url=model_3d_presigned_url,
            model_3d_file_name=construction.model_3d_file_name,
            model_3d_file_size=construction.model_3d_file_size,
            model_3d_file_type=construction.model_3d_file_type,
            progress_percentage=progress_percentage,
        )

    def list_constructions(
            self,
            user_id: str,
            user_role: UserRole,
    ) -> list[ConstructionResponse]:
        """
        List constructions based on user role.
        ADMIN sees all, others see only assigned constructions.
        """
        if user_role == UserRole.ADMIN:
            constructions = self.construction_repo.list_all()
        else:
            constructions = self.construction_repo.list_by_user(user_id)

        result = []

        for construction in constructions:
            progress_percentage = self._calculate_overall_progress(construction.id)

            construction_data = ConstructionResponse.model_validate(construction)
            construction_data.progress_percentage = progress_percentage
            result.append(construction_data)

        return result

    def update_construction(
            self,
            construction_id: str,
            construction_data: ConstructionUpdate,
    ) -> ConstructionResponse:
        """
        Update construction information.
        """
        update_data = construction_data.model_dump(exclude_unset=True)

        construction = self.construction_repo.update(construction_id, **update_data)
        if not construction:
            raise NotFoundException(detail="Construction not found")

        return ConstructionResponse.model_validate(construction)

    def delete_construction(self, construction_id: str) -> bool:
        """
        Soft delete a construction.
        """
        success = self.construction_repo.soft_delete(construction_id)
        if not success:
            raise NotFoundException(detail="Construction not found")

        return success

    def assign_users(
            self,
            construction_id: str,
            user_ids: list[str],
    ) -> ConstructionDetail:
        """
        Assign multiple users to a construction.
        """
        construction = self.construction_repo.get_by_id(construction_id)
        if not construction:
            raise NotFoundException(detail="Construction not found")

        for user_id in user_ids:
            self.construction_repo.assign_user(construction_id, user_id)

        return self.get_construction(construction_id)

    def remove_user(
            self,
            construction_id: str,
            user_id: str,
    ) -> ConstructionDetail:
        """
        Remove a user from a construction.
        """
        construction = self.construction_repo.get_by_id(construction_id)
        if not construction:
            raise NotFoundException(detail="Construction not found")

        success = self.construction_repo.remove_user(construction_id, user_id)
        if not success:
            raise BadRequestException(detail="User not assigned to construction")

        return self.get_construction(construction_id)

    async def upload_bim_reference(
            self,
            construction_id: str,
            file: UploadFile,
            uploaded_by: str,
            description: Optional[str] = None,
    ) -> BIMReferenceResponse:
        """
        Upload a BIM reference image for a construction.
        """
        construction = self.construction_repo.get_by_id(construction_id)
        if not construction:
            raise NotFoundException(detail="Construction not found")

        if not file.content_type or not file.content_type.startswith("image/"):
            raise BadRequestException(detail="File must be an image")

        file_content = await file.read()

        folder = f"constructions/{construction_id}/bim"
        s3_key = s3_service.upload_file(
            file_content=file_content,
            file_name=file.filename or "bim_reference.jpg",
            content_type=file.content_type,
            folder=folder,
        )

        bim_ref = BIMReference(
            construction_id=construction_id,
            s3_key=s3_key,
            uploaded_by=uploaded_by,
            description=description,
        )

        self.db.add(bim_ref)
        self.db.commit()
        self.db.refresh(bim_ref)

        presigned_url = s3_service.generate_presigned_url(s3_key)

        response = BIMReferenceResponse.model_validate(bim_ref)
        response.presigned_url = presigned_url

        return response

    def delete_bim_reference(
            self,
            construction_id: str,
            bim_id: str,
    ) -> bool:
        """
        Delete a BIM reference image.
        """
        construction = self.construction_repo.get_by_id(construction_id)
        if not construction:
            raise NotFoundException(detail="Construction not found")

        bim_ref = self.db.query(BIMReference).filter(
            BIMReference.id == bim_id,
            BIMReference.construction_id == construction_id,
            BIMReference.deleted_at.is_(None),
        ).first()

        if not bim_ref:
            raise NotFoundException(detail="BIM reference not found")

        self.db.delete(bim_ref)
        self.db.commit()

        return True

    async def upload_model_3d(
            self,
            construction_id: str,
            file: UploadFile,
            uploaded_by: str,
    ) -> dict:
        """
        Upload a 3D model file for a construction.
        Suporta múltiplos formatos: .obj, .gltf, .glb, .fbx
        """
        construction = self.construction_repo.get_by_id(construction_id)
        if not construction:
            raise NotFoundException(detail="Construction not found")

        # Validar extensão - suporta múltiplos formatos
        allowed_extensions = ['.obj', '.gltf', '.glb', '.fbx']
        if not file.filename:
            raise BadRequestException(detail="File must have a filename")

        file_ext = None
        for ext in allowed_extensions:
            if file.filename.lower().endswith(ext):
                file_ext = ext.lstrip('.')
                break

        if not file_ext:
            raise BadRequestException(
                detail=f"File format not supported. Use one of: {', '.join(allowed_extensions)}"
            )

        file_content = await file.read()
        file_size = len(file_content)

        # Sem limite de tamanho para modelos 3D

        folder = f"constructions/{construction_id}/model_3d"
        s3_key = s3_service.upload_file(
            file_content=file_content,
            file_name=file.filename,
            content_type=file.content_type or "application/octet-stream",
            folder=folder,
        )

        # Atualizar construção com modelo 3D
        construction.model_3d_s3_key = s3_key
        construction.model_3d_file_name = file.filename
        construction.model_3d_file_size = file_size
        construction.model_3d_file_type = file_ext

        self.db.commit()
        self.db.refresh(construction)

        presigned_url = s3_service.generate_presigned_url(s3_key)

        return {
            "model_3d_presigned_url": presigned_url,
            "model_3d_file_name": file.filename,
            "model_3d_file_size": file_size,
            "model_3d_file_type": file_ext,
        }

    def delete_model_3d(self, construction_id: str) -> bool:
        """
        Delete the 3D model from a construction.
        """
        construction = self.construction_repo.get_by_id(construction_id)
        if not construction:
            raise NotFoundException(detail="Construction not found")

        if not construction.model_3d_s3_key:
            raise NotFoundException(detail="No 3D model found for this construction")

        # Deletar do S3 (opcional - pode manter para histórico)
        # s3_service.delete_file(construction.model_3d_s3_key)

        # Limpar campos na construção
        construction.model_3d_s3_key = None
        construction.model_3d_file_name = None
        construction.model_3d_file_size = None
        construction.model_3d_file_type = None

        self.db.commit()

        return True
    
    def _calculate_overall_progress(self, construction_id: str) -> float:
        """
        Calculate overall construction progress.
        Uses the BEST (highest) score from each BIM reference.
        Progress is calculated as: (sum of best scores) / (total BIMs * 100)
        BIMs without progress contribute 0%.
        """
        construction = self.construction_repo.get_by_id(construction_id)
        if not construction or not construction.bim_references:
            return 0.0
        
        total_bims = len(construction.bim_references)
        total_score = 0.0
        
        for bim_ref in construction.bim_references:
            progress_entries = self.progress_repo.list_by_bim_reference(bim_ref.id)
            
            if progress_entries:
                scores = [p.deviation_score for p in progress_entries if p.deviation_score is not None]
                if scores:
                    best_score = max(scores)
                    total_score += best_score
        
        return (total_score / total_bims) if total_bims > 0 else 0.0
    
    def get_construction_timeline(self, construction_id: str) -> list[dict]:
        """
        Get temporal evolution of construction progress.
        Returns chronological progression considering ALL BIMs in the construction.
        Progress is always calculated based on current total BIMs, not historical count.
        """
        construction = self.construction_repo.get_by_id(construction_id)
        if not construction:
            raise NotFoundException(detail="Construction not found")
        
        progress_entries = self.progress_repo.list_by_construction(construction_id)
        
        if not progress_entries:
            return []
        
        total_bims = len(construction.bim_references) if construction.bim_references else 1
        
        timeline_data = []
        seen_dates = set()
        
        for progress in sorted(progress_entries, key=lambda p: p.created_at):
            if progress.deviation_score is None:
                continue
            
            date_key = progress.created_at.date()
            
            if date_key not in seen_dates:
                seen_dates.add(date_key)
                
                entries_until_date = [
                    p for p in progress_entries 
                    if p.created_at.date() <= date_key and p.deviation_score is not None
                ]
                
                bim_scores_map = {}
                for entry in entries_until_date:
                    bim_id = entry.bim_reference_id
                    score = entry.deviation_score
                    
                    if bim_id not in bim_scores_map:
                        bim_scores_map[bim_id] = score
                    else:
                        bim_scores_map[bim_id] = max(bim_scores_map[bim_id], score)
                
                total_score = sum(bim_scores_map.values())
                overall_score = (total_score / total_bims) if total_bims > 0 else 0.0
                
                timeline_data.append({
                    'date': progress.created_at.isoformat(),
                    'score': overall_score,
                    'bim_count': len(bim_scores_map),
                    'total_bims': total_bims,
                })
        
        return timeline_data

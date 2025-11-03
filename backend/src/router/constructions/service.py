from typing import Optional
from sqlalchemy.orm import Session
from fastapi import UploadFile

from src.entities.construction import (
    ConstructionCreate,
    ConstructionUpdate,
    ConstructionResponse,
    ConstructionDetail,
    BIMReferenceResponse,
    PhaseResponse,
)
from src.entities.user import UserResponse
from src.repositories.repositories.construction_repo.construction_repo import ConstructionRepository
from src.repositories.repositories.construction_phase_repo.construction_phase_repo import ConstructionPhaseRepository
from src.repositories.models.construction import BIMReference
from src.helpers.errors import NotFoundException, ForbiddenException, BadRequestException
from src.helpers.enums import UserRole
from src.helpers.phase_initializer import initialize_standard_phases
from src.infra.s3_manager import s3_service


class ConstructionService:
    """
    Service layer for construction business logic.
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.construction_repo = ConstructionRepository(db)
    
    def create_construction(
        self,
        construction_data: ConstructionCreate,
        user_id: str,
    ) -> ConstructionResponse:
        """
        Create a new construction project with standard phases.
        """
        construction = self.construction_repo.create(
            name=construction_data.name,
            description=construction_data.description,
            location=construction_data.location,
            start_date=construction_data.start_date,
            end_date=construction_data.end_date,
            created_by=user_id,
        )
        
        initialize_standard_phases(construction.id, self.db)
        
        return ConstructionResponse.model_validate(construction)
    
    def get_construction(self, construction_id: str) -> ConstructionDetail:
        """
        Get construction details with relationships.
        """
        construction = self.construction_repo.get_by_id(construction_id)
        if not construction:
            raise NotFoundException(detail="Construction not found")
        
        phase_repo = ConstructionPhaseRepository(self.db)
        phases = phase_repo.list_by_construction(construction_id)
        
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
            phases=[PhaseResponse.model_validate(p) for p in phases],
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
        
        return [ConstructionResponse.model_validate(c) for c in constructions]
    
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
        phase_id: Optional[str] = None,
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
            phase_id=phase_id,
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


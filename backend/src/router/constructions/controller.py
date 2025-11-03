from sqlalchemy.orm import Session
from fastapi import UploadFile

from src.entities.construction import (
    ConstructionCreate,
    ConstructionUpdate,
    ConstructionResponse,
    ConstructionDetail,
    AssignUserRequest,
    BIMUploadRequest,
    BIMReferenceResponse,
    BIMModelResponse,
)
from src.router.constructions.service import ConstructionService
from src.repositories.models.user import User


class ConstructionController:
    """
    Controller layer for construction endpoints.
    """
    
    @staticmethod
    def create_construction(
        construction_data: ConstructionCreate,
        current_user: User,
        db: Session,
    ) -> ConstructionResponse:
        """
        Create a new construction.
        """
        service = ConstructionService(db)
        return service.create_construction(construction_data, current_user.id)
    
    @staticmethod
    def get_construction(construction_id: str, db: Session) -> ConstructionDetail:
        """
        Get construction details.
        """
        service = ConstructionService(db)
        return service.get_construction(construction_id)
    
    @staticmethod
    def list_constructions(current_user: User, db: Session) -> list[ConstructionResponse]:
        """
        List constructions based on user role.
        """
        service = ConstructionService(db)
        return service.list_constructions(current_user.id, current_user.role)
    
    @staticmethod
    def update_construction(
        construction_id: str,
        construction_data: ConstructionUpdate,
        db: Session,
    ) -> ConstructionResponse:
        """
        Update construction.
        """
        service = ConstructionService(db)
        return service.update_construction(construction_id, construction_data)
    
    @staticmethod
    def delete_construction(construction_id: str, db: Session) -> dict:
        """
        Delete construction.
        """
        service = ConstructionService(db)
        service.delete_construction(construction_id)
        return {"message": "Construction deleted successfully"}
    
    @staticmethod
    def assign_users(
        construction_id: str,
        assign_data: AssignUserRequest,
        db: Session,
    ) -> ConstructionDetail:
        """
        Assign users to construction.
        """
        service = ConstructionService(db)
        return service.assign_users(construction_id, assign_data.user_ids)
    
    @staticmethod
    def remove_user(
        construction_id: str,
        user_id: str,
        db: Session,
    ) -> ConstructionDetail:
        """
        Remove user from construction.
        """
        service = ConstructionService(db)
        return service.remove_user(construction_id, user_id)
    
    @staticmethod
    async def upload_bim_reference(
        construction_id: str,
        file: UploadFile,
        current_user: User,
        db: Session,
        description: str | None = None,
    ) -> BIMReferenceResponse:
        """
        Upload BIM reference image.
        """
        service = ConstructionService(db)
        return await service.upload_bim_reference(
            construction_id=construction_id,
            file=file,
            uploaded_by=current_user.id,
            description=description,
        )
    
    @staticmethod
    def delete_bim_reference(
        construction_id: str,
        bim_id: str,
        db: Session,
    ) -> dict:
        """
        Delete BIM reference image.
        """
        service = ConstructionService(db)
        service.delete_bim_reference(construction_id, bim_id)
        return {"message": "BIM reference deleted successfully"}
    
    @staticmethod
    async def upload_model_3d(
        construction_id: str,
        file: UploadFile,
        current_user: User,
        db: Session,
    ) -> dict:
        """
        Upload 3D model file for construction.
        Suporta múltiplos formatos: .obj, .gltf, .glb, .fbx
        """
        service = ConstructionService(db)
        return await service.upload_model_3d(
            construction_id=construction_id,
            file=file,
            uploaded_by=current_user.id,
        )
    
    @staticmethod
    def delete_model_3d(construction_id: str, db: Session) -> dict:
        """
        Delete 3D model from construction.
        """
        service = ConstructionService(db)
        service.delete_model_3d(construction_id)
        return {"message": "3D model deleted successfully"}
    
    @staticmethod
    def get_construction_timeline(construction_id: str, db: Session) -> list[dict]:
        """
        Get temporal evolution of construction progress.
        """
        service = ConstructionService(db)
        return service.get_construction_timeline(construction_id)



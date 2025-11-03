from sqlalchemy.orm import Session
from fastapi import UploadFile

from src.entities.construction import ProgressCreate, ProgressResponse
from src.router.progress.service import ProgressService
from src.repositories.models.user import User


class ProgressController:
    """
    Controller layer for progress endpoints.
    """
    
    @staticmethod
    async def register_progress(
        progress_data: ProgressCreate,
        file: UploadFile,
        current_user: User,
        db: Session,
    ) -> ProgressResponse:
        """
        Register construction progress with photo.
        """
        service = ProgressService(db)
        return await service.register_progress(progress_data, file, current_user.id)
    
    @staticmethod
    def get_progress(progress_id: str, db: Session) -> ProgressResponse:
        """
        Get progress entry details.
        """
        service = ProgressService(db)
        return service.get_progress(progress_id)
    
    @staticmethod
    def list_progress_by_construction(
        construction_id: str,
        db: Session,
    ) -> list[ProgressResponse]:
        """
        List all progress entries for a construction.
        """
        service = ProgressService(db)
        return service.list_progress_by_construction(construction_id)



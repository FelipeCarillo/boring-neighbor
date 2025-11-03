from typing import Optional
from sqlalchemy.orm import Session, joinedload

from src.repositories.models.construction import ConstructionProgress
from src.repositories.repositories.construction_progress_repo.construction_progress_repo_interface import ConstructionProgressRepositoryInterface


class ConstructionProgressRepository(ConstructionProgressRepositoryInterface):
    """
    SQLAlchemy implementation of ConstructionProgress repository.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(
        self,
        construction_id: str,
        bim_reference_id: str,
        registered_by: str,
        s3_photo_key: str,
        notes: Optional[str] = None,
        deviation_score: Optional[float] = None,
    ) -> ConstructionProgress:
        """
        Create a new progress entry.
        """
        progress = ConstructionProgress(
            construction_id=construction_id,
            bim_reference_id=bim_reference_id,
            s3_photo_key=s3_photo_key,
            registered_by=registered_by,
            notes=notes,
            deviation_score=deviation_score,
        )
        self.db.add(progress)
        self.db.commit()
        self.db.refresh(progress)
        return progress
    
    def get_by_id(self, progress_id: str) -> Optional[ConstructionProgress]:
        """
        Get progress by ID with relationships.
        """
        return self.db.query(ConstructionProgress).options(
            joinedload(ConstructionProgress.registered_by_user),
            joinedload(ConstructionProgress.bim_reference),
        ).filter(
            ConstructionProgress.id == progress_id,
            ConstructionProgress.deleted_at.is_(None),
        ).first()
    
    def list_by_construction(self, construction_id: str) -> list[ConstructionProgress]:
        """
        List all progress entries for a construction.
        """
        return self.db.query(ConstructionProgress).options(
            joinedload(ConstructionProgress.registered_by_user),
            joinedload(ConstructionProgress.bim_reference),
        ).filter(
            ConstructionProgress.construction_id == construction_id,
            ConstructionProgress.deleted_at.is_(None),
        ).order_by(ConstructionProgress.created_at.desc()).all()
    
    def list_by_bim_reference(self, bim_reference_id: str) -> list[ConstructionProgress]:
        """
        List all progress entries for a specific BIM reference.
        """
        return self.db.query(ConstructionProgress).options(
            joinedload(ConstructionProgress.registered_by_user),
            joinedload(ConstructionProgress.bim_reference),
        ).filter(
            ConstructionProgress.bim_reference_id == bim_reference_id,
            ConstructionProgress.deleted_at.is_(None),
        ).order_by(ConstructionProgress.created_at.desc()).all()
    
    def update(self, progress_id: str, **kwargs) -> Optional[ConstructionProgress]:
        """
        Update progress fields.
        """
        progress = self.get_by_id(progress_id)
        if not progress:
            return None
        
        for key, value in kwargs.items():
            if hasattr(progress, key):
                setattr(progress, key, value)
        
        self.db.commit()
        self.db.refresh(progress)
        return progress
    
    def list_without_deviation_score(
        self,
        construction_id: str,
    ) -> list[ConstructionProgress]:
        """
        List progress entries without deviation scores.
        Used for retroactive calculation when BIM is uploaded.
        """
        query = self.db.query(ConstructionProgress).filter(
            ConstructionProgress.construction_id == construction_id,
            ConstructionProgress.deviation_score.is_(None),
            ConstructionProgress.deleted_at.is_(None),
        )
        
        return query.all()



from typing import Optional
from sqlalchemy.orm import Session, joinedload
from datetime import datetime

from src.repositories.models.construction import BIMModel
from src.repositories.repositories.bim_model_repo.bim_model_repo_interface import BIMModelRepositoryInterface


class BIMModelRepository(BIMModelRepositoryInterface):
    """
    SQLAlchemy implementation of BIMModel repository.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(
        self,
        construction_id: str,
        s3_key: str,
        file_name: str,
        file_size: int,
        uploaded_by: str,
        phase_id: Optional[str] = None,
        description: Optional[str] = None,
    ) -> BIMModel:
        bim_model = BIMModel(
            construction_id=construction_id,
            phase_id=phase_id,
            s3_key=s3_key,
            file_name=file_name,
            file_size=file_size,
            uploaded_by=uploaded_by,
            description=description,
        )
        self.db.add(bim_model)
        self.db.commit()
        self.db.refresh(bim_model)
        return bim_model
    
    def get_by_id(self, model_id: str) -> Optional[BIMModel]:
        return self.db.query(BIMModel).options(
            joinedload(BIMModel.uploaded_by_user),
            joinedload(BIMModel.phase),
        ).filter(
            BIMModel.id == model_id,
            BIMModel.deleted_at.is_(None),
        ).first()
    
    def list_by_construction(self, construction_id: str) -> list[BIMModel]:
        return self.db.query(BIMModel).filter(
            BIMModel.construction_id == construction_id,
            BIMModel.deleted_at.is_(None),
        ).order_by(BIMModel.created_at.desc()).all()
    
    def list_by_phase(self, phase_id: str) -> list[BIMModel]:
        return self.db.query(BIMModel).filter(
            BIMModel.phase_id == phase_id,
            BIMModel.deleted_at.is_(None),
        ).order_by(BIMModel.created_at.desc()).all()
    
    def soft_delete(self, model_id: str) -> bool:
        bim_model = self.db.query(BIMModel).filter(
            BIMModel.id == model_id,
            BIMModel.deleted_at.is_(None),
        ).first()
        
        if not bim_model:
            return False
        
        bim_model.deleted_at = datetime.utcnow()
        self.db.commit()
        return True


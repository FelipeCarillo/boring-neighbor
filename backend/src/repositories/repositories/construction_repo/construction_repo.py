from datetime import datetime, date
from typing import Optional
from sqlalchemy.orm import Session, joinedload

from src.repositories.models.construction import Construction
from src.repositories.models.user import User
from src.repositories.repositories.construction_repo.construction_repo_interface import ConstructionRepositoryInterface


class ConstructionRepository(ConstructionRepositoryInterface):
    """
    SQLAlchemy implementation of Construction repository.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(
        self,
        name: str,
        location: str,
        start_date: date,
        created_by: str,
        description: Optional[str] = None,
        end_date: Optional[date] = None,
    ) -> Construction:
        """
        Create a new construction project.
        """
        construction = Construction(
            name=name,
            description=description,
            location=location,
            start_date=start_date,
            end_date=end_date,
            created_by=created_by,
        )
        self.db.add(construction)
        self.db.commit()
        self.db.refresh(construction)
        return construction
    
    def get_by_id(self, construction_id: str) -> Optional[Construction]:
        """
        Get construction by ID with relationships loaded.
        """
        return self.db.query(Construction).options(
            joinedload(Construction.assigned_users),
            joinedload(Construction.created_by_user),
        ).filter(
            Construction.id == construction_id,
            Construction.deleted_at.is_(None),
        ).first()
    
    def list_all(self, include_deleted: bool = False) -> list[Construction]:
        """
        List all constructions.
        """
        query = self.db.query(Construction).options(
            joinedload(Construction.assigned_users),
        )
        
        if not include_deleted:
            query = query.filter(Construction.deleted_at.is_(None))
        
        return query.all()
    
    def list_by_user(self, user_id: str) -> list[Construction]:
        """
        List constructions assigned to a specific user or created by them.
        """
        return self.db.query(Construction).options(
            joinedload(Construction.assigned_users),
        ).join(
            Construction.assigned_users
        ).filter(
            User.id == user_id,
            Construction.deleted_at.is_(None),
        ).all()
    
    def update(self, construction_id: str, **kwargs) -> Optional[Construction]:
        """
        Update construction fields.
        """
        construction = self.get_by_id(construction_id)
        if not construction:
            return None
        
        for key, value in kwargs.items():
            if hasattr(construction, key) and value is not None:
                setattr(construction, key, value)
        
        self.db.commit()
        self.db.refresh(construction)
        return construction
    
    def soft_delete(self, construction_id: str) -> bool:
        """
        Soft delete a construction.
        """
        construction = self.get_by_id(construction_id)
        if not construction:
            return False
        
        construction.deleted_at = datetime.utcnow()
        self.db.commit()
        return True
    
    def assign_user(self, construction_id: str, user_id: str) -> bool:
        """
        Assign a user to a construction.
        """
        construction = self.get_by_id(construction_id)
        user = self.db.query(User).filter(User.id == user_id).first()
        
        if not construction or not user:
            return False
        
        if user not in construction.assigned_users:
            construction.assigned_users.append(user)
            self.db.commit()
        
        return True
    
    def remove_user(self, construction_id: str, user_id: str) -> bool:
        """
        Remove a user from a construction.
        """
        construction = self.get_by_id(construction_id)
        user = self.db.query(User).filter(User.id == user_id).first()
        
        if not construction or not user:
            return False
        
        if user in construction.assigned_users:
            construction.assigned_users.remove(user)
            self.db.commit()
        
        return True
    
    def is_user_assigned(self, construction_id: str, user_id: str) -> bool:
        """
        Check if a user is assigned to a construction.
        """
        construction = self.get_by_id(construction_id)
        if not construction:
            return False
        
        return any(user.id == user_id for user in construction.assigned_users)



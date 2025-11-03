from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session

from src.repositories.models.user import User
from src.repositories.repositories.user_repo.user_repo_interface import UserRepositoryInterface
from src.helpers.enums import UserRole


class UserRepository(UserRepositoryInterface):
    """
    SQLAlchemy implementation of User repository.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(
        self,
        registro: str,
        password_hash: str,
        name: str,
        email: str,
        role: UserRole,
    ) -> User:
        """
        Create a new user in the database.
        """
        user = User(
            registro=registro,
            password_hash=password_hash,
            name=name,
            email=email,
            role=role,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def get_by_id(self, user_id: str) -> Optional[User]:
        """
        Get user by ID, excluding soft-deleted users.
        """
        return self.db.query(User).filter(
            User.id == user_id,
            User.deleted_at.is_(None),
        ).first()
    
    def get_by_registro(self, registro: str) -> Optional[User]:
        """
        Get user by registro, excluding soft-deleted users.
        """
        return self.db.query(User).filter(
            User.registro == registro,
            User.deleted_at.is_(None),
        ).first()
    
    def get_by_email(self, email: str) -> Optional[User]:
        """
        Get user by email, excluding soft-deleted users.
        """
        return self.db.query(User).filter(
            User.email == email,
            User.deleted_at.is_(None),
        ).first()
    
    def list_all(self, include_deleted: bool = False) -> list[User]:
        """
        List all users.
        """
        query = self.db.query(User)
        
        if not include_deleted:
            query = query.filter(User.deleted_at.is_(None))
        
        return query.all()
    
    def update(self, user_id: str, **kwargs) -> Optional[User]:
        """
        Update user fields.
        """
        user = self.get_by_id(user_id)
        if not user:
            return None
        
        for key, value in kwargs.items():
            if hasattr(user, key) and value is not None:
                setattr(user, key, value)
        
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def soft_delete(self, user_id: str) -> bool:
        """
        Soft delete a user by setting deleted_at timestamp.
        """
        user = self.get_by_id(user_id)
        if not user:
            return False
        
        user.deleted_at = datetime.utcnow()
        self.db.commit()
        return True



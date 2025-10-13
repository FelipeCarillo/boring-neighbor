from typing import Optional, List
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from entities.user import User
from repositories.models.user import User as UserModel
from .user_repo_interface import IUserRepo


class UserRepo(IUserRepo):
    """Real implementation of User repository."""

    def __init__(self, session: Session):
        self.session = session

    def create_user(self, user: User) -> User:
        """Create a new user."""
        try:
            db_user = UserModel(
                id=user.id,
                rg=user.rg,
                password_hash=user.password_hash,
                name=user.name,
                email=user.email,
                role=user.role,
                is_active=user.is_active
            )
            self.session.add(db_user)
            self.session.commit()
            self.session.refresh(db_user)
            
            # Convert back to entity
            return User(
                id=str(db_user.id),
                rg=db_user.rg,
                password_hash=db_user.password_hash,
                name=db_user.name,
                email=db_user.email,
                role=db_user.role,
                is_active=db_user.is_active
            )
        except IntegrityError:
            self.session.rollback()
            raise ValueError("RG already exists")

    def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        """Get user by ID."""
        db_user = self.session.query(UserModel).filter(
            UserModel.id == user_id,
            UserModel.is_deleted == False
        ).first()
        
        if not db_user:
            return None
            
        return User(
            id=str(db_user.id),
            rg=db_user.rg,
            password_hash=db_user.password_hash,
            name=db_user.name,
            email=db_user.email,
            role=db_user.role,
            is_active=db_user.is_active
        )

    def get_user_by_rg(self, rg: str) -> Optional[User]:
        """Get user by RG."""
        db_user = self.session.query(UserModel).filter(
            UserModel.rg == rg,
            UserModel.is_deleted == False
        ).first()
        
        if not db_user:
            return None
            
        return User(
            id=str(db_user.id),
            rg=db_user.rg,
            password_hash=db_user.password_hash,
            name=db_user.name,
            email=db_user.email,
            role=db_user.role,
            is_active=db_user.is_active
        )

    def update_user(self, user: User) -> Optional[User]:
        """Update user."""
        db_user = self.session.query(UserModel).filter(
            UserModel.id == user.id,
            UserModel.is_deleted == False
        ).first()
        
        if not db_user:
            return None
            
        db_user.rg = user.rg
        db_user.password_hash = user.password_hash
        db_user.name = user.name
        db_user.email = user.email
        db_user.role = user.role
        db_user.is_active = user.is_active
        
        self.session.commit()
        self.session.refresh(db_user)
        
        return User(
            id=str(db_user.id),
            rg=db_user.rg,
            password_hash=db_user.password_hash,
            name=db_user.name,
            email=db_user.email,
            role=db_user.role,
            is_active=db_user.is_active
        )

    def delete_user(self, user_id: UUID) -> bool:
        """Soft delete user."""
        db_user = self.session.query(UserModel).filter(
            UserModel.id == user_id,
            UserModel.is_deleted == False
        ).first()
        
        if not db_user:
            return False
            
        db_user.is_deleted = True
        self.session.commit()
        return True

    def list_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """List users with pagination."""
        db_users = self.session.query(UserModel).filter(
            UserModel.is_deleted == False
        ).offset(skip).limit(limit).all()
        
        return [
            User(
                id=str(db_user.id),
                rg=db_user.rg,
                password_hash=db_user.password_hash,
                name=db_user.name,
                email=db_user.email,
                role=db_user.role,
                is_active=db_user.is_active
            )
            for db_user in db_users
        ]

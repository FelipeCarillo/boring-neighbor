from typing import Optional
from sqlalchemy.orm import Session

from src.entities.user import UserCreate, UserUpdate, UserResponse, UserLogin, TokenResponse
from src.repositories.repositories.user_repo.user_repo import UserRepository
from src.helpers.auth import hash_password, verify_password, create_access_token, create_refresh_token
from src.helpers.errors import BadRequestException, NotFoundException, UnauthorizedException, ConflictException
from src.helpers.enums import UserRole


class UserService:
    """
    Service layer for user business logic.
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
    
    def authenticate_user(self, login_data: UserLogin) -> TokenResponse:
        """
        Authenticate user and return tokens.
        """
        user = self.user_repo.get_by_registro(login_data.registro)
        
        if not user or not verify_password(login_data.password, user.password_hash):
            raise UnauthorizedException(detail="Invalid credentials")
        
        access_token = create_access_token({"sub": user.id, "role": user.role})
        refresh_token = create_refresh_token({"sub": user.id})
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserResponse.model_validate(user),
        )
    
    def create_user(self, user_data: UserCreate) -> UserResponse:
        """
        Create a new user.
        """
        existing_user = self.user_repo.get_by_registro(user_data.registro)
        if existing_user:
            raise ConflictException(detail="Registro already exists")
        
        existing_email = self.user_repo.get_by_email(user_data.email)
        if existing_email:
            raise ConflictException(detail="Email already exists")
        
        password_hash = hash_password(user_data.password)
        
        user = self.user_repo.create(
            registro=user_data.registro,
            password_hash=password_hash,
            name=user_data.name,
            email=user_data.email,
            role=user_data.role,
        )
        
        return UserResponse.model_validate(user)
    
    def get_user(self, user_id: str) -> UserResponse:
        """
        Get user by ID.
        """
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise NotFoundException(detail="User not found")
        
        return UserResponse.model_validate(user)
    
    def list_users(self) -> list[UserResponse]:
        """
        List all active users.
        """
        users = self.user_repo.list_all()
        return [UserResponse.model_validate(user) for user in users]
    
    def update_user(self, user_id: str, user_data: UserUpdate) -> UserResponse:
        """
        Update user information.
        """
        existing_user = self.user_repo.get_by_id(user_id)
        if not existing_user:
            raise NotFoundException(detail="User not found")
        
        update_data = user_data.model_dump(exclude_unset=True)
        
        if "password" in update_data:
            update_data["password_hash"] = hash_password(update_data.pop("password"))
        
        if "email" in update_data and update_data["email"] != existing_user.email:
            existing_email = self.user_repo.get_by_email(update_data["email"])
            if existing_email:
                raise ConflictException(detail="Email already exists")
        
        user = self.user_repo.update(user_id, **update_data)
        if not user:
            raise NotFoundException(detail="User not found")
        
        return UserResponse.model_validate(user)
    
    def delete_user(self, user_id: str) -> bool:
        """
        Soft delete a user.
        """
        success = self.user_repo.soft_delete(user_id)
        if not success:
            raise NotFoundException(detail="User not found")
        
        return success



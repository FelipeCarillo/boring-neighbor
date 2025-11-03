from sqlalchemy.orm import Session

from src.entities.user import UserCreate, UserUpdate, UserResponse
from src.router.users.service import UserService
from src.repositories.models.user import User


class UserController:
    """
    Controller layer for user endpoints.
    """
    
    @staticmethod
    def create_user(user_data: UserCreate, db: Session) -> UserResponse:
        """
        Create a new user.
        """
        service = UserService(db)
        return service.create_user(user_data)
    
    @staticmethod
    def get_user(user_id: str, db: Session) -> UserResponse:
        """
        Get user by ID.
        """
        service = UserService(db)
        return service.get_user(user_id)
    
    @staticmethod
    def list_users(db: Session) -> list[UserResponse]:
        """
        List all users.
        """
        service = UserService(db)
        return service.list_users()
    
    @staticmethod
    def update_user(user_id: str, user_data: UserUpdate, db: Session, current_user: User) -> UserResponse:
        """
        Update user information.
        """
        service = UserService(db)
        return service.update_user(user_id, user_data)
    
    @staticmethod
    def delete_user(user_id: str, db: Session) -> dict:
        """
        Delete a user.
        """
        service = UserService(db)
        service.delete_user(user_id)
        return {"message": "User deleted successfully"}



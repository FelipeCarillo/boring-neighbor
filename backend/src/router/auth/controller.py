from sqlalchemy.orm import Session

from src.entities.user import UserLogin, TokenResponse, UserResponse
from src.router.auth.service import AuthService
from src.repositories.models.user import User


class AuthController:
    """
    Controller layer for authentication endpoints.
    """
    
    @staticmethod
    def login(login_data: UserLogin, db: Session) -> TokenResponse:
        """
        Authenticate user and return JWT tokens.
        """
        service = AuthService(db)
        return service.login(login_data)
    
    @staticmethod
    def refresh_token(refresh_token: str, db: Session) -> TokenResponse:
        """
        Refresh access token using refresh token.
        """
        service = AuthService(db)
        return service.refresh_token(refresh_token)
    
    @staticmethod
    def get_me(current_user: User) -> UserResponse:
        """
        Get current authenticated user information.
        """
        return UserResponse.model_validate(current_user)



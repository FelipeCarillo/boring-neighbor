from sqlalchemy.orm import Session

from src.entities.user import UserLogin, TokenResponse, UserResponse
from src.repositories.repositories.user_repo.user_repo import UserRepository
from src.helpers.auth import verify_password, create_access_token, create_refresh_token, decode_token
from src.helpers.errors import UnauthorizedException


class AuthService:
    """
    Service layer for authentication operations.
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
    
    def login(self, login_data: UserLogin) -> TokenResponse:
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
    
    def refresh_token(self, refresh_token: str) -> TokenResponse:
        """
        Generate new access token from refresh token.
        """
        payload = decode_token(refresh_token)
        
        if payload.get("type") != "refresh":
            raise UnauthorizedException(detail="Invalid token type")
        
        user_id = payload.get("sub")
        if not user_id:
            raise UnauthorizedException(detail="Invalid token payload")
        
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise UnauthorizedException(detail="User not found")
        
        access_token = create_access_token({"sub": user.id, "role": user.role})
        new_refresh_token = create_refresh_token({"sub": user.id})
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            user=UserResponse.model_validate(user),
        )



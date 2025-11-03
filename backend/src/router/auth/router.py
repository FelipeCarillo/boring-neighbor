from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session

from src.entities.user import UserLogin, TokenResponse, UserResponse
from src.router.auth.controller import AuthController
from src.repositories.database import get_db
from src.helpers.auth import get_current_user
from src.repositories.models.user import User


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    login_data: UserLogin,
    db: Session = Depends(get_db),
):
    """
    Login with registro (7 digits) and password.
    
    Returns JWT access token and refresh token.
    """
    return AuthController.login(login_data, db)


@router.post(
    "/refresh",
    response_model=TokenResponse,
)
def refresh_token(
    refresh_token: str = Body(..., embed=True),
    db: Session = Depends(get_db),
):
    """
    Refresh access token using refresh token.
    
    Returns new access token and refresh token.
    """
    return AuthController.refresh_token(refresh_token, db)


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    """
    Get current authenticated user information.
    
    Requires valid JWT access token in Authorization header.
    """
    return AuthController.get_me(current_user)



from fastapi import APIRouter, Depends, HTTPException, status

from entities import User
from helpers.auth import get_user
from helpers.errors import handle_exception
from .controller import AuthController
from .models import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from .service import AuthService

auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


async def get_service() -> AuthService:
    return AuthService()


async def get_controller(
    service: AuthService = Depends(get_service)
) -> AuthController:
    return AuthController(service)


@handle_exception
@auth_router.post("/register", response_model=UserResponse)
async def register(
    user_data: RegisterRequest,
    current_user: User = Depends(get_user)
):
    """Register a new user (admin only)."""
    # Check if current user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can register new users"
        )
    
    controller = AuthController(AuthService())
    return await controller.register_user(user_data)


@handle_exception
@auth_router.post("/login", response_model=TokenResponse)
async def login(
    login_data: LoginRequest,
    controller: AuthController = Depends(get_controller)
):
    """Login with RG and password."""
    return await controller.login_user(login_data)


@handle_exception
@auth_router.get("/me", response_model=UserResponse)
async def me(
    user: User = Depends(get_user)
):
    """Get current user information."""
    return UserResponse(
        id=user.id,
        rg=user.rg,
        name=user.name,
        email=user.email,
        role=user.role,
        is_active=user.is_active
    )

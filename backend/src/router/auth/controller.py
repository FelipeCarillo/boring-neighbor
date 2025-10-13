from .service import AuthService
from .models import RegisterRequest, LoginRequest, TokenResponse, UserResponse


class AuthController:
    def __init__(self, service: AuthService):
        self.service = service

    async def register_user(self, user_data: RegisterRequest) -> UserResponse:
        """Register a new user."""
        return await self.service.register_user(user_data)

    async def login_user(self, login_data: LoginRequest) -> TokenResponse:
        """Login user with RG and password."""
        result = await self.service.login_user(login_data)
        return TokenResponse(**result)

    async def get_current_user(self, user_id: str) -> UserResponse:
        """Get current user information."""
        return await self.service.get_current_user(user_id)

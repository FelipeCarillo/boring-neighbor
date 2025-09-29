from typing import Dict, Any

from .service import AuthService
from .view import AuthResponse, UserResponse, TokenFormData


class AuthController:
    def __init__(self, service: AuthService):
        self.service = service

    async def token(self, data: TokenFormData) -> AuthResponse:
        """Exchange authorization code for access token."""
        return await self.service.token(data)

    async def token_refresh(self, data: Dict[str, Any]) -> AuthResponse:
        """Refresh access token using refresh token."""
        return await self.service.token_refresh(data)

    async def me(self, user_id: str) -> UserResponse:
        """Get current user information."""
        return await self.service.me(user_id)

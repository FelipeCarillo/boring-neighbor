from typing import Optional
from pydantic import BaseModel


class RegisterRequest(BaseModel):
    """Request model for user registration."""
    rg: str
    password: str
    name: str
    email: Optional[str] = None
    role: str = "viewer"


class LoginRequest(BaseModel):
    """Request model for user login."""
    rg: str
    password: str


class TokenResponse(BaseModel):
    """Response model for authentication tokens."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class UserResponse(BaseModel):
    """User information response."""
    id: str
    rg: str
    name: str
    email: Optional[str] = None
    role: str
    is_active: bool

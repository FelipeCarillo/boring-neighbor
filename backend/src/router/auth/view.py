from pydantic import BaseModel


class TokenFormData(BaseModel):
    """Form data for token exchange."""
    code: str
    state: str


class TokenRefreshFormData(BaseModel):
    """Form data for token refresh."""
    refresh_token: str


class AuthResponse(BaseModel):
    """Authentication response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class UserResponse(BaseModel):
    """User information response."""
    id: str
    email: str
    name: str
    avatar_key: str = None
    role: str
    is_active: bool

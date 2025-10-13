from pydantic import BaseModel, Field, field_validator
from typing import Optional
from uuid import UUID, uuid4


class User(BaseModel):
    """User entity representing a user with RG-based authentication."""

    id: str = Field(default_factory=lambda: str(uuid4()), description="User identifier")
    rg: str = Field(..., description="RG (7-digit numeric identifier)")
    password_hash: str = Field(..., description="Hashed password")
    name: str = Field(..., description="User's full name")
    email: Optional[str] = Field(None, description="User's email address")
    role: str = Field(default="viewer", description="User's role in the system")
    is_active: bool = Field(default=True, description="Whether user is active")

    @field_validator('rg')
    @classmethod
    def validate_rg(cls, v):
        if not v.isdigit() or len(v) != 7:
            raise ValueError('RG must be exactly 7 digits')
        return v

    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        allowed_roles = ['admin', 'supervisor', 'worker', 'viewer']
        if v not in allowed_roles:
            raise ValueError(f'Role must be one of: {allowed_roles}')
        return v

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if v and '@' not in v:
            raise ValueError('Invalid email format')
        return v


class UserCreate(BaseModel):
    """Model for creating a new user."""
    
    rg: str = Field(..., description="RG (7-digit numeric identifier)")
    password: str = Field(..., description="Plain text password")
    name: str = Field(..., description="User's full name")
    email: Optional[str] = Field(None, description="User's email address")
    role: str = Field(default="viewer", description="User's role in the system")

    @field_validator('rg')
    @classmethod
    def validate_rg(cls, v):
        if not v.isdigit() or len(v) != 7:
            raise ValueError('RG must be exactly 7 digits')
        return v

    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        allowed_roles = ['admin', 'supervisor', 'worker', 'viewer']
        if v not in allowed_roles:
            raise ValueError(f'Role must be one of: {allowed_roles}')
        return v

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if v and '@' not in v:
            raise ValueError('Invalid email format')
        return v


class UserLogin(BaseModel):
    """Model for user login."""
    
    rg: str = Field(..., description="RG (7-digit numeric identifier)")
    password: str = Field(..., description="Plain text password")

    @field_validator('rg')
    @classmethod
    def validate_rg(cls, v):
        if not v.isdigit() or len(v) != 7:
            raise ValueError('RG must be exactly 7 digits')
        return v


class UserUpdate(BaseModel):
    """Model for updating user information."""
    
    name: Optional[str] = Field(None, description="User's full name")
    email: Optional[str] = Field(None, description="User's email address")
    role: Optional[str] = Field(None, description="User's role in the system")
    is_active: Optional[bool] = Field(None, description="Whether user is active")

    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        if v is not None:
            allowed_roles = ['admin', 'supervisor', 'worker', 'viewer']
            if v not in allowed_roles:
                raise ValueError(f'Role must be one of: {allowed_roles}')
        return v

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if v and '@' not in v:
            raise ValueError('Invalid email format')
        return v


class UserResponse(BaseModel):
    """Model for user response (without password hash)."""
    
    id: str = Field(..., description="User identifier")
    rg: str = Field(..., description="RG (7-digit numeric identifier)")
    name: str = Field(..., description="User's full name")
    email: Optional[str] = Field(None, description="User's email address")
    role: str = Field(..., description="User's role in the system")
    is_active: bool = Field(..., description="Whether user is active")

from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, field_validator

from .base import BaseEntity


class User(BaseEntity):
    """User entity representing a user in the system with role-based access."""
    
    id: UUID = Field(..., description="Unique identifier for the user")
    email: str = Field(..., description="User's email address")
    name: str = Field(..., description="User's full name")
    avatar_key: Optional[str] = Field(None, description="S3 key for user's avatar image")
    role: str = Field(..., description="User's role in the system")
    is_active: bool = Field(True, description="Whether the user account is active")
    
    @field_validator('role')
    def validate_role(self, v):
        allowed_roles = ['admin', 'supervisor', 'worker', 'viewer']
        if v not in allowed_roles:
            raise ValueError(f'Role must be one of: {allowed_roles}')
        return v


class UserCreate(BaseModel):
    """Schema for creating a new user."""
    
    email: str = Field(..., description="User's email address")
    name: str = Field(..., description="User's full name")
    avatar_key: Optional[str] = Field(None, description="S3 key for user's avatar image")
    role: str = Field(..., description="User's role in the system")
    is_active: bool = Field(True, description="Whether the user account is active")
    
    @field_validator('role')
    def validate_role(self, v):
        allowed_roles = ['admin', 'supervisor', 'worker', 'viewer']
        if v not in allowed_roles:
            raise ValueError(f'Role must be one of: {allowed_roles}')
        return v


class UserUpdate(BaseModel):
    """Schema for updating an existing user."""
    
    email: Optional[str] = Field(None, description="User's email address")
    name: Optional[str] = Field(None, description="User's full name")
    avatar_key: Optional[str] = Field(None, description="S3 key for user's avatar image")
    role: Optional[str] = Field(None, description="User's role in the system")
    is_active: Optional[bool] = Field(None, description="Whether the user account is active")
    
    @field_validator('role')
    def validate_role(self, v):
        if v is not None:
            allowed_roles = ['admin', 'supervisor', 'worker', 'viewer']
            if v not in allowed_roles:
                raise ValueError(f'Role must be one of: {allowed_roles}')
        return v

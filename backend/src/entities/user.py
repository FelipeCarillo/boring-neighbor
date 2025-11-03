from pydantic import EmailStr, Field, field_validator
from typing import Optional

from src.entities.base import BaseEntity, BaseResponse
from src.helpers.enums import UserRole


class UserCreate(BaseEntity):
    """
    Request model for creating a new user.
    """
    
    registro: str = Field(..., min_length=7, max_length=7, pattern="^[0-9]{7}$")
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    role: UserRole
    
    @field_validator("registro")
    @classmethod
    def validate_registro(cls, v: str) -> str:
        if not v.isdigit():
            raise ValueError("Registro must contain only digits")
        return v


class UserLogin(BaseEntity):
    """
    Request model for user login.
    """
    
    registro: str = Field(..., min_length=7, max_length=7)
    password: str


class UserUpdate(BaseEntity):
    """
    Request model for updating user information.
    """
    
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None
    password: Optional[str] = Field(None, min_length=6)


class UserResponse(BaseResponse):
    """
    Response model for user data.
    """
    
    registro: str
    name: str
    email: str
    role: UserRole


class TokenResponse(BaseEntity):
    """
    Response model for authentication tokens.
    """
    
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse



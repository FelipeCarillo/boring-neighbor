from datetime import timedelta
from typing import Optional
from fastapi import HTTPException, status

from configs import ENV
from entities.user import User, UserCreate, UserLogin, UserResponse
from helpers.auth import create_access_token
from helpers.password import hash_password, verify_password
from repositories.repository import Repository


class AuthService:

    @staticmethod
    async def register_user(user_data: UserCreate) -> UserResponse:
        """Register a new user."""
        try:
            repository = Repository()
            
            # Check if RG already exists
            existing_user = repository.user_repo.get_user_by_rg(user_data.rg)
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="RG already exists"
                )
            
            # Hash password
            password_hash = hash_password(user_data.password)
            
            # Create user entity
            user = User(
                rg=user_data.rg,
                password_hash=password_hash,
                name=user_data.name,
                email=user_data.email,
                role=user_data.role,
                is_active=True
            )
            
            # Save to database
            created_user = repository.user_repo.create_user(user)
            
            # Return user response (without password hash)
            return UserResponse(
                id=created_user.id,
                rg=created_user.rg,
                name=created_user.name,
                email=created_user.email,
                role=created_user.role,
                is_active=created_user.is_active
            )
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Registration failed: {str(e)}"
            )

    @staticmethod
    async def login_user(login_data: UserLogin) -> dict:
        """Login user with RG and password."""
        try:
            repository = Repository()
            
            # Get user by RG
            user = repository.user_repo.get_user_by_rg(login_data.rg)
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid RG or password"
                )
            
            # Check if user is active
            if not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User account is inactive"
                )
            
            # Verify password
            if not verify_password(login_data.password, user.password_hash):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid RG or password"
                )
            
            # Create access token
            access_token_expires = timedelta(minutes=ENV.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": user.id}, expires_delta=access_token_expires
            )
            
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "expires_in": ENV.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60
            }
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Login failed: {str(e)}"
            )

    @staticmethod
    async def get_current_user(user_id: str) -> UserResponse:
        """Get current user information."""
        try:
            repository = Repository()
            user = repository.user_repo.get_user_by_id(user_id)
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            return UserResponse(
                id=user.id,
                rg=user.rg,
                name=user.name,
                email=user.email,
                role=user.role,
                is_active=user.is_active
            )
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get user info: {str(e)}"
            )

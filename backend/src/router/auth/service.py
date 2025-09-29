from datetime import datetime, timedelta
from typing import Dict, Any
from uuid import uuid4

import httpx
import jwt
from fastapi import HTTPException

from configs import ENV
from router.auth.view import TokenFormData, AuthResponse, UserResponse


class AuthService:

    async def token(self, data: TokenFormData) -> AuthResponse:
        """Exchange authorization code for access token."""
        try:
            # Exchange code for tokens with Azure AD
            token_data = {
                "client_id": ENV.AZURE_CLIENT_ID,
                "client_secret": ENV.AZURE_CLIENT_SECRET,
                "code": data.code,
                "grant_type": "authorization_code",
                "redirect_uri": ENV.REDIRECT_URI,
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"https://login.microsoftonline.com/{ENV.AZURE_TENANT_ID}/oauth2/v2.0/token",
                    data=token_data
                )

                if response.status_code != 200:
                    raise HTTPException(status_code=400, detail="Failed to exchange code for token")

                token_response = response.json()

                # Get user info from Azure AD
                user_info = await self._get_user_info(token_response["access_token"])

                # Create user response from Azure AD info
                user = self._create_user_from_azure_info(user_info)

                # Generate our own JWT tokens
                access_token = self._generate_access_token(user)
                refresh_token = self._generate_refresh_token(user)

                return AuthResponse(
                    access_token=access_token,
                    refresh_token=refresh_token,
                    token_type="bearer",
                    expires_in=3600
                )

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")

    async def token_refresh(self, data: Dict[str, Any]) -> AuthResponse:
        """Refresh access token using refresh token."""
        try:
            # Decode refresh token to get user info
            payload = jwt.decode(data["refresh_token"], ENV.JWT_SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("sub")

            if not user_id:
                raise HTTPException(status_code=401, detail="Invalid refresh token")

            # Create user response from token payload
            user = UserResponse(
                id=user_id,
                email=payload.get("email", ""),
                name=payload.get("name", ""),
                avatar_key=payload.get("avatar_key"),
                role=payload.get("role", "viewer"),
                is_active=True
            )

            # Generate new tokens
            access_token = self._generate_access_token(user)
            refresh_token = self._generate_refresh_token(user)

            return AuthResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                token_type="bearer",
                expires_in=3600
            )

        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Refresh token expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Token refresh failed: {str(e)}")

    async def me(self, user_id: str) -> UserResponse:
        """Get current user information."""
        # In a real implementation, you would decode the JWT token to get user info
        # For now, we'll return a mock response
        return UserResponse(
            id=user_id,
            email="user@example.com",
            name="User Name",
            avatar_key=None,
            role="viewer",
            is_active=True
        )

    async def _get_user_info(self, access_token: str) -> Dict[str, Any]:
        """Get user information from Azure AD."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://graph.microsoft.com/v1.0/me",
                headers={"Authorization": f"Bearer {access_token}"}
            )

            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get user info")

            return response.json()

    def _create_user_from_azure_info(self, user_info: Dict[str, Any]) -> UserResponse:
        """Create user response from Azure AD information."""
        email = user_info.get("mail") or user_info.get("userPrincipalName")
        name = user_info.get("displayName", "")

        return UserResponse(
            id=str(uuid4()),  # Generate a new UUID for the user
            email=email,
            name=name,
            avatar_key="",  # Could be updated from Azure AD profile photo
            role="viewer",  # Default role
            is_active=True
        )

    def _generate_access_token(self, user: UserResponse) -> str:
        """Generate JWT access token."""
        payload = {
            "sub": user.id,
            "email": user.email,
            "role": user.role,
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow()
        }
        return jwt.encode(payload, ENV.JWT_SECRET_KEY, algorithm="HS256")

    def _generate_refresh_token(self, user: UserResponse) -> str:
        """Generate JWT refresh token."""
        payload = {
            "sub": user.id,
            "exp": datetime.utcnow() + timedelta(days=30),
            "iat": datetime.utcnow()
        }
        return jwt.encode(payload, ENV.JWT_SECRET_KEY, algorithm="HS256")

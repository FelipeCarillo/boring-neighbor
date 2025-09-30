from typing import Dict, Any

import httpx
from fastapi import HTTPException

from configs import ENV
from router.auth.models import TokenFormData, AuthResponse, UserResponse, TokenRefreshFormData


class AuthService:

    @staticmethod
    async def token(data: TokenFormData) -> AuthResponse:
        """Exchange authorization code for access token."""
        try:
            token_data = {
                "client_id": ENV.AZURE_CLIENT_ID,
                "client_secret": ENV.AZURE_CLIENT_SECRET,
                "code": data.code,
                "grant_type": "authorization_code",
                "redirect_uri": ENV.REDIRECT_URI,
                "scope": "openid profile email user.read"
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"https://login.microsoftonline.com/{ENV.AZURE_TENANT_ID}/oauth2/v2.0/token",
                    data=token_data
                )

                if response.status_code != 200:
                    raise HTTPException(status_code=400, detail="Failed to exchange code for token")

                token_response = response.json()

                # Return Microsoft tokens directly
                return AuthResponse(
                    access_token=token_response["access_token"],
                    refresh_token=token_response.get("refresh_token"),
                    token_type=token_response.get("token_type", "bearer"),
                    expires_in=token_response.get("expires_in", 3600)
                )

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")

    @staticmethod
    async def token_refresh(data: TokenRefreshFormData) -> AuthResponse:
        """Refresh access token using Microsoft refresh token."""
        try:
            token_data = {
                "client_id": ENV.AZURE_CLIENT_ID,
                "client_secret": ENV.AZURE_CLIENT_SECRET,
                "refresh_token": data.refresh_token,
                "grant_type": "refresh_token",
                "scope": "openid profile email user.read",
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"https://login.microsoftonline.com/{ENV.AZURE_TENANT_ID}/oauth2/v2.0/token",
                    data=token_data
                )

                if response.status_code != 200:
                    raise HTTPException(status_code=401, detail="Failed to refresh token")

                token_response = response.json()

                return AuthResponse(
                    access_token=token_response["access_token"],
                    refresh_token=token_response.get("refresh_token") or data.refresh_token,
                    token_type=token_response.get("token_type", "bearer"),
                    expires_in=token_response.get("expires_in", 3600)
                )

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Token refresh failed: {str(e)}")

    async def me(self, token: str) -> UserResponse:
        """Get current user information using Microsoft token."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://graph.microsoft.com/v1.0/me",
                    headers={"Authorization": f"Bearer {token}"}
                )

                if response.status_code != 200:
                    raise HTTPException(status_code=401, detail="Invalid or expired token")

                user_info = response.json()
                return self._create_user_from_azure_info(user_info)

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to get user info: {str(e)}")

    @staticmethod
    def _create_user_from_azure_info(user_info: Dict[str, Any]) -> UserResponse:
        """Create user response from Azure AD information."""
        email = user_info.get("mail") or user_info.get("userPrincipalName")
        name = user_info.get("displayName", "")

        return UserResponse(
            id=user_info.get("id", ""),
            email=email,
            name=name,
            avatar_key="",
            role="viewer",
            is_active=True
        )

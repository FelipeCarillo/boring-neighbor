import base64
import json
from uuid import UUID
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2AuthorizationCodeBearer

from configs import ENV
from entities import User

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=ENV.LOGIN_URI,
    tokenUrl=ENV.TOKEN_URI,
)


def _decode_jwt_payload(token: str) -> dict:
    """Decode JWT payload without signature verification."""
    try:
        parts = token.split('.')
        if len(parts) != 3:
            raise ValueError("Invalid JWT token format")
        
        payload = parts[1]

        payload += '=' * (-len(payload) % 4)

        decoded_payload = base64.urlsafe_b64decode(payload)

        payload_str = decoded_payload.decode('utf-8')
        claims = json.loads(payload_str)
        
        return claims
    except Exception as e:
        raise ValueError(f"Failed to decode JWT payload: {str(e)}")


async def get_user(token: str = Depends(oauth2_scheme)) -> User:
    """Extract user information from Microsoft JWT token."""
    try:
        claims = _decode_jwt_payload(token)

        user_id = claims.get("oid") or claims.get("sub")
        email = claims.get("preferred_username") or claims.get("upn") or claims.get("email")
        name = claims.get("name") or claims.get("given_name", "") + " " + claims.get("family_name", "")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not extract user ID from token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not extract email from token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = User(
            id=user_id,
            email=email,
            name=name.strip() if name else "",
            role="admin",
            avatar_key=None
        )

        return user

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token format: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

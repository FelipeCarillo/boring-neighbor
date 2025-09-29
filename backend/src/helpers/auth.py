import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2AuthorizationCodeBearer

from configs import ENV

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=ENV.LOGIN_URI,
    tokenUrl=ENV.TOKEN_URI,
)


async def get_user(token: str = Depends(oauth2_scheme)) -> str:
    """Extract user ID from JWT token."""
    try:
        payload = jwt.decode(token, ENV.JWT_SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

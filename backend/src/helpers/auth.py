from datetime import datetime, timedelta
from typing import Any
from jose import JWTError, jwt
import bcrypt
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from src.configs.env import settings
from src.helpers.errors import UnauthorizedException, ForbiddenException
from src.helpers.enums import UserRole
from src.repositories.database import get_db

# HTTPBearer para autenticação no Swagger
security = HTTPBearer()


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    """
    password_bytes = password.encode('utf-8')
   
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password_bytes, salt)
    
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    """
    try:
        password_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except (ValueError, TypeError):
        return False


def create_access_token(data: dict[str, Any], expires_delta: timedelta | None = None) -> str:
    """
    Create a JWT access token.
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.jwt_access_token_expire_minutes)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    
    return encoded_jwt


def create_refresh_token(data: dict[str, Any]) -> str:
    """
    Create a JWT refresh token.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.jwt_refresh_token_expire_days)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    
    return encoded_jwt


def decode_token(token: str) -> dict[str, Any]:
    """
    Decode and validate a JWT token.
    """
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        return payload
    except JWTError:
        raise UnauthorizedException(detail="Invalid or expired token")


def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Extract and validate user ID from JWT token in Authorization header.
    """
    token = credentials.credentials
    payload = decode_token(token)
    
    if payload.get("type") != "access":
        raise UnauthorizedException(detail="Invalid token type")
    
    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException(detail="Invalid token payload")
    
    return user_id


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    """
    Get current authenticated user from database.
    """
    from src.repositories.repositories.user_repo.user_repo import UserRepository
    
    user_id = get_current_user_id(credentials)
    user_repo = UserRepository(db)
    user = user_repo.get_by_id(user_id)
    
    if not user or user.deleted_at is not None:
        raise UnauthorizedException(detail="User not found")
    
    return user


def require_roles(allowed_roles: list[UserRole]):
    """
    Decorator to require specific roles for an endpoint.
    """
    def decorator(user = Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise ForbiddenException(detail="Insufficient permissions")
        return user
    
    return decorator


def get_admin_user(user = Depends(get_current_user)):
    """
    Dependency to require ADMIN role.
    """
    if user.role != UserRole.ADMIN:
        raise ForbiddenException(detail="Admin access required")
    return user


def get_admin_or_supervisor_user(user = Depends(get_current_user)):
    """
    Dependency to require ADMIN or SUPERVISOR role.
    """
    if user.role not in [UserRole.ADMIN, UserRole.SUPERVISOR]:
        raise ForbiddenException(detail="Admin or Supervisor access required")
    return user



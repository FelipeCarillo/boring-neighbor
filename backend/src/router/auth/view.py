from fastapi import APIRouter, Depends

from .service import AuthService
from .controller import AuthController

auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)



from fastapi import APIRouter, Depends

auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

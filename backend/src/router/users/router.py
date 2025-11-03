from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.entities.user import UserCreate, UserUpdate, UserResponse
from src.router.users.controller import UserController
from src.repositories.database import get_db
from src.helpers.auth import get_admin_user, get_admin_or_supervisor_user, get_current_user
from src.repositories.models.user import User


router = APIRouter(prefix="/users", tags=["Users"])


@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_supervisor_user),
):
    """
    Create a new user.
    
    Requires ADMIN or SUPERVISOR role.
    """
    return UserController.create_user(user_data, db)


@router.get(
    "/",
    response_model=list[UserResponse],
)
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_supervisor_user),
):
    """
    List all users.
    
    Requires ADMIN or SUPERVISOR role.
    """
    return UserController.list_users(db)


@router.get(
    "/{user_id}",
    response_model=UserResponse,
)
def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get user details by ID.
    
    Requires authentication.
    """
    return UserController.get_user(user_id, db)


@router.put(
    "/{user_id}",
    response_model=UserResponse,
)
def update_user(
    user_id: str,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    """
    Update user information.
    
    Requires ADMIN role.
    """
    return UserController.update_user(user_id, user_data, db, current_user)


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_200_OK,
)
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    """
    Soft delete a user.
    
    Requires ADMIN role.
    """
    return UserController.delete_user(user_id, db)



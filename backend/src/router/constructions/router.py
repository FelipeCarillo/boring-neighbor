from fastapi import APIRouter, Depends, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional

from src.entities.construction import (
    ConstructionCreate,
    ConstructionUpdate,
    ConstructionResponse,
    ConstructionDetail,
    AssignUserRequest,
    BIMReferenceResponse,
)
from src.router.constructions.controller import ConstructionController
from src.repositories.database import get_db
from src.helpers.auth import get_current_user, get_admin_user, get_admin_or_supervisor_user
from src.repositories.models.user import User


router = APIRouter(prefix="/constructions", tags=["Constructions"])


@router.post(
    "/",
    response_model=ConstructionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_construction(
    construction_data: ConstructionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_supervisor_user),
):
    """
    Create a new construction project.
    
    Requires ADMIN or SUPERVISOR role.
    """
    return ConstructionController.create_construction(construction_data, current_user, db)


@router.get(
    "/",
    response_model=list[ConstructionResponse],
)
def list_constructions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List constructions.
    
    ADMIN sees all constructions.
    SUPERVISOR and OPERADOR see only assigned constructions.
    """
    return ConstructionController.list_constructions(current_user, db)


@router.get(
    "/{construction_id}",
    response_model=ConstructionDetail,
)
def get_construction(
    construction_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get construction details with timeline.
    
    Requires authentication.
    """
    return ConstructionController.get_construction(construction_id, db)


@router.put(
    "/{construction_id}",
    response_model=ConstructionResponse,
)
def update_construction(
    construction_id: str,
    construction_data: ConstructionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_supervisor_user),
):
    """
    Update construction information.
    
    Requires ADMIN or SUPERVISOR role.
    """
    return ConstructionController.update_construction(construction_id, construction_data, db)


@router.delete(
    "/{construction_id}",
    status_code=status.HTTP_200_OK,
)
def delete_construction(
    construction_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    """
    Soft delete a construction.
    
    Requires ADMIN role.
    """
    return ConstructionController.delete_construction(construction_id, db)


@router.post(
    "/{construction_id}/users",
    response_model=ConstructionDetail,
)
def assign_users(
    construction_id: str,
    assign_data: AssignUserRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_supervisor_user),
):
    """
    Assign users to construction.
    
    Requires ADMIN or SUPERVISOR role.
    """
    return ConstructionController.assign_users(construction_id, assign_data, db)


@router.delete(
    "/{construction_id}/users/{user_id}",
    response_model=ConstructionDetail,
)
def remove_user(
    construction_id: str,
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_supervisor_user),
):
    """
    Remove user from construction.
    
    Requires ADMIN or SUPERVISOR role.
    """
    return ConstructionController.remove_user(construction_id, user_id, db)


@router.post(
    "/{construction_id}/bim",
    response_model=BIMReferenceResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_bim_reference(
    construction_id: str,
    file: UploadFile = File(...),
    phase_id: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_supervisor_user),
):
    """
    Upload BIM reference image (architectural print).
    
    Requires ADMIN or SUPERVISOR role.
    """
    return await ConstructionController.upload_bim_reference(
        construction_id=construction_id,
        file=file,
        current_user=current_user,
        db=db,
        phase_id=phase_id,
        description=description,
    )



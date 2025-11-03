from fastapi import APIRouter, Depends, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional

from src.entities.construction import ProgressCreate, ProgressResponse
from src.router.progress.controller import ProgressController
from src.repositories.database import get_db
from src.helpers.auth import get_current_user
from src.repositories.models.user import User


router = APIRouter(prefix="/progress", tags=["Progress"])


@router.post(
    "/",
    response_model=ProgressResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register_progress(
    construction_id: str = Form(...),
    file: UploadFile = File(...),
    phase_id: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Register construction progress with photo.
    
    Automatically calculates deviation if BIM references exist.
    All authenticated users can register progress on assigned constructions.
    """
    progress_data = ProgressCreate(
        construction_id=construction_id,
        phase_id=phase_id,
        notes=notes,
    )
    
    return await ProgressController.register_progress(
        progress_data,
        file,
        current_user,
        db,
    )


@router.get(
    "/{progress_id}",
    response_model=ProgressResponse,
)
def get_progress(
    progress_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get specific progress entry with deviation analysis.
    
    Requires authentication.
    """
    return ProgressController.get_progress(progress_id, db)


@router.get(
    "/construction/{construction_id}",
    response_model=list[ProgressResponse],
)
def list_progress_by_construction(
    construction_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all progress entries for a construction.
    
    Requires authentication.
    """
    return ProgressController.list_progress_by_construction(construction_id, db)



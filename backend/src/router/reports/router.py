from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.entities.report import ReportResponse
from src.router.reports.controller import ReportController
from src.repositories.database import get_db
from src.helpers.auth import get_current_user, get_admin_or_supervisor_user
from src.repositories.models.user import User


router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post(
    "/construction/{construction_id}",
    response_model=ReportResponse,
    status_code=status.HTTP_201_CREATED,
)
def generate_report(
    construction_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_or_supervisor_user),
):
    """
    Generate AI-powered analysis report for a construction.
    
    Aggregates all progress data, deviation scores, and phases.
    Uses OpenAI to generate comprehensive analysis and recommendations.
    
    Requires ADMIN or SUPERVISOR role.
    """
    return ReportController.generate_report(construction_id, db)


@router.get(
    "/{report_id}",
    response_model=ReportResponse,
)
def get_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get specific report details.
    
    Requires authentication.
    """
    return ReportController.get_report(report_id, db)


@router.get(
    "/construction/{construction_id}",
    response_model=list[ReportResponse],
)
def list_reports_by_construction(
    construction_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List all reports for a construction.
    
    Requires authentication.
    """
    return ReportController.list_reports_by_construction(construction_id, db)



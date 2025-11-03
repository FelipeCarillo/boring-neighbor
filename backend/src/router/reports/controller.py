from sqlalchemy.orm import Session

from src.entities.report import ReportResponse
from src.router.reports.service import ReportService


class ReportController:
    """
    Controller layer for report endpoints.
    """
    
    @staticmethod
    def generate_report(construction_id: str, db: Session) -> ReportResponse:
        """
        Generate AI-powered construction report.
        """
        service = ReportService(db)
        return service.generate_report(construction_id)
    
    @staticmethod
    def get_report(report_id: str, db: Session) -> ReportResponse:
        """
        Get report details.
        """
        service = ReportService(db)
        return service.get_report(report_id)
    
    @staticmethod
    def list_reports_by_construction(
        construction_id: str,
        db: Session,
    ) -> list[ReportResponse]:
        """
        List all reports for a construction.
        """
        service = ReportService(db)
        return service.list_reports_by_construction(construction_id)



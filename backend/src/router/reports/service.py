from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from src.entities.report import ReportResponse, ReportDetail
from src.repositories.repositories.construction_repo.construction_repo import ConstructionRepository
from src.repositories.repositories.construction_phase_repo.construction_phase_repo import ConstructionPhaseRepository
from src.repositories.repositories.construction_progress_repo.construction_progress_repo import ConstructionProgressRepository
from src.repositories.models.construction import DeviationReport, ConstructionProgress
from src.helpers.errors import NotFoundException, InternalServerException
from src.services.openai_service import openai_service


class ReportService:
    """
    Service layer for report generation and retrieval.
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.construction_repo = ConstructionRepository(db)
        self.phase_repo = ConstructionPhaseRepository(db)
        self.progress_repo = ConstructionProgressRepository(db)
    
    def generate_report(self, construction_id: str) -> ReportResponse:
        """
        Generate AI-powered report for a construction.
        """
        if not openai_service:
            raise InternalServerException(detail="OpenAI service not configured")
        
        construction = self.construction_repo.get_by_id(construction_id)
        if not construction:
            raise NotFoundException(detail="Construction not found")
        
        report_data = self._aggregate_construction_data(construction_id)
        
        ai_analysis = openai_service.generate_construction_report(
            construction_name=construction.name,
            phases_data=report_data["phases"],
            deviations_data=report_data["deviations"],
            total_progress=report_data["total_progress"],
            average_deviation=report_data["average_deviation"],
        )
        
        deviation_report = DeviationReport(
            construction_id=construction_id,
            progress_id=None,
            deviation_score=report_data["average_deviation"],
            ai_analysis=ai_analysis,
        )
        
        self.db.add(deviation_report)
        self.db.commit()
        self.db.refresh(deviation_report)
        
        return ReportResponse.model_validate(deviation_report)
    
    def get_report(self, report_id: str) -> ReportResponse:
        """
        Get a specific report by ID.
        """
        report = self.db.query(DeviationReport).filter(
            DeviationReport.id == report_id,
            DeviationReport.deleted_at.is_(None),
        ).first()
        
        if not report:
            raise NotFoundException(detail="Report not found")
        
        return ReportResponse.model_validate(report)
    
    def list_reports_by_construction(
        self,
        construction_id: str,
    ) -> list[ReportResponse]:
        """
        List all reports for a construction.
        """
        construction = self.construction_repo.get_by_id(construction_id)
        if not construction:
            raise NotFoundException(detail="Construction not found")
        
        reports = self.db.query(DeviationReport).filter(
            DeviationReport.construction_id == construction_id,
            DeviationReport.deleted_at.is_(None),
            DeviationReport.progress_id.is_(None),
        ).order_by(DeviationReport.created_at.desc()).all()
        
        return [ReportResponse.model_validate(r) for r in reports]
    
    def _aggregate_construction_data(self, construction_id: str) -> dict:
        """
        Aggregate construction data for report generation.
        """
        phases = self.phase_repo.list_by_construction(construction_id)
        progress_entries = self.progress_repo.list_by_construction(construction_id)
        
        phases_data = {}
        for phase in phases:
            phase_progress = [p for p in progress_entries if p.phase_id == phase.id]
            deviations = [p.deviation_score for p in phase_progress if p.deviation_score is not None]
            
            phases_data[phase.phase_name] = {
                "status": phase.status.value,
                "progress_count": len(phase_progress),
                "avg_deviation": sum(deviations) / len(deviations) if deviations else None,
            }
        
        deviations_data = []
        for progress in progress_entries:
            phase_name = progress.phase.phase_name if progress.phase else "Sem fase"
            deviations_data.append({
                "phase": phase_name,
                "score": progress.deviation_score,
                "notes": progress.notes,
                "date": progress.created_at,
            })
        
        all_deviations = [p.deviation_score for p in progress_entries if p.deviation_score is not None]
        average_deviation = sum(all_deviations) / len(all_deviations) if all_deviations else None
        
        return {
            "phases": phases_data,
            "deviations": deviations_data,
            "total_progress": len(progress_entries),
            "average_deviation": average_deviation,
        }



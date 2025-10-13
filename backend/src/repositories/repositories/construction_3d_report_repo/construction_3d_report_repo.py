from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import desc

from entities.construction import Construction3DReport
from repositories.models.construction import Construction3DReport as Construction3DReportModel
from .construction_3d_report_repo_interface import IConstruction3DReportRepo


class Construction3DReportRepo(IConstruction3DReportRepo):

    def __init__(self, session: Session):
        self.session = session

    def _to_entity(self, db_model: Construction3DReportModel) -> Construction3DReport:
        return Construction3DReport(
            id=str(db_model.id),
            construction_id=str(db_model.construction_id),
            s3_ply_key=db_model.s3_ply_key,
            s3_obj_key=db_model.s3_obj_key,
            status=db_model.status,
            report_json=db_model.report_json,
            processing_started_at=db_model.processing_started_at,
            processing_completed_at=db_model.processing_completed_at,
            error_message=db_model.error_message,
            created_at=db_model.created_at,
            updated_at=db_model.updated_at
        )

    def _to_model(self, entity: Construction3DReport) -> Construction3DReportModel:
        return Construction3DReportModel(
            id=entity.id,
            construction_id=entity.construction_id,
            s3_ply_key=entity.s3_ply_key,
            s3_obj_key=entity.s3_obj_key,
            status=entity.status,
            report_json=entity.report_json,
            processing_started_at=entity.processing_started_at,
            processing_completed_at=entity.processing_completed_at,
            error_message=entity.error_message
        )

    def get_report_by_id(self, id: str) -> Optional[Construction3DReport]:
        db_model = self.session.query(Construction3DReportModel).filter(Construction3DReportModel.id == id).first()
        return self._to_entity(db_model) if db_model else None

    def create_report(self, report: Construction3DReport) -> Construction3DReport:
        db_model = self._to_model(report)
        self.session.add(db_model)
        self.session.commit()
        return self._to_entity(db_model)

    def update_report(self, report: Construction3DReport) -> Construction3DReport:
        db_model = self.session.query(Construction3DReportModel).filter(Construction3DReportModel.id == report.id).first()
        if db_model:
            db_model.status = report.status
            db_model.report_json = report.report_json
            db_model.processing_started_at = report.processing_started_at
            db_model.processing_completed_at = report.processing_completed_at
            db_model.error_message = report.error_message
            self.session.commit()
            return self._to_entity(db_model)
        return report

    def delete_report(self, id: str) -> None:
        db_model = self.session.query(Construction3DReportModel).filter(Construction3DReportModel.id == id).first()
        if db_model:
            self.session.delete(db_model)
            self.session.commit()

    def list_reports_by_construction(self, construction_id: str) -> List[Construction3DReport]:
        db_models = self.session.query(Construction3DReportModel).filter(
            Construction3DReportModel.construction_id == construction_id
        ).order_by(desc(Construction3DReportModel.created_at)).all()
        return [self._to_entity(model) for model in db_models]

    def get_latest_report_by_construction(self, construction_id: str) -> Optional[Construction3DReport]:
        db_model = self.session.query(Construction3DReportModel).filter(
            Construction3DReportModel.construction_id == construction_id
        ).order_by(desc(Construction3DReportModel.created_at)).first()
        return self._to_entity(db_model) if db_model else None

    def list_reports_by_status(self, status: str) -> List[Construction3DReport]:
        db_models = self.session.query(Construction3DReportModel).filter(
            Construction3DReportModel.status == status
        ).order_by(desc(Construction3DReportModel.created_at)).all()
        return [self._to_entity(model) for model in db_models]

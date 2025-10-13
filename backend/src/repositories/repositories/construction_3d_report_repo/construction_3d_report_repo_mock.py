from typing import Optional, List
from datetime import datetime
from uuid import uuid4

from entities.construction import Construction3DReport
from .construction_3d_report_repo_interface import IConstruction3DReportRepo


class Construction3DReportRepoMock(IConstruction3DReportRepo):

    def __init__(self):
        self.reports = []

    def get_report_by_id(self, id: str) -> Optional[Construction3DReport]:
        return next((r for r in self.reports if r.id == id), None)

    def create_report(self, report: Construction3DReport) -> Construction3DReport:
        self.reports.append(report)
        return report

    def update_report(self, report: Construction3DReport) -> Construction3DReport:
        for i, r in enumerate(self.reports):
            if r.id == report.id:
                self.reports[i] = report
                break
        return report

    def delete_report(self, id: str) -> None:
        self.reports = [r for r in self.reports if r.id != id]

    def list_reports_by_construction(self, construction_id: str) -> List[Construction3DReport]:
        return [r for r in self.reports if r.construction_id == construction_id]

    def get_latest_report_by_construction(self, construction_id: str) -> Optional[Construction3DReport]:
        reports = self.list_reports_by_construction(construction_id)
        return reports[0] if reports else None

    def list_reports_by_status(self, status: str) -> List[Construction3DReport]:
        return [r for r in self.reports if r.status == status]

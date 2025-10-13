from abc import abstractmethod, ABC
from typing import Optional, List

from entities.construction import Construction3DReport


class IConstruction3DReportRepo(ABC):

    @abstractmethod
    def get_report_by_id(self, id: str) -> Optional[Construction3DReport]:
        pass

    @abstractmethod
    def create_report(self, report: Construction3DReport) -> Construction3DReport:
        pass

    @abstractmethod
    def update_report(self, report: Construction3DReport) -> Construction3DReport:
        pass

    @abstractmethod
    def delete_report(self, id: str) -> None:
        pass

    @abstractmethod
    def list_reports_by_construction(self, construction_id: str) -> List[Construction3DReport]:
        pass

    @abstractmethod
    def get_latest_report_by_construction(self, construction_id: str) -> Optional[Construction3DReport]:
        pass

    @abstractmethod
    def list_reports_by_status(self, status: str) -> List[Construction3DReport]:
        pass

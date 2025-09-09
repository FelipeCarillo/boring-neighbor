from abc import ABC, abstractmethod
from typing import Optional, List

from repositories.models.construction import ConstructionApproval


class IConstructionApprovalRepo(ABC):
    @abstractmethod
    def get_approval_by_id(self, id: str) -> Optional[ConstructionApproval]:
        pass

    @abstractmethod
    def create_approval(self, approval: ConstructionApproval) -> ConstructionApproval:
        pass

    @abstractmethod
    def update_approval(self, approval: ConstructionApproval) -> ConstructionApproval:
        pass

    @abstractmethod
    def delete_approval(self, id: str) -> None:
        pass

    @abstractmethod
    def list_approvals_by_construction(self, construction_id: str) -> List[ConstructionApproval]:
        pass

    @abstractmethod
    def list_approvals_by_user(self, user_id: str) -> List[ConstructionApproval]:
        pass

    @abstractmethod
    def list_approvals_by_approver(self, approver_id: str) -> List[ConstructionApproval]:
        pass

    @abstractmethod
    def list_approvals_by_status(self, status: str) -> List[ConstructionApproval]:
        pass

    @abstractmethod
    def get_approval_by_construction_and_user(self, construction_id: str, user_id: str) -> Optional[ConstructionApproval]:
        pass

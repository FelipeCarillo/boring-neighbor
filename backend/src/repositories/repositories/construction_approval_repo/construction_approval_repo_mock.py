from typing import Optional, List

from repositories.models.construction import ConstructionApproval
from .construction_approval_repo_interface import IConstructionApprovalRepo


class ConstructionApprovalRepoMock(IConstructionApprovalRepo):

    def __init__(self):
        self.approvals = [
            ConstructionApproval(
                id="1",
                construction_id="1",
                user_id="2",
                approver_id="1",
                status="approved",
                can_view=True,
                can_edit=True,
                can_delete=False,
                can_approve=False,
                can_manage_users=False,
                comments="Aprovado para visualização e edição",
            ),
            ConstructionApproval(
                id="2",
                construction_id="1",
                user_id="3",
                approver_id="1",
                status="pending",
                can_view=True,
                can_edit=False,
                can_delete=False,
                can_approve=False,
                can_manage_users=False,
                comments="Aguardando aprovação",
            ),
        ]

    def get_approval_by_id(self, id: str) -> Optional[ConstructionApproval]:
        return next((approval for approval in self.approvals if approval.id == id), None)

    def create_approval(self, approval: ConstructionApproval) -> ConstructionApproval:
        self.approvals.append(approval)
        return approval

    def update_approval(self, approval: ConstructionApproval) -> ConstructionApproval:
        self.approvals = [a for a in self.approvals if a.id != approval.id]
        self.approvals.append(approval)
        return approval

    def delete_approval(self, id: str) -> None:
        self.approvals = [a for a in self.approvals if a.id != id]

    def list_approvals_by_construction(self, construction_id: str) -> List[ConstructionApproval]:
        return [a for a in self.approvals if a.construction_id == construction_id]

    def list_approvals_by_user(self, user_id: str) -> List[ConstructionApproval]:
        return [a for a in self.approvals if a.user_id == user_id]

    def list_approvals_by_approver(self, approver_id: str) -> List[ConstructionApproval]:
        return [a for a in self.approvals if a.approver_id == approver_id]

    def list_approvals_by_status(self, status: str) -> List[ConstructionApproval]:
        return [a for a in self.approvals if a.status == status]

    def get_approval_by_construction_and_user(self, construction_id: str, user_id: str) -> Optional[ConstructionApproval]:
        return next((a for a in self.approvals if a.construction_id == construction_id and a.user_id == user_id), None)

from typing import Optional, List
from sqlalchemy.orm import Session

from repositories.models.construction import ConstructionApproval
from .construction_approval_repo_interface import IConstructionApprovalRepo


class ConstructionApprovalRepo(IConstructionApprovalRepo):

    def __init__(self, session: Session):
        self.session = session

    def get_approval_by_id(self, id: str) -> Optional[ConstructionApproval]:
        return self.session.query(ConstructionApproval).filter(ConstructionApproval.id == id).first()

    def create_approval(self, approval: ConstructionApproval) -> ConstructionApproval:
        self.session.add(approval)
        self.session.commit()
        return approval

    def update_approval(self, approval: ConstructionApproval) -> ConstructionApproval:
        self.session.commit()
        return approval

    def delete_approval(self, id: str) -> None:
        approval = self.get_approval_by_id(id)
        if approval:
            self.session.delete(approval)
            self.session.commit()

    def list_approvals_by_construction(self, construction_id: str) -> List[ConstructionApproval]:
        return self.session.query(ConstructionApproval).filter(
            ConstructionApproval.construction_id == construction_id
        ).all()

    def list_approvals_by_user(self, user_id: str) -> List[ConstructionApproval]:
        return self.session.query(ConstructionApproval).filter(
            ConstructionApproval.user_id == user_id
        ).all()

    def list_approvals_by_approver(self, approver_id: str) -> List[ConstructionApproval]:
        return self.session.query(ConstructionApproval).filter(
            ConstructionApproval.approver_id == approver_id
        ).all()

    def list_approvals_by_status(self, status: str) -> List[ConstructionApproval]:
        return self.session.query(ConstructionApproval).filter(
            ConstructionApproval.status == status
        ).all()

    def get_approval_by_construction_and_user(self, construction_id: str, user_id: str) -> Optional[ConstructionApproval]:
        return self.session.query(ConstructionApproval).filter(
            ConstructionApproval.construction_id == construction_id,
            ConstructionApproval.user_id == user_id
        ).first()

from typing import Optional, List
from sqlalchemy.orm import Session

from entities.construction import ConstructionApproval
from repositories.models.construction import ConstructionApproval as ConstructionApprovalModel
from repositories.repositories.construction_approval_repo.construction_approval_repo_interface import \
    IConstructionApprovalRepo


class ConstructionApprovalRepo(IConstructionApprovalRepo):

    def __init__(self, session: Session):
        self.session = session

    def _to_entity(self, db_model: ConstructionApprovalModel) -> ConstructionApproval:
        return ConstructionApproval(
            id=str(db_model.id),
            construction_id=str(db_model.construction_id),
            user_id=str(db_model.user_id),
            approver_id=str(db_model.approver_id) if db_model.approver_id else None,
            status=db_model.status,
            can_view=db_model.can_view,
            can_edit=db_model.can_edit,
            can_delete=db_model.can_delete,
            can_approve=db_model.can_approve,
            can_manage_users=db_model.can_manage_users,
            comments=db_model.comments,
            expires_at=db_model.expires_at,
            created_at=db_model.created_at,
            updated_at=db_model.updated_at
        )

    def _to_model(self, entity: ConstructionApproval) -> ConstructionApprovalModel:
        return ConstructionApprovalModel(
            id=entity.id,
            construction_id=entity.construction_id,
            user_id=entity.user_id,
            approver_id=entity.approver_id,
            status=entity.status,
            can_view=entity.can_view,
            can_edit=entity.can_edit,
            can_delete=entity.can_delete,
            can_approve=entity.can_approve,
            can_manage_users=entity.can_manage_users,
            comments=entity.comments,
            expires_at=entity.expires_at
        )

    def get_approval_by_id(self, id: str) -> Optional[ConstructionApproval]:
        db_model = self.session.query(ConstructionApprovalModel).filter(ConstructionApprovalModel.id == id).first()
        return self._to_entity(db_model) if db_model else None

    def create_approval(self, approval: ConstructionApproval) -> ConstructionApproval:
        db_model = self._to_model(approval)
        self.session.add(db_model)
        self.session.commit()
        return self._to_entity(db_model)

    def update_approval(self, approval: ConstructionApproval) -> ConstructionApproval:
        db_model = self.session.query(ConstructionApprovalModel).filter(ConstructionApprovalModel.id == approval.id).first()
        if db_model:
            db_model.status = approval.status
            db_model.can_view = approval.can_view
            db_model.can_edit = approval.can_edit
            db_model.can_delete = approval.can_delete
            db_model.can_approve = approval.can_approve
            db_model.can_manage_users = approval.can_manage_users
            db_model.comments = approval.comments
            db_model.expires_at = approval.expires_at
            self.session.commit()
            return self._to_entity(db_model)
        return approval

    def delete_approval(self, id: str) -> None:
        db_model = self.session.query(ConstructionApprovalModel).filter(ConstructionApprovalModel.id == id).first()
        if db_model:
            self.session.delete(db_model)
            self.session.commit()

    def list_approvals_by_construction(self, construction_id: str) -> List[ConstructionApproval]:
        db_models = self.session.query(ConstructionApprovalModel).filter(
            ConstructionApprovalModel.construction_id == construction_id
        ).all()
        return [self._to_entity(model) for model in db_models]

    def list_approvals_by_user(self, user_id: str) -> List[ConstructionApproval]:
        db_models = self.session.query(ConstructionApprovalModel).filter(
            ConstructionApprovalModel.user_id == user_id
        ).all()
        return [self._to_entity(model) for model in db_models]

    def list_approvals_by_approver(self, approver_id: str) -> List[ConstructionApproval]:
        db_models = self.session.query(ConstructionApprovalModel).filter(
            ConstructionApprovalModel.approver_id == approver_id
        ).all()
        return [self._to_entity(model) for model in db_models]

    def list_approvals_by_status(self, status: str) -> List[ConstructionApproval]:
        db_models = self.session.query(ConstructionApprovalModel).filter(
            ConstructionApprovalModel.status == status
        ).all()
        return [self._to_entity(model) for model in db_models]

    def get_approval_by_construction_and_user(self, construction_id: str, user_id: str) -> Optional[
        ConstructionApproval]:
        db_model = self.session.query(ConstructionApprovalModel).filter(
            ConstructionApprovalModel.construction_id == construction_id,
            ConstructionApprovalModel.user_id == user_id
        ).first()
        return self._to_entity(db_model) if db_model else None

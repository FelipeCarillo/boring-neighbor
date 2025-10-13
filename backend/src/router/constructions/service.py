from typing import Optional, List, Dict, Any
from uuid import uuid4

from entities.construction import (
    Construction, ConstructionCreate, ConstructionUpdate,
    ConstructionProgress, ConstructionProgressCreate, ConstructionProgressUpdate,
    ConstructionPhase, ConstructionPhaseCreate, ConstructionPhaseUpdate,
    ConstructionApproval, ConstructionApprovalCreate, ConstructionApprovalUpdate
)
from repositories.repository import Repository


class ConstructionService:
    def __init__(self, repository: Repository):
        self.repository = repository

    def create_construction(self, construction_data: ConstructionCreate, user_id: str) -> Construction:
        construction = Construction(
            id=str(uuid4()),
            **construction_data.model_dump()
        )
        return self.repository.construction_repo.create_construction(construction)

    def get_construction(self, construction_id: str) -> Optional[Construction]:
        return self.repository.construction_repo.get_construction_by_id(construction_id)

    def update_construction(self, construction_id: str, update_data: ConstructionUpdate) -> Optional[Construction]:
        construction = self.get_construction(construction_id)
        if not construction:
            return None

        for field, value in update_data.model_dump(exclude_unset=True).items():
            setattr(construction, field, value)

        return self.repository.construction_repo.update_construction(construction)

    def delete_construction(self, construction_id: str) -> bool:
        construction = self.get_construction(construction_id)
        if not construction:
            return False

        self.repository.construction_repo.delete_construction(construction_id)
        return True

    def list_constructions(self, filters: Optional[Dict[str, Any]] = None) -> List[Construction]:
        if not filters:
            return self.repository.construction_repo.list_constructions()

        constructions = []

        if 'status' in filters:
            constructions = self.repository.construction_repo.get_constructions_by_status(filters['status'])
        elif 'supervisor_id' in filters:
            constructions = self.repository.construction_repo.get_constructions_by_supervisor(filters['supervisor_id'])
        elif 'phase' in filters:
            constructions = self.repository.construction_repo.get_constructions_by_phase(filters['phase'])
        elif 'name' in filters:
            constructions = self.repository.construction_repo.search_constructions_by_name(filters['name'])
        elif 'start_date' in filters and 'end_date' in filters:
            constructions = self.repository.construction_repo.get_constructions_by_date_range(
                filters['start_date'], filters['end_date']
            )

        return constructions

    def create_progress(self, progress_data: ConstructionProgressCreate, user_id: str) -> ConstructionProgress:
        progress = ConstructionProgress(
            id=str(uuid4()),
            recorded_by=user_id,
            **progress_data.model_dump()
        )
        return self.repository.construction_progress_repo.create_progress(progress)

    def get_progress(self, progress_id: str) -> Optional[ConstructionProgress]:
        return self.repository.construction_progress_repo.get_progress_by_id(progress_id)

    def update_progress(self, progress_id: str, update_data: ConstructionProgressUpdate) -> Optional[
        ConstructionProgress]:
        progress = self.get_progress(progress_id)
        if not progress:
            return None

        for field, value in update_data.model_dump(exclude_unset=True).items():
            setattr(progress, field, value)

        return self.repository.construction_progress_repo.update_progress(progress)

    def delete_progress(self, progress_id: str) -> bool:
        progress = self.get_progress(progress_id)
        if not progress:
            return False

        self.repository.construction_progress_repo.delete_progress(progress_id)
        return True

    def list_progress_by_construction(self, construction_id: str) -> List[ConstructionProgress]:
        return self.repository.construction_progress_repo.list_progress_by_construction(construction_id)

    def get_latest_progress(self, construction_id: str) -> Optional[ConstructionProgress]:
        return self.repository.construction_progress_repo.get_latest_progress_by_construction(construction_id)

    def create_phase(self, phase_data: ConstructionPhaseCreate) -> ConstructionPhase:
        phase = ConstructionPhase(
            id=str(uuid4()),
            **phase_data.model_dump()
        )
        return self.repository.construction_phase_repo.create_phase(phase)

    def get_phase(self, phase_id: str) -> Optional[ConstructionPhase]:
        return self.repository.construction_phase_repo.get_phase_by_id(phase_id)

    def update_phase(self, phase_id: str, update_data: ConstructionPhaseUpdate) -> Optional[ConstructionPhase]:
        phase = self.get_phase(phase_id)
        if not phase:
            return None

        for field, value in update_data.model_dump(exclude_unset=True).items():
            setattr(phase, field, value)

        return self.repository.construction_phase_repo.update_phase(phase)

    def delete_phase(self, phase_id: str) -> bool:
        phase = self.get_phase(phase_id)
        if not phase:
            return False

        self.repository.construction_phase_repo.delete_phase(phase_id)
        return True

    def list_phases(self) -> List[ConstructionPhase]:
        return self.repository.construction_phase_repo.list_phases()

    def list_active_phases(self) -> List[ConstructionPhase]:
        return self.repository.construction_phase_repo.list_active_phases()

    def create_approval(self, approval_data: ConstructionApprovalCreate, approver_id: str) -> ConstructionApproval:
        approval = ConstructionApproval(
            id=str(uuid4()),
            approver_id=approver_id,
            **approval_data.model_dump()
        )
        return self.repository.construction_approval_repo.create_approval(approval)

    def get_approval(self, approval_id: str) -> Optional[ConstructionApproval]:
        return self.repository.construction_approval_repo.get_approval_by_id(approval_id)

    def update_approval(self, approval_id: str, update_data: ConstructionApprovalUpdate) -> Optional[
        ConstructionApproval]:
        approval = self.get_approval(approval_id)
        if not approval:
            return None

        for field, value in update_data.model_dump(exclude_unset=True).items():
            setattr(approval, field, value)

        return self.repository.construction_approval_repo.update_approval(approval)

    def delete_approval(self, approval_id: str) -> bool:
        approval = self.get_approval(approval_id)
        if not approval:
            return False

        self.repository.construction_approval_repo.delete_approval(approval_id)
        return True

    def list_approvals_by_construction(self, construction_id: str) -> List[ConstructionApproval]:
        return self.repository.construction_approval_repo.list_approvals_by_construction(construction_id)

    def list_approvals_by_user(self, user_id: str) -> List[ConstructionApproval]:
        return self.repository.construction_approval_repo.list_approvals_by_user(user_id)

    def get_approval_by_construction_and_user(self, construction_id: str, user_id: str) -> Optional[
        ConstructionApproval]:
        return self.repository.construction_approval_repo.get_approval_by_construction_and_user(construction_id,
                                                                                                user_id)

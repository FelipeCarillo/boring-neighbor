from typing import Optional, List, Dict, Any
from fastapi import HTTPException, status

from entities.construction import (
    Construction, ConstructionCreate, ConstructionUpdate,
    ConstructionProgress, ConstructionProgressCreate, ConstructionProgressUpdate,
    ConstructionPhase, ConstructionPhaseCreate, ConstructionPhaseUpdate,
    ConstructionApproval, ConstructionApprovalCreate, ConstructionApprovalUpdate
)
from .service import ConstructionService


class ConstructionController:
    def __init__(self, service: ConstructionService):
        self.service = service

    def create_construction(self, data: ConstructionCreate, user_id: str) -> Construction:
        return self.service.create_construction(data, user_id)

    def get_construction(self, construction_id: str) -> Construction:
        construction = self.service.get_construction(construction_id)
        if not construction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Construction not found"
            )
        return construction

    def update_construction(self, construction_id: str, data: ConstructionUpdate) -> Construction:
        construction = self.service.update_construction(construction_id, data)
        if not construction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Construction not found"
            )
        return construction

    def delete_construction(self, construction_id: str) -> Dict[str, str]:
        success = self.service.delete_construction(construction_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Construction not found"
            )
        return {"message": "Construction deleted successfully"}

    def list_constructions(self, filters: Optional[Dict[str, Any]] = None) -> List[Construction]:
        return self.service.list_constructions(filters)

    def create_progress(self, data: ConstructionProgressCreate, user_id: str) -> ConstructionProgress:
        return self.service.create_progress(data, user_id)

    def get_progress(self, progress_id: str) -> ConstructionProgress:
        progress = self.service.get_progress(progress_id)
        if not progress:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Progress record not found"
            )
        return progress

    def update_progress(self, progress_id: str, data: ConstructionProgressUpdate) -> ConstructionProgress:
        progress = self.service.update_progress(progress_id, data)
        if not progress:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Progress record not found"
            )
        return progress

    def delete_progress(self, progress_id: str) -> Dict[str, str]:
        success = self.service.delete_progress(progress_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Progress record not found"
            )
        return {"message": "Progress record deleted successfully"}

    def list_progress_by_construction(self, construction_id: str) -> List[ConstructionProgress]:
        return self.service.list_progress_by_construction(construction_id)

    def get_latest_progress(self, construction_id: str) -> Optional[ConstructionProgress]:
        return self.service.get_latest_progress(construction_id)

    def create_phase(self, data: ConstructionPhaseCreate) -> ConstructionPhase:
        return self.service.create_phase(data)

    def get_phase(self, phase_id: str) -> ConstructionPhase:
        phase = self.service.get_phase(phase_id)
        if not phase:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Phase not found"
            )
        return phase

    def update_phase(self, phase_id: str, data: ConstructionPhaseUpdate) -> ConstructionPhase:
        phase = self.service.update_phase(phase_id, data)
        if not phase:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Phase not found"
            )
        return phase

    def delete_phase(self, phase_id: str) -> Dict[str, str]:
        success = self.service.delete_phase(phase_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Phase not found"
            )
        return {"message": "Phase deleted successfully"}

    def list_phases(self) -> List[ConstructionPhase]:
        return self.service.list_phases()

    def list_active_phases(self) -> List[ConstructionPhase]:
        return self.service.list_active_phases()

    def create_approval(self, data: ConstructionApprovalCreate, approver_id: str) -> ConstructionApproval:
        return self.service.create_approval(data, approver_id)

    def get_approval(self, approval_id: str) -> ConstructionApproval:
        approval = self.service.get_approval(approval_id)
        if not approval:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Approval not found"
            )
        return approval

    def update_approval(self, approval_id: str, data: ConstructionApprovalUpdate) -> ConstructionApproval:
        approval = self.service.update_approval(approval_id, data)
        if not approval:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Approval not found"
            )
        return approval

    def delete_approval(self, approval_id: str) -> Dict[str, str]:
        success = self.service.delete_approval(approval_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Approval not found"
            )
        return {"message": "Approval deleted successfully"}

    def list_approvals_by_construction(self, construction_id: str) -> List[ConstructionApproval]:
        return self.service.list_approvals_by_construction(construction_id)

    def list_approvals_by_user(self, user_id: str) -> List[ConstructionApproval]:
        return self.service.list_approvals_by_user(user_id)

    def get_approval_by_construction_and_user(self, construction_id: str, user_id: str) -> Optional[ConstructionApproval]:
        return self.service.get_approval_by_construction_and_user(construction_id, user_id)

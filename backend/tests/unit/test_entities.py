import pytest
from datetime import datetime
from uuid import uuid4
from pydantic import ValidationError

from src.entities.construction import (
    Construction, ConstructionCreate, ConstructionUpdate,
    ConstructionProgress, ConstructionProgressCreate, ConstructionProgressUpdate,
    ConstructionPhase, ConstructionPhaseCreate, ConstructionPhaseUpdate,
    ConstructionApproval, ConstructionApprovalCreate, ConstructionApprovalUpdate
)
from src.entities.user import User, UserCreate, UserUpdate


class TestConstruction:
    def test_construction_creation_valid(self):
        construction = Construction(
            id=str(uuid4()),
            name="Test Construction",
            description="Test Description",
            location="Test Location",
            status="planned",
            progress_percentage=0.0
        )
        
        assert construction.name == "Test Construction"
        assert construction.status == "planned"
        assert construction.progress_percentage == 0.0

    def test_construction_invalid_status(self):
        with pytest.raises(ValidationError):
            Construction(
                id=str(uuid4()),
                name="Test Construction",
                status="invalid_status",
                progress_percentage=0.0
            )

    def test_construction_progress_percentage_validation(self):
        with pytest.raises(ValidationError):
            Construction(
                id=str(uuid4()),
                name="Test Construction",
                status="planned",
                progress_percentage=150.0
            )

    def test_construction_create_valid(self):
        construction_data = ConstructionCreate(
            name="Test Construction",
            description="Test Description",
            status="planned"
        )
        
        assert construction_data.name == "Test Construction"
        assert construction_data.status == "planned"
        assert construction_data.progress_percentage == 0.0

    def test_construction_update_partial(self):
        update_data = ConstructionUpdate(
            name="Updated Name",
            progress_percentage=50.0
        )
        
        assert update_data.name == "Updated Name"
        assert update_data.progress_percentage == 50.0
        assert update_data.description is None


class TestConstructionProgress:
    def test_construction_progress_creation_valid(self):
        progress = ConstructionProgress(
            id=str(uuid4()),
            construction_id=str(uuid4()),
            recorded_by=str(uuid4()),
            progress_percentage=25.0,
            phase="Foundation"
        )
        
        assert progress.progress_percentage == 25.0
        assert progress.phase == "Foundation"

    def test_construction_progress_percentage_validation(self):
        with pytest.raises(ValidationError):
            ConstructionProgress(
                id=str(uuid4()),
                construction_id=str(uuid4()),
                recorded_by=str(uuid4()),
                progress_percentage=-10.0,
                phase="Foundation"
            )

    def test_construction_progress_create_valid(self):
        progress_data = ConstructionProgressCreate(
            construction_id=str(uuid4()),
            recorded_by=str(uuid4()),
            progress_percentage=30.0,
            phase="Structure",
            workers_count=10,
            hours_worked=8.0
        )
        
        assert progress_data.progress_percentage == 30.0
        assert progress_data.workers_count == 10
        assert progress_data.hours_worked == 8.0


class TestConstructionPhase:
    def test_construction_phase_creation_valid(self):
        phase = ConstructionPhase(
            id=str(uuid4()),
            name="Foundation",
            description="Foundation phase",
            order=1,
            estimated_duration_days=30,
            is_active=True
        )
        
        assert phase.name == "Foundation"
        assert phase.order == 1
        assert phase.is_active is True

    def test_construction_phase_create_valid(self):
        phase_data = ConstructionPhaseCreate(
            name="Structure",
            description="Structure phase",
            order=2,
            estimated_duration_days=60
        )
        
        assert phase_data.name == "Structure"
        assert phase_data.order == 2
        assert phase_data.is_active is True


class TestConstructionApproval:
    def test_construction_approval_creation_valid(self):
        approval = ConstructionApproval(
            id=str(uuid4()),
            construction_id=str(uuid4()),
            user_id=str(uuid4()),
            approver_id=str(uuid4()),
            status="approved",
            can_view=True,
            can_edit=False
        )
        
        assert approval.status == "approved"
        assert approval.can_view is True
        assert approval.can_edit is False

    def test_construction_approval_invalid_status(self):
        with pytest.raises(ValidationError):
            ConstructionApproval(
                id=str(uuid4()),
                construction_id=str(uuid4()),
                user_id=str(uuid4()),
                approver_id=str(uuid4()),
                status="invalid_status"
            )

    def test_construction_approval_create_valid(self):
        approval_data = ConstructionApprovalCreate(
            construction_id=str(uuid4()),
            user_id=str(uuid4()),
            approver_id=str(uuid4()),
            status="pending",
            can_view=True,
            can_edit=True,
            can_delete=False
        )
        
        assert approval_data.status == "pending"
        assert approval_data.can_view is True
        assert approval_data.can_edit is True
        assert approval_data.can_delete is False


class TestUser:
    def test_user_creation_valid(self):
        user = User(
            id=str(uuid4()),
            email="test@example.com",
            name="Test User",
            role="admin"
        )
        
        assert user.email == "test@example.com"
        assert user.name == "Test User"
        assert user.role == "admin"

    def test_user_invalid_role(self):
        with pytest.raises(ValidationError):
            User(
                id=str(uuid4()),
                email="test@example.com",
                name="Test User",
                role="invalid_role"
            )

    def test_user_create_valid(self):
        user_data = UserCreate(
            email="test@example.com",
            name="Test User",
            role="supervisor",
            is_active=True
        )
        
        assert user_data.email == "test@example.com"
        assert user_data.role == "supervisor"
        assert user_data.is_active is True

    def test_user_update_partial(self):
        update_data = UserUpdate(
            name="Updated Name",
            role="worker"
        )
        
        assert update_data.name == "Updated Name"
        assert update_data.role == "worker"
        assert update_data.email is None

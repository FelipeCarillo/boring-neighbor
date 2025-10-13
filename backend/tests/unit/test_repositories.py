import pytest
from unittest.mock import Mock, MagicMock
from datetime import datetime
from uuid import uuid4

from src.repositories.repositories.construction_repo.construction_repo_mock import ConstructionRepoMock
from src.repositories.repositories.construction_progress_repo.construction_progress_repo_mock import ConstructionProgressRepoMock
from src.repositories.repositories.construction_phase_repo.construction_phase_repo_mock import ConstructionPhaseRepoMock
from src.repositories.repositories.construction_approval_repo.construction_approval_repo_mock import ConstructionApprovalRepoMock
from src.repositories.repositories.construction_3d_report_repo.construction_3d_report_repo_mock import Construction3DReportRepoMock
from src.entities.construction import Construction, ConstructionProgress, ConstructionPhase, ConstructionApproval, Construction3DReport
from src.entities.user import User


class TestConstructionRepoMock:
    def setup_method(self):
        self.repo = ConstructionRepoMock()

    def test_create_construction(self):
        construction = Construction(
            id=str(uuid4()),
            name="Test Construction",
            status="planned",
            progress_percentage=0.0
        )
        
        result = self.repo.create_construction(construction)
        
        assert result == construction
        assert len(self.repo.constructions) == 1

    def test_get_construction_by_id(self):
        construction = Construction(
            id=str(uuid4()),
            name="Test Construction",
            status="planned",
            progress_percentage=0.0
        )
        self.repo.create_construction(construction)
        
        result = self.repo.get_construction_by_id(construction.id)
        
        assert result == construction

    def test_get_construction_by_id_not_found(self):
        result = self.repo.get_construction_by_id("non-existent-id")
        
        assert result is None

    def test_update_construction(self):
        construction = Construction(
            id=str(uuid4()),
            name="Test Construction",
            status="planned",
            progress_percentage=0.0
        )
        self.repo.create_construction(construction)
        
        construction.name = "Updated Name"
        result = self.repo.update_construction(construction)
        
        assert result.name == "Updated Name"

    def test_delete_construction(self):
        construction = Construction(
            id=str(uuid4()),
            name="Test Construction",
            status="planned",
            progress_percentage=0.0
        )
        self.repo.create_construction(construction)
        
        self.repo.delete_construction(construction.id)
        
        assert len(self.repo.constructions) == 0

    def test_list_constructions(self):
        construction1 = Construction(
            id=str(uuid4()),
            name="Construction 1",
            status="planned",
            progress_percentage=0.0
        )
        construction2 = Construction(
            id=str(uuid4()),
            name="Construction 2",
            status="in_progress",
            progress_percentage=50.0
        )
        
        self.repo.create_construction(construction1)
        self.repo.create_construction(construction2)
        
        result = self.repo.list_constructions()
        
        assert len(result) == 2

    def test_get_constructions_by_status(self):
        construction1 = Construction(
            id=str(uuid4()),
            name="Construction 1",
            status="planned",
            progress_percentage=0.0
        )
        construction2 = Construction(
            id=str(uuid4()),
            name="Construction 2",
            status="in_progress",
            progress_percentage=50.0
        )
        
        self.repo.create_construction(construction1)
        self.repo.create_construction(construction2)
        
        result = self.repo.get_constructions_by_status("planned")
        
        assert len(result) == 1
        assert result[0].status == "planned"


class TestConstructionProgressRepoMock:
    def setup_method(self):
        self.repo = ConstructionProgressRepoMock()

    def test_create_progress(self):
        progress = ConstructionProgress(
            id=str(uuid4()),
            construction_id=str(uuid4()),
            recorded_by=str(uuid4()),
            progress_percentage=25.0,
            phase="Foundation"
        )
        
        result = self.repo.create_progress(progress)
        
        assert result == progress
        assert len(self.repo.progress_records) == 1

    def test_get_progress_by_id(self):
        progress = ConstructionProgress(
            id=str(uuid4()),
            construction_id=str(uuid4()),
            recorded_by=str(uuid4()),
            progress_percentage=25.0,
            phase="Foundation"
        )
        self.repo.create_progress(progress)
        
        result = self.repo.get_progress_by_id(progress.id)
        
        assert result == progress

    def test_list_progress_by_construction(self):
        construction_id = str(uuid4())
        progress1 = ConstructionProgress(
            id=str(uuid4()),
            construction_id=construction_id,
            recorded_by=str(uuid4()),
            progress_percentage=25.0,
            phase="Foundation"
        )
        progress2 = ConstructionProgress(
            id=str(uuid4()),
            construction_id=construction_id,
            recorded_by=str(uuid4()),
            progress_percentage=50.0,
            phase="Structure"
        )
        
        self.repo.create_progress(progress1)
        self.repo.create_progress(progress2)
        
        result = self.repo.list_progress_by_construction(construction_id)
        
        assert len(result) == 2
        assert all(p.construction_id == construction_id for p in result)


class TestConstructionPhaseRepoMock:
    def setup_method(self):
        self.repo = ConstructionPhaseRepoMock()

    def test_create_phase(self):
        phase = ConstructionPhase(
            id=str(uuid4()),
            name="Foundation",
            description="Foundation phase",
            order=1,
            estimated_duration_days=30,
            is_active=True
        )
        
        result = self.repo.create_phase(phase)
        
        assert result == phase
        assert len(self.repo.phases) == 1

    def test_get_phase_by_id(self):
        phase = ConstructionPhase(
            id=str(uuid4()),
            name="Foundation",
            description="Foundation phase",
            order=1,
            is_active=True
        )
        self.repo.create_phase(phase)
        
        result = self.repo.get_phase_by_id(phase.id)
        
        assert result == phase

    def test_list_active_phases(self):
        phase1 = ConstructionPhase(
            id=str(uuid4()),
            name="Foundation",
            order=1,
            is_active=True
        )
        phase2 = ConstructionPhase(
            id=str(uuid4()),
            name="Structure",
            order=2,
            is_active=False
        )
        
        self.repo.create_phase(phase1)
        self.repo.create_phase(phase2)
        
        result = self.repo.list_active_phases()
        
        assert len(result) == 1
        assert result[0].is_active is True


class TestConstructionApprovalRepoMock:
    def setup_method(self):
        self.repo = ConstructionApprovalRepoMock()

    def test_create_approval(self):
        approval = ConstructionApproval(
            id=str(uuid4()),
            construction_id=str(uuid4()),
            user_id=str(uuid4()),
            approver_id=str(uuid4()),
            status="approved",
            can_view=True,
            can_edit=False
        )
        
        result = self.repo.create_approval(approval)
        
        assert result == approval
        assert len(self.repo.approvals) == 1

    def test_get_approval_by_id(self):
        approval = ConstructionApproval(
            id=str(uuid4()),
            construction_id=str(uuid4()),
            user_id=str(uuid4()),
            approver_id=str(uuid4()),
            status="approved"
        )
        self.repo.create_approval(approval)
        
        result = self.repo.get_approval_by_id(approval.id)
        
        assert result == approval

    def test_list_approvals_by_construction(self):
        construction_id = str(uuid4())
        approval1 = ConstructionApproval(
            id=str(uuid4()),
            construction_id=construction_id,
            user_id=str(uuid4()),
            approver_id=str(uuid4()),
            status="approved"
        )
        approval2 = ConstructionApproval(
            id=str(uuid4()),
            construction_id=construction_id,
            user_id=str(uuid4()),
            approver_id=str(uuid4()),
            status="pending"
        )
        
        self.repo.create_approval(approval1)
        self.repo.create_approval(approval2)
        
        result = self.repo.list_approvals_by_construction(construction_id)
        
        assert len(result) == 2
        assert all(a.construction_id == construction_id for a in result)


class TestConstruction3DReportRepoMock:
    def setup_method(self):
        self.repo = Construction3DReportRepoMock()

    def test_create_report(self):
        report = Construction3DReport(
            id=str(uuid4()),
            construction_id=str(uuid4()),
            s3_ply_key="test/ply.ply",
            s3_obj_key="test/obj.obj",
            status="pending"
        )
        
        result = self.repo.create_report(report)
        
        assert result == report
        assert len(self.repo.reports) == 1

    def test_get_report_by_id(self):
        report = Construction3DReport(
            id=str(uuid4()),
            construction_id=str(uuid4()),
            s3_ply_key="test/ply.ply",
            s3_obj_key="test/obj.obj",
            status="pending"
        )
        self.repo.create_report(report)
        
        result = self.repo.get_report_by_id(report.id)
        
        assert result == report

    def test_list_reports_by_construction(self):
        construction_id = str(uuid4())
        report1 = Construction3DReport(
            id=str(uuid4()),
            construction_id=construction_id,
            s3_ply_key="test/ply1.ply",
            s3_obj_key="test/obj1.obj",
            status="completed"
        )
        report2 = Construction3DReport(
            id=str(uuid4()),
            construction_id=construction_id,
            s3_ply_key="test/ply2.ply",
            s3_obj_key="test/obj2.obj",
            status="pending"
        )
        
        self.repo.create_report(report1)
        self.repo.create_report(report2)
        
        result = self.repo.list_reports_by_construction(construction_id)
        
        assert len(result) == 2
        assert all(r.construction_id == construction_id for r in result)



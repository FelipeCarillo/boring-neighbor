import pytest
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
from datetime import datetime
from uuid import uuid4

from src.main import app
from src.entities.user import User
from src.entities.construction import Construction, ConstructionProgress, ConstructionPhase, Construction3DReport


class TestConstructionIntegrationFlow:
    def setup_method(self):
        self.client = TestClient(app)
        self.mock_user = User(
            id=str(uuid4()),
            email="test@example.com",
            name="Test User",
            role="admin"
        )

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_construction_controller')
    def test_complete_construction_lifecycle(self, mock_get_controller, mock_get_user):
        mock_controller = Mock()
        mock_get_controller.return_value = mock_controller
        mock_get_user.return_value = self.mock_user
        
        construction_id = str(uuid4())
        
        # Create construction
        construction_data = {
            "name": "Integration Test Construction",
            "description": "Test Description",
            "status": "planned"
        }
        
        mock_construction = Construction(
            id=construction_id,
            name="Integration Test Construction",
            description="Test Description",
            status="planned",
            progress_percentage=0.0
        )
        mock_controller.create_construction.return_value = mock_construction
        mock_controller.get_construction.return_value = mock_construction
        mock_controller.update_construction.return_value = mock_construction
        mock_controller.delete_construction.return_value = {"message": "Construction deleted successfully"}
        
        # Test create
        response = self.client.post("/api/v1/constructions/", json=construction_data)
        assert response.status_code == 200
        
        # Test get
        response = self.client.get(f"/api/v1/constructions/{construction_id}")
        assert response.status_code == 200
        
        # Test update
        update_data = {"status": "in_progress", "progress_percentage": 25.0}
        response = self.client.put(f"/api/v1/constructions/{construction_id}", json=update_data)
        assert response.status_code == 200
        
        # Test delete
        response = self.client.delete(f"/api/v1/constructions/{construction_id}")
        assert response.status_code == 200

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_construction_controller')
    def test_construction_progress_workflow(self, mock_get_controller, mock_get_user):
        mock_controller = Mock()
        mock_get_controller.return_value = mock_controller
        mock_get_user.return_value = self.mock_user
        
        construction_id = str(uuid4())
        
        # Create progress record
        progress_data = {
            "progress_percentage": 25.0,
            "phase": "Foundation",
            "workers_count": 10,
            "hours_worked": 8.0,
            "notes": "Foundation work completed"
        }
        
        mock_progress = ConstructionProgress(
            id=str(uuid4()),
            construction_id=construction_id,
            recorded_by=self.mock_user.id,
            progress_percentage=25.0,
            phase="Foundation"
        )
        mock_controller.create_progress.return_value = mock_progress
        mock_controller.list_progress_by_construction.return_value = [mock_progress]
        mock_controller.get_latest_progress.return_value = mock_progress
        
        # Test create progress
        response = self.client.post(f"/api/v1/constructions/{construction_id}/progress", json=progress_data)
        assert response.status_code == 200
        
        # Test list progress
        response = self.client.get(f"/api/v1/constructions/{construction_id}/progress")
        assert response.status_code == 200
        
        # Test get latest progress
        response = self.client.get(f"/api/v1/constructions/{construction_id}/progress/latest")
        assert response.status_code == 200

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_construction_controller')
    def test_phase_management_workflow(self, mock_get_controller, mock_get_user):
        mock_controller = Mock()
        mock_get_controller.return_value = mock_controller
        mock_get_user.return_value = self.mock_user
        
        # Create phase
        phase_data = {
            "name": "Foundation",
            "description": "Foundation phase",
            "order": 1,
            "estimated_duration_days": 30
        }
        
        mock_phase = ConstructionPhase(
            id=str(uuid4()),
            name="Foundation",
            description="Foundation phase",
            order=1,
            estimated_duration_days=30,
            is_active=True
        )
        mock_controller.create_phase.return_value = mock_phase
        mock_controller.get_phase.return_value = mock_phase
        mock_controller.list_phases.return_value = [mock_phase]
        mock_controller.list_active_phases.return_value = [mock_phase]
        mock_controller.update_phase.return_value = mock_phase
        mock_controller.delete_phase.return_value = {"message": "Phase deleted successfully"}
        
        # Test create phase
        response = self.client.post("/api/v1/phases/", json=phase_data)
        assert response.status_code == 200
        
        # Test list phases
        response = self.client.get("/api/v1/phases/")
        assert response.status_code == 200
        
        # Test list active phases
        response = self.client.get("/api/v1/phases/?active_only=true")
        assert response.status_code == 200
        
        # Test get phase
        phase_id = str(uuid4())
        response = self.client.get(f"/api/v1/phases/{phase_id}")
        assert response.status_code == 200
        
        # Test update phase
        update_data = {"estimated_duration_days": 35}
        response = self.client.put(f"/api/v1/phases/{phase_id}", json=update_data)
        assert response.status_code == 200
        
        # Test delete phase
        response = self.client.delete(f"/api/v1/phases/{phase_id}")
        assert response.status_code == 200

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_construction_controller')
    def test_approval_management_workflow(self, mock_get_controller, mock_get_user):
        mock_controller = Mock()
        mock_get_controller.return_value = mock_controller
        mock_get_user.return_value = self.mock_user
        
        construction_id = str(uuid4())
        user_id = str(uuid4())
        
        # Create approval
        approval_data = {
            "user_id": user_id,
            "can_view": True,
            "can_edit": False,
            "can_delete": False,
            "can_approve": False,
            "can_manage_users": False
        }
        
        mock_approval = Mock()
        mock_controller.create_approval.return_value = mock_approval
        mock_controller.list_approvals_by_construction.return_value = [mock_approval]
        mock_controller.list_approvals_by_user.return_value = [mock_approval]
        mock_controller.get_approval.return_value = mock_approval
        mock_controller.update_approval.return_value = mock_approval
        mock_controller.delete_approval.return_value = {"message": "Approval deleted successfully"}
        
        # Test create approval
        response = self.client.post(f"/api/v1/constructions/{construction_id}/approvals", json=approval_data)
        assert response.status_code == 200
        
        # Test list approvals by construction
        response = self.client.get(f"/api/v1/constructions/{construction_id}/approvals")
        assert response.status_code == 200
        
        # Test list approvals by user
        response = self.client.get(f"/api/v1/approvals/user/{user_id}")
        assert response.status_code == 200
        
        # Test get approval
        approval_id = str(uuid4())
        response = self.client.get(f"/api/v1/approvals/{approval_id}")
        assert response.status_code == 200
        
        # Test update approval
        update_data = {"can_edit": True}
        response = self.client.put(f"/api/v1/approvals/{approval_id}", json=update_data)
        assert response.status_code == 200
        
        # Test delete approval
        response = self.client.delete(f"/api/v1/approvals/{approval_id}")
        assert response.status_code == 200

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_s3_manager')
    @patch('src.router.constructions.view.get_repository')
    def test_3d_processing_workflow(self, mock_get_repository, mock_get_s3_manager, mock_get_user):
        mock_repository = Mock()
        mock_s3_manager = Mock()
        mock_get_repository.return_value = mock_repository
        mock_get_s3_manager.return_value = mock_s3_manager
        mock_get_user.return_value = self.mock_user
        
        construction_id = str(uuid4())
        
        # Mock 3D report
        mock_report = Mock()
        mock_report.id = str(uuid4())
        mock_report.status = "completed"
        mock_report.processing_started_at = datetime.utcnow()
        mock_report.processing_completed_at = datetime.utcnow()
        mock_report.error_message = None
        mock_report.report_json = '{"test": "data"}'
        mock_repository.construction_3d_report_repo.get_latest_report_by_construction.return_value = mock_report
        
        # Test upload 3D files
        files = {
            'ply_file': ('test.ply', b'ply content', 'application/octet-stream'),
            'obj_file': ('test.obj', b'obj content', 'application/octet-stream')
        }
        response = self.client.post(f"/api/v1/constructions/{construction_id}/3d/upload", files=files)
        assert response.status_code == 200
        
        # Test process 3D files
        form_data = {
            'ply_key': 'test/ply.ply',
            'obj_key': 'test/obj.obj'
        }
        response = self.client.post(f"/api/v1/constructions/{construction_id}/3d/process", data=form_data)
        assert response.status_code == 200
        
        # Test get 3D status
        response = self.client.get(f"/api/v1/constructions/{construction_id}/3d/status")
        assert response.status_code == 200
        
        # Test get 3D report
        response = self.client.get(f"/api/v1/constructions/{construction_id}/3d/report")
        assert response.status_code == 200
        
        # Test get download URL
        response = self.client.get(f"/api/v1/constructions/{construction_id}/3d/download/ply")
        assert response.status_code == 200

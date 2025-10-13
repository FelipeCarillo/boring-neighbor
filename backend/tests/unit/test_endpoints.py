import pytest
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
from fastapi import status
import json
from uuid import uuid4

from src.main import app
from src.entities.construction import Construction, ConstructionCreate, ConstructionUpdate, Construction3DReport
from src.entities.user import User


class TestConstructionEndpoints:
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
    def test_create_construction_success(self, mock_get_controller, mock_get_user):
        mock_controller = Mock()
        mock_controller.create_construction.return_value = Construction(
            id=str(uuid4()),
            name="Test Construction",
            status="planned",
            progress_percentage=0.0
        )
        mock_get_controller.return_value = mock_controller
        mock_get_user.return_value = self.mock_user
        
        construction_data = {
            "name": "Test Construction",
            "description": "Test Description",
            "status": "planned"
        }
        
        response = self.client.post("/api/v1/constructions/", json=construction_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == "Test Construction"
        assert data["status"] == "planned"

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_construction_controller')
    def test_get_construction_success(self, mock_get_controller, mock_get_user):
        construction_id = str(uuid4())
        mock_controller = Mock()
        mock_controller.get_construction.return_value = Construction(
            id=construction_id,
            name="Test Construction",
            status="planned",
            progress_percentage=0.0
        )
        mock_get_controller.return_value = mock_controller
        mock_get_user.return_value = self.mock_user
        
        response = self.client.get(f"/api/v1/constructions/{construction_id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == construction_id
        assert data["name"] == "Test Construction"

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_construction_controller')
    def test_get_construction_not_found(self, mock_get_controller, mock_get_user):
        construction_id = str(uuid4())
        mock_controller = Mock()
        mock_controller.get_construction.side_effect = Exception("Construction not found")
        mock_get_controller.return_value = mock_controller
        mock_get_user.return_value = self.mock_user
        
        response = self.client.get(f"/api/v1/constructions/{construction_id}")
        
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_construction_controller')
    def test_list_constructions_success(self, mock_get_controller, mock_get_user):
        mock_controller = Mock()
        mock_controller.list_constructions.return_value = [
            Construction(
                id=str(uuid4()),
                name="Construction 1",
                status="planned",
                progress_percentage=0.0
            ),
            Construction(
                id=str(uuid4()),
                name="Construction 2",
                status="in_progress",
                progress_percentage=50.0
            )
        ]
        mock_get_controller.return_value = mock_controller
        mock_get_user.return_value = self.mock_user
        
        response = self.client.get("/api/v1/constructions/")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 2
        assert data[0]["name"] == "Construction 1"
        assert data[1]["name"] == "Construction 2"

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_construction_controller')
    def test_list_constructions_with_filters(self, mock_get_controller, mock_get_user):
        mock_controller = Mock()
        mock_controller.list_constructions.return_value = []
        mock_get_controller.return_value = mock_controller
        mock_get_user.return_value = self.mock_user
        
        response = self.client.get("/api/v1/constructions/?status=in_progress&supervisor_id=123")
        
        assert response.status_code == status.HTTP_200_OK
        mock_controller.list_constructions.assert_called_once()
        call_args = mock_controller.list_constructions.call_args[0][0]
        assert call_args["status"] == "in_progress"
        assert call_args["supervisor_id"] == "123"

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_construction_controller')
    def test_update_construction_success(self, mock_get_controller, mock_get_user):
        construction_id = str(uuid4())
        mock_controller = Mock()
        mock_controller.update_construction.return_value = Construction(
            id=construction_id,
            name="Updated Construction",
            status="in_progress",
            progress_percentage=25.0
        )
        mock_get_controller.return_value = mock_controller
        mock_get_user.return_value = self.mock_user
        
        update_data = {
            "name": "Updated Construction",
            "progress_percentage": 25.0
        }
        
        response = self.client.put(f"/api/v1/constructions/{construction_id}", json=update_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == "Updated Construction"
        assert data["progress_percentage"] == 25.0

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_construction_controller')
    def test_delete_construction_success(self, mock_get_controller, mock_get_user):
        construction_id = str(uuid4())
        mock_controller = Mock()
        mock_controller.delete_construction.return_value = {"message": "Construction deleted successfully"}
        mock_get_controller.return_value = mock_controller
        mock_get_user.return_value = self.mock_user
        
        response = self.client.delete(f"/api/v1/constructions/{construction_id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["message"] == "Construction deleted successfully"


class TestProgressEndpoints:
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
    def test_create_progress_success(self, mock_get_controller, mock_get_user):
        construction_id = str(uuid4())
        mock_controller = Mock()
        mock_controller.create_progress.return_value = Mock()
        mock_get_controller.return_value = mock_controller
        mock_get_user.return_value = self.mock_user
        
        progress_data = {
            "progress_percentage": 25.0,
            "phase": "Foundation",
            "workers_count": 10,
            "hours_worked": 8.0
        }
        
        response = self.client.post(f"/api/v1/constructions/{construction_id}/progress", json=progress_data)
        
        assert response.status_code == status.HTTP_200_OK

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_construction_controller')
    def test_list_progress_by_construction_success(self, mock_get_controller, mock_get_user):
        construction_id = str(uuid4())
        mock_controller = Mock()
        mock_controller.list_progress_by_construction.return_value = []
        mock_get_controller.return_value = mock_controller
        mock_get_user.return_value = self.mock_user
        
        response = self.client.get(f"/api/v1/constructions/{construction_id}/progress")
        
        assert response.status_code == status.HTTP_200_OK


class TestPhaseEndpoints:
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
    def test_create_phase_success(self, mock_get_controller, mock_get_user):
        mock_controller = Mock()
        mock_controller.create_phase.return_value = Mock()
        mock_get_controller.return_value = mock_controller
        mock_get_user.return_value = self.mock_user
        
        phase_data = {
            "name": "Foundation",
            "description": "Foundation phase",
            "order": 1,
            "estimated_duration_days": 30
        }
        
        response = self.client.post("/api/v1/phases/", json=phase_data)
        
        assert response.status_code == status.HTTP_200_OK

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_construction_controller')
    def test_list_phases_success(self, mock_get_controller, mock_get_user):
        mock_controller = Mock()
        mock_controller.list_phases.return_value = []
        mock_get_controller.return_value = mock_controller
        mock_get_user.return_value = self.mock_user
        
        response = self.client.get("/api/v1/phases/")
        
        assert response.status_code == status.HTTP_200_OK

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_construction_controller')
    def test_list_phases_active_only(self, mock_get_controller, mock_get_user):
        mock_controller = Mock()
        mock_controller.list_active_phases.return_value = []
        mock_get_controller.return_value = mock_controller
        mock_get_user.return_value = self.mock_user
        
        response = self.client.get("/api/v1/phases/?active_only=true")
        
        assert response.status_code == status.HTTP_200_OK


class TestApprovalEndpoints:
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
    def test_create_approval_success(self, mock_get_controller, mock_get_user):
        construction_id = str(uuid4())
        mock_controller = Mock()
        mock_controller.create_approval.return_value = Mock()
        mock_get_controller.return_value = mock_controller
        mock_get_user.return_value = self.mock_user
        
        approval_data = {
            "user_id": str(uuid4()),
            "can_view": True,
            "can_edit": False,
            "can_delete": False
        }
        
        response = self.client.post(f"/api/v1/constructions/{construction_id}/approvals", json=approval_data)
        
        assert response.status_code == status.HTTP_200_OK

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_construction_controller')
    def test_list_approvals_by_construction_success(self, mock_get_controller, mock_get_user):
        construction_id = str(uuid4())
        mock_controller = Mock()
        mock_controller.list_approvals_by_construction.return_value = []
        mock_get_controller.return_value = mock_controller
        mock_get_user.return_value = self.mock_user
        
        response = self.client.get(f"/api/v1/constructions/{construction_id}/approvals")
        
        assert response.status_code == status.HTTP_200_OK


class Test3DEndpoints:
    def setup_method(self):
        self.client = TestClient(app)
        self.mock_user = User(
            id=str(uuid4()),
            email="test@example.com",
            name="Test User",
            role="admin"
        )

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_s3_manager')
    def test_upload_3d_files_success(self, mock_get_s3_manager, mock_get_user):
        mock_s3_manager = Mock()
        mock_get_s3_manager.return_value = mock_s3_manager
        mock_get_user.return_value = self.mock_user
        
        construction_id = str(uuid4())
        
        files = {
            'ply_file': ('test.ply', b'ply content', 'application/octet-stream'),
            'obj_file': ('test.obj', b'obj content', 'application/octet-stream')
        }
        
        response = self.client.post(f"/api/v1/constructions/{construction_id}/3d/upload", files=files)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "message" in data
        assert "ply_key" in data
        assert "obj_key" in data

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_s3_manager')
    def test_upload_3d_files_invalid_extension(self, mock_get_s3_manager, mock_get_user):
        mock_s3_manager = Mock()
        mock_get_s3_manager.return_value = mock_s3_manager
        mock_get_user.return_value = self.mock_user
        
        construction_id = str(uuid4())
        
        files = {
            'ply_file': ('test.txt', b'content', 'text/plain'),
            'obj_file': ('test.obj', b'obj content', 'application/octet-stream')
        }
        
        response = self.client.post(f"/api/v1/constructions/{construction_id}/3d/upload", files=files)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_repository')
    @patch('src.router.constructions.view.get_s3_manager')
    def test_process_3d_files_success(self, mock_get_s3_manager, mock_get_repository, mock_get_user):
        mock_s3_manager = Mock()
        mock_repository = Mock()
        mock_get_s3_manager.return_value = mock_s3_manager
        mock_get_repository.return_value = mock_repository
        mock_get_user.return_value = self.mock_user
        
        construction_id = str(uuid4())
        
        form_data = {
            'ply_key': 'test/ply.ply',
            'obj_key': 'test/obj.obj'
        }
        
        response = self.client.post(f"/api/v1/constructions/{construction_id}/3d/process", data=form_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "message" in data
        assert "report_id" in data

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_repository')
    def test_get_3d_status_success(self, mock_get_repository, mock_get_user):
        mock_repository = Mock()
        mock_report = Mock()
        mock_report.status = "completed"
        mock_report.processing_started_at = "2023-01-01T00:00:00"
        mock_report.processing_completed_at = "2023-01-01T01:00:00"
        mock_report.error_message = None
        mock_repository.construction_3d_report_repo.get_latest_report_by_construction.return_value = mock_report
        mock_get_repository.return_value = mock_repository
        mock_get_user.return_value = self.mock_user
        
        construction_id = str(uuid4())
        
        response = self.client.get(f"/api/v1/constructions/{construction_id}/3d/status")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "completed"

    @patch('src.router.constructions.view.get_user')
    @patch('src.router.constructions.view.get_repository')
    def test_get_3d_status_not_found(self, mock_get_repository, mock_get_user):
        mock_repository = Mock()
        mock_repository.construction_3d_report_repo.get_latest_report_by_construction.return_value = None
        mock_get_repository.return_value = mock_repository
        mock_get_user.return_value = self.mock_user
        
        construction_id = str(uuid4())
        
        response = self.client.get(f"/api/v1/constructions/{construction_id}/3d/status")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

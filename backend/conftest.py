import pytest
import os
import sys
from unittest.mock import Mock

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from src.entities.user import User
from src.entities.construction import Construction, Construction3DReport


@pytest.fixture
def mock_user():
    return User(
        id="test-user-id",
        email="test@example.com",
        name="Test User",
        role="admin"
    )


@pytest.fixture
def mock_construction():
    return Construction(
        id="test-construction-id",
        name="Test Construction",
        description="Test Description",
        status="planned",
        progress_percentage=0.0
    )


@pytest.fixture
def mock_repository():
    repository = Mock()
    repository.construction_repo = Mock()
    repository.construction_progress_repo = Mock()
    repository.construction_phase_repo = Mock()
    repository.construction_approval_repo = Mock()
    repository.construction_3d_report_repo = Mock()
    repository.user_repo = Mock()
    return repository


@pytest.fixture
def mock_s3_manager():
    s3_manager = Mock()
    s3_manager.bucket_name = "test-bucket"
    return s3_manager


@pytest.fixture(autouse=True)
def setup_test_environment():
    os.environ["STAGE"] = "local"
    os.environ["DATABASE_URL"] = "sqlite:///test.db"
    os.environ["BUCKET_NAME"] = "test-bucket"
    os.environ["API_VERSION"] = "v1"
    os.environ["PROJECT_NAME"] = "test-project"
    os.environ["API_DOMAIN"] = "http://localhost:8000"
    os.environ["AZURE_TENANT_ID"] = "test-tenant"
    os.environ["AZURE_CLIENT_ID"] = "test-client"
    os.environ["AZURE_CLIENT_SECRET"] = "test-secret"

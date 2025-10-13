import pytest
from unittest.mock import Mock, MagicMock
from datetime import datetime
from uuid import uuid4

from src.router.constructions.service import ConstructionService
from src.entities.construction import ConstructionCreate, ConstructionUpdate
from src.repositories.repository import Repository


@pytest.fixture
def mock_repository():
    return Mock(spec=Repository)

@pytest.fixture
def construction_service(mock_repository):
    return ConstructionService(mock_repository)

def test_create_construction(construction_service, mock_repository):
    user_id = str(uuid4())
    construction_data = ConstructionCreate(
        name="Test Construction",
        description="Test Description",
        status="planned"
    )
    
    mock_construction = Mock()
    mock_repository.construction_repo.create_construction.return_value = mock_construction
    
    result = construction_service.create_construction(construction_data, user_id)
    
    mock_repository.construction_repo.create_construction.assert_called_once()
    assert result == mock_construction

def test_get_construction(construction_service, mock_repository):
    construction_id = str(uuid4())
    mock_construction = Mock()
    mock_repository.construction_repo.get_construction_by_id.return_value = mock_construction
    
    result = construction_service.get_construction(construction_id)
    
    mock_repository.construction_repo.get_construction_by_id.assert_called_once_with(construction_id)
    assert result == mock_construction

def test_get_construction_not_found(construction_service, mock_repository):
    construction_id = str(uuid4())
    mock_repository.construction_repo.get_construction_by_id.return_value = None
    
    result = construction_service.get_construction(construction_id)
    
    assert result is None

def test_update_construction(construction_service, mock_repository):
    construction_id = str(uuid4())
    mock_construction = Mock()
    mock_repository.construction_repo.get_construction_by_id.return_value = mock_construction
    mock_repository.construction_repo.update_construction.return_value = mock_construction
    
    update_data = ConstructionUpdate(name="Updated Name")
    result = construction_service.update_construction(construction_id, update_data)
    
    assert result == mock_construction
    assert mock_construction.name == "Updated Name"

def test_update_construction_not_found(construction_service, mock_repository):
    construction_id = str(uuid4())
    mock_repository.construction_repo.get_construction_by_id.return_value = None
    
    update_data = ConstructionUpdate(name="Updated Name")
    result = construction_service.update_construction(construction_id, update_data)
    
    assert result is None

def test_delete_construction(construction_service, mock_repository):
    construction_id = str(uuid4())
    mock_construction = Mock()
    mock_repository.construction_repo.get_construction_by_id.return_value = mock_construction
    
    result = construction_service.delete_construction(construction_id)
    
    assert result is True
    mock_repository.construction_repo.delete_construction.assert_called_once_with(construction_id)

def test_delete_construction_not_found(construction_service, mock_repository):
    construction_id = str(uuid4())
    mock_repository.construction_repo.get_construction_by_id.return_value = None
    
    result = construction_service.delete_construction(construction_id)
    
    assert result is False

def test_list_constructions_no_filters(construction_service, mock_repository):
    mock_constructions = [Mock(), Mock()]
    mock_repository.construction_repo.list_constructions.return_value = mock_constructions
    
    result = construction_service.list_constructions()
    
    assert result == mock_constructions
    mock_repository.construction_repo.list_constructions.assert_called_once()

def test_list_constructions_with_status_filter(construction_service, mock_repository):
    mock_constructions = [Mock()]
    mock_repository.construction_repo.get_constructions_by_status.return_value = mock_constructions
    
    filters = {"status": "in_progress"}
    result = construction_service.list_constructions(filters)
    
    assert result == mock_constructions
    mock_repository.construction_repo.get_constructions_by_status.assert_called_once_with("in_progress")

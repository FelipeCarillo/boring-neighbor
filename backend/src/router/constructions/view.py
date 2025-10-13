from fastapi import APIRouter, Depends, Request, HTTPException, status
from typing import Optional, List
from uuid import UUID

from helpers.auth import get_user
from helpers.errors import handle_exception
from helpers.lifespan import get_repo
from entities.construction import Construction, ConstructionCreate, ConstructionUpdate
from .controller import ConstructionController
from .service import ConstructionService

construction_router = APIRouter(
    prefix="/constructions",
    tags=["Constructions"],
)


async def get_service(request: Request) -> ConstructionService:
    repo = await get_repo(request)
    return ConstructionService(repo.construction_repo)


async def get_controller(
    service: ConstructionService = Depends(get_service)
) -> ConstructionController:
    return ConstructionController(service)


@handle_exception
@construction_router.get("/", response_model=List[Construction])
async def list_constructions(
    status: Optional[str] = None,
    search: Optional[str] = None,
    supervisor_id: Optional[str] = None,
    controller: ConstructionController = Depends(get_controller),
    user=Depends(get_user)
):
    """List all constructions with optional filters."""
    filters = {}
    if status:
        filters['status'] = status
    if search:
        filters['search'] = search
    if supervisor_id:
        filters['supervisor_id'] = supervisor_id
    
    constructions = controller.list_constructions(filters)
    return constructions


@handle_exception
@construction_router.get("/{construction_id}", response_model=Construction)
async def get_construction(
    construction_id: str,
    controller: ConstructionController = Depends(get_controller),
    user=Depends(get_user)
):
    """Get a specific construction by ID."""
    construction = controller.get_construction(construction_id)
    if not construction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Construction not found"
        )
    return construction


@handle_exception
@construction_router.post("/", response_model=Construction, status_code=status.HTTP_201_CREATED)
async def create_construction(
    construction_data: ConstructionCreate,
    controller: ConstructionController = Depends(get_controller),
    user=Depends(get_user)
):
    """Create a new construction."""
    construction = controller.create_construction(construction_data)
    return construction


@handle_exception
@construction_router.put("/{construction_id}", response_model=Construction)
async def update_construction(
    construction_id: str,
    construction_data: ConstructionUpdate,
    controller: ConstructionController = Depends(get_controller),
    user=Depends(get_user)
):
    """Update an existing construction."""
    # Check if construction exists
    existing_construction = controller.get_construction(construction_id)
    if not existing_construction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Construction not found"
        )
    
    updated_construction = controller.update_construction(construction_id, construction_data)
    return updated_construction


@handle_exception
@construction_router.delete("/{construction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_construction(
    construction_id: str,
    controller: ConstructionController = Depends(get_controller),
    user=Depends(get_user)
):
    """Delete a construction."""
    # Check if construction exists
    existing_construction = controller.get_construction(construction_id)
    if not existing_construction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Construction not found"
        )
    
    controller.delete_construction(construction_id)
    return None

from fastapi import APIRouter, Depends

from helpers.auth import get_user
from helpers.errors import handle_exception
from .controller import ConstructionController
from .service import ConstructionService

construction_router = APIRouter(
    prefix="/constructions",
    tags=["Contructions"],
)

construction_service = ConstructionService(...)
construction_controller = ConstructionController(construction_service)


@handle_exception
@construction_router.get("/{construction_id}")
def get_construction(construction_id: int, user=Depends(get_user)):
    # Logic to retrieve a construction by ID
    return {"construction_id": construction_id, "detail": "Construction details here"}


@handle_exception
@construction_router.post("/")
def create_construction(construction_data: dict, user=Depends(get_user)):
    # Logic to create a new construction
    return {"construction_id": 1, "detail": "New construction created"}

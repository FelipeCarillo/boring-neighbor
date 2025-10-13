from typing import Optional, List, Dict, Any
from entities.construction import Construction, ConstructionCreate, ConstructionUpdate


class ConstructionController:
    def __init__(self, service):
        self.service = service

    def create_construction(self, construction_data: ConstructionCreate) -> Construction:
        """Create a new construction."""
        return self.service.create_construction(construction_data)

    def get_construction(self, construction_id: str) -> Optional[Construction]:
        """Get a construction by ID."""
        return self.service.get_construction(construction_id)

    def update_construction(self, construction_id: str, update_data: ConstructionUpdate) -> Construction:
        """Update an existing construction."""
        return self.service.update_construction(construction_id, update_data)

    def delete_construction(self, construction_id: str) -> None:
        """Delete a construction."""
        return self.service.delete_construction(construction_id)

    def list_constructions(self, filters: Optional[Dict[str, Any]] = None) -> List[Construction]:
        """List constructions with optional filters."""
        return self.service.list_constructions(filters)

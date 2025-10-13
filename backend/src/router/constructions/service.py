from typing import Optional, List, Dict, Any
from uuid import uuid4
from datetime import datetime, timezone

from entities.construction import Construction, ConstructionCreate, ConstructionUpdate


class ConstructionService:
    def __init__(self, construction_repository):
        self.construction_repository = construction_repository

    def create_construction(self, construction_data: ConstructionCreate) -> Construction:
        """Business logic for creating a construction."""
        # Convert ConstructionCreate to Construction entity
        construction = Construction(
            id=str(uuid4()),
            name=construction_data.name,
            description=construction_data.description,
            location=construction_data.location,
            start_date=construction_data.start_date,
            end_date=construction_data.end_date,
            status=construction_data.status,
            current_phase=construction_data.current_phase,
            progress_percentage=construction_data.progress_percentage,
            assigned_supervisor_id=construction_data.assigned_supervisor_id,
            s3_folder_key=construction_data.s3_folder_key,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        
        return self.construction_repository.create_construction(construction)

    def get_construction(self, construction_id: str) -> Optional[Construction]:
        """Business logic for retrieving a construction."""
        return self.construction_repository.get_construction_by_id(construction_id)

    def update_construction(self, construction_id: str, update_data: ConstructionUpdate) -> Construction:
        """Business logic for updating a construction."""
        # Get existing construction
        existing_construction = self.construction_repository.get_construction_by_id(construction_id)
        if not existing_construction:
            return None
        
        # Update only provided fields
        update_dict = update_data.model_dump(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(existing_construction, field, value)
        
        existing_construction.updated_at = datetime.now(timezone.utc)
        
        return self.construction_repository.update_construction(existing_construction)

    def delete_construction(self, construction_id: str) -> None:
        """Business logic for deleting a construction."""
        return self.construction_repository.delete_construction(construction_id)

    def list_constructions(self, filters: Optional[Dict[str, Any]] = None) -> List[Construction]:
        """Business logic for listing constructions with optional filters."""
        if not filters:
            return self.construction_repository.list_constructions()
        
        constructions = []
        
        # Apply filters
        if 'status' in filters:
            constructions.extend(self.construction_repository.get_constructions_by_status(filters['status']))
        elif 'supervisor_id' in filters:
            constructions.extend(self.construction_repository.get_constructions_by_supervisor(filters['supervisor_id']))
        elif 'search' in filters:
            constructions.extend(self.construction_repository.search_constructions_by_name(filters['search']))
        else:
            constructions = self.construction_repository.list_constructions()
        
        # Remove duplicates if multiple filters are applied
        seen_ids = set()
        unique_constructions = []
        for construction in constructions:
            if construction.id not in seen_ids:
                seen_ids.add(construction.id)
                unique_constructions.append(construction)
        
        return unique_constructions

from typing import Optional, List
from datetime import datetime, timezone
from uuid import uuid4

from repositories.models.construction import Construction
from .construction_repo_interface import IConstructionRepo


class ConstructionRepoMock(IConstructionRepo):

    def __init__(self):
        self.constructions = [
            Construction(
                id=str(uuid4()),
                name="São Paulo-Morumbi Station",
                description="Construction of São Paulo-Morumbi station for Line 4-Yellow",
                location="Av. Morumbi, 1000 - São Paulo, SP",
                start_date=datetime(2024, 1, 15, tzinfo=timezone.utc),
                end_date=datetime(2025, 6, 30, tzinfo=timezone.utc),
                status="in_progress",
                current_phase="structure",
                progress_percentage=65.0,
                assigned_supervisor_id="supervisor-1",
                s3_folder_key="constructions/sp-morumbi-station",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
                is_deleted=False
            ),
            Construction(
                id=str(uuid4()),
                name="Paulista Avenue Tunnel",
                description="Tunnel drilling under Paulista Avenue",
                location="Av. Paulista, 500 - São Paulo, SP",
                start_date=datetime(2024, 2, 1, tzinfo=timezone.utc),
                end_date=datetime(2025, 12, 31, tzinfo=timezone.utc),
                status="in_progress",
                current_phase="foundation",
                progress_percentage=45.0,
                assigned_supervisor_id="supervisor-2",
                s3_folder_key="constructions/paulista-tunnel",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
                is_deleted=False
            ),
            Construction(
                id=str(uuid4()),
                name="Faria Lima Station",
                description="Renovation and expansion of Faria Lima station",
                location="Av. Brigadeiro Faria Lima, 2000 - São Paulo, SP",
                start_date=datetime(2023, 8, 10, tzinfo=timezone.utc),
                end_date=datetime(2024, 3, 15, tzinfo=timezone.utc),
                status="completed",
                current_phase="completed",
                progress_percentage=100.0,
                assigned_supervisor_id="supervisor-1",
                s3_folder_key="constructions/faria-lima-station",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
                is_deleted=False
            ),
        ]

    def get_construction_by_id(self, id: str) -> Optional[Construction]:
        return next((construction for construction in self.constructions if construction.id == id), None)

    def create_construction(self, construction: Construction) -> Construction:
        self.constructions.append(construction)
        return construction

    def update_construction(self, construction: Construction) -> Construction:
        self.constructions = [c for c in self.constructions if c.id != construction.id]
        self.constructions.append(construction)
        return construction

    def delete_construction(self, id: str) -> None:
        self.constructions = [c for c in self.constructions if c.id != id]

    def list_constructions(self) -> List[Construction]:
        return self.constructions

    def get_constructions_by_supervisor(self, supervisor_id: str) -> List[Construction]:
        return [c for c in self.constructions if c.assigned_supervisor_id == supervisor_id]

    def get_constructions_by_status(self, status: str) -> List[Construction]:
        return [c for c in self.constructions if c.status == status]

    def get_constructions_by_phase(self, phase: str) -> List[Construction]:
        return [c for c in self.constructions if c.current_phase == phase]

    def search_constructions_by_name(self, name: str) -> List[Construction]:
        return [c for c in self.constructions if name.lower() in c.name.lower()]

    def get_constructions_by_date_range(self, start_date: datetime, end_date: datetime) -> List[Construction]:
        return [c for c in self.constructions if c.start_date and c.end_date and start_date <= c.start_date <= end_date]

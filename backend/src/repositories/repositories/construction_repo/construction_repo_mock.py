from typing import Optional, List
from datetime import datetime

from repositories.models.construction import Construction
from .construction_repo_interface import IConstructionRepo


class ConstructionRepoMock(IConstructionRepo):

    def __init__(self):
        self.constructions = [
            Construction(
                id="1",
                name="Projeto Residencial Alpha",
                description="Construção de casa residencial de 2 andares",
                location="São Paulo, SP",
                status="in_progress",
                current_phase="structure",
                progress_percentage=45.0,
                assigned_supervisor_id="1",
            ),
            Construction(
                id="2",
                name="Edifício Comercial Beta",
                description="Construção de edifício comercial de 10 andares",
                location="Rio de Janeiro, RJ",
                status="planned",
                current_phase="foundation",
                progress_percentage=0.0,
                assigned_supervisor_id="1",
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

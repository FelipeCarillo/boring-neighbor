from typing import Optional, List

from repositories.models.construction import ConstructionPhase
from .construction_phase_repo_interface import IConstructionPhaseRepo


class ConstructionPhaseRepoMock(IConstructionPhaseRepo):

    def __init__(self):
        self.phases = [
            ConstructionPhase(
                id="1",
                name="foundation",
                description="Fundação e estrutura básica",
                order=1,
                estimated_duration_days=15,
                is_active=True,
            ),
            ConstructionPhase(
                id="2",
                name="structure",
                description="Estrutura principal e paredes",
                order=2,
                estimated_duration_days=30,
                is_active=True,
            ),
            ConstructionPhase(
                id="3",
                name="finishing",
                description="Acabamentos e instalações",
                order=3,
                estimated_duration_days=20,
                is_active=True,
            ),
        ]

    def get_phase_by_id(self, id: str) -> Optional[ConstructionPhase]:
        return next((phase for phase in self.phases if phase.id == id), None)

    def get_phase_by_name(self, name: str) -> Optional[ConstructionPhase]:
        return next((phase for phase in self.phases if phase.name == name), None)

    def create_phase(self, phase: ConstructionPhase) -> ConstructionPhase:
        self.phases.append(phase)
        return phase

    def update_phase(self, phase: ConstructionPhase) -> ConstructionPhase:
        self.phases = [p for p in self.phases if p.id != phase.id]
        self.phases.append(phase)
        return phase

    def delete_phase(self, id: str) -> None:
        self.phases = [p for p in self.phases if p.id != id]

    def list_phases(self) -> List[ConstructionPhase]:
        return self.phases

    def list_active_phases(self) -> List[ConstructionPhase]:
        return [p for p in self.phases if p.is_active]

    def get_phases_by_order(self) -> List[ConstructionPhase]:
        return sorted([p for p in self.phases if p.is_active], key=lambda x: x.order)

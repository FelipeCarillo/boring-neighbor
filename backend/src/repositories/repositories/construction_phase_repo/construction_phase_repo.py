from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import asc

from repositories.models.construction import ConstructionPhase
from .construction_phase_repo_interface import IConstructionPhaseRepo


class ConstructionPhaseRepo(IConstructionPhaseRepo):

    def __init__(self, session: Session):
        self.session = session

    def get_phase_by_id(self, id: str) -> Optional[ConstructionPhase]:
        return self.session.query(ConstructionPhase).filter(ConstructionPhase.id == id).first()

    def get_phase_by_name(self, name: str) -> Optional[ConstructionPhase]:
        return self.session.query(ConstructionPhase).filter(ConstructionPhase.name == name).first()

    def create_phase(self, phase: ConstructionPhase) -> ConstructionPhase:
        self.session.add(phase)
        self.session.commit()
        return phase

    def update_phase(self, phase: ConstructionPhase) -> ConstructionPhase:
        self.session.commit()
        return phase

    def delete_phase(self, id: str) -> None:
        phase = self.get_phase_by_id(id)
        if phase:
            self.session.delete(phase)
            self.session.commit()

    def list_phases(self) -> List[ConstructionPhase]:
        return self.session.query(ConstructionPhase).all()

    def list_active_phases(self) -> List[ConstructionPhase]:
        return self.session.query(ConstructionPhase).filter(ConstructionPhase.is_active == True).all()

    def get_phases_by_order(self) -> List[ConstructionPhase]:
        return self.session.query(ConstructionPhase).filter(
            ConstructionPhase.is_active == True
        ).order_by(asc(ConstructionPhase.order)).all()

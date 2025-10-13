from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import asc

from entities.construction import ConstructionPhase
from repositories.models.construction import ConstructionPhase as ConstructionPhaseModel
from repositories.repositories.construction_phase_repo.construction_phase_repo_interface import IConstructionPhaseRepo


class ConstructionPhaseRepo(IConstructionPhaseRepo):

    def __init__(self, session: Session):
        self.session = session

    def _to_entity(self, db_model: ConstructionPhaseModel) -> ConstructionPhase:
        return ConstructionPhase(
            id=str(db_model.id),
            name=db_model.name,
            description=db_model.description,
            order=db_model.order,
            estimated_duration_days=db_model.estimated_duration_days,
            is_active=db_model.is_active,
            created_at=db_model.created_at,
            updated_at=db_model.updated_at
        )

    def _to_model(self, entity: ConstructionPhase) -> ConstructionPhaseModel:
        return ConstructionPhaseModel(
            id=entity.id,
            name=entity.name,
            description=entity.description,
            order=entity.order,
            estimated_duration_days=entity.estimated_duration_days,
            is_active=entity.is_active
        )

    def get_phase_by_id(self, id: str) -> Optional[ConstructionPhase]:
        db_model = self.session.query(ConstructionPhaseModel).filter(ConstructionPhaseModel.id == id).first()
        return self._to_entity(db_model) if db_model else None

    def get_phase_by_name(self, name: str) -> Optional[ConstructionPhase]:
        db_model = self.session.query(ConstructionPhaseModel).filter(ConstructionPhaseModel.name == name).first()
        return self._to_entity(db_model) if db_model else None

    def create_phase(self, phase: ConstructionPhase) -> ConstructionPhase:
        db_model = self._to_model(phase)
        self.session.add(db_model)
        self.session.commit()
        return self._to_entity(db_model)

    def update_phase(self, phase: ConstructionPhase) -> ConstructionPhase:
        db_model = self.session.query(ConstructionPhaseModel).filter(ConstructionPhaseModel.id == phase.id).first()
        if db_model:
            db_model.name = phase.name
            db_model.description = phase.description
            db_model.order = phase.order
            db_model.estimated_duration_days = phase.estimated_duration_days
            db_model.is_active = phase.is_active
            self.session.commit()
            return self._to_entity(db_model)
        return phase

    def delete_phase(self, id: str) -> None:
        db_model = self.session.query(ConstructionPhaseModel).filter(ConstructionPhaseModel.id == id).first()
        if db_model:
            self.session.delete(db_model)
            self.session.commit()

    def list_phases(self) -> List[ConstructionPhase]:
        db_models = self.session.query(ConstructionPhaseModel).all()
        return [self._to_entity(model) for model in db_models]

    def list_active_phases(self) -> List[ConstructionPhase]:
        db_models = self.session.query(ConstructionPhaseModel).filter(ConstructionPhaseModel.is_active == True).all()
        return [self._to_entity(model) for model in db_models]

    def get_phases_by_order(self) -> List[ConstructionPhase]:
        db_models = self.session.query(ConstructionPhaseModel).filter(
            ConstructionPhaseModel.is_active == True
        ).order_by(asc(ConstructionPhaseModel.order)).all()
        return [self._to_entity(model) for model in db_models]

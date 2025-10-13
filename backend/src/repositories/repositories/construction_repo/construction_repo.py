from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session

from entities.construction import Construction
from repositories.models.construction import Construction as ConstructionModel
from repositories.repositories.construction_repo.construction_repo_interface import IConstructionRepo


class ConstructionRepo(IConstructionRepo):

    def __init__(self, session: Session):
        self.session = session

    def _to_entity(self, db_model: ConstructionModel) -> Construction:
        return Construction(
            id=str(db_model.id),
            name=db_model.name,
            description=db_model.description,
            location=db_model.location,
            start_date=db_model.start_date,
            end_date=db_model.end_date,
            status=db_model.status,
            current_phase=db_model.current_phase,
            progress_percentage=db_model.progress_percentage,
            assigned_supervisor_id=db_model.assigned_supervisor_id,
            s3_folder_key=db_model.s3_folder_key,
            created_at=db_model.created_at,
            updated_at=db_model.updated_at
        )

    def _to_model(self, entity: Construction) -> ConstructionModel:
        return ConstructionModel(
            id=entity.id,
            name=entity.name,
            description=entity.description,
            location=entity.location,
            start_date=entity.start_date,
            end_date=entity.end_date,
            status=entity.status,
            current_phase=entity.current_phase,
            progress_percentage=entity.progress_percentage,
            assigned_supervisor_id=entity.assigned_supervisor_id,
            s3_folder_key=entity.s3_folder_key
        )

    def get_construction_by_id(self, id: str) -> Optional[Construction]:
        db_model = self.session.query(ConstructionModel).filter(ConstructionModel.id == id).first()
        return self._to_entity(db_model) if db_model else None

    def create_construction(self, construction: Construction) -> Construction:
        db_model = self._to_model(construction)
        self.session.add(db_model)
        self.session.commit()
        return self._to_entity(db_model)

    def update_construction(self, construction: Construction) -> Construction:
        db_model = self.session.query(ConstructionModel).filter(ConstructionModel.id == construction.id).first()
        if db_model:
            db_model.name = construction.name
            db_model.description = construction.description
            db_model.location = construction.location
            db_model.start_date = construction.start_date
            db_model.end_date = construction.end_date
            db_model.status = construction.status
            db_model.current_phase = construction.current_phase
            db_model.progress_percentage = construction.progress_percentage
            db_model.assigned_supervisor_id = construction.assigned_supervisor_id
            db_model.s3_folder_key = construction.s3_folder_key
            self.session.commit()
            return self._to_entity(db_model)
        return construction

    def delete_construction(self, id: str) -> None:
        db_model = self.session.query(ConstructionModel).filter(ConstructionModel.id == id).first()
        if db_model:
            self.session.delete(db_model)
            self.session.commit()

    def list_constructions(self) -> List[Construction]:
        db_models = self.session.query(ConstructionModel).all()
        return [self._to_entity(model) for model in db_models]

    def get_constructions_by_supervisor(self, supervisor_id: str) -> List[Construction]:
        db_models = self.session.query(ConstructionModel).filter(ConstructionModel.assigned_supervisor_id == supervisor_id).all()
        return [self._to_entity(model) for model in db_models]

    def get_constructions_by_status(self, status: str) -> List[Construction]:
        db_models = self.session.query(ConstructionModel).filter(ConstructionModel.status == status).all()
        return [self._to_entity(model) for model in db_models]

    def get_constructions_by_phase(self, phase: str) -> List[Construction]:
        db_models = self.session.query(ConstructionModel).filter(ConstructionModel.current_phase == phase).all()
        return [self._to_entity(model) for model in db_models]

    def search_constructions_by_name(self, name: str) -> List[Construction]:
        db_models = self.session.query(ConstructionModel).filter(ConstructionModel.name.ilike(f"%{name}%")).all()
        return [self._to_entity(model) for model in db_models]

    def get_constructions_by_date_range(self, start_date: datetime, end_date: datetime) -> List[Construction]:
        db_models = self.session.query(ConstructionModel).filter(
            ConstructionModel.start_date >= start_date,
            ConstructionModel.end_date <= end_date
        ).all()
        return [self._to_entity(model) for model in db_models]

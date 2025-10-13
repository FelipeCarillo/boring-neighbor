from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import desc

from entities.construction import ConstructionProgress
from repositories.models.construction import ConstructionProgress as ConstructionProgressModel
from repositories.repositories.construction_progress_repo.construction_progress_repo_interface import IConstructionProgressRepo


class ConstructionProgressRepo(IConstructionProgressRepo):

    def __init__(self, session: Session):
        self.session = session

    def _to_entity(self, db_model: ConstructionProgressModel) -> ConstructionProgress:
        return ConstructionProgress(
            id=str(db_model.id),
            construction_id=str(db_model.construction_id),
            recorded_by=str(db_model.recorded_by),
            progress_percentage=db_model.progress_percentage,
            phase=db_model.phase,
            workers_count=db_model.workers_count,
            hours_worked=db_model.hours_worked,
            progress_photos_count=db_model.progress_photos_count,
            s3_photos_key=db_model.s3_photos_key,
            notes=db_model.notes,
            issues_identified=db_model.issues_identified,
            weather_conditions=db_model.weather_conditions,
            created_at=db_model.created_at,
            updated_at=db_model.updated_at
        )

    def _to_model(self, entity: ConstructionProgress) -> ConstructionProgressModel:
        return ConstructionProgressModel(
            id=entity.id,
            construction_id=entity.construction_id,
            recorded_by=entity.recorded_by,
            progress_percentage=entity.progress_percentage,
            phase=entity.phase,
            workers_count=entity.workers_count,
            hours_worked=entity.hours_worked,
            progress_photos_count=entity.progress_photos_count,
            s3_photos_key=entity.s3_photos_key,
            notes=entity.notes,
            issues_identified=entity.issues_identified,
            weather_conditions=entity.weather_conditions
        )

    def get_progress_by_id(self, id: str) -> Optional[ConstructionProgress]:
        db_model = self.session.query(ConstructionProgressModel).filter(ConstructionProgressModel.id == id).first()
        return self._to_entity(db_model) if db_model else None

    def create_progress(self, progress: ConstructionProgress) -> ConstructionProgress:
        db_model = self._to_model(progress)
        self.session.add(db_model)
        self.session.commit()
        return self._to_entity(db_model)

    def update_progress(self, progress: ConstructionProgress) -> ConstructionProgress:
        db_model = self.session.query(ConstructionProgressModel).filter(ConstructionProgressModel.id == progress.id).first()
        if db_model:
            db_model.progress_percentage = progress.progress_percentage
            db_model.phase = progress.phase
            db_model.workers_count = progress.workers_count
            db_model.hours_worked = progress.hours_worked
            db_model.progress_photos_count = progress.progress_photos_count
            db_model.s3_photos_key = progress.s3_photos_key
            db_model.notes = progress.notes
            db_model.issues_identified = progress.issues_identified
            db_model.weather_conditions = progress.weather_conditions
            self.session.commit()
            return self._to_entity(db_model)
        return progress

    def delete_progress(self, id: str) -> None:
        db_model = self.session.query(ConstructionProgressModel).filter(ConstructionProgressModel.id == id).first()
        if db_model:
            self.session.delete(db_model)
            self.session.commit()

    def list_progress_by_construction(self, construction_id: str) -> List[ConstructionProgress]:
        db_models = self.session.query(ConstructionProgressModel).filter(
            ConstructionProgressModel.construction_id == construction_id
        ).order_by(desc(ConstructionProgressModel.created_at)).all()
        return [self._to_entity(model) for model in db_models]

    def list_progress_by_recorder(self, recorder_id: str) -> List[ConstructionProgress]:
        db_models = self.session.query(ConstructionProgressModel).filter(
            ConstructionProgressModel.recorded_by == recorder_id
        ).order_by(desc(ConstructionProgressModel.created_at)).all()
        return [self._to_entity(model) for model in db_models]

    def list_progress_by_phase(self, phase: str) -> List[ConstructionProgress]:
        db_models = self.session.query(ConstructionProgressModel).filter(
            ConstructionProgressModel.phase == phase
        ).order_by(desc(ConstructionProgressModel.created_at)).all()
        return [self._to_entity(model) for model in db_models]

    def get_progress_by_date_range(self, start_date: datetime, end_date: datetime) -> List[ConstructionProgress]:
        db_models = self.session.query(ConstructionProgressModel).filter(
            ConstructionProgressModel.created_at >= start_date,
            ConstructionProgressModel.created_at <= end_date
        ).order_by(desc(ConstructionProgressModel.created_at)).all()
        return [self._to_entity(model) for model in db_models]

    def get_latest_progress_by_construction(self, construction_id: str) -> Optional[ConstructionProgress]:
        db_model = self.session.query(ConstructionProgressModel).filter(
            ConstructionProgressModel.construction_id == construction_id
        ).order_by(desc(ConstructionProgressModel.created_at)).first()
        return self._to_entity(db_model) if db_model else None

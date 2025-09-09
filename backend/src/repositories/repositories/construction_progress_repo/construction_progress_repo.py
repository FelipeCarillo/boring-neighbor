from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import desc

from repositories.models.construction import ConstructionProgress
from .construction_progress_repo_interface import IConstructionProgressRepo


class ConstructionProgressRepo(IConstructionProgressRepo):

    def __init__(self, session: Session):
        self.session = session

    def get_progress_by_id(self, id: str) -> Optional[ConstructionProgress]:
        return self.session.query(ConstructionProgress).filter(ConstructionProgress.id == id).first()

    def create_progress(self, progress: ConstructionProgress) -> ConstructionProgress:
        self.session.add(progress)
        self.session.commit()
        return progress

    def update_progress(self, progress: ConstructionProgress) -> ConstructionProgress:
        self.session.commit()
        return progress

    def delete_progress(self, id: str) -> None:
        progress = self.get_progress_by_id(id)
        if progress:
            self.session.delete(progress)
            self.session.commit()

    def list_progress_by_construction(self, construction_id: str) -> List[ConstructionProgress]:
        return self.session.query(ConstructionProgress).filter(
            ConstructionProgress.construction_id == construction_id
        ).order_by(desc(ConstructionProgress.created_at)).all()

    def list_progress_by_recorder(self, recorder_id: str) -> List[ConstructionProgress]:
        return self.session.query(ConstructionProgress).filter(
            ConstructionProgress.recorded_by == recorder_id
        ).order_by(desc(ConstructionProgress.created_at)).all()

    def list_progress_by_phase(self, phase: str) -> List[ConstructionProgress]:
        return self.session.query(ConstructionProgress).filter(
            ConstructionProgress.phase == phase
        ).order_by(desc(ConstructionProgress.created_at)).all()

    def get_progress_by_date_range(self, start_date: datetime, end_date: datetime) -> List[ConstructionProgress]:
        return self.session.query(ConstructionProgress).filter(
            ConstructionProgress.created_at >= start_date,
            ConstructionProgress.created_at <= end_date
        ).order_by(desc(ConstructionProgress.created_at)).all()

    def get_latest_progress_by_construction(self, construction_id: str) -> Optional[ConstructionProgress]:
        return self.session.query(ConstructionProgress).filter(
            ConstructionProgress.construction_id == construction_id
        ).order_by(desc(ConstructionProgress.created_at)).first()

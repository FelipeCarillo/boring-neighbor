from typing import Optional, List
from datetime import datetime

from repositories.models.construction import ConstructionProgress
from .construction_progress_repo_interface import IConstructionProgressRepo


class ConstructionProgressRepoMock(IConstructionProgressRepo):

    def __init__(self):
        self.progress_records = [
            ConstructionProgress(
                id="1",
                construction_id="1",
                recorded_by="1",
                progress_percentage=45.0,
                phase="structure",
                workers_count=8,
                hours_worked=8.0,
                progress_photos_count=5,
                notes="Estrutura principal concluída",
                weather_conditions="sunny",
            ),
            ConstructionProgress(
                id="2",
                construction_id="1",
                recorded_by="1",
                progress_percentage=50.0,
                phase="structure",
                workers_count=10,
                hours_worked=8.5,
                progress_photos_count=7,
                notes="Paredes externas finalizadas",
                weather_conditions="cloudy",
            ),
        ]

    def get_progress_by_id(self, id: str) -> Optional[ConstructionProgress]:
        return next((progress for progress in self.progress_records if progress.id == id), None)

    def create_progress(self, progress: ConstructionProgress) -> ConstructionProgress:
        self.progress_records.append(progress)
        return progress

    def update_progress(self, progress: ConstructionProgress) -> ConstructionProgress:
        self.progress_records = [p for p in self.progress_records if p.id != progress.id]
        self.progress_records.append(progress)
        return progress

    def delete_progress(self, id: str) -> None:
        self.progress_records = [p for p in self.progress_records if p.id != id]

    def list_progress_by_construction(self, construction_id: str) -> List[ConstructionProgress]:
        return [p for p in self.progress_records if p.construction_id == construction_id]

    def list_progress_by_recorder(self, recorder_id: str) -> List[ConstructionProgress]:
        return [p for p in self.progress_records if p.recorded_by == recorder_id]

    def list_progress_by_phase(self, phase: str) -> List[ConstructionProgress]:
        return [p for p in self.progress_records if p.phase == phase]

    def get_progress_by_date_range(self, start_date: datetime, end_date: datetime) -> List[ConstructionProgress]:
        return [p for p in self.progress_records if start_date <= p.created_at <= end_date]

    def get_latest_progress_by_construction(self, construction_id: str) -> Optional[ConstructionProgress]:
        construction_progress = [p for p in self.progress_records if p.construction_id == construction_id]
        return construction_progress[-1] if construction_progress else None

from datetime import datetime
from pydantic import Field
from typing import Optional

from src.entities.base import BaseEntity, BaseResponse


class ReportGenerate(BaseEntity):
    """
    Request model for generating a report.
    """
    
    include_images: bool = Field(default=False, description="Include images in AI analysis (uses GPT-4 Vision)")


class ReportResponse(BaseResponse):
    """
    Response model for deviation report.
    """
    
    construction_id: str
    progress_id: Optional[str]
    deviation_score: Optional[float]
    ai_analysis: Optional[str]


class ReportDetail(ReportResponse):
    """
    Detailed report response with aggregated data.
    """
    
    total_progress_entries: int
    average_deviation_score: Optional[float]
    phases_summary: dict



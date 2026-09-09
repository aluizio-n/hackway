import uuid
from typing import Literal

from pydantic import BaseModel


class ReportRequest(BaseModel):
    target_id: uuid.UUID
    report_type: Literal["tech", "exec"]


class ReportOut(BaseModel):
    title: str
    content: str

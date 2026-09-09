import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.core.constants import PHASE_COUNT


class NoteUpsert(BaseModel):
    phase_index: int = Field(ge=0, lt=PHASE_COUNT)
    content: str = Field(default="", max_length=20000)


class NoteRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    target_id: uuid.UUID
    phase_index: int
    content: str
    updated_at: datetime

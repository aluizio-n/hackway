import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.core.constants import PHASE_COUNT, TARGET_TYPE_KEYS
from app.modules.targets.models import TargetStatus


class TargetCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    type: str
    address: str = Field(min_length=1, max_length=2048)
    description: str | None = Field(default=None, max_length=8192)
    scope_phases: list[bool] = Field(min_length=PHASE_COUNT, max_length=PHASE_COUNT)

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        if v not in TARGET_TYPE_KEYS:
            raise ValueError(f"Tipo de alvo inválido: {v}")
        return v

    @field_validator("scope_phases")
    @classmethod
    def validate_scope(cls, v: list[bool]) -> list[bool]:
        if not any(v):
            raise ValueError("Selecione ao menos uma fase no escopo")
        return v


class TargetUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    address: str | None = Field(default=None, min_length=1, max_length=2048)
    description: str | None = Field(default=None, max_length=8192)


class PhaseStatusUpdate(BaseModel):
    phase_index: int = Field(ge=0, lt=PHASE_COUNT)
    status: int = Field(ge=0, le=2)


class TargetRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    type: str
    address: str
    description: str | None
    status: TargetStatus
    scope_phases: list[bool]
    phase_status: list[int]
    progress_pct: int
    created_at: datetime
    updated_at: datetime

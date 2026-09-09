from pydantic import BaseModel


class ToolCommand(BaseModel):
    label: str
    command: str
    desc: str | None = None


class ToolGroup(BaseModel):
    name: str
    tag: str | None = None
    commands: list[ToolCommand]


class TargetTypeOut(BaseModel):
    key: str
    label: str
    placeholder: str


class PhaseOut(BaseModel):
    num: str
    name: str
    desc: str


class MetaOut(BaseModel):
    target_types: list[TargetTypeOut]
    phases: list[PhaseOut]
    specialties: list[str]

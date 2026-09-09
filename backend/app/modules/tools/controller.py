from fastapi import HTTPException, status

from app.core.constants import PHASE_COUNT, TARGET_TYPE_KEYS
from app.modules.tools.repository import ToolsRepository


class ToolsController:
    def __init__(self) -> None:
        self.repo = ToolsRepository()

    def get_meta(self) -> dict:
        return {
            "target_types": self.repo.get_target_types(),
            "phases": self.repo.get_phases(),
            "specialties": self.repo.get_specialties(),
        }

    def get_tool_groups(self, target_type: str, phase_index: int) -> list[dict]:
        if target_type not in TARGET_TYPE_KEYS:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tipo de alvo inválido")
        if not 0 <= phase_index < PHASE_COUNT:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fase inválida")
        return self.repo.get_tool_groups(target_type, phase_index)

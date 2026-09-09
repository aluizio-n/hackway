from app.core.constants import PTES_PHASES, SPECIALTIES, TARGET_TYPES
from app.modules.tools.data import get_tool_count, get_tools


class ToolsRepository:
    """Fonte dos dados de referencia (estatico, em memoria)."""

    def get_target_types(self) -> list[dict]:
        return TARGET_TYPES

    def get_phases(self) -> list[dict]:
        return PTES_PHASES

    def get_specialties(self) -> list[str]:
        return SPECIALTIES

    def get_tool_groups(self, target_type: str, phase_index: int) -> list[dict]:
        return get_tools(target_type, phase_index)

    def get_tool_count(self, target_type: str, phase_index: int) -> int:
        return get_tool_count(target_type, phase_index)

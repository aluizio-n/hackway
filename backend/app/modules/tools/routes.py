from fastapi import APIRouter, Depends

from app.core.deps import get_current_user
from app.modules.tools.controller import ToolsController
from app.modules.tools.schemas import MetaOut, ToolGroup
from app.modules.users.models import User

router = APIRouter(prefix="/tools", tags=["tools"])


@router.get("/meta", response_model=MetaOut)
async def get_meta() -> dict:
    # Publico: usado tambem na tela de cadastro (especialidades) antes do login.
    return ToolsController().get_meta()


@router.get("/{target_type}/{phase_index}", response_model=list[ToolGroup])
async def get_tool_groups(
    target_type: str, phase_index: int, current_user: User = Depends(get_current_user)
) -> list[dict]:
    return ToolsController().get_tool_groups(target_type, phase_index)

from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.database import get_db
from app.core.deps import get_current_user
from app.modules.auth.controller import AuthController
from app.modules.auth.schemas import LoginRequest
from app.modules.users.controller import UserController
from app.modules.users.models import User
from app.modules.users.schemas import UserCreate, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()

_COOKIE_KWARGS = dict(
    httponly=True,
    secure=settings.environment == "production",
    samesite="lax",
    path="/",
)


def _set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.auth_cookie_name,
        value=token,
        max_age=settings.access_token_expire_minutes * 60,
        **_COOKIE_KWARGS,
    )


@router.post("/register", response_model=UserRead, status_code=201)
async def register(payload: UserCreate, response: Response, db: AsyncSession = Depends(get_db)) -> User:
    user = await UserController(db).register(payload)
    auth_controller = AuthController(db)
    _, token = await auth_controller.authenticate(payload.email, payload.password)
    _set_auth_cookie(response, token)
    return user


@router.post("/login", response_model=UserRead)
async def login(payload: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)) -> User:
    user, token = await AuthController(db).authenticate(payload.email, payload.password)
    _set_auth_cookie(response, token)
    return user


@router.post("/logout", status_code=204)
async def logout(response: Response) -> None:
    response.delete_cookie(key=settings.auth_cookie_name, path="/")


@router.get("/me", response_model=UserRead)
async def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user

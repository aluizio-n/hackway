from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.modules.users.models import User
from app.modules.users.repository import UserRepository
from app.modules.users.schemas import UserCreate


class UserController:
    def __init__(self, db: AsyncSession) -> None:
        self.repo = UserRepository(db)

    async def register(self, payload: UserCreate) -> User:
        existing = await self.repo.get_by_email(payload.email)
        if existing is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="E-mail já cadastrado")

        return await self.repo.create(
            name=payload.name,
            email=payload.email,
            password_hash=hash_password(payload.password),
            specialties=payload.specialties,
        )

    async def get_me(self, user: User) -> User:
        return user

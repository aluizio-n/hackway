import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.targets.models import Target


class TargetRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_for_owner(self, owner_id: uuid.UUID) -> list[Target]:
        result = await self.db.execute(
            select(Target).where(Target.owner_id == owner_id).order_by(Target.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_for_owner(self, target_id: uuid.UUID, owner_id: uuid.UUID) -> Target | None:
        result = await self.db.execute(
            select(Target).where(Target.id == target_id, Target.owner_id == owner_id)
        )
        return result.scalar_one_or_none()

    async def create(self, target: Target) -> Target:
        self.db.add(target)
        await self.db.commit()
        await self.db.refresh(target)
        return target

    async def save(self, target: Target) -> Target:
        await self.db.commit()
        await self.db.refresh(target)
        return target

    async def delete(self, target: Target) -> None:
        await self.db.delete(target)
        await self.db.commit()

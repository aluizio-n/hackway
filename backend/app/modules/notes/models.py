import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.core.security import EncryptedString


class Note(Base):
    __tablename__ = "notes"
    __table_args__ = (UniqueConstraint("target_id", "phase_index", name="uq_note_target_phase"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    target_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("targets.id", ondelete="CASCADE"), nullable=False, index=True
    )
    phase_index: Mapped[int] = mapped_column(Integer, nullable=False)

    # Anotacoes do pentester (descobertas, outputs) - criptografadas em repouso.
    content: Mapped[str] = mapped_column(EncryptedString(), nullable=False, default="")

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    target: Mapped["Target"] = relationship(back_populates="notes")

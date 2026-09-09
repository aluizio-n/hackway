"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-09-07

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

TARGET_TYPE_KEYS = (
    "host",
    "domain",
    "company",
    "person",
    "network",
    "mobile",
    "api",
    "cloud",
    "wifi",
)


def upgrade() -> None:
    target_type_enum = postgresql.ENUM(*TARGET_TYPE_KEYS, name="target_type")
    target_status_enum = postgresql.ENUM(
        "not_started", "in_progress", "completed", name="target_status"
    )
    target_type_enum.create(op.get_bind(), checkfirst=True)
    target_status_enum.create(op.get_bind(), checkfirst=True)

    # Tipo ja criado explicitamente acima - evita que create_table tente
    # recriar o mesmo ENUM (via evento before_create) e falhe com "already exists".
    target_type_enum.create_type = False
    target_status_enum.create_type = False

    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("specialties", postgresql.ARRAY(sa.String()), server_default="{}", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("email"),
    )
    op.create_index("ix_users_email", "users", ["email"])

    op.create_table(
        "targets",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "owner_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("type", target_type_enum, nullable=False),
        sa.Column("address", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("status", target_status_enum, nullable=False, server_default="not_started"),
        sa.Column("scope_phases", postgresql.ARRAY(sa.Boolean()), nullable=False),
        sa.Column("phase_status", postgresql.ARRAY(sa.Integer()), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_targets_owner_id", "targets", ["owner_id"])

    op.create_table(
        "notes",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "target_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("targets.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("phase_index", sa.Integer(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("target_id", "phase_index", name="uq_note_target_phase"),
    )
    op.create_index("ix_notes_target_id", "notes", ["target_id"])


def downgrade() -> None:
    op.drop_table("notes")
    op.drop_table("targets")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")

    postgresql.ENUM(name="target_status").drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM(name="target_type").drop(op.get_bind(), checkfirst=True)

"""Baseline empty migration to align Alembic with existing schema.

Revision ID: 0001_baseline
Revises: 
Create Date: 2025-08-08
"""
from typing import Sequence, Union

from alembic import op  # noqa
import sqlalchemy as sa  # noqa

# revision identifiers, used by Alembic.
revision: str = "0001_baseline"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Schema already exists (created via SQLAlchemy Base.metadata.create_all)
    pass

def downgrade() -> None:
    # No downgrade for baseline.
    pass

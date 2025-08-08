"""init

Revision ID: c323d8253139
Revises: 39bdbca5af10  
Create Date: 2025-08-08 11:08:13.448992
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'c323d8253139'
down_revision: Union[str, None] = '39bdbca5af10'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    pass

def downgrade() -> None:
    pass

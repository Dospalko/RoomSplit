#!/usr/bin/env bash
set -euo pipefail

# Initialize DB schema (idempotent)
python -m init_db || echo "DB init skipped (module issue)"

# Start API with auto-reload for dev when mounted volume present
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload

#!/usr/bin/env bash
python -m app.init_db
uvicorn app.main:app --host 0.0.0.0 --port 8000

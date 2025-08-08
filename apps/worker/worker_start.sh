#!/usr/bin/env bash
set -euo pipefail

# Celery expects a module path; our app instance lives in main.py as 'app'
exec celery -A main:app worker --loglevel=INFO --concurrency=2

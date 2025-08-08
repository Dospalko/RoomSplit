#!/usr/bin/env bash
celery -A worker.main:app worker --loglevel=INFO --concurrency=2

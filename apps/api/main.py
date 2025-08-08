from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="FairShare API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

# --- test celery ---
try:
    from celery import Celery
    celery_app = Celery(
        "fairshare",
        broker=os.getenv("CELERY_BROKER", "redis://cache:6379/0"),
        backend=os.getenv("CELERY_BACKEND", "redis://cache:6379/0"),
    )
except Exception:
    celery_app = None

@app.post("/tasks/ocr-test")
def ocr_test(upload_id: int = 123):
    if not celery_app:
        return {"queued": False, "reason": "celery not available"}
    r = celery_app.send_task("main.ocr_task", args=[upload_id])
    return {"queued": True, "task_id": r.id}

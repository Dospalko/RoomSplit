from celery import Celery

app = Celery("fairshare", broker="redis://cache:6379/0", backend="redis://cache:6379/0")

@app.task
def ocr_task(upload_id: int):
    # TODO: OCR pipeline
    return {"upload_id": upload_id, "status": "stub"}

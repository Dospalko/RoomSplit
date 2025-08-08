FROM python:3.11-slim
ENV PIP_NO_CACHE_DIR=1 PYTHONDONTWRITEBYTECODE=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt
COPY . .
# Ensure script is executable (especially on Windows hosts)
RUN chmod +x uvicorn_start.sh
EXPOSE 8000
CMD ["./uvicorn_start.sh"]

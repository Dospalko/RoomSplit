# RoomSplit

RoomSplit is a scalable full-stack web app for managing shared living expenses, splitting bills fairly, tracking payments, and providing cost-saving suggestions.

## Tech Stack

### Frontend
- **Framework:** Next.js (App Router) + TypeScript
- **UI:** shadcn/ui, Tailwind CSS
- **State & Data:** TanStack Query, react-hook-form, Zod validation
- **Auth:** NextAuth.js (JWT strategy)
- **File Uploads:** S3 pre-signed URLs (AWS S3 / MinIO for local)

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **ORM:** SQLAlchemy 2.0
- **Validation:** Pydantic v2
- **DB:** PostgreSQL
- **Cache/Queue:** Redis (for background jobs, reminders, OCR)
- **Storage:** S3-compatible (AWS S3 prod / MinIO dev)
- **OCR:** Tesseract OCR (baseline, swappable for AWS Textract/GCP Vision)
- **AI Suggestions:** OpenAI API (pluggable provider)

### Infrastructure
- **Local Dev:** Docker Compose (frontend, backend, db, redis, minio)
- **Deployment:** Railway / Render / Fly.io
- **Background Jobs:** Celery (Python) + Redis broker
- **Monitoring:** Sentry, Prometheus, Grafana

---

## Features

- Create rooms (e.g., "C211") with multiple members
- Upload bills (image/PDF) → OCR parsing → confirm/edit → save
- Manual expense entry
- Bill splitting modes: equal, percentage, meter, weight
- Track payments & overdue bills
- AI-based cost optimization suggestions
- Email & push reminders
- Role-based access control (Owner/Admin/Member)
- Secure file storage (S3)

---

## Dev Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Python 3.11+
- pnpm

### Clone & Start
```bash
git clone https://github.com/yourusername/RoomSplit.git
cd RoomSplit
pnpm install
docker compose up --build

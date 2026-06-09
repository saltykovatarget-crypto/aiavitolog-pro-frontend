# AI Avitolog PRO Monorepo

This repository contains the static front-end built with Vite and a starter FastAPI backend with an initial PostgreSQL schema managed by Alembic.

## Front-end (Vite + React)

### Development

```bash
npm install
npm run dev
```

The development server listens on [http://localhost:5173](http://localhost:5173).

### Production build

```bash
npm ci
npm run build
```

The production assets are written to `dist/` and can be previewed locally with `npm run preview`.

### Deployment notes for the APP server

1. Copy the contents of the `dist/` directory to a location that Nginx can serve (e.g. `/var/www/avitolog/dist`).
2. Point the root of the site to that folder and enable SPA history fallback. Example Nginx server block:

   ```nginx
   server {
       listen 80;
       server_name your-domain.example.com;

       root /var/www/avitolog/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /assets/ {
           add_header Cache-Control "public, max-age=31536000";
       }
   }
   ```

3. After deployment verify the navigation path: `Landing → Chat (Free) → Pricing → Registration/Login (modals) → Statistics → Settings → /billing/success → /billing/fail`.

## Backend (FastAPI)

### Environment variables

Copy `backend/.env.example` to `backend/.env` and adjust the values for your environment. The backend expects a PostgreSQL DSN in `DATABASE_URL` using the `psycopg` driver.

LLM-specific variables are read by the assistant and summarizer services:

- `OPENAI_API_KEY` — API ключ для доступа к OpenAI (обязателен).
- `OPENAI_BASE` — базовый URL API (опционально, по умолчанию `https://api.openai.com/v1`).
- `ASSISTANT_MODEL` — модель для основного ассистента (по умолчанию `gpt-5`).
- `SUMMARY_MODEL` — модель для генерации саммари (по умолчанию `gpt-5-mini`).

### Install dependencies

It is recommended to use a virtual environment inside `backend/`:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Database migrations

Run migrations using Alembic:

```bash
cd backend
alembic upgrade head
```

To revert the latest migration:

```bash
alembic downgrade -1
```

An optional seed script (`python -m app.initial_data`) creates a demo user, chat and messages.

### Running the API server

```bash
cd backend
uvicorn app.main:app --reload
```

The FastAPI app exposes:

- `/healthz` — readiness probe
- `/api/auth/telegram` — stubbed Telegram auth that issues an httpOnly cookie
- `/api/me` and `/api/me/stats`
- `/api/chats` CRUD helpers and `/api/chats/{chat_id}/send`
- `/api/chats/{chat_id}/stream` — SSE stub emitting a few demo chunks
- File and billing endpoints returning `501 Not Implemented`

CORS origins are taken from `ALLOWED_ORIGINS`, and session cookies are `httpOnly` with `SameSite=Lax`.

## Repository structure

```
.
├── backend/          # FastAPI application, Alembic migrations and requirements
├── src/              # React source code
├── dist/             # Created during `npm run build`
├── package.json
├── vite.config.ts
└── README.md
```

## Useful commands

- `npm run build` — create production assets in `dist/`
- `npm run preview` — preview the production build locally
- `alembic upgrade head` — apply the latest DB schema
- `uvicorn app.main:app` — start the FastAPI app

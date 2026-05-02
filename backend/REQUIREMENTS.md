# Zero-Day Cartographer Backend Requirements

This file captures the runtime requirements and setup checklist for the native backend path.

## System requirements

- Windows 10/11, macOS, or Linux
- Python 3.11+
- Node.js 18+ for the frontend
- Git
- 8 GB RAM minimum; 16 GB+ recommended for local model inference
- 10 GB+ free disk space

## Local LLM requirements

- Ollama installed locally
- Model installed: `qwen3:8b-q4_K_M`
- API endpoint: `http://localhost:11434/v1`

Fallback model options:
- `qwen2.5:7b-instruct`
- `gemma2:9b-instruct`
- `mistral:7b-instruct`

## Backend requirements

Python packages from `backend/requirements.txt`:
- `fastapi`
- `uvicorn[standard]`
- `httpx`
- `feedparser`
- `beautifulsoup4`
- `apscheduler`
- `pydantic`
- `python-dotenv`

## Environment variables

Required or recommended values in `backend/.env`:

```env
LLM_PROVIDER=ollama
LLM_BASE_URL=http://localhost:11434/v1
LLM_MODEL=qwen3:8b-q4_K_M
LLM_TIMEOUT_SECONDS=120
LLM_TEMPERATURE=0.2
SCRAPE_INTERVAL_HOURS=1
INITIAL_SCRAPE_ON_STARTUP=true
ALLOW_MOCK_FALLBACK=true
USE_MOCK_DATA=false
DB_PATH=backend/db/threats.db
```

## Services and endpoints

- Backend API: `http://localhost:8000`
- Health: `/health`
- Threat list: `/api/threats`
- Threat details: `/api/threats/{threat_id}`
- Generate patch: `/api/generate`
- Refresh feed: `/api/refresh`
- Realtime websocket: `/ws/live`

## Data sources

- Krebs on Security RSS
- The Hacker News RSS
- Schneier on Security RSS
- CISA Alerts RSS

## Storage

- SQLite database: `backend/db/threats.db`

## Setup checklist

1. Install Ollama.
2. Pull `qwen3:8b-q4_K_M`.
3. Copy `backend/.env.example` to `backend/.env`.
4. Start backend with `backend/run-native.ps1` or `backend/run-native.bat`.
5. Start frontend with `npm run dev` in `frontend/`.
6. Verify `/health`, `/api/status`, and `/api/threats`.

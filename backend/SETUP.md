# Zero-Day Cartographer Backend Setup Guide

This guide sets up the backend with live RSS threat data, local LLM inference, realtime websocket updates, and the frontend integration path.

## 1) Prerequisites

### Required
- Python 3.11+
- Node.js 18+ for the frontend
- Git

### Optional but recommended
- Ollama for a native local LLM runtime
- NVIDIA GPU + CUDA compatible drivers
- Apple Silicon machine if you want Metal-accelerated local inference

## 2) Recommended local LLM

### Best default for no-Docker setup
- `qwen3:8b-q4_K_M` via Ollama

### Alternative
- `gemma2:9b-instruct` via Ollama

### Why these
- They are small enough for local realtime use.
- They work well with OpenAI-compatible local servers such as Ollama or LocalAI.
- They can generate both threat classifications and mitigation code.

## 3) Install backend dependencies

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## 4) Configure environment

Copy the example env file:

```bash
copy .env.example .env
```

Edit `.env` and set:

```env
LLM_PROVIDER=ollama
LLM_BASE_URL=http://localhost:11434/v1
LLM_MODEL=qwen3:8b-q4_K_M
SCRAPE_INTERVAL_HOURS=1
INITIAL_SCRAPE_ON_STARTUP=true
ALLOW_MOCK_FALLBACK=true
USE_MOCK_DATA=false
DB_PATH=backend/db/threats.db
```

## 5) Start the local LLM

### Option A: Ollama (no Docker)

Install Ollama from https://ollama.com, then pull a model:

```bash
ollama pull qwen3:8b-q4_K_M
```

Quick test:

```bash
curl http://localhost:11434/v1/models
```

If the model is listed, Ollama is ready.

### Option B: LocalAI (optional, Docker-based)

If you later want Docker, you can use LocalAI with the same backend settings but point `LLM_BASE_URL` at `http://localhost:8080`.

## 6) Start the backend

### Native helper scripts

If you want one command on Windows, run:

```powershell
.\run-native.ps1
```

Or from Command Prompt:

```bat
run-native.bat
```

If you want to start it manually instead of using the helper script:

```bash
uvicorn main:app --reload --port 8000
```

After the backend starts, verify it with:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/status
curl http://localhost:8000/api/threats
```

## 7) How realtime data works

### Live RSS ingestion
- The backend fetches four threat sources:
  - Krebs on Security
  - The Hacker News
  - Schneier on Security
  - CISA Alerts
- Feeds are fetched asynchronously and parsed into article records.
- The researcher agent uses the local LLM to decide if an article is a real threat.
- Threats are upserted in SQLite using a deterministic ID so repeated scrapes do not create duplicates.

### Realtime updates
- Every successful scrape broadcasts a websocket event to `/ws/live`.
- The frontend can poll `/api/threats` every minute and/or connect to `/ws/live` for push updates.

## 8) Generate patches

`POST /api/generate` sends the selected threat to the engineer agent.

If LocalAI is available:
- It returns JSON with `middleware_code`, `firewall_regex`, and `explanation`.

If LocalAI is not available:
- The backend falls back to deterministic patch templates so the UI still works.

## 9) Frontend integration

The frontend already calls:
- `GET /api/threats`
- `POST /api/generate`
- `POST /api/refresh`
- `GET /api/status`

To point the frontend at the backend, ensure `http://localhost:8000` is available.

If you want websocket live updates later, connect a client to:

```text
ws://localhost:8000/ws/live
```

## 10) Verification checklist

Run these in order:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/status
curl http://localhost:8000/api/threats
curl -X POST http://localhost:8000/api/refresh
```

Then open the frontend and confirm:
- The threat graph loads
- Clicking a threat opens the panel
- Generate Patch returns code
- Threat count changes after refresh

## 11) Troubleshooting

### Backend starts but no threats appear
- Check RSS connectivity.
- Try `curl` on the feed URLs.
- If feeds are blocked, set `USE_MOCK_DATA=true` temporarily.

### LLM errors
- Confirm `LLM_BASE_URL` and `LLM_MODEL` are correct.
- For Ollama, use `http://localhost:11434/v1`.
- Verify the model exists with `curl http://localhost:11434/v1/models`.
- Increase `LLM_TIMEOUT_SECONDS` if the model is slow.

### SQLite locking or schema issues
- Stop the backend.
- Delete `backend/db/threats.db`.
- Restart to regenerate the schema.

### WebSocket updates not arriving
- Ensure the client connects to `ws://localhost:8000/ws/live`.
- Check browser console and backend logs.

## 12) Optional Docker setup

If you later want Docker, you can add a compose file that runs:
- LocalAI
- Backend
- Frontend

For now, the recommended path is native Ollama so you do not need Docker installed.


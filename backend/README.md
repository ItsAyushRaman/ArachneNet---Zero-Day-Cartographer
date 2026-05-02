# Zero-Day Cartographer Backend

FastAPI backend for live threat scraping, local LLM analysis, code generation, and realtime websocket updates.

## What this backend does

- Scrapes live cybersecurity RSS feeds
- Uses a local OpenAI-compatible LLM endpoint for threat classification and patch generation
- Stores and upserts results in SQLite
- Broadcasts realtime updates over WebSocket at `/ws/live`
- Serves the frontend API endpoints used by the dashboard

## Core endpoints

- `GET /api/threats`
- `GET /api/threats/{threat_id}`
- `POST /api/generate`
- `POST /api/refresh`
- `GET /api/status`
- `GET /health`
- `WS /ws/live`

## Quick start

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload --port 8000
```

Open the API docs at `http://localhost:8000/docs`.

## No-Docker setup (recommended): Ollama

1. Install Ollama for your OS from https://ollama.com.
2. Pull a model:

```bash
ollama pull qwen3:8b-q4_K_M
```

3. Confirm the local OpenAI-compatible API is available:

```bash
curl http://localhost:11434/v1/models
```

4. Set `.env`:

```env
LLM_PROVIDER=ollama
LLM_BASE_URL=http://localhost:11434/v1
LLM_MODEL=qwen3:8b-q4_K_M
```

5. Start the backend and the frontend as usual.

### Native backend launch scripts

From the `backend/` folder you can also run:

```bash
# PowerShell
.\run-native.ps1

# Command Prompt
run-native.bat
```

### Suggested Ollama models

- `qwen3:8b-q4_K_M` for your installed model
- `qwen2.5:7b-instruct` as a smaller fallback
- `gemma2:9b-instruct` if you want to try Gemma on stronger hardware
- `mistral:7b-instruct` if you want a lighter fallback

## Optional: Docker LocalAI setup

If you still want Docker later, you can use LocalAI with the same backend API shape.

## Realtime behavior

- On startup, the backend schedules live RSS scrapes at the configured interval.
- When new threats are found, the backend upserts them into SQLite and broadcasts a `threats_updated` event to websocket clients.
- `POST /api/refresh` triggers an immediate background scrape.

## Recommended local models

- Ollama: `qwen3:8b-q4_K_M` first
- Ollama: `gemma2:9b-instruct` on stronger systems
- LocalAI/gguf: `Qwen-7B-Chat` q4_0 or q4_k
- LocalAI/gguf: `Gemma-7B-Instruct` q4_0 or q4_k

For your current setup, start with `qwen3:8b-q4_K_M` first.

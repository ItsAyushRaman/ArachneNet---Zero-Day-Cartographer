# Zero-Day Cartographer — Quick Start Guide

Get the dashboard running with live RSS data and a local LLM.

## 1. Read the setup guide

Follow the full backend guide first:

- [backend/SETUP.md](backend/SETUP.md)

That guide covers LocalAI, model selection, environment variables, the database, and realtime updates.

## 2. Install dependencies

### Backend
```bash
cd backend
pip install -r requirements.txt
```

### Frontend
```bash
cd frontend
npm install
```

## 3. Configure environment

Copy the backend example env file:

```bash
copy backend\.env.example backend\.env
```

Set these values in `backend/.env`:

```env
LLM_PROVIDER=localai
LLM_BASE_URL=http://localhost:8080
LLM_MODEL=qwen-7b-chat-q4
```

## 4. Start LocalAI

Place a GGUF model in `backend/models/`, then run:

```bash
docker run --rm -p 8080:8080 -v %cd%/backend/models:/models ghcr.io/go-skynet/localai/localai:latest --models-dir /models
```

## 5. Start backend

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

## 6. Start frontend

```bash
cd frontend
npm run dev
```

## 7. Open the dashboard

Visit `http://localhost:5173`.

## 8. Verify realtime data

Run these checks:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/status
curl http://localhost:8000/api/threats
curl -X POST http://localhost:8000/api/refresh
```

## 9. What you should see

- The graph loads with threat nodes from live feeds or bootstrap data.
- Clicking a node opens the threat detail panel.
- Generating a patch returns Next.js middleware and a firewall regex.
- Realtime websocket updates are available at `ws://localhost:8000/ws/live`.

## 10. Troubleshooting

- If no threats appear, confirm RSS access and check backend logs.
- If patch generation is slow, lower the model size or use a quantized GGUF.
- If LocalAI is unavailable, the backend falls back to deterministic templates so the UI still works.

For deeper details, return to [backend/SETUP.md](backend/SETUP.md).

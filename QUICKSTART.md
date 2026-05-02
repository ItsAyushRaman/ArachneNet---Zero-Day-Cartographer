# Zero-Day Cartographer — Quick Start Guide

Get the threat intelligence dashboard running in 5 minutes.

## Step 1: Install Dependencies

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

## Step 2: Configure API Key

Edit the `.env` file in the root directory:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Get your API key from [Anthropic Console](https://console.anthropic.com)

## Step 3: Start Backend

In a terminal, from the project root:
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

✅ Backend is ready at `http://localhost:8000`

## Step 4: Start Frontend

In a new terminal, from the project root:
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.1.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ Frontend is ready at `http://localhost:5173`

## Step 5: Open the Dashboard

Visit `http://localhost:5173` in your browser.

### First Run
- The graph will be empty initially (waiting for threats)
- Click **REFRESH** button in the bottom-right
- Wait 5-10 seconds for threats to populate from RSS feeds
- You'll see colored nodes appear on the 3D graph

### Interact with Threats
1. **Click a node** → Side panel opens with threat details
2. Click **GENERATE PATCH** → Creates Next.js middleware + firewall rules
3. **Copy** the generated code with one click
4. Check **Status Bar** (bottom) for live threat count

## Testing Endpoints with curl

Verify the backend is working:

```bash
# Check status
curl http://localhost:8000/api/status

# List threats
curl http://localhost:8000/api/threats

# Health check
curl http://localhost:8000/health

# Trigger refresh (create new threats)
curl -X POST http://localhost:8000/api/refresh
```

## Troubleshooting

### Backend won't start
- Ensure Python 3.11+ is installed: `python --version`
- Missing dependencies? Run: `pip install -r requirements.txt`
- Port 8000 in use? Change with: `--port 8001`

### Frontend won't start
- Ensure Node 18+ is installed: `node --version`
- Missing modules? Run: `npm install`
- Port 5173 in use? Vite will auto-pick next available

### No threats showing
- Check `.env` has valid `ANTHROPIC_API_KEY`
- Click REFRESH and wait 10 seconds
- Check terminal logs for errors
- Verify backend is running: `curl http://localhost:8000/health`

### API calls failing
- Ensure backend is running on port 8000
- Check CORS: backend has `http://localhost:5173` whitelisted
- Check browser console for error messages

## Next Steps

### Customize Threat Sources
Edit `backend/config.py` to add/remove RSS feeds:
```python
THREAT_SOURCES = [
    {
        "name": "Your Feed",
        "url": "https://example.com/feed.xml",
        "type": "rss"
    },
    # ... more feeds
]
```

### Adjust Scrape Frequency
In `backend/config.py`:
```python
SCRAPE_INTERVAL_HOURS = 6  # Change to desired interval
```

### Customize Colors & Fonts
Edit `frontend/src/styles/global.css`:
```css
:root {
  --accent-red: #ff3b3b;    /* Change severity colors */
  --accent-cyan: #06b6d4;
  /* ... */
}
```

## Architecture Overview

```
┌─────────────────────────────────────────┐
│   React + Three.js (http://5173)        │
│   → Interactive 3D threat graph         │
└────────────────┬────────────────────────┘
                 │ HTTP REST API
┌────────────────▼────────────────────────┐
│   FastAPI Backend (http://8000)         │
│   → Threat extraction & code generation │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
    ┌───▼──┐      ┌──────▼────┐
    │ RSS  │      │  Anthropic │
    │Feeds │      │   Claude   │
    └──────┘      └────────────┘
        │                 │
        └────────┬────────┘
                 │
            ┌────▼────┐
            │ SQLite  │
            │   DB    │
            └─────────┘
```

## Support

For detailed documentation, see [README.md](./README.md)

For API reference, run backend and visit: `http://localhost:8000/docs`

---

**Ready?** Start with Step 1 above! 🚀

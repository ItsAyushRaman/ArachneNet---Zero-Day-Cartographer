# Zero-Day Cartographer

Zero-Day Cartographer is an interactive threat-mapping UI (frontend) built in React + Vite with a NeoBrutalism design system. This repository contains the frontend UI used to visualize, inspect, and generate mitigation patches for detected threats.

This README provides a high-level overview. See the frontend-specific running guide at `frontend/README.md` for exact commands and API contract details.

Key features
- 3D interactive threat graph (react-force-graph-3d + three.js)
- Detail panel with threat metadata, attack explanations and generated remediation code
- Mock fallback mode for offline testing
- NeoBrutalism design tokens and utilities

Repository layout
- `frontend/` — React frontend (run and develop here)
- `zdc_production_build_prompt.md` — build spec used to implement UI

If you want to run the UI locally, open `frontend/README.md` and follow the Quick Start commands.
# Zero-Day Cartographer

A dual-agent threat intelligence system that scrapes cybersecurity chatter, maps emerging threats as an interactive 3D network graph, and autonomously generates Next.js middleware or firewall rules on-demand.

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Anthropic API Key

### 1. Setup Backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the root directory:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Start the backend:
```bash
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Architecture

### Backend (Python/FastAPI)
- **Researcher Agent**: Scrapes RSS feeds, extracts threat data using Claude
- **Engineer Agent**: Generates Next.js middleware + firewall rules for each threat
- **Database**: SQLite for threat persistence
- **Scheduler**: Runs threat scraping every 6 hours

### Frontend (React/Three.js)
- **3D Graph**: Interactive threat visualization with force-directed layout
- **Threat Panel**: Detailed view and patch generation on node click
- **Status Bar**: Live threat count and refresh controls

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/threats` | GET | Fetch all threats |
| `/api/threats/{id}` | GET | Fetch single threat |
| `/api/generate` | POST | Generate middleware + firewall rules |
| `/api/refresh` | POST | Trigger immediate scrape |
| `/api/status` | GET | System status |
| `/health` | GET | Health check |

## File Structure

```
zero-day-cartographer/
├── backend/
│   ├── agents/          # LLM agents (researcher, engineer)
│   ├── db/              # Database module
│   ├── models/          # Pydantic models
│   ├── scraper/         # RSS feed scraper
│   ├── config.py        # Configuration
│   ├── main.py          # FastAPI app
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── styles/      # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── .env
└── .gitignore
```

## Features

✨ **Real-time Threat Monitoring**
- Scrapes 4 security RSS feeds (Krebs, Hacker News, Schneier, CISA)
- AI-powered threat extraction and classification

🗺️ **Interactive 3D Visualization**
- Force-directed graph layout
- Color-coded severity (CRITICAL/HIGH/MEDIUM/LOW)
- Starfield background with dark terminal aesthetic

🛡️ **On-Demand Security Patches**
- Generate Next.js 14 middleware for threat mitigation
- Create firewall rules (nginx/ModSecurity compatible)
- One-click patch generation per threat

## Configuration

Edit `backend/config.py` to customize:
- Threat sources (RSS feeds)
- Scrape interval (default: 6 hours)
- LLM model (default: claude-sonnet-4-20250514)
- Max tokens per response

## Technologies

**Backend**: FastAPI, Python 3.11, Anthropic Claude API, SQLite, APScheduler  
**Frontend**: React 18, Three.js, Vite, Tailwind CSS  
**Styling**: Dark terminal aesthetic with custom CSS variables

## Development Notes

- **Async concurrency**: Researcher agent uses semaphore(5) for rate limiting
- **Error isolation**: Per-source feed failures don't cascade
- **Live polling**: Frontend polls threats every 60 seconds
- **Responsive**: Panel adapts to mobile (100vw width)

## License

MIT

## Support

For issues or feature requests, check the project documentation or contact the maintainers.

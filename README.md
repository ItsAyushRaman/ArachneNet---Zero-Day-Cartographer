> A local cybersecurity threat-intelligence dashboard that turns live security updates into actionable defense.
> 

---

## The Problem It Solves

Security information is usually spread across many sources and is difficult to process quickly. Teams often spend too much time reading advisories, comparing reports, and writing defensive code manually.

**Zero-Day Cartographer reduces that delay by:**

- Collecting relevant threat information automatically
- Organizing it into structured data
- Showing the data visually
- Generating defensive code on demand

---

## How It Works

The system uses a simple pipeline:

1. Live security feeds are collected from multiple trusted sources.
2. A **researcher agent** analyzes the articles and extracts threat details.
3. Threat records are stored in **SQLite**.
4. The frontend displays threats in a **3D graph and list view**.
5. When a threat is selected, an **engineer agent** generates mitigation code.
6. Updates are broadcast to the UI in **realtime**.

---

## Main Capabilities

### Live Threat Collection

The backend regularly scrapes current security sources and keeps the threat list updated.

### AI-Based Classification

A local **Qwen model** running through **Ollama** classifies content into structured threat records — severity, attack vector, affected layer, and more.

### Interactive Visualization

Threats are displayed as a **3D graph** so patterns are easy to spot. Users can browse the list, inspect details, and focus on high-priority threats.

### Patch Generation

For each selected threat, the system can generate:

- Next.js middleware
- Firewall or regex-based filtering logic
- A short explanation of how the patch works

### Realtime Updates

The dashboard stays synchronized with backend changes — new threats appear without a full refresh.

---

## Architecture

### Backend

Built with **Python** and **FastAPI**. Handles:

- Feed ingestion
- Threat classification
- Data storage
- Patch generation
- API & WebSocket delivery

### Frontend

Built with **React** and **Vite**. Handles:

- 3D threat graph
- UI Sounds (11Labs)
- Threat list
- Detail panel
- Patch output panel
- Live status indicators

### Local LLM

Uses a local **OpenAI-compatible model server** through **Ollama**. Self-contained.

---

## Data Flow

```
Threat Sources → Researcher Agent → Database → Realtime API/WebSocket → Interactive Dashboard → Engineer Agent → Generated Mitigation Code
```

---

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Backend | Python, FastAPI, SQLite |
| AI / LLM | Ollama, Qwen |
| Frontend | React, Vite, Three.js |
| Data | RSS feed parsing |
| Realtime | WebSocket |

---

## Typical Use Cases

**Security Monitoring** — Track current threats from multiple public security feeds in one place.

**Rapid Response** — Generate a defensive patch faster than manual analysis and implementation.

**Learning & Demonstration** — Use the dashboard to explain common attack patterns, threat severity, and mitigation strategies in a clear visual format.

**Hackathon or Pitch Demo** — Show the entire flow from live intelligence to generated defense in one smooth presentation.

---

## Project Highlights

- Local-first design
- No external API key required for local setup
- Structured threat data instead of raw articles
- Visual threat mapping using 3D Graph
- On-demand mitigation generation
- Realtime dashboard updates
- Simple database-backed persistence

---

## Suggested Demo Flow

1. Open the dashboard.
2. Show that threats are already loaded from live sources.
3. Click a threat in the list or graph.
4. Explain the threat details and severity.
5. Generate the patch.
6. Show the generated middleware or firewall rule.
7. Copy the result and explain how it can be used in a real project.

---

## Running Locally

### Backend

```bash
cd /path/to/zero-day-cartographer/backend
python -m venv .venv
.venv/Scripts/activate
pip install -r requirements.txt
python -m uvicorn main:app --port 8000
```

### Frontend

```bash
cd /path/to/zero-day-cartographer/frontend
npm install
npm run dev
```

---

## Project Structure

```
zero-day-cartographer/
├── backend/         # API, scraping, database, and AI logic
├── frontend/        # React dashboard and visualization UI
├── README.md        # Main project guide
├── QUICKSTART.md    # Short run guide
└── PUBLIC_PROJECT_OVERVIEW.md  # Public-facing overview
```

---

## Why It Matters

Zero-Day Cartographer brings together **intelligence collection**, **visualization**, and **remediation** in one workflow. Instead of reading threats in isolation, users can see the bigger picture and act faster.

This makes it useful for:

- Developers who need practical mitigation code
- Small teams without a dedicated security analyst
- Students learning how real threats are detected and handled

[![Watch the video](https://img.youtube.com/vi/uY3SHZL5ms4/maxresdefault.jpg)](https://www.youtube.com/watch?v=uY3SHZL5ms4)

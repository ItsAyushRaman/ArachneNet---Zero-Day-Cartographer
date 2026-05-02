# Zero-Day Cartographer

**A realtime threat intelligence dashboard powered by local LLMs, live RSS feeds, and autonomous security agents.**

Zero-Day Cartographer is a fully self-contained cybersecurity threat monitoring system. It scrapes 8+ security feeds, classifies vulnerabilities using a local Qwen LLM, persists them in SQLite, broadcasts updates over WebSocket, and autonomously generates Next.js middleware + firewall rules for detected attacks.

## 🎯 Quick Overview

```
📡 RSS Feeds (Krebs, CISA, Rapid7, Cloudflare, etc.)
    ↓
🧠 Researcher Agent (Qwen LLM - threat classification)
    ↓
💾 SQLite Database (persistent threat store)
    ↓
🔴 WebSocket Realtime Broadcast
    ↓
📊 3D Force-Graph UI + Threat Detail Panel
    ↓
⚙️ Engineer Agent (Qwen LLM - patch generation)
    ↓
🛡️ Next.js Middleware + Firewall Rules
```

## ✨ Key Features

- **🌐 Live Data Pipeline**: Scrapes 8 security feeds every hour (Krebs, CISA, Schneier, BleepingComputer, Cloudflare, Google Security, Unit 42, Rapid7)
- **🤖 Dual-Agent System**:
  - **Researcher**: Classifies raw security articles into structured threats
  - **Engineer**: Generates production-ready Next.js middleware + WAF rules
- **📡 Realtime Broadcasting**: WebSocket `/ws/live` pushes threat updates to UI instantly
- **🗄️ Persistent Storage**: SQLite database with deterministic threat IDs prevents duplicates
- **🎨 3D Visualization**: Interactive force-graph threat network with severity-based coloring
- **⚡ No External APIs**: Runs entirely on local Ollama (Qwen LLM) — no Anthropic/OpenAI costs
- **🎪 Fallback Resilience**: Heuristic threat classification + template patches if LLM unavailable

---

## 📋 System Requirements

### Hardware
- **CPU**: Any modern processor (quad-core+ recommended)
- **RAM**: 16GB minimum (Qwen 8B model uses ~6-8GB)
- **Disk**: 20GB free (for Ollama models + database)
- **Network**: Active internet (for RSS feed scraping)

### Software
- **Windows 10+**, **macOS**, or **Linux**
- **Python 3.11+**
- **Node.js 18+**
- **Ollama** (for local Qwen LLM)

---

## 🚀 Complete Installation & Setup

### Step 1: Install Ollama + Download Qwen Model

**On Windows/Mac/Linux:**

1. Download Ollama from https://ollama.com
2. Install and run Ollama
3. In a terminal, pull the Qwen model:

```bash
ollama pull qwen3:8b-q4_K_M
```

Verify it's available:

```bash
ollama list
```

You should see:
```
NAME                ID              SIZE      MODIFIED
qwen3:8b-q4_K_M    500a1f067a9f    5.2 GB    [timestamp]
```

Ollama now runs at `http://localhost:11434` with an OpenAI-compatible API at `http://localhost:11434/v1`.

---

### Step 2: Clone & Setup Backend

```bash
cd d:\College Projects\H4G\zero-day-cartographer\backend

# Create Python virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from template
copy .env.example .env
```

**Edit `.env` file** (or use defaults):

```env
# Ollama configuration
LLM_PROVIDER=ollama
LLM_BASE_URL=http://localhost:11434
LLM_MODEL=qwen3:8b-q4_K_M
LLM_TIMEOUT_SECONDS=120
LLM_TEMPERATURE=0.2

# Scraping
SCRAPE_INTERVAL_HOURS=1
INITIAL_SCRAPE_ON_STARTUP=true
ALLOW_MOCK_FALLBACK=true
USE_MOCK_DATA=false

# Database
DB_PATH=backend/db/threats.db
```

---

### Step 3: Setup Frontend

```bash
cd frontend

# Install Node dependencies
npm install

# Verify environment (optional)
# The frontend auto-detects http://localhost:8000 as backend
```

---

## 🎬 Running the MVP

You need **three terminal windows/tabs** running simultaneously:

### Terminal 1: Start Ollama

```bash
ollama serve
```

Ollama will run in the background. Keep this terminal open.

### Terminal 2: Start Backend

```bash
cd d:\College Projects\H4G\zero-day-cartographer\backend
.venv\Scripts\activate
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Wait for the backend to fully start. You should see:
```
INFO:main:Starting Zero-Day Cartographer...
INFO:main:Database initialized
INFO:main:Scheduler started - will scrape every 1 hour(s)
INFO:main:Starting threat scrape pipeline...
...
INFO:     Application startup complete.
```

### Terminal 3: Start Frontend

```bash
cd path
npm run dev
```

The frontend will start and print:
```
  VITE v5.4.21  ready in XXX ms

  ➜  Local:   http://localhost:5174/
```

---

## 🌐 Access the Dashboard

Open your browser and go to:

```
http://localhost:5174
```

You should see:
- **Header**: "ZERO-DAY CARTOGRAPHER" with live timestamp and system status
- **Threat Ticker**: Scrolling list of recent threats (top)
- **3D Force-Graph**: Interactive threat network with colored nodes (center)
- **Threat List**: Sidebar with all detected threats (left)
- **Status Bar**: Shows threat count, source count, and LIVE/POLLING indicator (bottom)

---

## 🎮 How to Use the Dashboard

### View Threats
1. **Threat Ticker** (top): Shows a scrolling carousel of the latest threats
2. **Left Sidebar**: Browse the full threat list by attack vector
3. **3D Graph**: Click any threat node to open the detail panel

### Generate Security Patches
1. Click any threat in the list or 3D graph
2. A detail panel opens on the right side showing:
   - Threat name, description, severity, CVE references
   - Source attribution (which feed discovered it)
   - Attack vector classification
3. Click **REGENERATE PATCH** button
4. Wait a few seconds for Qwen to generate:
   - **Next.js Middleware**: TypeScript code to block the attack pattern
   - **Firewall Regex**: WAF rule pattern (nginx, ModSecurity, etc.)
   - **Explanation**: How the patch blocks this specific threat
5. Click **⎘ COPY** to copy code to clipboard

### Refresh Threats
1. Click the **↺ REFRESH** button in the status bar
2. Backend immediately scrapes all feeds and classifies new threats
3. UI updates via WebSocket within seconds

### Monitor Live Updates
- **LIVE** indicator (status bar, right): Green when WebSocket is connected
- **POLLING** indicator: Orange when falling back to 60-second REST polling
- Threat count auto-increments as new threats arrive

---

## 🤖 Architecture: The Dual-Agent System

### Researcher Agent
**Location**: `backend/agents/researcher.py`

**Purpose**: Classify security articles into structured threats

**Flow**:
1. Scraper fetches 92+ articles from 8 feeds per cycle
2. Researcher Agent processes each article via Qwen LLM
3. Qwen returns: `{ threat_type, severity, description, cve_refs }`
4. If Qwen fails, heuristic fallback uses pattern matching
5. Generate stable threat ID (SHA256 hash of article + metadata)
6. Upsert into SQLite (prevents duplicates)
7. Broadcast `threats_updated` event over WebSocket

**Example**:
```
Input: "SQL Injection vulnerability in admin dashboard allows..."
Output: {
  "is_threat": true,
  "threat_type": "SQL Injection",
  "severity": "CRITICAL",
  "description": "Unsanitized query parameter reaches SQL engine",
  "cve_refs": "CVE-2024-1234"
}
```

### Engineer Agent
**Location**: `backend/agents/engineer.py`

**Purpose**: Generate production-ready security code

**Flow**:
1. User clicks "GENERATE PATCH" on a threat
2. Engineer Agent sends threat details to Qwen LLM
3. Qwen generates:
   - Next.js 14 App Router middleware (TypeScript)
   - POSIX firewall regex rule
   - Explanation of the patch
4. If Qwen fails, deterministic templates are returned
5. Frontend displays code with copy-to-clipboard

**Example**:
```
Input: {
  "threat_type": "SQL Injection",
  "description": "Unsanitized query parameter reaches SQL engine",
  "severity": "CRITICAL"
}
Output: {
  "middleware_code": "export function middleware(request: NextRequest) { ... }",
  "firewall_regex": "(?i)(union.*select|select.*from|...)",
  "explanation": "Detects and blocks common SQL injection patterns..."
}
```

---

## 🔄 Data Flow Details

### Startup Sequence
1. **Backend boots** → Initializes SQLite, loads schema
2. **Scheduler starts** → Sets up hourly scrape timer
3. **Initial scrape trigger** → Immediately fetches all 8 feeds
4. **Researcher pipeline** → 92 articles → classification → 25-35 threats indexed
5. **Mock data seed** (optional, if `USE_MOCK_DATA=true`) → 16 additional threats
6. **Realtime broadcast** → WebSocket sends `threats_updated` event
7. **Frontend connects** → Receives threat list via `/api/threats` + WebSocket

### Hourly Scrape Cycle
Every 1 hour (configurable):
1. Fetch feeds → 80-100 articles
2. Classify via Researcher Agent → 20-30 new threats
3. Upsert into SQLite (with deterministic IDs to prevent dups)
4. Broadcast updates to all WebSocket clients
5. Frontend auto-updates threat graph and counts

### User Patch Generation
1. User clicks threat → detail panel opens
2. Click "REGENERATE PATCH" → `POST /api/generate` with `threat_id`
3. Backend fetches threat details from SQLite
4. Engineer Agent calls Qwen with threat context
5. Returns middleware + firewall rule
6. Frontend displays code tabs + copy button
7. User copies code → deploys to their application

---

## 📊 RSS Feed Sources

The system monitors these security feeds:

| Feed | Category | Update Frequency |
|------|----------|------------------|
| **Krebs on Security** | Independent Analysis | Daily |
| **BleepingComputer** | Security News | Hourly |
| **Schneier on Security** | Expert Analysis | Daily |
| **CISA Cybersecurity Advisories** | Government Alerts | Continuous |
| **Cloudflare Security Blog** | Vendor Insight | Weekly |
| **Google Security Blog** | Vendor Insight | Weekly |
| **Rapid7 Blog** | Vendor Research | Weekly |
| **Unit 42 (Palo Alto) Blog** | Threat Research | Weekly |

---

## 🛠️ Troubleshooting

### Issue: "UI loads but is blank"

**Problem**: The useStatus hook crashed due to mismatched response parsing.

**Solution**: Ensure `frontend/src/hooks/useStatus.js` reads the correct API format:
```javascript
const data = await fetchStatus();  // Already parsed JSON
setStatus(prev => ({
  ...prev,
  sourcesCount: data?.sources_count || 0,  // Not response.data
  // ...
}));
```

### Issue: "Backend throws 404 on Ollama calls"

**Problem**: LLM_BASE_URL is set to `http://localhost:11434/v1` (includes `/v1` suffix).

**Solution**: Use just `http://localhost:11434` in `.env`. The client normalizes it:
```env
LLM_BASE_URL=http://localhost:11434
```

### Issue: "No threats are showing up"

**Causes**:
1. Ollama not running → `ollama serve` in a separate terminal
2. RSS feeds are down → Check internet connection or feed URLs in `backend/config.py`
3. Qwen model not installed → `ollama pull qwen3:8b-q4_K_M`
4. Classification is failing → Check `USE_MOCK_DATA=true` in `.env` to seed 16 mock threats

**Solution**:
```bash
# Verify Ollama is running
curl http://localhost:11434/api/tags

# Test Qwen directly
curl http://localhost:11434/api/generate -d '{"model":"qwen3:8b-q4_K_M","prompt":"test"}'

# Enable mock data temporarily
# Edit backend/.env → USE_MOCK_DATA=true
# Restart backend
```

### Issue: "Frontend can't connect to backend (CORS error)"

**Problem**: Backend CORS middleware isn't configured for the frontend port.

**Solution**: Edit `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: "WebSocket shows POLLING instead of LIVE"

**Cause**: WebSocket connection failed, falling back to HTTP polling every 60s.

**Why**: This is normal on startup while the backend is still scraping. Once scraping completes, WebSocket will connect.

**Workaround**: Check if backend is responding:
```bash
curl http://localhost:8000/health
```

---

## 📂 Project Structure

```
zero-day-cartographer/
├── backend/
│   ├── main.py                    # FastAPI app, WebSocket manager, endpoints
│   ├── agents/
│   │   ├── researcher.py          # Threat classification agent
│   │   └── engineer.py            # Patch generation agent
│   ├── services/
│   │   └── local_llm.py           # Ollama OpenAI-compatible client
│   ├── scraper/
│   │   └── feeds.py               # RSS feed parser (8 sources)
│   ├── db/
│   │   ├── database.py            # SQLite operations, schema
│   │   └── threats.db             # SQLite database (auto-created)
│   ├── models/
│   │   └── threat.py              # Pydantic threat schema
│   ├── config.py                  # Environment-driven configuration
│   ├── test_data.py               # Mock threat corpus (16 items)
│   ├── requirements.txt           # Python dependencies
│   ├── .env.example               # Environment template
│   ├── README.md                  # Backend-specific docs
│   ├── SETUP.md                   # Backend setup guide
│   └── run-native.ps1             # Windows native launch script
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Root component
│   │   ├── components/
│   │   │   ├── graph/
│   │   │   │   └── ThreatGraph.jsx            # 3D force-graph (Three.js + react-force-graph-3d)
│   │   │   ├── panel/
│   │   │   │   └── ThreatPanel.jsx            # Threat detail + patch gen panel
│   │   │   ├── layout/
│   │   │   │   ├── AppShell.jsx               # Main layout wrapper
│   │   │   │   ├── Header.jsx                 # Title bar + branding
│   │   │   │   ├── StatusBar.jsx              # Threat count + status footer
│   │   │   │   └── ThreatTicker.jsx           # Scrolling threat carousel
│   │   │   └── ui/
│   │   │       ├── Button.jsx                 # Reusable button component
│   │   │       └── index.js                   # UI component exports
│   │   ├── hooks/
│   │   │   ├── useThreats.js                  # Threat list + WebSocket listener
│   │   │   ├── useGenerate.js                 # Patch generation hook
│   │   │   ├── useStatus.js                   # Backend status poller
│   │   │   └── useCountUp.js                  # Animated count increment
│   │   ├── utils/
│   │   │   ├── api.js                         # Axios client + API helpers
│   │   │   ├── severity.js                    # Severity levels + colors
│   │   │   └── formatters.js                  # Date/time formatting
│   │   ├── data/
│   │   │   └── mockThreats.js                 # Fallback mock threat list
│   │   ├── context/
│   │   │   └── ThemeContext.jsx               # Dark mode context
│   │   ├── styles/
│   │   │   ├── global.css                     # NeoBrutalism design tokens
│   │   │   └── fonts.css                      # Custom fonts (Courier, Helvetica)
│   │   └── index.jsx                          # React root entry
│   ├── package.json               # Node dependencies (Vite, React, Three.js, etc.)
│   ├── vite.config.js             # Vite build config
│   └── README.md                  # Frontend-specific docs
│
├── README.md                      # This file (complete run guide)
└── zdc_production_build_prompt.md # Original design spec
```

---

## 🔧 Advanced Configuration

### Increase Scrape Frequency
Edit `backend/.env`:
```env
SCRAPE_INTERVAL_HOURS=0.5  # Scrape every 30 minutes instead of 1 hour
```

### Add More RSS Feeds
Edit `backend/config.py`:
```python
THREAT_SOURCES = [
    # ... existing sources ...
    {
        "name": "My Custom Feed",
        "url": "https://example.com/feed.rss",
        "type": "rss",
        "category": "custom"
    }
]
```

### Use a Different Qwen Model
Edit `backend/.env`:
```env
LLM_MODEL=qwen2.5:7b-instruct  # Smaller model
# or
LLM_MODEL=qwen3:8b-q4_K_M      # Default (recommended)
```

### Switch to LocalAI (if Docker available)
Edit `backend/.env`:
```env
LLM_PROVIDER=localai
LLM_BASE_URL=http://localhost:8080
LLM_MODEL=Qwen-7B-Chat
```

---

## 📈 Performance Notes

### Memory Usage
- **Ollama + Qwen 8B**: ~6-8GB RAM
- **Backend (Python)**: ~200-300MB
- **Frontend (React)**: ~50-100MB
- **SQLite database**: Grows ~2-5MB per 100 threats

### CPU Usage
- **During scrape**: 20-40% (50-100 articles processed in parallel)
- **Idle**: <5%
- **LLM inference**: 30-60% (depends on model size + hardware)

### Network
- **Startup**: ~1-2 min for initial scrape + classification
- **Hourly cycle**: ~30-60 seconds
- **WebSocket updates**: <100ms latency

---

## 🎓 Understanding the UI

### Threat Matrix (Center Panel)
Shows severity distribution:
- **CRITICAL**: Red (highest priority)
- **HIGH**: Orange (significant)
- **MEDIUM**: Yellow (monitor)
- **LOW**: Gray (informational)

### 3D Force-Graph
- **Nodes**: Individual threats
- **Colors**: Severity level
- **Connections**: Similar threat types cluster together
- **Interaction**: Click to select, drag to pan, scroll to zoom

### Status Bar (Bottom)
- **● THREATS: 45**: Total threat count
- **CRIT: 12 / HIGH: 15 / MEDI: 18 / LOW: 0**: Severity breakdown
- **MONITORING: 8 FEEDS**: Active RSS source count
- **LIVE**: WebSocket connected (green) or POLLING fallback (orange)
- **LAST: 14:35:00 UTC**: Last update timestamp
- **↺ REFRESH**: Manually trigger new scrape

---

## 🚨 Important Notes

### No External API Calls
- All threat classification happens locally via Ollama/Qwen
- Zero dependency on Anthropic, OpenAI, or any cloud service
- RSS feeds are the only external data source

### Deterministic Threat IDs
- Threat IDs are SHA256 hashes of article metadata
- Same article → same threat ID (prevents duplicates)
- ID survives across restarts

### Fallback Resilience
- **If LLM unavailable**: Heuristic pattern matching (SQL, XSS, etc.)
- **If RSS feeds down**: Mock threats seed the UI
- **If WebSocket fails**: REST polling every 60s
- **System never crashes** — graceful degradation built-in

---

## 📝 License & Attribution

**Attribution**:
- **Qwen LLM**: Alibaba Cloud (open-source)
- **Ollama**: Open-source local LLM runtime
- **React**: Facebook/Meta
- **Three.js**: JS 3D graphics library
- **FastAPI**: Modern Python web framework
- **SQLite**: Public domain database

---

## 🆘 Support & Further Reading

### Backend Details
See [backend/README.md](backend/README.md) and [backend/SETUP.md](backend/SETUP.md) for:
- API endpoint documentation
- Docker setup (alternative to native)
- Environment variable reference
- Troubleshooting specific to backend

### Frontend Details
See [frontend/README.md](frontend/README.md) for:
- Component architecture
- Build & deployment
- Styling system (NeoBrutalism)
- Performance optimization

### Original Design Spec
See [zdc_production_build_prompt.md](zdc_production_build_prompt.md) for:
- Complete feature requirements
- Design decisions
- UI/UX specifications

---

## 🎉 You're Ready!

Your complete Zero-Day Cartographer MVP is now live. Start with these steps:

1. **Open** http://localhost:5174
2. **Explore** the threat list and 3D graph
3. **Click** any threat to see details
4. **Generate** a security patch with one click
5. **Copy** the middleware code to your application

Threats update every hour automatically. Enjoy realtime threat intelligence! 🚀

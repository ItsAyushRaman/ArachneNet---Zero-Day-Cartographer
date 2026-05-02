import asyncio
from datetime import datetime

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import logging

from db.database import (
    bulk_upsert_threats,
    get_all_threats,
    get_last_updated,
    get_threat_by_id,
    get_threat_count,
    init_db,
    insert_threat,
)
from models.threat import ThreatNode, GenerateRequest, GenerateResponse, StatusResponse
from config import (
    ALLOW_MOCK_FALLBACK,
    INITIAL_SCRAPE_ON_STARTUP,
    SCRAPE_INTERVAL_HOURS,
    THREAT_SOURCES,
    USE_MOCK_DATA,
)
from scraper.feeds import scrape_all_sources
from agents.researcher import run_researcher_agent
from agents.engineer import run_engineer_agent
from test_data import get_mock_threats
from apscheduler.schedulers.asyncio import AsyncIOScheduler

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="Zero-Day Cartographer", version="0.1.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state
scheduler = None
last_scrape_time = None
scrape_lock = asyncio.Lock()


class ConnectionManager:
    def __init__(self):
        self.connections: set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.connections.discard(websocket)

    async def broadcast(self, message: dict):
        if not self.connections:
            return
        dead = []
        for websocket in self.connections:
            try:
                await websocket.send_json(message)
            except Exception:
                dead.append(websocket)
        for websocket in dead:
            self.disconnect(websocket)


realtime_manager = ConnectionManager()


async def publish_status(event_type: str, payload: dict | None = None):
    status = {
        "type": event_type,
        "timestamp": datetime.utcnow().isoformat(),
        "payload": payload or {},
        "status": {
            "threat_count": get_threat_count(),
            "last_updated": get_last_updated(),
            "sources_count": len(THREAT_SOURCES),
        },
    }
    await realtime_manager.broadcast(status)


async def run_scrape_pipeline():
    """
    Full scrape → research → insert pipeline.
    Called on startup and on schedule.
    """
    global last_scrape_time
    
    async with scrape_lock:
        try:
            logger.info("Starting threat scrape pipeline...")

            # Step 1: Scrape all sources
            raw_articles = await scrape_all_sources(THREAT_SOURCES)
            logger.info(f"Scraped {len(raw_articles)} articles from threat sources")

            if not raw_articles:
                logger.warning("No articles scraped")
                if USE_MOCK_DATA or ALLOW_MOCK_FALLBACK:
                    mock_threats = get_mock_threats()
                    bulk_upsert_threats(mock_threats)
                    await publish_status("threats_bootstrapped", {"new_count": len(mock_threats)})
                    return mock_threats
                return []

            # Step 2: Run researcher agent
            threats = await run_researcher_agent(raw_articles)
            logger.info(f"Researcher agent identified {len(threats)} threats")

            # Step 3: Insert threats into database
            if threats:
                bulk_upsert_threats(threats)
            elif USE_MOCK_DATA or ALLOW_MOCK_FALLBACK:
                mock_threats = get_mock_threats()
                bulk_upsert_threats(mock_threats)
                threats = mock_threats

            if threats:
                await publish_status("threats_updated", {"new_count": len(threats)})

            last_scrape_time = datetime.utcnow().isoformat()
            logger.info(f"Pipeline complete. {len(threats)} new threats indexed.")
            return threats

        except Exception as e:
            logger.error(f"Pipeline error: {str(e)}")
            return []

@app.on_event("startup")
async def startup_event():
    """Initialize DB and start scheduler on app startup."""
    global scheduler
    
    logger.info("Starting Zero-Day Cartographer...")
    if USE_MOCK_DATA:
        logger.info("⚠️  USE_MOCK_DATA enabled - using deterministic mock threat data")
    
    # Initialize database
    init_db()
    logger.info("Database initialized")
    
    # Seed baseline data so the UI is never empty.
    if USE_MOCK_DATA:
        mock_threats = get_mock_threats()
        bulk_upsert_threats(mock_threats)
        logger.info(f"Loaded {len(mock_threats)} mock threats for bootstrapping")

    # Run scrape pipeline immediately unless explicitly disabled.
    if INITIAL_SCRAPE_ON_STARTUP:
        asyncio.create_task(run_scrape_pipeline())

    # Set up scheduler to run every N hours.
    scheduler = AsyncIOScheduler()
    scheduler.add_job(run_scrape_pipeline, 'interval', hours=SCRAPE_INTERVAL_HOURS)
    scheduler.start()
    logger.info(f"Scheduler started - will scrape every {SCRAPE_INTERVAL_HOURS} hour(s)")

@app.on_event("shutdown")
async def shutdown_event():
    """Stop scheduler on app shutdown."""
    global scheduler
    if scheduler and scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("Scheduler stopped")

# ==================== ENDPOINTS ====================

@app.get("/api/threats", response_model=list[ThreatNode])
async def get_threats():
    """
    Get all threats from the database.
    Returns list of ThreatNode objects ordered by discovery date (newest first).
    """
    try:
        threats_data = get_all_threats()
        return [ThreatNode(**threat) for threat in threats_data]
    except Exception as e:
        logger.error(f"Error fetching threats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch threats")

@app.get("/api/threats/{threat_id}", response_model=ThreatNode)
async def get_threat_detail(threat_id: str):
    """
    Get a single threat by ID.
    """
    try:
        threat_data = get_threat_by_id(threat_id)
        if not threat_data:
            raise HTTPException(status_code=404, detail="Threat not found")
        return ThreatNode(**threat_data)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching threat {threat_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch threat")

@app.post("/api/generate", response_model=GenerateResponse)
async def generate_patch(request: GenerateRequest):
    """
    Generate middleware and firewall rules for a specific threat.
    Triggered by clicking a threat node.
    """
    try:
        # Fetch the threat
        threat_data = get_threat_by_id(request.threat_id)
        if not threat_data:
            raise HTTPException(status_code=404, detail="Threat not found")
        
        # Run engineer agent
        logger.info(f"Generating patch for threat {request.threat_id}...")
        result = await run_engineer_agent(threat_data)
        
        return GenerateResponse(
            middleware_code=result.get("middleware_code", ""),
            firewall_regex=result.get("firewall_regex", ""),
            explanation=result.get("explanation", "")
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating patch: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate patch")

@app.post("/api/refresh")
async def refresh_threats():
    """
    Trigger an immediate refresh of threat data.
    Researcher agent is dispatched in background.
    """
    try:
        asyncio.create_task(run_scrape_pipeline())
        
        return {
            "status": "refresh_started",
            "message": "Researcher agent dispatched"
        }
    except Exception as e:
        logger.error(f"Error triggering refresh: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to trigger refresh")

@app.get("/api/status", response_model=StatusResponse)
async def get_status():
    """
    Get current system status.
    Returns threat count, last update time, and sources monitored.
    """
    try:
        threat_count = get_threat_count()
        last_updated = get_last_updated()
        sources_count = len(THREAT_SOURCES)
        
        return StatusResponse(
            threat_count=threat_count,
            last_updated=last_updated,
            sources_count=sources_count
        )
    except Exception as e:
        logger.error(f"Error fetching status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch status")

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@app.websocket("/ws/live")
async def live_updates(websocket: WebSocket):
    """Stream threat and status updates to websocket clients."""
    await realtime_manager.connect(websocket)
    try:
        await websocket.send_json({
            "type": "connected",
            "timestamp": datetime.utcnow().isoformat(),
            "status": {
                "threat_count": get_threat_count(),
                "last_updated": get_last_updated(),
                "sources_count": len(THREAT_SOURCES),
            },
            "threats": get_all_threats()[:10],
        })
        while True:
            message = await websocket.receive_text()
            if message.lower() == "ping":
                await websocket.send_json({"type": "pong", "timestamp": datetime.utcnow().isoformat()})
    except WebSocketDisconnect:
        realtime_manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        realtime_manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

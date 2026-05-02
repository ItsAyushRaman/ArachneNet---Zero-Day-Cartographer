import asyncio
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import logging

from db.database import (
    init_db, get_all_threats, get_threat_by_id, 
    insert_threat, get_threat_count, get_last_updated
)
from models.threat import ThreatNode, GenerateRequest, GenerateResponse, StatusResponse
from config import THREAT_SOURCES, SCRAPE_INTERVAL_HOURS, TEST_MODE
from scraper.feeds import scrape_all_sources
from agents.researcher import run_researcher_agent
from agents.engineer import run_engineer_agent
from test_data import get_mock_threats
from apscheduler.schedulers.background import BackgroundScheduler

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="Zero-Day Cartographer", version="0.1.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state
scheduler = None
last_scrape_time = None

async def run_scrape_pipeline():
    """
    Full scrape → research → insert pipeline.
    Called on startup and on schedule.
    """
    global last_scrape_time
    
    try:
        logger.info("Starting threat scrape pipeline...")
        
        # Step 1: Scrape all sources
        raw_articles = await scrape_all_sources(THREAT_SOURCES)
        logger.info(f"Scraped {len(raw_articles)} articles from threat sources")
        
        if not raw_articles:
            logger.warning("No articles scraped")
            return
        
        # Step 2: Run researcher agent
        threats = await run_researcher_agent(raw_articles)
        logger.info(f"Researcher agent identified {len(threats)} threats")
        
        # Step 3: Insert threats into database
        for threat in threats:
            insert_threat(threat)
        
        last_scrape_time = datetime.utcnow().isoformat()
        logger.info(f"Pipeline complete. {len(threats)} new threats indexed.")
    
    except Exception as e:
        logger.error(f"Pipeline error: {str(e)}")

@app.on_event("startup")
async def startup_event():
    """Initialize DB and start scheduler on app startup."""
    global scheduler
    
    logger.info("Starting Zero-Day Cartographer...")
    if TEST_MODE:
        logger.info("⚠️  TEST MODE ENABLED - Using mock threat data")
    
    # Initialize database
    init_db()
    logger.info("Database initialized")
    
    # Load mock threats in TEST_MODE
    if TEST_MODE:
        mock_threats = get_mock_threats()
        for threat in mock_threats:
            insert_threat(threat)
        logger.info(f"Loaded {len(mock_threats)} mock threats for testing")
    
    # Run scrape pipeline immediately (background task) - skip in test mode
    if not TEST_MODE:
        asyncio.create_task(run_scrape_pipeline())
    
    # Set up scheduler to run every N hours (skip in test mode)
    if not TEST_MODE:
        scheduler = BackgroundScheduler()
        scheduler.add_job(
            lambda: asyncio.run(run_scrape_pipeline()),
            'interval',
            hours=SCRAPE_INTERVAL_HOURS
        )
        scheduler.start()
        logger.info(f"Scheduler started - will scrape every {SCRAPE_INTERVAL_HOURS} hours")
    else:
        logger.info("Scheduler disabled in TEST MODE")

@app.on_event("shutdown")
async def shutdown_event():
    """Stop scheduler on app shutdown."""
    global scheduler
    if scheduler and scheduler.running:
        scheduler.shutdown()
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
async def refresh_threats(background_tasks: BackgroundTasks):
    """
    Trigger an immediate refresh of threat data.
    Researcher agent is dispatched in background.
    """
    try:
        # Add to background tasks
        background_tasks.add_task(run_scrape_pipeline)
        
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

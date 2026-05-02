import os
from dotenv import load_dotenv

load_dotenv()

# API Configuration
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
TEST_MODE = os.getenv("TEST_MODE", "").lower() in {"1", "true", "yes"} or not ANTHROPIC_API_KEY or not ANTHROPIC_API_KEY.startswith("sk-ant-")

# LLM Configuration
MODEL = "claude-sonnet-4-20250514"
MAX_TOKENS = 1500

# Scraping Configuration
SCRAPE_INTERVAL_HOURS = 6

# Threat Sources (RSS Feeds)
THREAT_SOURCES = [
    {
        "name": "Krebs on Security",
        "url": "https://krebsonsecurity.com/feed/",
        "type": "rss"
    },
    {
        "name": "The Hacker News",
        "url": "https://feeds.feedburner.com/TheHackersNews",
        "type": "rss"
    },
    {
        "name": "Schneier on Security",
        "url": "https://www.schneier.com/feed/atom",
        "type": "rss"
    },
    {
        "name": "CISA Alerts",
        "url": "https://www.cisa.gov/cybersecurity-advisories/all.xml",
        "type": "rss"
    }
]

# Database
DB_PATH = "backend/db/threats.db"

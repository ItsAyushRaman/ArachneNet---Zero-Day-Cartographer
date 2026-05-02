import os
from dotenv import load_dotenv

load_dotenv()


def _env_bool(name: str, default: str = "false") -> bool:
    return os.getenv(name, default).lower() in {"1", "true", "yes", "on"}


# Runtime mode
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "localai").lower()
USE_MOCK_DATA = _env_bool("USE_MOCK_DATA", "false")

# Local LLM configuration
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "http://localhost:8080")
LLM_MODEL = os.getenv("LLM_MODEL", "qwen-7b-chat-q4")
LLM_TIMEOUT_SECONDS = int(os.getenv("LLM_TIMEOUT_SECONDS", "120"))
LLM_TEMPERATURE = float(os.getenv("LLM_TEMPERATURE", "0.2"))

# Backward-compatibility alias used by older code paths
TEST_MODE = USE_MOCK_DATA

# Scraping / realtime configuration
SCRAPE_INTERVAL_HOURS = int(os.getenv("SCRAPE_INTERVAL_HOURS", "1"))
INITIAL_SCRAPE_ON_STARTUP = _env_bool("INITIAL_SCRAPE_ON_STARTUP", "true")
ALLOW_MOCK_FALLBACK = _env_bool("ALLOW_MOCK_FALLBACK", "true")

# Threat Sources (RSS Feeds)
THREAT_SOURCES = [
    {
        "name": "Krebs on Security",
        "url": "https://krebsonsecurity.com/feed/",
        "type": "rss",
        "category": "independent"
    },
    {
        "name": "BleepingComputer",
        "url": "https://www.bleepingcomputer.com/feed/",
        "type": "rss",
        "category": "security-news"
    },
    {
        "name": "Schneier on Security",
        "url": "https://www.schneier.com/feed/atom",
        "type": "rss",
        "category": "analysis"
    },
    {
        "name": "CISA Alerts",
        "url": "https://www.cisa.gov/cybersecurity-advisories/all.xml",
        "type": "rss",
        "category": "government"
    },
    {
        "name": "Rapid7",
        "url": "https://www.rapid7.com/blog/rss/",
        "type": "rss",
        "category": "vendor"
    },
    {
        "name": "Google Security Blog",
        "url": "https://security.googleblog.com/feeds/posts/default?alt=rss",
        "type": "rss",
        "category": "vendor"
    },
    {
        "name": "Cloudflare Security",
        "url": "https://blog.cloudflare.com/tag/security/rss/",
        "type": "rss",
        "category": "vendor"
    },
    {
        "name": "Unit 42",
        "url": "https://unit42.paloaltonetworks.com/feed/",
        "type": "rss",
        "category": "research"
    }
]

# Keep a slightly deeper slice of each feed so the UI stays populated with fresh items.
MAX_ARTICLES_PER_SOURCE = int(os.getenv("MAX_ARTICLES_PER_SOURCE", "12"))

# Database
DB_PATH = os.getenv("DB_PATH", "backend/db/threats.db")

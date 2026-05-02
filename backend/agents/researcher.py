import asyncio
import json
import uuid
from datetime import datetime
from anthropic import Anthropic
from config import TEST_MODE, ANTHROPIC_API_KEY

client = Anthropic(api_key=ANTHROPIC_API_KEY) if not TEST_MODE else None

SYSTEM_PROMPT = """You are a cybersecurity threat intelligence analyst. You receive a raw text excerpt 
from a security blog or advisory. Your job is to determine if it describes a specific, 
actionable attack technique against web applications.

If the excerpt describes an attack, respond ONLY with a valid JSON object. 
No markdown, no explanation, no backticks. Just the JSON.

JSON format:
{
  "is_threat": true,
  "title": "Concise threat name (max 60 chars)",
  "description": "What the attack does and why it's dangerous (2-3 sentences)",
  "attack_vector": "One of: SQL Injection, XSS, CSRF, Path Traversal, RCE, 
                    SSRF, Auth Bypass, Privilege Escalation, Supply Chain, 
                    Cryptographic Weakness, Misconfiguration, DoS, Other",
  "severity": "One of: CRITICAL, HIGH, MEDIUM, LOW",
  "affected_layer": "One of: Frontend, API, Database, Auth, Infrastructure, 
                     Dependency, Network",
  "cve_refs": "Comma-separated CVE IDs if mentioned (e.g. CVE-2024-1234), 
               else empty string"
}

If the excerpt does NOT describe a specific attack technique (e.g. it's an opinion 
piece, a product announcement, or general news), respond with exactly:
{"is_threat": false}
"""

async def run_researcher_agent(raw_articles: list) -> list:
    """
    Process raw articles through the Researcher Agent.
    Uses a semaphore to limit concurrent API calls.
    In TEST_MODE, returns empty list (mock data loaded separately).
    """
    if TEST_MODE:
        print("[RESEARCHER] Running in TEST MODE - skipping article processing")
        return []
    
    semaphore = asyncio.Semaphore(5)  # Max 5 concurrent requests
    
    async def process_article(article):
        async with semaphore:
            return await extract_threat_from_article(article)
    
    tasks = [process_article(article) for article in raw_articles]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Filter out None results and exceptions
    threats = [r for r in results if r is not None and not isinstance(r, Exception)]
    return threats

async def extract_threat_from_article(article: dict) -> dict:
    """
    Extract threat data from a single article using Claude API.
    Returns a threat dict or None if not a threat.
    """
    try:
        article_text = article.get("text", "")[:800]  # Ensure max 800 chars
        
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1500,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": article_text
                }
            ]
        )
        
        response_text = response.content[0].text
        
        # Parse JSON response
        threat_data = json.loads(response_text)
        
        if not threat_data.get("is_threat", False):
            return None
        
        # Build complete threat dict
        threat = {
            "id": str(uuid.uuid4()),
            "title": threat_data.get("title", "Unnamed Threat"),
            "description": threat_data.get("description", ""),
            "attack_vector": threat_data.get("attack_vector", "Other"),
            "severity": threat_data.get("severity", "MEDIUM"),
            "affected_layer": threat_data.get("affected_layer", "Infrastructure"),
            "cve_refs": threat_data.get("cve_refs", ""),
            "source_name": article.get("source_name", "Unknown"),
            "source_url": article.get("source_url", ""),
            "discovered_at": datetime.utcnow().isoformat(),
            "raw_excerpt": article_text[:500]
        }
        
        return threat
    
    except json.JSONDecodeError as e:
        print(f"[RESEARCHER ERROR] Failed to parse JSON response: {str(e)}")
        return None
    except Exception as e:
        print(f"[RESEARCHER ERROR] {str(e)}")
        return None

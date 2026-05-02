import asyncio
import hashlib
import json
import re
from datetime import datetime

from config import ALLOW_MOCK_FALLBACK, LLM_BASE_URL, LLM_MODEL, LLM_PROVIDER, LLM_TEMPERATURE, LLM_TIMEOUT_SECONDS, USE_MOCK_DATA
from services.local_llm import call_local_llm_json

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
    Uses a semaphore to limit concurrent LLM calls.
    In mock mode, falls back to deterministic heuristics.
    """
    semaphore = asyncio.Semaphore(5)  # Max 5 concurrent requests
    
    async def process_article(article):
        async with semaphore:
            return await extract_threat_from_article(article)
    
    tasks = [process_article(article) for article in raw_articles]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Filter out None results and exceptions
    threats = [r for r in results if r is not None and not isinstance(r, Exception)]
    return threats

def _stable_threat_id(article: dict, title: str, discovered_at: str) -> str:
    key = "|".join([
        article.get("source_url", ""),
        article.get("link", ""),
        title or "",
        discovered_at or "",
        article.get("text", "")[:400],
    ])
    return hashlib.sha256(key.encode("utf-8")).hexdigest()[:24]


def _fallback_classify(article: dict) -> dict | None:
    text = f"{article.get('title', '')} {article.get('text', '')}".lower()
    attack_vector = "Other"
    severity = "MEDIUM"
    affected_layer = "Infrastructure"

    patterns = [
        ("sql", "SQL Injection", "Database", "CRITICAL"),
        ("xss", "XSS", "Frontend", "HIGH"),
        ("cross-site scripting", "XSS", "Frontend", "HIGH"),
        ("csrf", "CSRF", "Frontend", "MEDIUM"),
        ("path traversal", "Path Traversal", "API", "HIGH"),
        ("directory traversal", "Path Traversal", "API", "HIGH"),
        ("rce", "RCE", "Infrastructure", "CRITICAL"),
        ("remote code execution", "RCE", "Infrastructure", "CRITICAL"),
        ("ssrf", "SSRF", "API", "HIGH"),
        ("auth bypass", "Auth Bypass", "Auth", "CRITICAL"),
        ("privilege escalation", "Privilege Escalation", "Auth", "HIGH"),
        ("dos", "DoS", "Network", "MEDIUM"),
    ]

    matched = None
    for needle, vector, layer, level in patterns:
        if needle in text:
            matched = (vector, layer, level)
            break

    if not matched:
        return None

    attack_vector, affected_layer, severity = matched
    title = article.get("title", "Potential Security Threat")
    discovered_at = article.get("pub_date") or datetime.utcnow().isoformat()
    return {
        "is_threat": True,
        "title": title[:60],
        "description": article.get("text", "")[:500] or f"Potential {attack_vector} activity detected.",
        "attack_vector": attack_vector,
        "severity": severity,
        "affected_layer": affected_layer,
        "cve_refs": "",
        "source_name": article.get("source_name", "Unknown"),
        "source_url": article.get("source_url", ""),
        "raw_excerpt": article.get("text", "")[:500],
        "discovered_at": discovered_at,
    }


async def extract_threat_from_article(article: dict) -> dict:
    """
    Extract threat data from a single article using the configured local LLM.
    Returns a threat dict or None if not a threat.
    """
    try:
        article_text = article.get("text", "")[:800]  # Ensure max 800 chars
        discovered_at = article.get("pub_date") or datetime.utcnow().isoformat()

        async def fallback():
            return _fallback_classify(article)

        threat_data = await call_local_llm_json(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=article_text,
            fallback=fallback,
            max_tokens=1200,
            temperature=LLM_TEMPERATURE,
        )

        if not threat_data or not threat_data.get("is_threat", False):
            return None

        title = threat_data.get("title", article.get("title", "Unnamed Threat"))
        threat = {
            "id": _stable_threat_id(article, title, discovered_at),
            "title": title,
            "description": threat_data.get("description", article_text[:500]),
            "attack_vector": threat_data.get("attack_vector", "Other"),
            "severity": threat_data.get("severity", "MEDIUM"),
            "affected_layer": threat_data.get("affected_layer", "Infrastructure"),
            "cve_refs": threat_data.get("cve_refs", ""),
            "source_name": article.get("source_name", "Unknown"),
            "source_url": article.get("source_url", ""),
            "article_url": article.get("link", article.get("source_url", "")),
            "discovered_at": discovered_at,
            "raw_excerpt": article_text[:500],
        }

        return threat
    
    except Exception as e:
        if ALLOW_MOCK_FALLBACK and USE_MOCK_DATA:
            return _fallback_classify(article)
        print(f"[RESEARCHER ERROR] {str(e)}")
        return None

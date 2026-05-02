import asyncio
import re
from datetime import datetime

import feedparser
import httpx
from bs4 import BeautifulSoup

from config import MAX_ARTICLES_PER_SOURCE

async def scrape_all_sources(sources: list) -> list:
    """
    Scrape all threat sources concurrently.
    
    For each source, fetch the RSS feed and extract articles.
    Returns a list of raw article dicts.
    """
    tasks = []
    for source in sources:
        tasks.append(scrape_single_source(source))
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Flatten results and filter out exceptions
    articles = []
    for result in results:
        if isinstance(result, Exception):
            continue
        if result:
            articles.extend(result)
    
    return articles

async def scrape_single_source(source: dict) -> list:
    """Scrape a single RSS feed source."""
    try:
        source_name = source.get("name", "Unknown")
        source_url = source.get("url", "")

        # Fetch feed content asynchronously, then parse locally.
        async with httpx.AsyncClient(timeout=20.0, follow_redirects=True, headers={
            "User-Agent": "Zero-Day Cartographer/1.0"
        }) as client:
            response = await client.get(source_url)
            response.raise_for_status()

        feed = feedparser.parse(response.text)
        
        if feed.bozo:
            print(f"[SCRAPER WARNING] Feed parsing warning for {source_name}: {feed.bozo_exception}")
        
        articles = []
        for entry in feed.entries[:MAX_ARTICLES_PER_SOURCE]:
            title = entry.get("title", "No Title")
            link = entry.get("link", source_url)
            
            # Extract summary/content
            summary = entry.get("summary", "")
            if not summary and hasattr(entry, "content"):
                summary = entry.content[0].value if entry.content else ""
            
            # Strip HTML tags
            clean_text = strip_html(summary)
            
            # Truncate to 800 characters
            clean_text = clean_text[:800]
            
            # Get published date
            pub_date = entry.get("published", datetime.utcnow().isoformat())
            
            articles.append({
                "source_name": source_name,
                "source_url": source_url,
                "title": title,
                "text": clean_text,
                "pub_date": pub_date,
                "link": link,
                "summary": clean_text,
            })
        
        return articles
    
    except Exception as e:
        print(f"[SCRAPER ERROR] {source.get('name', 'Unknown')}: {str(e)}")
        return []

def strip_html(html_text: str) -> str:
    """Strip HTML tags from text using BeautifulSoup."""
    try:
        soup = BeautifulSoup(html_text, "html.parser")
        text = soup.get_text(separator=" ", strip=True)
        # Clean up multiple spaces
        text = re.sub(r'\s+', ' ', text)
        return text
    except Exception:
        # Fallback: simple regex-based HTML stripping
        text = re.sub(r'<[^>]+>', '', html_text)
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

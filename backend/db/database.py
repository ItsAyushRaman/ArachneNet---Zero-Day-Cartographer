import json
import os
import sqlite3
from datetime import datetime

DB_PATH = os.getenv("DB_PATH", "backend/db/threats.db")

def get_db_connection():
    """Get a thread-safe database connection."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database with the threats table."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS threats (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        attack_vector TEXT NOT NULL,
        severity TEXT NOT NULL,
        affected_layer TEXT NOT NULL,
        cve_refs TEXT,
        source_name TEXT NOT NULL,
        source_url TEXT NOT NULL,
        discovered_at TEXT NOT NULL,
        raw_excerpt TEXT,
        article_url TEXT,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Lightweight migration for older databases created before article_url/updated_at existed.
    cursor.execute("PRAGMA table_info(threats)")
    existing_columns = {row[1] for row in cursor.fetchall()}
    if "article_url" not in existing_columns:
        cursor.execute("ALTER TABLE threats ADD COLUMN article_url TEXT")
    if "updated_at" not in existing_columns:
        cursor.execute("ALTER TABLE threats ADD COLUMN updated_at TEXT")
        cursor.execute("UPDATE threats SET updated_at = ? WHERE updated_at IS NULL", (datetime.utcnow().isoformat(),))
    
    conn.commit()
    conn.close()

def insert_threat(threat_dict):
    """Insert or update a threat in the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
        INSERT INTO threats 
        (id, title, description, attack_vector, severity, affected_layer, 
         cve_refs, source_name, source_url, discovered_at, raw_excerpt, article_url, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            description = excluded.description,
            attack_vector = excluded.attack_vector,
            severity = excluded.severity,
            affected_layer = excluded.affected_layer,
            cve_refs = excluded.cve_refs,
            source_name = excluded.source_name,
            source_url = excluded.source_url,
            discovered_at = excluded.discovered_at,
            raw_excerpt = excluded.raw_excerpt,
            article_url = excluded.article_url,
            updated_at = excluded.updated_at
        """, (
            threat_dict.get("id"),
            threat_dict.get("title"),
            threat_dict.get("description"),
            threat_dict.get("attack_vector"),
            threat_dict.get("severity"),
            threat_dict.get("affected_layer"),
            json.dumps(threat_dict.get("cve_refs", "")) if isinstance(threat_dict.get("cve_refs", ""), (list, tuple)) else threat_dict.get("cve_refs", ""),
            threat_dict.get("source_name"),
            threat_dict.get("source_url"),
            threat_dict.get("discovered_at"),
            threat_dict.get("raw_excerpt"),
            threat_dict.get("article_url", threat_dict.get("source_url")),
            datetime.utcnow().isoformat()
        ))
        conn.commit()
    finally:
        conn.close()


def bulk_upsert_threats(threats):
    """Insert a collection of threats atomically."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        for threat in threats:
            cursor.execute("""
            INSERT INTO threats 
            (id, title, description, attack_vector, severity, affected_layer, 
             cve_refs, source_name, source_url, discovered_at, raw_excerpt, article_url, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                title = excluded.title,
                description = excluded.description,
                attack_vector = excluded.attack_vector,
                severity = excluded.severity,
                affected_layer = excluded.affected_layer,
                cve_refs = excluded.cve_refs,
                source_name = excluded.source_name,
                source_url = excluded.source_url,
                discovered_at = excluded.discovered_at,
                raw_excerpt = excluded.raw_excerpt,
                article_url = excluded.article_url,
                updated_at = excluded.updated_at
            """, (
                threat.get("id"),
                threat.get("title"),
                threat.get("description"),
                threat.get("attack_vector"),
                threat.get("severity"),
                threat.get("affected_layer"),
                json.dumps(threat.get("cve_refs", "")) if isinstance(threat.get("cve_refs", ""), (list, tuple)) else threat.get("cve_refs", ""),
                threat.get("source_name"),
                threat.get("source_url"),
                threat.get("discovered_at"),
                threat.get("raw_excerpt"),
                threat.get("article_url", threat.get("source_url")),
                datetime.utcnow().isoformat()
            ))
        conn.commit()
    finally:
        conn.close()

def get_all_threats():
    """Fetch all threats from the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT * FROM threats ORDER BY discovered_at DESC")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()

def get_threat_by_id(threat_id):
    """Fetch a single threat by ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT * FROM threats WHERE id = ?", (threat_id,))
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        conn.close()

def get_threat_count():
    """Get the total count of threats in the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT COUNT(*) as count FROM threats")
        result = cursor.fetchone()
        return result["count"]
    finally:
        conn.close()

def get_last_updated():
    """Get the timestamp of the most recently discovered threat."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT MAX(discovered_at) as last_updated FROM threats")
        result = cursor.fetchone()
        return result["last_updated"] if result["last_updated"] else None
    finally:
        conn.close()

import sqlite3
import os
from datetime import datetime

DB_PATH = "backend/db/threats.db"

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
        raw_excerpt TEXT
    )
    """)
    
    conn.commit()
    conn.close()

def insert_threat(threat_dict):
    """Insert a threat into the database (INSERT OR IGNORE to prevent duplicates by ID)."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
        INSERT OR IGNORE INTO threats 
        (id, title, description, attack_vector, severity, affected_layer, 
         cve_refs, source_name, source_url, discovered_at, raw_excerpt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            threat_dict.get("id"),
            threat_dict.get("title"),
            threat_dict.get("description"),
            threat_dict.get("attack_vector"),
            threat_dict.get("severity"),
            threat_dict.get("affected_layer"),
            threat_dict.get("cve_refs", ""),
            threat_dict.get("source_name"),
            threat_dict.get("source_url"),
            threat_dict.get("discovered_at"),
            threat_dict.get("raw_excerpt")
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

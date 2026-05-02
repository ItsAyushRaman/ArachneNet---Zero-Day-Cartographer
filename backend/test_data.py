import uuid
from datetime import datetime, timedelta
from models.threat import ThreatNode

# Mock threat data for testing
MOCK_THREATS = [
    {
        "id": str(uuid.uuid4()),
        "title": "SQL Injection in Admin Dashboard",
        "description": "A critical SQL injection vulnerability was discovered in the admin dashboard login endpoint. Attackers can bypass authentication and gain unauthorized access to the entire database.",
        "attack_vector": "SQL Injection",
        "severity": "CRITICAL",
        "affected_layer": "Database",
        "cve_refs": "CVE-2024-1234",
        "source_name": "Krebs on Security",
        "source_url": "https://krebsonsecurity.com",
        "discovered_at": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
        "raw_excerpt": "SQL Injection vulnerability discovered in popular admin framework allowing remote code execution"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Cross-Site Scripting (XSS) Vulnerability",
        "description": "Reflected XSS vulnerability in user comment section allows attackers to execute arbitrary JavaScript in victim browsers. This can lead to session hijacking and credential theft.",
        "attack_vector": "XSS",
        "severity": "HIGH",
        "affected_layer": "Frontend",
        "cve_refs": "CVE-2024-5678",
        "source_name": "The Hacker News",
        "source_url": "https://thehackernews.com",
        "discovered_at": (datetime.utcnow() - timedelta(hours=4)).isoformat(),
        "raw_excerpt": "Reflected XSS found in popular e-commerce platform user feedback form"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "API Authentication Bypass",
        "description": "API endpoints lack proper authentication validation. Attackers can access protected resources without valid tokens by manipulating request headers.",
        "attack_vector": "Auth Bypass",
        "severity": "CRITICAL",
        "affected_layer": "API",
        "cve_refs": "",
        "source_name": "Schneier on Security",
        "source_url": "https://www.schneier.com",
        "discovered_at": (datetime.utcnow() - timedelta(hours=6)).isoformat(),
        "raw_excerpt": "REST API authentication mechanism can be bypassed using modified bearer tokens"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Path Traversal in File Upload",
        "description": "File upload endpoint does not properly sanitize paths, allowing attackers to write files outside the intended upload directory and potentially overwrite critical system files.",
        "attack_vector": "Path Traversal",
        "severity": "HIGH",
        "affected_layer": "API",
        "cve_refs": "CVE-2024-9012",
        "source_name": "CISA Alerts",
        "source_url": "https://www.cisa.gov",
        "discovered_at": (datetime.utcnow() - timedelta(hours=8)).isoformat(),
        "raw_excerpt": "Directory traversal vulnerability in document management system file upload handler"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Cryptographic Weakness in Password Hashing",
        "description": "Passwords are hashed using MD5 which is cryptographically broken. Attackers can perform dictionary and rainbow table attacks to crack passwords offline.",
        "attack_vector": "Cryptographic Weakness",
        "severity": "HIGH",
        "affected_layer": "Auth",
        "cve_refs": "",
        "source_name": "Krebs on Security",
        "source_url": "https://krebsonsecurity.com",
        "discovered_at": (datetime.utcnow() - timedelta(hours=10)).isoformat(),
        "raw_excerpt": "MD5 password hashing deprecated in modern applications due to collision attacks"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "CSRF Token Validation Missing",
        "description": "POST endpoints lack CSRF token validation, allowing attackers to perform unauthorized actions on behalf of authenticated users.",
        "attack_vector": "CSRF",
        "severity": "MEDIUM",
        "affected_layer": "Frontend",
        "cve_refs": "",
        "source_name": "The Hacker News",
        "source_url": "https://thehackernews.com",
        "discovered_at": (datetime.utcnow() - timedelta(hours=12)).isoformat(),
        "raw_excerpt": "Missing CSRF protection allows unauthorized fund transfers and account modifications"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Unvalidated Redirect in OAuth Handler",
        "description": "OAuth redirect_uri parameter is not validated, allowing attackers to redirect users to phishing sites and capture authorization codes.",
        "attack_vector": "SSRF",
        "severity": "MEDIUM",
        "affected_layer": "Auth",
        "cve_refs": "CVE-2024-3456",
        "source_name": "Schneier on Security",
        "source_url": "https://www.schneier.com",
        "discovered_at": (datetime.utcnow() - timedelta(hours=14)).isoformat(),
        "raw_excerpt": "OAuth implementation vulnerable to open redirect attacks via manipulated redirect_uri"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Insufficient Rate Limiting on Login",
        "description": "Login endpoint lacks rate limiting, enabling brute force attacks. Attackers can attempt unlimited password guesses to compromise user accounts.",
        "attack_vector": "DoS",
        "severity": "MEDIUM",
        "affected_layer": "Auth",
        "cve_refs": "",
        "source_name": "CISA Alerts",
        "source_url": "https://www.cisa.gov",
        "discovered_at": (datetime.utcnow() - timedelta(hours=16)).isoformat(),
        "raw_excerpt": "No rate limiting on authentication attempts allows rapid brute force login attempts"
    },
]

def get_mock_threats():
    """Return mock threat data for testing."""
    return MOCK_THREATS

def get_mock_threat_by_id(threat_id: str):
    """Get a single mock threat by ID."""
    for threat in MOCK_THREATS:
        if threat["id"] == threat_id:
            return threat
    return None

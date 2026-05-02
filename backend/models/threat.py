from pydantic import BaseModel
from typing import Optional

class ThreatNode(BaseModel):
    id: str
    title: str
    description: str
    attack_vector: str
    severity: str
    affected_layer: str
    cve_refs: Optional[str] = ""
    source_name: str
    source_url: str
    discovered_at: str
    raw_excerpt: Optional[str] = ""

class GenerateRequest(BaseModel):
    threat_id: str

class GenerateResponse(BaseModel):
    middleware_code: str
    firewall_regex: str
    explanation: str

class StatusResponse(BaseModel):
    threat_count: int
    last_updated: Optional[str] = None
    sources_count: int

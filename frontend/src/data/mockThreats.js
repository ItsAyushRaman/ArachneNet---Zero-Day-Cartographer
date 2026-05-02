import { getAttackKnowledge } from './attackKnowledge.js'

const now = Date.now()
const minutesAgo = (minutes) => new Date(now - minutes * 60 * 1000).toISOString()

const baseThreats = [
  {
    id: 'zdc-001',
    title: 'Middleware bypass exposes protected admin routes',
    severity: 'CRITICAL',
    attack_vector: 'Auth Bypass',
    affected_layer: 'edge-middleware',
    source_name: 'Next.js routing guard',
    source_url: 'https://example.com/threats/zdc-001',
    discovered_at: minutesAgo(12),
    cve_refs: 'CVE-2025-29927',
  },
  {
    id: 'zdc-002',
    title: 'Header-based middleware skip remains reachable',
    severity: 'HIGH',
    attack_vector: 'Auth Bypass',
    affected_layer: 'edge-middleware',
    source_name: 'Reverse proxy',
    source_url: 'https://example.com/threats/zdc-002',
    discovered_at: minutesAgo(28),
    cve_refs: 'CVE-2025-29927',
  },
  {
    id: 'zdc-003',
    title: 'Unsanitized query parameter reaches SQL engine',
    severity: 'HIGH',
    attack_vector: 'SQL Injection',
    affected_layer: 'api',
    source_name: 'Public login endpoint',
    source_url: 'https://example.com/threats/zdc-003',
    discovered_at: minutesAgo(47),
    cve_refs: 'CVE-2024-0001',
  },
  {
    id: 'zdc-004',
    title: 'Blind SQLi pattern detected in search route',
    severity: 'MEDIUM',
    attack_vector: 'SQL Injection',
    affected_layer: 'api',
    source_name: 'Search service',
    source_url: 'https://example.com/threats/zdc-004',
    discovered_at: minutesAgo(63),
    cve_refs: 'CVE-2024-0001',
  },
  {
    id: 'zdc-005',
    title: 'Reflected script payload observed in comment field',
    severity: 'MEDIUM',
    attack_vector: 'XSS',
    affected_layer: 'web-ui',
    source_name: 'Comments widget',
    source_url: 'https://example.com/threats/zdc-005',
    discovered_at: minutesAgo(74),
    cve_refs: 'CVE-2023-9001',
  },
  {
    id: 'zdc-006',
    title: 'Image fetcher can reach cloud metadata endpoint',
    severity: 'CRITICAL',
    attack_vector: 'SSRF',
    affected_layer: 'backend',
    source_name: 'Image proxy',
    source_url: 'https://example.com/threats/zdc-006',
    discovered_at: minutesAgo(92),
    cve_refs: 'CVE-2019-1234',
  },
  {
    id: 'zdc-007',
    title: 'Directory traversal reaches sensitive config files',
    severity: 'HIGH',
    attack_vector: 'Path Traversal',
    affected_layer: 'backend',
    source_name: 'File download API',
    source_url: 'https://example.com/threats/zdc-007',
    discovered_at: minutesAgo(110),
    cve_refs: 'CVE-2021-41773',
  },
  {
    id: 'zdc-008',
    title: 'Malicious package dependency inserted into build chain',
    severity: 'CRITICAL',
    attack_vector: 'Supply Chain',
    affected_layer: 'build-system',
    source_name: 'CI dependency audit',
    source_url: 'https://example.com/threats/zdc-008',
    discovered_at: minutesAgo(135),
    cve_refs: 'CVE-2020-9999',
  },
]

export const MOCK_THREATS = baseThreats.map((threat) => {
  const knowledge = getAttackKnowledge(threat.attack_vector)
  return {
    ...threat,
    description: knowledge.what,
    raw_excerpt: knowledge.how,
  }
})

export const getMockThreatById = (id) => MOCK_THREATS.find((threat) => threat.id === id) || MOCK_THREATS[0]

export const createMockGenerateResult = (threatId) => {
  const threat = getMockThreatById(threatId)
  const vectorSlug = threat.attack_vector.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  return {
    middleware_code: `export function middleware(request) {\n  const url = request.nextUrl.clone()\n  if (request.headers.get('x-middleware-subrequest')) {\n    return new Response('blocked', { status: 403 })\n  }\n  return Response.next()\n}`,
    firewall_regex: `/(${vectorSlug}|${threat.severity.toLowerCase()})/i`,
    explanation: `Offline fallback patch generated for ${threat.title}. Replace this with a backend-generated remediation when the API is available.`,
  }
}

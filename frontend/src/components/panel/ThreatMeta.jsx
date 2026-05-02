import { DataTag, Badge } from '../ui'

export const ThreatMeta = ({ threat }) => {
  const cveRefs = threat.cve_refs ? threat.cve_refs.split(',').map((c) => c.trim()) : []

  return (
    <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
      <div className="data-label" style={{ marginBottom: '8px' }}>
        ATTACK PROFILE
      </div>

      <DataTag label="VECTOR" value={threat.attack_vector} />
      <DataTag label="LAYER" value={threat.affected_layer} accent />
      <DataTag label="SOURCE" value={threat.source_name} />

      {cveRefs.length > 0 && (
        <div style={{ marginTop: '12px', marginBottom: '12px' }}>
          <div className="data-label" style={{ marginBottom: '6px' }}>
            CVE REFERENCES
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {cveRefs.map((cve) => (
              <Badge key={cve} variant="vector" size="sm">
                {cve}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '12px' }}>
        <DataTag
          label="DETECTED"
          value={new Date(threat.discovered_at).toISOString().replace('T', ' ').slice(0, 19) + ' UTC'}
        />
      </div>

      <a
        href={threat.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="nb-btn"
        style={{
          width: '100%',
          justifyContent: 'center',
          marginTop: '8px',
          fontSize: '0.65rem',
          textDecoration: 'none',
          color: 'var(--text-primary)',
          display: 'flex',
        }}
      >
        ↗ VIEW SOURCE
      </a>
    </div>
  )
}

export default ThreatMeta

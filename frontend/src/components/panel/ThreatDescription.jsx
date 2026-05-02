export const ThreatDescription = ({ threat }) => {
  return (
    <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
      <div className="data-label" style={{ marginBottom: '8px' }}>
        THREAT ANALYSIS
      </div>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
        }}
      >
        {threat.description}
      </p>
      {threat.raw_excerpt && (
        <div
          style={{
            marginTop: '12px',
            padding: '10px',
            background: 'var(--bg-base)',
            border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-data)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
          }}
        >
          <div className="terminal-line" style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>
            RAW EXCERPT
          </div>
          {threat.raw_excerpt}
        </div>
      )}
    </div>
  )
}

export default ThreatDescription

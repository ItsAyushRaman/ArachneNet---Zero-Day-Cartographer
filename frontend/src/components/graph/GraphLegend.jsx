export const GraphLegend = () => {
  const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
  const severityColors = {
    CRITICAL: 'var(--severity-critical)',
    HIGH: 'var(--severity-high)',
    MEDIUM: 'var(--severity-medium)',
    LOW: 'var(--severity-low)',
  }

  return (
    <div
      className="nb-card-sm"
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 20,
        padding: '10px 14px',
        fontFamily: 'var(--font-data)',
        fontSize: '0.65rem',
      }}
    >
      <div style={{ marginBottom: '8px', fontWeight: 700 }}>THREAT SEVERITY</div>
      {severities.map((severity) => (
        <div
          key={severity}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px',
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              background: severityColors[severity],
              border: '1px solid var(--border-color)',
            }}
          />
          <span>{severity}</span>
        </div>
      ))}
    </div>
  )
}

export default GraphLegend

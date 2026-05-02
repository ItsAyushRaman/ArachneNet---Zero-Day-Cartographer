import { Badge } from '../ui'

export const ThreatHeader = ({ threat, onClose }) => {
  return (
    <div
      style={{
        padding: '16px',
        borderBottom: '2px solid var(--border-color)',
        background: 'var(--bg-elevated)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div>
        <Badge variant={threat.severity.toLowerCase()} size="md">
          {threat.severity}
        </Badge>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.3rem',
            letterSpacing: '0.05em',
            marginTop: '6px',
            lineHeight: 1.1,
          }}
        >
          {threat.title.toUpperCase()}
        </h2>
      </div>
      <button
        onClick={onClose}
        className="nb-btn"
        style={{ padding: '4px 8px', marginLeft: '8px', flexShrink: 0 }}
      >
        ×
      </button>
    </div>
  )
}

export default ThreatHeader

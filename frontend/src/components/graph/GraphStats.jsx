import ProgressBar from '../ui/ProgressBar'
import useCountUp from '../../hooks/useCountUp'

const severityColor = (sev) => {
  const map = {
    CRITICAL: 'var(--severity-critical)',
    HIGH: 'var(--severity-high)',
    MEDIUM: 'var(--severity-medium)',
    LOW: 'var(--severity-low)',
  }
  return map[sev] || 'var(--text-2)'
}

function SeverityRow({ severity, count, total, index }) {
  const animatedCount = useCountUp(count, 600)
  const pct = total ? Math.round((count / total) * 100) : 0

  return (
    <div
      style={{
        marginBottom: 8,
        animationDelay: `${index * 80}ms`,
        animation: 'stagger-in 300ms ease both',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span className="data-label" style={{ color: severityColor(severity) }}>
          {severity}
        </span>
        <span className="data-value">{animatedCount}</span>
      </div>
      <ProgressBar value={pct} color={severityColor(severity)} animated={false} />
    </div>
  )
}

export default function GraphStats({ threats = [] }) {
  if (!threats || threats.length === 0) return null

  return (
    <div
      className="nb-card-sm"
      style={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 20,
        padding: '10px 14px',
        minWidth: 160,
      }}
    >
      <div className="data-label" style={{ marginBottom: 8 }}>
        THREAT MATRIX
      </div>
      {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((severity, index) => {
        const count = threats.filter((threat) => threat.severity === severity).length
        return <SeverityRow key={severity} severity={severity} count={count} total={threats.length} index={index} />
      })}
    </div>
  )
}

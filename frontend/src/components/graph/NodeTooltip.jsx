import Badge from '../ui/Badge.jsx'
import { truncate } from '../../utils/formatters.js'

export default function NodeTooltip({ node, x, y, visible }) {
  if (!node || !visible) return null
  const sev = (node.severity || 'LOW').toLowerCase()
  return (
    <div className="nb-card-sm" style={{
      position: 'fixed', left: x + 18, top: y + 18,
      zIndex: 'var(--z-tooltip)', minWidth: 160, maxWidth: 220,
      padding: '8px 11px', pointerEvents: 'none',
      animation: 'fade-in 100ms ease both',
    }}>
      <Badge variant={sev} size="sm" style={{ marginBottom: 5 }}>{node.severity}</Badge>
      <div style={{ fontFamily: 'var(--f-mono)', fontSize: '0.65rem', lineHeight: 1.35,
                    marginBottom: 4 }}>
        {truncate(node.name, 38)}
      </div>
      <div className="data-label" style={{ marginBottom: 4 }}>
        {node.attack_vector}
      </div>
      <div style={{ fontFamily: 'var(--f-data)', fontSize: '0.52rem', color: 'var(--cyan)' }}>
        CLICK TO INVESTIGATE →
      </div>
    </div>
  )
}

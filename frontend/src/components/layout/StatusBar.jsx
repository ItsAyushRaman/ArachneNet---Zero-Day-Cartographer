import Button from '../ui/Button.jsx'
import { SEVERITIES, getSeverityHex } from '../../utils/severity.js'
import { formatISO } from '../../utils/formatters.js'
import useCountUp from '../../hooks/useCountUp.js'

export default function StatusBar({ threats = [], sourcesCount = 4, lastUpdated, connected = false, onRefresh, refreshing }) {
  const totalCount = useCountUp(threats.length)
  const counts = Object.fromEntries(
    SEVERITIES.map(s => [s, threats.filter(t => t.severity === s).length])
  )

  return (
    <footer style={{
      height: 32, flexShrink: 0,
      background: 'var(--bg-surface)',
      borderTop: '2px solid var(--border-col)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 14px',
      fontFamily: 'var(--f-data)', fontSize: '0.55rem', letterSpacing: '0.07em',
      zIndex: 'var(--z-header)',
    }}>
      {/* LEFT — counts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span>
          <span style={{ color: 'var(--green)' }}>●</span>
          &nbsp;THREATS: <strong>{totalCount}</strong>
        </span>
        {SEVERITIES.map(s => (
          <span key={s} style={{ color: getSeverityHex(s) }}>
            {s.slice(0, 4)}: <strong>{counts[s]}</strong>
          </span>
        ))}
      </div>

      {/* CENTER */}
      <span style={{ color: 'var(--t3)' }}>
        MONITORING: {sourcesCount} FEEDS
      </span>

      {/* RIGHT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: connected ? 'var(--green)' : 'var(--orange)' }}>
          {connected ? 'LIVE' : 'POLLING'}
        </span>
        <span style={{ color: 'var(--t3)' }}>
          LAST: {lastUpdated ? formatISO(lastUpdated.toISOString()) : 'PENDING'}
        </span>
        <Button size="xs" loading={refreshing} onClick={onRefresh}>↺ REFRESH</Button>
      </div>
    </footer>
  )
}

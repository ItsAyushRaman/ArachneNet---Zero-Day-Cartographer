import { useRef, useState } from 'react'
import { getSeverityHex } from '../../utils/severity.js'
import { truncate, formatDate } from '../../utils/formatters.js'

export default function ThreatTicker({ threats = [] }) {
  const [paused, setPaused] = useState(false)
  const items = threats.length ? threats : [
    { id: 'x1', title: 'No threats indexed yet — trigger /api/refresh', severity: 'LOW', attack_vector: 'SYSTEM', discovered_at: new Date().toISOString() }
  ]
  const doubled = [...items, ...items]
  const duration = Math.max(20, items.length * 6)

  return (
    <div style={{
      height: 26, flexShrink: 0,
      background: 'var(--bg-base)',
      borderBottom: '2px solid var(--border-col)',
      overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center',
    }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Fade masks */}
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:50, zIndex:2, pointerEvents:'none',
                    background:'linear-gradient(to right, var(--bg-base), transparent)' }} />
      <div style={{ position:'absolute', right:0, top:0, bottom:0, width:50, zIndex:2, pointerEvents:'none',
                    background:'linear-gradient(to left, var(--bg-base), transparent)' }} />

      <div style={{
        display: 'flex', whiteSpace: 'nowrap', alignItems: 'center',
        '--ticker-duration': `${duration}s`,
      }} className={`ticker-track${paused ? ' is-paused' : ''}`}>
        {doubled.map((t, i) => (
          <span key={`${t.id}-${i}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '0 22px',
            borderRight: '1px solid var(--border-dim)',
            fontFamily: 'var(--f-data)', fontSize: '0.58rem',
          }}>
            <span style={{ fontSize: 7, color: getSeverityHex(t.severity) }}>●</span>
            <span style={{ color: 'var(--t3)' }}>{t.attack_vector}</span>
            <span style={{ color: 'var(--t1)' }}>{truncate(t.title, 42)}</span>
            <span style={{ color: 'var(--t3)' }}>[{formatDate(t.discovered_at)}]</span>
          </span>
        ))}
      </div>
    </div>
  )
}

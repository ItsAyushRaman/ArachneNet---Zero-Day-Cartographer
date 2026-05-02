import { useState, useEffect } from 'react'
import { GlitchText, ThemeToggle, BlinkCursor } from '../ui/index.js'
import { formatLiveClock } from '../../utils/formatters.js'

export default function Header() {
  const [clock, setClock] = useState(formatLiveClock())

  useEffect(() => {
    const iv = setInterval(() => setClock(formatLiveClock()), 1000)
    return () => clearInterval(iv)
  }, [])

  return (
    <header style={{
      height: 52, flexShrink: 0,
      background: 'var(--bg-surface)',
      borderBottom: '2px solid var(--border-col)',
      boxShadow: '0 2px 0 var(--border-col)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 18px',
      zIndex: 'var(--z-header)',
      position: 'relative',
    }}>
      {/* LEFT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 10, height: 10,
          background: 'var(--red)',
          border: '1.5px solid var(--border-col)',
          animation: 'pulse-dot 1.2s ease-in-out infinite',
          flexShrink: 0,
        }} />
        <GlitchText
          text="ZERO-DAY CARTOGRAPHER"
          style={{ fontFamily: 'var(--f-display)', fontSize: '0.9rem', letterSpacing: '0.18em' }}
        />
        <BlinkCursor color="var(--green)" />
        <span style={{
          fontFamily: 'var(--f-data)', fontSize: '0.5rem',
          color: 'var(--t3)', border: '1px solid var(--border-dim)',
          padding: '1px 5px', letterSpacing: '0.08em',
        }}>v3.0.0-ALIVE</span>
      </div>

      {/* RIGHT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--f-data)', fontSize: '0.58rem', color: 'var(--amber)' }}>
          {clock}
        </span>
        <span style={{ fontFamily: 'var(--f-data)', fontSize: '0.52rem',
                       color: 'var(--green)', letterSpacing: '0.12em' }}>
          SYS:ONLINE
        </span>
        <ThemeToggle />
        <span style={{
          fontFamily: 'var(--f-data)', fontSize: '0.5rem', padding: '3px 8px',
          border: '1.5px solid var(--green)', color: 'var(--green)', letterSpacing: '0.1em',
          animation: 'agent-thinking 2s linear infinite',
        }}>
          AGENTS ACTIVE
        </span>
      </div>
    </header>
  )
}

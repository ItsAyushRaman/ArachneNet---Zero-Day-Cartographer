import Header from './Header.jsx'
import ThreatTicker from './ThreatTicker.jsx'
import StatusBar from './StatusBar.jsx'

export default function AppShell({ children, threats, statusProps }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden',
      background: 'var(--bg-base)',
    }}>
      <Header />
      <ThreatTicker threats={threats} />
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex' }}>
        {children}
      </main>
      <StatusBar {...statusProps} />
    </div>
  )
}

import ThreatHeader from './ThreatHeader.jsx'
import ThreatMeta from './ThreatMeta.jsx'
import ThreatDescription from './ThreatDescription.jsx'
import AttackExplainer from './AttackExplainer.jsx'
import GenerateButton from './GenerateButton.jsx'
import AgentStatusLog from './AgentStatusLog.jsx'
import CodeOutput from '../code/CodeOutput.jsx'
import { useEffect } from 'react'

export default function ThreatPanel({ threat, onClose, generateResult, generating, genError, onGenerate }) {
  // Close on Escape key
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  // Detect mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <div
      key={threat.id}
      style={{
        width: isMobile ? '100%' : 440,
        flexShrink: 0,
        background: 'var(--bg-surface)',
        borderLeft: isMobile ? 'none' : '2px solid var(--border-col)',
        borderTop: isMobile ? '2px solid var(--border-col)' : 'none',
        boxShadow: isMobile ? '0 -4px 0 var(--border-col)' : '-4px 0 0 var(--border-col)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        position: isMobile ? 'fixed' : 'relative',
        ...(isMobile ? { left: 0, right: 0, bottom: 32, height: '70vh', zIndex: 'var(--z-panel)' } : {}),
        animation: isMobile
          ? 'slam-in-up 320ms cubic-bezier(0.34,1.56,0.64,1) both'
          : 'slam-in-right 320ms cubic-bezier(0.34,1.56,0.64,1) both',
      }}
    >
      <ThreatHeader threat={threat} onClose={onClose} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 14px 16px' }}>
        <ThreatMeta threat={threat} />
        <ThreatDescription threat={threat} />
        <AttackExplainer attackVector={threat.attack_vector} />
        <GenerateButton
          onGenerate={() => onGenerate(threat.id)}
          generating={generating}
          hasResult={!!generateResult}
        />
        <AgentStatusLog generating={generating} result={generateResult} error={genError} />
        {generateResult && <CodeOutput result={generateResult} />}
      </div>
    </div>
  )
}

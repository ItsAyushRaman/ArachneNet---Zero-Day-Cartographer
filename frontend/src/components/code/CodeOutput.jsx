import { useState } from 'react'
import CodeTab from './CodeTab'

export const CodeOutput = ({ result }) => {
  const [activeTab, setActiveTab] = useState('middleware')

  const code =
    activeTab === 'middleware' ? result.middleware_code : result.firewall_regex

  return (
    <div
      style={{
        marginTop: '16px',
        border: '2px solid var(--border-color)',
        boxShadow: 'var(--shadow-hard)',
      }}
    >
      <div
        style={{
          display: 'flex',
          borderBottom: '2px solid var(--border-color)',
        }}
      >
        {['middleware', 'firewall'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '8px',
              fontFamily: 'var(--font-data)',
              fontSize: '0.65rem',
              textTransform: 'uppercase',
              fontWeight: 700,
              border: 'none',
              borderRight: tab === 'middleware' ? '2px solid var(--border-color)' : 'none',
              background: activeTab === tab ? 'var(--accent-yellow)' : 'var(--bg-elevated)',
              color: activeTab === tab ? 'var(--text-inverse)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 80ms ease',
            }}
          >
            {tab === 'middleware' ? 'Next.js Middleware' : 'Firewall Regex'}
          </button>
        ))}
      </div>

      <CodeTab
        code={code}
        language={activeTab === 'middleware' ? 'typescript' : 'regex'}
      />

      <div
        style={{
          padding: '8px 12px',
          background: 'var(--bg-base)',
          borderTop: '1px solid var(--border-color)',
          fontFamily: 'var(--font-data)',
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ color: 'var(--accent-green)' }}>// </span>
        {result.explanation}
      </div>
    </div>
  )
}

export default CodeOutput

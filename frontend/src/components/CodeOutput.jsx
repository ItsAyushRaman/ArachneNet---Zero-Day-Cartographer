import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './CodeOutput.css'

const CodeOutput = ({ code }) => {
  const [activeTab, setActiveTab] = useState('middleware')
  const [copiedTab, setCopiedTab] = useState(null)

  const copyToClipboard = (text, tab) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedTab(tab)
      setTimeout(() => setCopiedTab(null), 2000)
    })
  }

  const middlewareCode = code.middleware_code || ''
  const firewallRegex = code.firewall_regex || ''
  const explanation = code.explanation || ''

  return (
    <div className="code-output fade-in">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'middleware' ? 'active' : ''}`}
          onClick={() => setActiveTab('middleware')}
        >
          Next.js Middleware
        </button>
        <button
          className={`tab ${activeTab === 'firewall' ? 'active' : ''}`}
          onClick={() => setActiveTab('firewall')}
        >
          Firewall Regex
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'middleware' && (
          <div className="code-section">
            <div className="code-header">
              <span className="code-label">TypeScript</span>
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(middlewareCode, 'middleware')}
              >
                {copiedTab === 'middleware' ? '✓ COPIED' : 'COPY'}
              </button>
            </div>
            <SyntaxHighlighter language="typescript" style={atomDark} className="code-block">
              {middlewareCode}
            </SyntaxHighlighter>
          </div>
        )}

        {activeTab === 'firewall' && (
          <div className="code-section">
            <div className="code-header">
              <span className="code-label">Regex</span>
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(firewallRegex, 'firewall')}
              >
                {copiedTab === 'firewall' ? '✓ COPIED' : 'COPY'}
              </button>
            </div>
            <SyntaxHighlighter language="regex" style={atomDark} className="code-block">
              {firewallRegex}
            </SyntaxHighlighter>
          </div>
        )}
      </div>

      <div className="explanation">
        <p className="explanation-label">Explanation:</p>
        <p className="explanation-text">{explanation}</p>
      </div>
    </div>
  )
}

export default CodeOutput

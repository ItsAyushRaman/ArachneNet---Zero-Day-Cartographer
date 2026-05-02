import React, { useState } from 'react'
import axios from 'axios'
import CodeOutput from './CodeOutput'
import './ThreatPanel.css'

const ThreatPanel = ({ threat, onClose }) => {
  const [generatedCode, setGeneratedCode] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const severityColorClass = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'severity-critical'
      case 'HIGH':
        return 'severity-high'
      case 'MEDIUM':
        return 'severity-medium'
      case 'LOW':
        return 'severity-low'
      default:
        return 'severity-default'
    }
  }

  const handleGeneratePatch = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post('http://localhost:8000/api/generate', {
        threat_id: threat.id,
      })

      setGeneratedCode(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to generate patch')
      console.error('Error generating patch:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!threat) return null

  const cveRefs = threat.cve_refs ? threat.cve_refs.split(',').filter((c) => c.trim()) : []
  const discoveredDate = new Date(threat.discovered_at)
  const formattedDate = discoveredDate.toLocaleString()

  return (
    <div className="threat-panel slide-in-right">
      <div className="panel-header">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="panel-content">
        <div className={`severity-badge ${severityColorClass(threat.severity)}`}>
          {threat.severity}
        </div>

        <h2 className="threat-title">{threat.title}</h2>

        <div className="threat-tags">
          <span className="tag">{threat.attack_vector}</span>
          <span className="tag">{threat.affected_layer}</span>
        </div>

        <p className="threat-description">{threat.description}</p>

        {cveRefs.length > 0 && (
          <div className="cve-section">
            <p className="section-label">CVE References:</p>
            <div className="cve-tags">
              {cveRefs.map((cve) => (
                <span key={cve.trim()} className="cve-tag">
                  {cve.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="source-section">
          <p className="section-label">Source:</p>
          <a href={threat.source_url} target="_blank" rel="noopener noreferrer" className="source-link">
            {threat.source_name}
          </a>
        </div>

        <p className="discovered-time">Discovered: {formattedDate}</p>

        <button
          className="generate-btn"
          onClick={handleGeneratePatch}
          disabled={loading}
        >
          {loading ? 'GENERATING...' : 'GENERATE PATCH'}
        </button>

        {error && <div className="error-message">{error}</div>}

        {generatedCode && <CodeOutput code={generatedCode} />}
      </div>
    </div>
  )
}

export default ThreatPanel

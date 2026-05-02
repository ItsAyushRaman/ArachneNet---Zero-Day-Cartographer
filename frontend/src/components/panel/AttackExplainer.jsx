import { useState } from 'react';
import { getAttackKnowledge } from '../../data/attackKnowledge';
import ProgressBar from '../ui/ProgressBar';
import Button from '../ui/Button';

const InfoSection = ({ label, content, color }) => (
  <div style={{ marginBottom: 10 }}>
    <div
      className="data-label"
      style={{
        color: color || 'var(--text-3)',
        marginBottom: 4
      }}
    >
      {label}
    </div>
    <p
      style={{
        fontFamily: 'var(--f-mono)',
        fontSize: '0.7rem',
        lineHeight: 1.6,
        color: 'var(--text-2)',
        margin: 0
      }}
    >
      {content}
    </p>
  </div>
);

export default function AttackExplainer({ attackVector }) {
  const [expanded, setExpanded] = useState(false);
  const knowledge = getAttackKnowledge(attackVector);

  return (
    <div style={{ marginBottom: 12 }}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          justifyContent: 'space-between',
          padding: '8px 12px'
        }}
      >
        <span>
          <span style={{ marginRight: 8 }}>{knowledge.icon}</span>
          UNDERSTAND THIS ATTACK
        </span>
        <span>{expanded ? '▲ COLLAPSE' : '▼ EXPAND'}</span>
      </Button>

      {expanded && (
        <div
          style={{
            padding: '12px',
            background: 'var(--bg-base)',
            border: '2px solid var(--border)',
            borderTop: 'none',
            animation: 'slide-down 200ms ease'
          }}
        >
          {/* Tagline */}
          <div
            style={{
              fontFamily: 'var(--f-headline)',
              fontSize: '1.1rem',
              letterSpacing: '0.08em',
              color: 'var(--yellow)',
              marginBottom: 12
            }}
          >
            "{knowledge.tagline}"
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <div className="nb-card-sm" style={{ flex: 1, padding: '6px 10px' }}>
              <div className="data-label">DIFFICULTY</div>
              <ProgressBar value={knowledge.difficulty * 20} color="var(--orange)" />
            </div>
            <div className="nb-card-sm" style={{ flex: 1, padding: '6px 10px' }}>
              <div className="data-label">PREVALENCE</div>
              <ProgressBar value={knowledge.prevalence * 20} color="var(--red)" />
            </div>
            <div className="nb-card-sm" style={{ flex: 1, padding: '6px 10px' }}>
              <div className="data-label">CVSS RANGE</div>
              <div className="data-value">{knowledge.cvssRange}</div>
            </div>
          </div>

          {/* Sections */}
          <InfoSection label="WHAT IT IS" content={knowledge.what} color="var(--cyan)" />
          <InfoSection label="HOW IT WORKS" content={knowledge.how} color="var(--yellow)" />
          <InfoSection label="IMPACT" content={knowledge.impact} color="var(--red)" />
          <InfoSection label="DEFENSE" content={knowledge.defend} color="var(--green)" />

          {/* Real world case */}
          <div
            style={{
              marginTop: 12,
              padding: '8px 10px',
              border: '2px solid var(--amber)',
              background: 'var(--bg-base)'
            }}
          >
            <div className="data-label" style={{ color: 'var(--amber)', marginBottom: 4 }}>
              ⚡ REAL-WORLD INCIDENT
            </div>
            <div
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: '0.7rem',
                lineHeight: 1.6,
                color: 'var(--text-2)'
              }}
            >
              {knowledge.realWorld}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

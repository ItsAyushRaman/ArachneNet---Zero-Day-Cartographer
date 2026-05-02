import { useState, useEffect } from 'react';

const logLines = [
  { text: '› ENGINEER AGENT INITIALIZED', color: 'var(--green)' },
  { text: '› PARSING THREAT SCHEMA...', color: 'var(--cyan)' },
  { text: '› ANALYZING ATTACK VECTOR', color: 'var(--cyan)' },
  { text: '› GENERATING MIDDLEWARE PATTERN...', color: 'var(--yellow)' },
  { text: '› COMPILING FIREWALL RULE...', color: 'var(--yellow)' }
];

export default function AgentStatusLog({ generating, result, error }) {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!generating) {
      setVisibleLines(0);
      return;
    }

    setVisibleLines(0);
    let line = 0;
    const iv = setInterval(() => {
      line++;
      setVisibleLines(Math.min(line, logLines.length));
      if (line >= logLines.length) clearInterval(iv);
    }, 600);

    return () => clearInterval(iv);
  }, [generating]);

  if (!generating && !result) return null;

  return (
    <div
      style={{
        background: 'var(--bg-code)',
        border: '2px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        padding: '10px 12px',
        marginTop: 12,
        fontFamily: 'var(--f-data)',
        fontSize: '0.65rem',
        lineHeight: 2,
        maxHeight: generating ? 'auto' : 0,
        overflow: 'hidden',
        transition: 'max-height 300ms ease',
        color: 'var(--green)'
      }}
    >
      {logLines.slice(0, visibleLines).map((line, i) => (
        <div key={i} style={{ color: line.color }}>
          {line.text}
        </div>
      ))}
      {result && (
        <div style={{ color: 'var(--green)', marginTop: 4 }}>
          › PATCH GENERATED [SUCCESS]
        </div>
      )}
      {error && (
        <div style={{ color: 'var(--red)', marginTop: 4 }}>
          › GENERATION FAILED [ERROR]
        </div>
      )}
    </div>
  );
}

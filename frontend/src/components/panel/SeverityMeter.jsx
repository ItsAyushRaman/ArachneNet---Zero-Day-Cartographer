export default function SeverityMeter({ severity }) {
  const levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const activeIndex = levels.indexOf(severity);

  const levelHeights = [20, 30, 42, 56];
  const levelColors = {
    LOW: 'var(--sev-low)',
    MEDIUM: 'var(--sev-medium)',
    HIGH: 'var(--sev-high)',
    CRITICAL: 'var(--sev-critical)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
        {levels.map((level, i) => (
          <div
            key={level}
            style={{
              width: 18,
              height: levelHeights[i],
              border: '2px solid var(--border)',
              background: i <= activeIndex ? levelColors[level] : 'var(--bg-overlay)',
              animation: i <= activeIndex && level === 'CRITICAL' ? 'pulse-critical 1.5s infinite' : 'none'
            }}
          />
        ))}
      </div>
      <div className="data-label">{severity} SEVERITY</div>
    </div>
  );
}

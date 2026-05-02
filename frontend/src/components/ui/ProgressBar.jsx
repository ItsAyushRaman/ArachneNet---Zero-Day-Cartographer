export default function ProgressBar({
  value = 0,
  color = 'var(--green)',
  label,
  animated = true
}) {
  return (
    <div>
      {label && <div className="data-label" style={{ marginBottom: 4 }}>{label} [{value}%]</div>}
      <div
        style={{
          width: '100%',
          height: 16,
          border: `var(--border-w) solid var(--border)`,
          boxShadow: 'var(--shadow-xs)',
          background: 'var(--bg-base)',
          borderRadius: 0,
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.min(value, 100)}%`,
            background: color,
            transition: animated ? 'width 600ms ease' : 'none',
            borderRight: value < 100 ? `2px solid var(--border)` : 'none'
          }}
        />
      </div>
    </div>
  );
}

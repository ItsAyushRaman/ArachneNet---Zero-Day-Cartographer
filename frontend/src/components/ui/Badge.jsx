export const Badge = ({ variant, children, size = 'sm' }) => {
  const variantStyles = {
    critical: { background: 'var(--severity-critical)', color: '#ffffff' },
    high: { background: 'var(--severity-high)', color: 'var(--text-inverse)' },
    medium: { background: 'var(--severity-medium)', color: '#ffffff' },
    low: { background: 'var(--severity-low)', color: 'var(--text-inverse)' },
    vector: {
      background: 'var(--bg-overlay)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
    },
    layer: {
      background: 'var(--bg-overlay)',
      color: 'var(--accent-cyan)',
      border: '1px solid var(--border-color)',
    },
  }

  const sizeStyles = {
    sm: { fontSize: '0.6rem', padding: '2px 8px' },
    md: { fontSize: '0.7rem', padding: '4px 12px' },
  }

  const style = {
    fontFamily: 'var(--font-data)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    border: '1px solid var(--border-color)',
    display: 'inline-flex',
    borderRadius: 0,
    ...variantStyles[variant],
    ...sizeStyles[size],
  }

  return <span style={style}>{children}</span>
}

export default Badge

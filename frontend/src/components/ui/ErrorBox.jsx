export const ErrorBox = ({ message, onDismiss, style }) => {
  return (
    <div
      style={{
        border: '2px solid var(--accent-red)',
        background: 'var(--bg-surface)',
        boxShadow: '4px 4px 0px var(--accent-red)',
        padding: '12px 16px',
        fontFamily: 'var(--font-data)',
        fontSize: '0.75rem',
        ...style,
      }}
    >
      <div style={{ color: 'var(--accent-red)', marginBottom: '4px' }}>[ERROR]</div>
      <div style={{ color: 'var(--text-primary)', marginBottom: onDismiss ? '8px' : 0 }}>
        {message}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-red)',
            cursor: 'pointer',
            fontSize: '0.65rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            fontFamily: 'var(--font-data)',
          }}
        >
          × DISMISS
        </button>
      )}
    </div>
  )
}

export default ErrorBox

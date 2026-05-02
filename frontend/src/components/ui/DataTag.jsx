export const DataTag = ({ label, value, accent = false }) => {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
      <span className="data-label">{label}:</span>
      <span
        className="data-value"
        style={accent ? { color: 'var(--accent-cyan)' } : {}}
      >
        {value}
      </span>
    </div>
  )
}

export default DataTag

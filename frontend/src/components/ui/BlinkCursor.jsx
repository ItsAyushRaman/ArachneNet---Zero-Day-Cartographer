export const BlinkCursor = () => {
  return (
    <span
      style={{
        animation: 'blink 1s step-end infinite',
        fontFamily: 'var(--font-data)',
      }}
    >
      _
    </span>
  )
}

export default BlinkCursor

import BlinkCursor from './BlinkCursor'

export const Spinner = () => {
  return (
    <span
      style={{
        fontFamily: 'var(--font-data)',
        color: 'var(--accent-green)',
        fontSize: '0.75rem',
      }}
    >
      [PROCESSING<BlinkCursor />]
    </span>
  )
}

export default Spinner

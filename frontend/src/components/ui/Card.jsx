export const Card = ({ children, className, elevated = false, style }) => {
  const cardClass = elevated ? 'nb-card' : 'nb-card-sm'
  const animation = elevated ? { animation: 'pulse-glow-red 2s infinite' } : {}

  return (
    <div className={`${cardClass} ${className || ''}`} style={{ ...animation, ...style }}>
      {children}
    </div>
  )
}

export default Card

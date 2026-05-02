import Spinner from './Spinner'

export const Button = ({ variant = 'default', size = 'md', loading = false, children, ...rest }) => {
  const sizeStyles = {
    sm: { padding: '4px 12px', fontSize: '0.65rem' },
    md: { padding: '8px 16px', fontSize: '0.75rem' },
    lg: { padding: '12px 24px', fontSize: '1rem' },
  }

  const variantClass =
    variant === 'primary'
      ? 'nb-btn--primary'
      : variant === 'danger'
        ? 'nb-btn--danger'
        : ''

  return (
    <button
      className={`nb-btn ${variantClass}`}
      disabled={loading}
      style={{
        ...sizeStyles[size],
      }}
      {...rest}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
}

export default Button

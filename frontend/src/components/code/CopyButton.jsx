import { useState } from 'react'

export const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      className="nb-btn"
      onClick={handleCopy}
      style={{
        fontSize: '0.6rem',
        padding: '2px 8px',
        position: 'absolute',
        top: '8px',
        right: '8px',
        zIndex: 10,
        background: copied ? 'var(--accent-green)' : 'var(--bg-surface)',
        color: copied ? 'var(--text-inverse)' : 'var(--text-primary)',
      }}
    >
      {copied ? '✓ COPIED' : '⎘ COPY'}
    </button>
  )
}

export default CopyButton

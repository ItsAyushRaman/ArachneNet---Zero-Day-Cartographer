import { useState } from 'react';

export default function Tooltip({ content, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex'
      }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: 0,
            zIndex: 'var(--z-tooltip)',
            minWidth: 200,
            maxWidth: 280,
            background: 'var(--bg-elevated)',
            border: '2px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
            padding: '8px 10px',
            fontFamily: 'var(--f-data)',
            fontSize: '0.65rem',
            color: 'var(--text-2)',
            whiteSpace: 'normal',
            lineHeight: 1.5,
            opacity: 1,
            pointerEvents: 'none',
            transition: 'opacity 150ms ease'
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}

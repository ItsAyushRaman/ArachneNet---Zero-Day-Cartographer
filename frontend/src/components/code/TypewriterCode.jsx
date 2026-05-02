import useTypewriter from '../../hooks/useTypewriter';
import BlinkCursor from '../ui/BlinkCursor';

export default function TypewriterCode({ code, speed = 4 }) {
  const { displayed, done } = useTypewriter(code, speed, true);

  if (!done) {
    return (
      <pre
        style={{
          fontFamily: 'var(--f-data)',
          fontSize: '0.72rem',
          lineHeight: 1.6,
          background: 'var(--bg-code)',
          padding: '12px',
          margin: 0,
          color: 'var(--green)',
          overflowX: 'auto',
          borderTop: '2px solid var(--border-dim)',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}
      >
        {displayed}
        <BlinkCursor color="var(--green)" />
      </pre>
    );
  }

  return (
    <pre
      style={{
        fontFamily: 'var(--f-data)',
        fontSize: '0.72rem',
        lineHeight: 1.6,
        background: 'var(--bg-code)',
        padding: '12px',
        margin: 0,
        color: 'var(--green)',
        overflowX: 'auto',
        borderTop: '2px solid var(--border-dim)',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word'
      }}
    >
      {code}
    </pre>
  );
}

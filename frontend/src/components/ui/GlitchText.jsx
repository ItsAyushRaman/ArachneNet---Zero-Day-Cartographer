import { useRef } from 'react';

export default function GlitchText({ text, className, triggerOnMount = true }) {
  const id = useRef(`glitch-${Math.random().toString(36).slice(2)}`);

  return (
    <span
      className={id.current}
      style={{
        position: 'relative',
        display: 'inline-block',
        ...(className && { className })
      }}
    >
      {text}
      <style>{`
        .${id.current}::before {
          content: "${text}";
          position: absolute;
          inset: 0;
          animation: ${triggerOnMount ? 'glitch-1 0.3s steps(1) 0.5s 3 both' : 'none'};
          color: var(--cyan);
        }
        .${id.current}::after {
          content: "${text}";
          position: absolute;
          inset: 0;
          animation: ${triggerOnMount ? 'glitch-2 0.3s steps(1) 0.6s 3 both' : 'none'};
        }
      `}</style>
    </span>
  );
}

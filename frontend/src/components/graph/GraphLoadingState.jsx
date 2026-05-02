import BlinkCursor from '../ui/BlinkCursor';

export default function GraphLoadingState() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
        gap: 16
      }}
    >
      {/* Radar circle animation */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: '2px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Sweep line */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '50%',
            height: '2px',
            background: 'linear-gradient(to right, var(--green), transparent)',
            transformOrigin: 'left center',
            animation: 'radar-sweep 2s linear infinite'
          }}
        />
        {/* Center dot */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 6,
            height: 6,
            background: 'var(--green)',
            border: '1px solid var(--border)'
          }}
        />
      </div>

      <div
        style={{
          fontFamily: 'var(--f-display)',
          fontSize: '1rem',
          letterSpacing: '0.2em',
          color: 'var(--text-1)'
        }}
      >
        MAPPING THREAT LANDSCAPE
        <BlinkCursor color="var(--green)" />
      </div>

      <div className="data-label" style={{ color: 'var(--green)' }}>
        INITIALIZING AGENT MESH...
      </div>
    </div>
  );
}

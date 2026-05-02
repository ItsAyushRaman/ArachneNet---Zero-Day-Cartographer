export const ScanlineOverlay = () => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        background: `repeating-linear-gradient(
          to bottom,
          transparent 0px,
          transparent 2px,
          rgba(0,0,0,0.04) 2px,
          rgba(0,0,0,0.04) 4px
        )`,
      }}
    >
      {/* Scan beam moving from top to bottom */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(to bottom, transparent, rgba(0,255,0,0.3), transparent)',
          boxShadow: '0 0 12px rgba(0,255,0,0.4)',
          animation: 'scanline-move 8s linear infinite',
        }}
      />
    </div>
  )
}

export default ScanlineOverlay

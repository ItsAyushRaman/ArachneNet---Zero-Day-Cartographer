import { Button } from '../ui'

export const GraphControls = ({ onReset }) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 48,
        right: 16,
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <Button size="sm" onClick={onReset}>
        ↺ RESET VIEW
      </Button>
    </div>
  )
}

export default GraphControls

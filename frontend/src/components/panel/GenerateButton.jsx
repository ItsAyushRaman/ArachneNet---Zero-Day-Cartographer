import { Button, BlinkCursor } from '../ui'

export const GenerateButton = ({ onGenerate, generating, hasResult }) => {
  return (
    <div style={{ paddingTop: '16px', paddingBottom: '8px' }}>
      <Button
        variant="primary"
        size="lg"
        loading={generating}
        onClick={onGenerate}
        style={{
          width: '100%',
          justifyContent: 'center',
          letterSpacing: '0.15em',
        }}
      >
        {hasResult ? '↺ REGENERATE PATCH' : '⚡ GENERATE PATCH'}
      </Button>
      {generating && (
        <div
          style={{
            marginTop: '8px',
            fontFamily: 'var(--font-data)',
            fontSize: '0.65rem',
            color: 'var(--accent-green)',
          }}
        >
          &gt; ENGINEER AGENT ACTIVE <BlinkCursor />
        </div>
      )}
    </div>
  )
}

export default GenerateButton

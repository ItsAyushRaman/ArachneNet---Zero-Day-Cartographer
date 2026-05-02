import { useEffect, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomDark, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import useTheme from '../../hooks/useTheme'
import useTypewriter from '../../hooks/useTypewriter'
import CopyButton from './CopyButton'
import BlinkCursor from '../ui/BlinkCursor'

export const CodeTab = ({ code, language }) => {
  const { isDark } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showHighlighter, setShowHighlighter] = useState(language !== 'typescript')
  
  const { displayed, done } = useTypewriter(language === 'typescript' ? code : '', 4, true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Switch to syntax highlighter after typewriter finishes
    if (language === 'typescript' && done) {
      setShowHighlighter(true)
    }
  }, [done, language])

  if (!mounted) return null

  const theme = isDark ? atomDark : vs

  // For middleware: use typewriter effect first, then syntax highlighter
  if (language === 'typescript' && !showHighlighter) {
    return (
      <div style={{ position: 'relative' }}>
        <CopyButton text={code} />
        <pre
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: '0.72rem',
            lineHeight: 1.6,
            background: 'var(--bg-code)',
            padding: '12px',
            margin: 0,
            color: 'var(--green)',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}
        >
          {displayed}
          <BlinkCursor color="var(--green)" />
        </pre>
      </div>
    )
  }

  // For firewall regex or after typewriter completes: use syntax highlighter
  return (
    <div style={{ position: 'relative' }}>
      <CopyButton text={code} />
      <SyntaxHighlighter
        language={language}
        style={theme}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: 'transparent',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-data)',
          padding: '12px',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default CodeTab

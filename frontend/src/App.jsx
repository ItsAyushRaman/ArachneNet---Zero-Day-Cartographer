import { useState, useCallback } from 'react'
import AppShell from './components/layout/AppShell.jsx'
import ThreatGraph from './components/graph/ThreatGraph.jsx'
import ThreatPanel from './components/panel/ThreatPanel.jsx'
import { ErrorBox } from './components/ui/index.js'
import useThreats from './hooks/useThreats.js'
import useGenerate from './hooks/useGenerate.js'
import { refreshThreats } from './utils/api.js'

export default function App() {
  const { threats, loading, error: threatsError, refetch, lastUpdated } = useThreats()
  const { result, generating, error: genError, generate, reset } = useGenerate()
  const [selectedThreat, setSelectedThreat] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [globalError, setGlobalError] = useState(null)

  const handleThreatSelect = useCallback((threat) => {
    setSelectedThreat(threat)
    if (threat) reset()
  }, [reset])

  const handleClosePanel = useCallback(() => {
    setSelectedThreat(null)
    reset()
  }, [reset])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await refreshThreats().catch(() => null)
      await refetch()
    } catch (e) {
      setGlobalError('Refresh failed: ' + (e?.message || 'Unknown error'))
    } finally {
      setRefreshing(false)
    }
  }, [refetch])

  const displayError = globalError || threatsError?.message

  return (
    <AppShell
      threats={threats}
      statusProps={{
        threats,
        sourcesCount: 4,
        lastUpdated,
        onRefresh: handleRefresh,
        refreshing,
      }}
    >
      {/* Main 3D Graph */}
      <ThreatGraph
        threats={threats}
        loading={loading}
        onThreatSelect={handleThreatSelect}
        selectedThreatId={selectedThreat?.id}
      />

      {/* Threat Detail Panel */}
      {selectedThreat && (
        <ThreatPanel
          key={selectedThreat.id}
          threat={selectedThreat}
          onClose={handleClosePanel}
          generateResult={result}
          generating={generating}
          genError={genError}
          onGenerate={generate}
        />
      )}

      {/* Global Error */}
      {displayError && (
        <ErrorBox
          message={displayError}
          onDismiss={() => setGlobalError(null)}
          style={{
            position: 'fixed', bottom: 44, left: 16,
            zIndex: 300, maxWidth: 340,
          }}
        />
      )}
    </AppShell>
  )
}

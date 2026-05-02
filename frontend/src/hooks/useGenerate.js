import { useState } from 'react'
import { generatePatch } from '../utils/api'
import { createMockGenerateResult } from '../data/mockThreats.js'

const useGenerate = () => {
  const [result, setResult] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)

  const generate = async (threatId) => {
    try {
      setGenerating(true)
      setError(null)
      const data = await generatePatch(threatId)
      setResult(data)
    } catch (err) {
      console.warn('Falling back to local mock patch generation:', err)
      setResult(createMockGenerateResult(threatId))
      setError(null)
    } finally {
      setGenerating(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError(null)
  }

  return { result, generating, error, generate, reset }
}

export default useGenerate

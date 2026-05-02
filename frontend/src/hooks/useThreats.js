import { useState, useEffect } from 'react'
import { fetchThreats } from '../utils/api'
import { MOCK_THREATS } from '../data/mockThreats.js'

const useThreats = () => {
  const [threats, setThreats] = useState(MOCK_THREATS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const refetch = async () => {
    try {
      setLoading(true)
      const data = await fetchThreats()
      setThreats(data)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      console.warn('Falling back to local mock threats:', err)
      setThreats(MOCK_THREATS)
      setLastUpdated(new Date())
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    const interval = setInterval(refetch, 60000)
    return () => clearInterval(interval)
  }, [])

  return { threats, loading, error, refetch, lastUpdated }
}

export default useThreats

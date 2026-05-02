import { useEffect, useMemo, useRef, useState } from 'react'
import { fetchThreats, getWebSocketUrl } from '../utils/api'
import { MOCK_THREATS } from '../data/mockThreats.js'

const useThreats = () => {
  const [threats, setThreats] = useState(MOCK_THREATS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)
  const reconnectTimerRef = useRef(null)
  const shouldReconnectRef = useRef(true)

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

  const connectRealtime = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      return
    }

    try {
      const socket = new WebSocket(getWebSocketUrl('/ws/live'))
      socketRef.current = socket

      socket.onopen = () => {
        setConnected(true)
        setError(null)
      }

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)

          if (message.type === 'connected' && Array.isArray(message.threats)) {
            setThreats(message.threats)
            setLastUpdated(new Date())
            return
          }

          if (message.type === 'threats_updated') {
            refetch()
            return
          }

          if (message.type === 'pong') {
            return
          }
        } catch (parseError) {
          console.warn('Realtime message parse failed:', parseError)
        }
      }

      socket.onerror = () => {
        setConnected(false)
      }

      socket.onclose = () => {
        setConnected(false)
        socketRef.current = null

        if (!shouldReconnectRef.current) {
          return
        }

        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current)
        }

        reconnectTimerRef.current = setTimeout(() => {
          connectRealtime()
        }, 5000)
      }
    } catch (err) {
      setConnected(false)
      console.warn('Realtime websocket unavailable:', err)
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    shouldReconnectRef.current = true
    connectRealtime()

    return () => {
      shouldReconnectRef.current = false
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
      }
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(refetch, 60000)
    return () => clearInterval(interval)
  }, [])

  return { threats, loading, error, refetch, lastUpdated, connected }
}

export default useThreats

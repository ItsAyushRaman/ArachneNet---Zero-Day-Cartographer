import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './StatusBar.css'

const StatusBar = ({ threatCount, sourcesCount, onRefresh }) => {
  const [isLive, setIsLive] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive((prev) => !prev)
    }, 600)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      const response = await axios.post('http://localhost:8000/api/refresh')
      console.log('Refresh triggered:', response.data)
      
      // Refetch after a short delay to allow backend processing
      setTimeout(() => {
        onRefresh()
        setRefreshing(false)
      }, 1000)
    } catch (error) {
      console.error('Refresh failed:', error)
      setRefreshing(false)
    }
  }

  return (
    <div className="status-bar">
      <div className="status-section left">
        <span className={`live-dot ${isLive ? 'active' : ''}`}></span>
        <span className="live-label">LIVE</span>
        <span className="divider">•</span>
        <span className="threat-count">{threatCount} THREATS INDEXED</span>
      </div>

      <div className="status-section center">
        <span className="sources-label">MONITORING {sourcesCount} SOURCES</span>
      </div>

      <div className="status-section right">
        <button
          className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'REFRESHING...' : 'REFRESH'}
        </button>
      </div>
    </div>
  )
}

export default StatusBar

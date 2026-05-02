import { useState, useEffect } from 'react';
import axios from 'axios';

const useStatus = () => {
  const [status, setStatus] = useState({
    threatCount: 0,
    sourcesCount: 0,
    lastUpdated: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/status');
        setStatus(prev => ({
          ...prev,
          threatCount: response.data.threat_count || 0,
          sourcesCount: response.data.sources_count || 0,
          lastUpdated: response.data.last_updated,
          loading: false,
          error: null
        }));
      } catch (err) {
        console.error('Failed to fetch status:', err);
        setStatus(prev => ({
          ...prev,
          loading: false,
          error: err.message
        }));
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return status;
};

export default useStatus;

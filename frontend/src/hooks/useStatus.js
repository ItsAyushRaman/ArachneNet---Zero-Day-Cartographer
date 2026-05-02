import { useState, useEffect } from 'react';
import { fetchStatus } from '../utils/api.js';

const useStatus = () => {
  const [status, setStatus] = useState({
    threatCount: 0,
    sourcesCount: 0,
    lastUpdated: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await fetchStatus();
        setStatus(prev => ({
          ...prev,
          threatCount: data?.threat_count || 0,
          sourcesCount: data?.sources_count || 0,
          lastUpdated: data?.last_updated,
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

    loadStatus();
    const interval = setInterval(loadStatus, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return status;
};

export default useStatus;

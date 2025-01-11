// src/hooks/useFireData.js
import { useState, useEffect, useCallback } from 'react';
import { fireService } from '../services/api';
import { format } from 'date-fns';

export function useFireData() {
  const [fires, setFires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Define fetchFireData using useCallback
  const fetchFireData = useCallback(async () => {
    try {
      console.log('Fetching fire data...');
      setLoading(true);
      const today = new Date();
      const formattedDate = format(today, 'yyyy-MM-dd');
      
      const data = await fireService.getFireData({
        start: formattedDate
      });
      
      console.log(`Setting ${data.length} fires at ${new Date().toLocaleTimeString()}`);
      setFires(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching fire data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since we don't use any external values

  // Set up polling effect
  useEffect(() => {
    console.log('Setting up polling effect...');
    
    // Initial fetch
    fetchFireData();

    // Set up 15-minute interval
    const interval = setInterval(() => {
      console.log('15-minute interval triggered');
      fetchFireData();
    }, 15 * 60 * 1000);

    // Cleanup
    return () => {
      console.log('Cleaning up polling effect');
      clearInterval(interval);
    };
  }, [fetchFireData]); // Include fetchFireData in dependencies

  return {
    fires,
    loading,
    error,
    lastUpdated,
    refresh: fetchFireData // Just pass the reference to the callback
  };
}
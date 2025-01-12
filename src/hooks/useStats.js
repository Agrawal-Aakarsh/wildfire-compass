// src/hooks/useStats.js
import { useState, useEffect, useCallback } from 'react';
import { weatherService } from '../services/weather';
import { calFireService } from '../services/calfire';

export function useStats() {
  const [stats, setStats] = useState({
    activeFires: 'Loading...',
    airQuality: 'Loading...',
    fireArea: 'Loading...',
    structuresDamaged: 'Loading...'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAllStats = useCallback(async () => {
    try {
      console.log('Fetching fresh stats...');
      setLoading(true);

      // Fetch CAL FIRE stats
      const fireStats = await calFireService.getIncidentStats();
      
      // Fetch air quality
      const airQuality = await weatherService.getAirQuality();

      setStats({
        activeFires: fireStats.activeFires.toString(),
        airQuality: airQuality,
        fireArea: fireStats.fireArea,
        structuresDamaged: fireStats.structuresDamaged
      });

      setLastUpdated(new Date());
      setError(null);
      console.log('Stats updated successfully');
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err);
      setStats(prev => ({
        ...prev,
        activeFires: 'Error',
        fireArea: 'Error',
        structuresDamaged: 'Error'
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and visibility change handler
  useEffect(() => {
    // Function to handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab is now visible, refreshing stats...');
        fetchAllStats();
      }
    };

    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial fetch
    fetchAllStats();

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchAllStats]);

  return {
    stats,
    loading,
    error,
    lastUpdated,
    refresh: fetchAllStats // Expose refresh function if needed
  };
}
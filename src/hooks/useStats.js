// // src/hooks/useStats.js
// import { useState, useEffect } from 'react';
// import { useFireData } from './useFireData';
// import { weatherService } from '../services/weather';
// import { calFireService } from '../services/calfire';

// export function useStats() {
//   const { fires, loading: firesLoading, error: firesError } = useFireData();
//   const [stats, setStats] = useState({
//     activeFires: 'Loading...',
//     airQuality: 'Loading...',
//     fireArea: 'Loading...',
//     structuresThreatened: 'Loading...'
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Update active fires count
//   useEffect(() => {
//     if (fires && fires.length > 0) {
//       setStats(prev => ({
//         ...prev,
//         activeFires: fires.length.toString()
//       }));
//     }
//   }, [fires]);

//   // Fetch air quality data
//   useEffect(() => {
//     async function fetchAirQuality() {
//       try {
//         const airQuality = await weatherService.getAirQuality();
//         setStats(prev => ({
//           ...prev,
//           airQuality: airQuality !== 'Unknown' ? airQuality : 'No Data'
//         }));
//       } catch (err) {
//         console.error('Error fetching air quality:', err);
//         setError(err);
//         setStats(prev => ({
//           ...prev,
//           airQuality: 'No Data'
//         }));
//       }
//     }

//     fetchAirQuality();
//     // Refresh air quality every hour
//     const interval = setInterval(fetchAirQuality, 60 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, []);

//   // Fetch CAL FIRE data
//   useEffect(() => {
//     async function fetchCalFireData() {
//       try {
//         const { fireArea, structuresThreatened } = await calFireService.getIncidentData();
//         setStats(prev => ({
//           ...prev,
//           fireArea,
//           structuresThreatened: structuresThreatened === 'No Data' 
//             ? 'No Data' 
//             : `${structuresThreatened}`
//         }));
//       } catch (err) {
//         console.error('Error fetching CAL FIRE data:', err);
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchCalFireData();
//     // Refresh CAL FIRE data every 30 minutes
//     const interval = setInterval(fetchCalFireData, 30 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, []);

//   return {
//     stats,
//     loading: loading || firesLoading,
//     error: error || firesError
//   };
// }

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
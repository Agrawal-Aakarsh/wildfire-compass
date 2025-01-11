// src/services/api.js
const API_BASE_URL = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv';
const API_KEY = meta.env.VITE_NASA_FIRMS_API_KEY;

// California bounding box
const CA_BOUNDS = {
  west: -124.409,
  south: 32.534,
  east: -114.131,
  north: 42.009
};

export const fireService = {
  async getFireData({ start }) {
    try {
      // Just use MODIS_NRT as it seems to have the best data for the LA area
      const source = 'MODIS_NRT';
      const areaCoords = `${CA_BOUNDS.west},${CA_BOUNDS.south},${CA_BOUNDS.east},${CA_BOUNDS.north}`;
      const url = `${API_BASE_URL}/${API_KEY}/${source}/${areaCoords}/3/${start}`;
      
      console.log('Fetching from URL:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch fire data: ${text}`);
      }

      const csv = await response.text();
      console.log('Raw CSV response:', csv);
      const parsed = parseFireData(csv);
      console.log('Parsed fire data:', parsed);
      return parsed;
    } catch (error) {
      console.error('Error fetching fire data:', error);
      throw error;
    }
  }
};

function parseFireData(csv) {
  if (!csv || typeof csv !== 'string') {
    console.error('Invalid CSV data received:', csv);
    return [];
  }

  // Split CSV into rows
  const rows = csv.split('\n').filter(row => row.trim());
  console.log('Number of CSV rows:', rows.length);
  
  if (rows.length <= 1) {
    console.log('No data rows found in CSV (only header)');
    return [];
  }

  // Skip header row and process data rows
  return rows.slice(1)
    .map(row => {
      const columns = row.split(',');
      if (columns.length < 9) {
        console.warn('Invalid row format:', row);
        return null;
      }

      // MODIS CSV format: latitude,longitude,brightness,scan,track,acq_date,acq_time,satellite,instrument,confidence,version,bright_t31,frp,daynight
      const fire = {
        latitude: parseFloat(columns[0]),
        longitude: parseFloat(columns[1]),
        brightness: parseFloat(columns[2]),
        confidence: parseInt(columns[9]) || 50,
        frp: parseFloat(columns[12]) || 1, // Fire Radiative Power
        timestamp: new Date(`${columns[5]} ${columns[6].substring(0,2)}:${columns[6].substring(2,4)}`),
        daynight: columns[13]
      };

      // Validate the parsed data
      if (isNaN(fire.latitude) || isNaN(fire.longitude) || isNaN(fire.brightness)) {
        console.warn('Invalid number in row:', row);
        return null;
      }

      return fire;
    })
    .filter(fire => fire !== null); // Remove any invalid entries
}
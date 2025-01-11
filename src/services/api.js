// src/services/api.js
const API_BASE_URL = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv';
const API_KEY = '3298c27607104be68ed19607388dc8a0';

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

// // src/services/api.js
// const API_BASE_URL = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv';
// const API_KEY = import.meta.env.VITE_NASA_FIRMS_API_KEY;
// const SOURCES = ['VIIRS_SNPP_NRT', 'VIIRS_NOAA20_NRT', 'MODIS_NRT']; // Try multiple sources


// // California bounding box
// const CA_BOUNDS = {
//   north: 42.009,
//   south: 32.534,
//   east: -114.131,
//   west: -124.409
// };

// export const fireService = {
//   async getFireData({ start }) {
//     try {
//       // Fetch from all sources
//       const allPromises = SOURCES.map(async (source) => {
//         const areaCoords = `-124.409,32.534,-114.131,42.009`; // California bounds
//         const url = `${API_BASE_URL}/${API_KEY}/${source}/${areaCoords}/3/${start}`; // Increased to 3 days
        
//         console.log(`Fetching from ${source} URL:`, url);
//         const response = await fetch(url);
        
//         if (!response.ok) {
//           console.warn(`Failed to fetch from ${source}:`, await response.text());
//           return [];
//         }

//         const csv = await response.text();
//         console.log(`${source} Raw response:`, csv);
//         return parseFireData(csv, source);
//       });

//       const results = await Promise.all(allPromises);
//       const allFires = results.flat();
//       console.log('Combined fire data:', allFires);
//       return allFires;
//     } catch (error) {
//       console.error('Error fetching fire data:', error);
//       throw error;
//     }
//   }
// };

// function parseFireData(csv) {
//   if (!csv || typeof csv !== 'string') {
//     console.error('Invalid CSV data received from ' + source + ':', csv);
//     return [];
//   }

//   const rows = csv.split('\n').filter(row => row.trim());
//   console.log(`${source} rows:`, rows.length);
  
//   if (rows.length <= 1) {
//     console.log(`No data rows found in CSV for ${source} (only header)`);
//     return [];
//   }

//   // Skip header row and process data rows
//   return rows.slice(1)
//     .map(row => {
//       const columns = row.split(',');
      
//       // Basic validation
//       if (columns.length < 9) {
//         console.warn(`Invalid row format from ${source}:`, row);
//         return null;
//       }

//       try {
//         const fire = {
//           source,
//           latitude: parseFloat(columns[0]),
//           longitude: parseFloat(columns[1]),
//           brightness: parseFloat(columns[2]) || 300, // Default if missing
//           acq_date: columns[5],
//           acq_time: columns[6],
//           confidence: columns[8] === 'h' ? 100 : columns[8] === 'n' ? 50 : 25,
//           timestamp: new Date(`${columns[5]} ${columns[6].substring(0,2)}:${columns[6].substring(2,4)}`)
//         };

//         // Extra validation
//         if (fire.latitude < 32 || fire.latitude > 43 || 
//             fire.longitude < -125 || fire.longitude > -114) {
//           console.warn(`Fire location outside California bounds:`, fire);
//           return null;
//         }

//         return fire;
//       } catch (err) {
//         console.warn(`Error parsing row from ${source}:`, row, err);
//         return null;
//       }
//     })
//     .filter(fire => fire !== null);
// }

// src/services/weather.js
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Los Angeles coordinates
const LA_LAT = 34.0522;
const LA_LON = -118.2437;

export const weatherService = {
  async getAirQuality() {
    try {
      // Test the API key
      console.log('Using OpenWeather API Key:', API_KEY);
      
      const url = `${BASE_URL}/air_pollution?lat=${LA_LAT}&lon=${LA_LON}&appid=${API_KEY}`;
      console.log('Fetching air quality from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenWeatherMap error:', errorText);
        throw new Error(`Failed to fetch air quality data: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Air quality data:', data);
      
      // The API returns an array of measurements in data.list
      // We want the most recent one
      const currentAQI = data.list[0].main.aqi;
      return convertAQIToText(currentAQI);
    } catch (error) {
      console.error('Error fetching air quality:', error);
      // Return a fallback value instead of throwing
      return 'Unknown';
    }
  }
};

// Convert OpenWeatherMap AQI (1-5) to text description
function convertAQIToText(aqi) {
  const aqiMap = {
    1: 'Good',
    2: 'Fair',
    3: 'Moderate',
    4: 'Poor',
    5: 'Very Poor'
  };
  return aqiMap[aqi] || 'Unknown';
}
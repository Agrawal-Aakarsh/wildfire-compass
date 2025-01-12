import { useEffect, useRef, useState } from 'react';
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Map as MapIcon, Layers, ZoomIn, ZoomOut, Home } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { useFireData } from '../../hooks/useFireData';

// LA coordinates and default zoom
const LA_CENTER = [-118.2437, 34.0522];
const LA_ZOOM = 8;

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function FireMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapInitError, setMapInitError] = useState(null);
  const { fires, loading, error, lastUpdated } = useFireData();

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    try {
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: LA_CENTER,
        zoom: LA_ZOOM,
        maxBounds: [
          [-124.409, 32.534], // Southwest coordinates
          [-114.131, 42.009]  // Northeast coordinates
        ]
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        console.log('Map loaded successfully');
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapInitError(e.error?.message || 'Error initializing map');
      });

    } catch (err) {
      console.error('Error creating map:', err);
      setMapInitError(err.message);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update fire data on the map
  useEffect(() => {
    if (!map.current || !fires?.length) return;

    try {
      console.log('Updating map with fires:', fires.length);

      // Wait for map to be loaded
      if (!map.current.loaded()) {
        map.current.once('load', updateFireData);
        return;
      }

      updateFireData();
    } catch (err) {
      console.error('Error updating fire data on map:', err);
    }

    function updateFireData() {
      const geojsonData = {
        type: 'FeatureCollection',
        features: fires.map(fire => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [fire.longitude, fire.latitude]
          },
          properties: {
            brightness: fire.brightness,
            confidence: fire.confidence,
            frp: fire.frp
          }
        }))
      };

      console.log('GeoJSON data:', geojsonData);

      // Remove existing layers and source if they exist
      if (map.current.getLayer('fire-heat')) map.current.removeLayer('fire-heat');
      if (map.current.getLayer('fire-points')) map.current.removeLayer('fire-points');
      if (map.current.getSource('fires')) map.current.removeSource('fires');

      // Add new data source
      map.current.addSource('fires', {
        type: 'geojson',
        data: geojsonData,
      });

      // Add heatmap layer
      map.current.addLayer({
        id: 'fire-heat',
        type: 'heatmap',
        source: 'fires',
        paint: {
          'heatmap-weight': [
            'interpolate', ['linear'], ['get', 'frp'],
            0, 0,
            100, 1,
            500, 2
          ],
          'heatmap-intensity': [
            'interpolate', ['linear'], ['zoom'],
            0, 1,
            9, 3
          ],
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.2, 'rgb(255,225,0)',
            0.4, 'rgb(255,140,0)',
            0.6, 'rgb(255,0,0)',
            0.8, 'rgb(200,0,0)',
            1, 'rgb(150,0,0)'
          ],
          'heatmap-radius': [
            'interpolate', ['linear'], ['zoom'],
            0, 4,
            9, 30
          ],
          'heatmap-opacity': 0.9
        }
      });

      // Add point layer
      map.current.addLayer({
        id: 'fire-points',
        type: 'circle',
        source: 'fires',
        paint: {
          'circle-color': [
            'interpolate', ['linear'], ['get', 'confidence'],
            0, '#FFFF00',
            50, '#FFA500',
            80, '#FF0000'
          ],
          'circle-radius': [
            'interpolate', ['linear'], ['get', 'frp'],
            1, 5,
            100, 10,
            500, 20
          ],
          'circle-opacity': 0.8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#FFFFFF'
        }
      });
    }
  }, [fires]);

  const handleResetView = () => {
    map.current?.flyTo({
      center: LA_CENTER,
      zoom: LA_ZOOM,
      essential: true
    });
  };

  if (mapInitError) {
    return (
      <Card className="relative h-96 w-full bg-red-50 flex items-center justify-center">
        <div className="text-red-500">Map initialization error: {mapInitError}</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="relative h-96 w-full bg-red-50 flex items-center justify-center">
        <div className="text-red-500">Error loading fire data: {error.message}</div>
      </Card>
    );
  }

  return (
    <Card className="relative h-[600px] w-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button 
          variant="default" 
          size="icon"
          className="bg-white text-black hover:bg-gray-100"
          onClick={handleResetView}
        >
          <Home className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 p-4 rounded-lg shadow-md">
        <h3 className="font-semibold mb-3">Fire Activity</h3>
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="text-sm font-medium mb-1">Heat Intensity</div>
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-yellow-300 via-orange-500 to-red-700"/>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Lower</span>
              <span>Higher</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium mb-1">Fire Size</div>
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-red-500"/>
                <span className="text-xs mt-1">Small</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-red-500"/>
                <span className="text-xs mt-1">Medium</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-red-500"/>
                <span className="text-xs mt-1">Large</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Loading...'}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default FireMap;
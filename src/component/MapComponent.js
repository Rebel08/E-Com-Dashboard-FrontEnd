import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const MapComponent = ({ cities }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const mapRef = useRef(null);

  // Custom marker icon setup
  const customIcon = L.icon({
    iconUrl: '/icon/image.png', 
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
    
  });

  // Fetch coordinates with error handling
  useEffect(() => {
    const fetchCoordinates = async () => {
      setLoading(true); // Set loading to true when fetching starts
      setError(null); // Reset any previous errors

      const limitedCities = cities.slice(0, 8); // Limit to 10 cities cause of limitation on fetching data 
      try {
        const results = await Promise.all(
          limitedCities.map(async (city) => {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
              params: {
                q: city._id,
                format: 'json',
              },
            });
            const location = response.data[0];
            return {
              name: city._id,
              count: city.count,
              lat: location.lat,
              lon: location.lon,
            };
          })
        );
        setLocations(results); // Set locations if fetching was successful
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch locations. Please try again later."); // Set error message
      } finally {
        setLoading(false); // Set loading to false when fetching completes
      }
    };

    fetchCoordinates();
  }, [cities]);

  // Initialize the map only once
  useEffect(() => {
    if (mapRef.current !== null) {
      return; // Map has already been initialized
    }

    const map = L.map('map').setView([20.5937, 78.9629], 5); // Center of India
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);
  }, []);

  // Update markers whenever locations change
  useEffect(() => {
    if (mapRef.current) {
      // Clear existing markers
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapRef.current.removeLayer(layer);
        }
      });

      locations.forEach((city) => {
        L.marker([city.lat, city.lon], { icon: customIcon }) // Use the custom icon
          .addTo(mapRef.current)
          .bindPopup(`${city.name}: ${city.count} customers`)
          .openPopup();
      });
    }
  }, [locations]);

  return (
    <div>
      {loading && <p>Loading locations...</p>} {/* Loading message */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Error message */}
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

export default MapComponent;

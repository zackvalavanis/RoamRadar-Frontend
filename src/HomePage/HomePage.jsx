import './HomePage.css';
import { useState, useEffect } from 'react';
import { useCities } from '../CitiesPage/CitiesContext.jsx';

export function HomePage() {
  const { cities, loading, error } = useCities(); // Accessing cities data from context
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  console.log('Cities:', cities); // Check if cities are correctly logged

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => {
          setCurrentLocation({
            latitude: null,
            longitude: null,
            error: error.message,
          });
        }
      );
    } else {
      setCurrentLocation({
        ...currentLocation,
        error: "Geolocation is not supported by this browser.",
      });
    }
  }, []);

  console.log('My Location:', currentLocation);

  if (loading) return <p>Loading cities...</p>; // Show a loading message
  if (error) return <p>Error: {error}</p>; // Show an error message

  return (
    <div>
      {cities && cities.length > 0 ? (
        cities.map((city) => (
          <div key={city.id}>
            <h1>{city.name}</h1>
          </div>
        ))
      ) : (
        <p>No cities available.</p>  // Display a message if no cities are available
      )}
    </div>
  );
}

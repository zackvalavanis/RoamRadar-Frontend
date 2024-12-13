import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CitiesContext = createContext();

export function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch cities data when the component mounts
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${apiUrl}/cities.json`);;
        setCities(response.data); // Assuming response.data contains the list of cities
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch cities');
        setLoading(false);
      }
    };

    fetchCities();
  }, []); // Empty dependency array ensures this runs only once

  console.log('These are your Cities', cities); // Log cities to check data

  return (
    <CitiesContext.Provider value={{ cities, setCities, loading, error }}>
      {children}
    </CitiesContext.Provider>
  );
}

export function useCities() {
  return useContext(CitiesContext);
}

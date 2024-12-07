import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CitiesPage.css';
import { useAuth } from '../AuthenticationProvider/AuthProvider';

export function CitiesPage() {
  const [cities, setCities] = useState([]);
  const [cityName, setCityName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { auth } = useAuth();


  const handleIndex = async () => {
    try {
      const response = await axios.get(`${apiUrl}/cities.json`);
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await handleIndex();
    };
    fetchData();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!cityName) {
      console.error('City name cannot be empty');
      return; 
    }
    const cityExists = cities.some((city) => city.name.toLowerCase() === cityName.toLowerCase());
    if (cityExists) {
      console.warn('City already exists');
      return; // Exit if the city already exists
    }

    const params = { city_name: cityName, user_id: auth?.user_id };
    try {
      const response = await axios.post(`${apiUrl}/cities.json`, params);
      console.log(response.data)
      await handleIndex();
      setCityName('');
    } catch (error) {
      console.error('Error creating city', error);
    }
  };

  const handleNavigate = (cityId) => {
    navigate(`/CityShow/${cityId}`);
  };

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (city) => { 
    try { 
      await axios.delete(`${apiUrl}/cities/${city.id}.json`);
      setCities((prevCities) => prevCities.filter((c) => c.id !== city.id));
    } catch(error) { 
      console.error('Error deleting city', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-4">
        {!auth || !auth.user_id ? (
          <p></p>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4 text-center">
            <label htmlFor="city_name" className="block">Enter A City:</label>
            <input
              name="city_name"
              type="text"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input name="user_id" defaultValue={auth.user_id || ''} type="hidden" />
            <button type="submit" className="w-[150px] inline-block bg-blue-500 text-white p-2 rounded mx-auto">Create new</button>
          </form>
        )}
      </div>

      <h1 className="text-center my-8">Cities:</h1>

      {/* Search Input */}
      <div className="w-full max-w-md p-4">
        <input
          type="text"
          placeholder="Search cities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="w-full max-w-4xl px-4">
        {filteredCities.length > 0 ? (
          filteredCities.map((city) => (
            <div key={city.id} className="mb-6 border p-4 rounded shadow">
              <h2 className="text-center text-xl">{city.name}</h2>
              <h3 className="text-center">{city.location}</h3>
              <img className='image-center' src={city.photo_url} alt={city.name}></img>
              <button
                className="w-[150px] container flex flex-col items-center bg-blue-500 text-white p-2 rounded mx-auto"
                onClick={() => handleNavigate(city.id)}
              >
                More Info
              </button>
              {auth?.is_admin && (
                <button
                  onClick={() => handleDelete(city)}
                  className="w-[150px] container flex flex-col items-center bg-red-500 text-white p-2 rounded mx-auto mt-4"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center">No cities found.</p>
        )}
      </div>
    </div>
  );
}

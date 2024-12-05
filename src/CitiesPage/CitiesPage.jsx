import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../AuthenticationProvider/AuthProvider';
import { useNavigate } from 'react-router-dom';

export function CitiesPage() { 
  const [cities, setCities] = useState([]);
  const { auth } = useAuth();
  const [ cityName, setCityName] = useState('');
  const [ content, setContent] = useState('')
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleComment = async (event) => { 
    event.preventDefault();

    // Check if user is logged in before trying to post a comment
    if (!auth || !auth.user_id) {
      console.log('You must be logged in to post a comment');
      return;
    }

    const form = event.target;
    const content = form.content.value;
    const userId = auth.user_id;  // User ID will be null if logged out
    const cityId = form.city_id.value;
    const params = { 
      content: content, 
      user_id: userId,
      city_id: cityId
    };
    try { 
      const response = await axios.post(`${apiUrl}/comments.json`, params);
      console.log(response.data);
      await handleIndex();
      setContent('')
    } catch (error) { 
      console.error("Error posting comment", error);
    }
  };

  const handleIndex = async () => {
    console.log("handleIndex");
    try { 
      const response = await axios.get(`${apiUrl}/cities.json`);
      
      console.log('API response:', response.data);
      setCities(response.data);
    } catch (error) { 
      console.error("Error fetching cities", error);
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
      return; // Prevent submission if city name is empty
    }

    const params = { 
      city_name: cityName, 
      user_id:  auth?.user_id,
    }
    try { 
      var response = await axios.post(`${apiUrl}/cities.json`, params);
      console.log(response.data);
      await handleIndex();
      setCityName('')
    } catch(error) { 
      console.error('error fetching results.', error)
    }
  }

  const handleNavigate = async (cityId) => { 
    navigate(`/CityShow/${cityId}`)
  }

  return ( 
    <div>
      <div>
      {!auth || !auth.user_id ? (
                <p></p>
              ) : (
        <form onSubmit={handleCreate}>
         Enter A City: <input
            name="city_name"
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)} // Bind input to state
            required 
            />
         <input name='user_id' defaultValue={auth && auth.user_id ? auth.user_id : ''} type='hidden' />
         <button type='submit'>Create new</button>
        </form> 
        )}
      </div>
      <h1>Cities:</h1>
      <div>
        {cities.length > 0 ? (
          cities.map((city) => (
            <div key={city.id}>
              <h2>{city.name}</h2>
              <h3>{city.location}</h3>
              Comments: 
              {city.comments.length > 0 ? 
                <ul>
                  {city.comments.map((comment) => (
                    <li key={comment.id}>{comment.content}</li>
                  ))}
                </ul>
              : ( 
                <p>No comments yet. Be the first to comment!</p>
              )}
              {!auth || !auth.user_id ? (
                <p></p>
              ) : (
                <form onSubmit={handleComment}>
                  <div>
                    <input placeholder='Type your comment...' name='content' type='text' value ={content} onChange={(e) => setContent(e.target.value)}required />
                  </div>
                  <div>
                    <input defaultValue={auth.user_id} name='user_id' type='hidden' />
                  </div>
                  <div>
                    <input defaultValue={city.id} name='city_id' type='hidden' />
                  </div>
                  <button type='submit'>Comment</button>
                </form>
              )}
              <button onClick={() => handleNavigate(city.id)}>More Info</button>
            </div>
          ))
        ) : (
          <p>No cities available.</p>
        )}
      </div>
    </div>
  );
}

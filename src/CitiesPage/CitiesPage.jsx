import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../AuthenticationProvider/AuthProvider';

export function CitiesPage() { 
  const [cities, setCities] = useState([]);
  const { auth } = useAuth();

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
      content, 
      user_id: userId,
      city_id: cityId
    };

    try { 
      const response = await axios.post('http://localhost:3000/comments.json', params);
      console.log(response.data);
      await handleIndex();
    } catch (error) { 
      console.error("Error posting comment", error);
    }
  };

  const handleIndex = async () => {
    console.log("handleIndex");
    try { 
      const response = await axios.get('http://localhost:3000/cities.json');
      console.log(response.data);
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

  return ( 
    <div>
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

              {/* Render different content based on user login status */}
              {!auth || !auth.user_id ? (
                <p>Please log in to add a comment.</p>
              ) : (
                <form onSubmit={handleComment}>
                  <div>
                    <input placeholder='Type your comment...' name='content' type='text' required />
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
            </div>
          ))
        ) : (
          <p>No cities available.</p>
        )}
      </div>
    </div>
  );
}

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useAuth } from '../AuthenticationProvider/AuthProvider';

export function CitiesPage () { 
  const [cities, setCities] = useState([])
  const { auth } = useAuth();
  
  console.log(auth.user_id)

  const handleComment = async (event) => { 
    event.preventDefault();

    const form = event.target
    const content = form.content.value;
    const userId = auth.id;
    const cityId = form.city_id.value;
    const params = { 
      content, 
      user_id: userId,
      city_id: cityId
    }
    try { 
      const response = await axios.post('http://localhost:3000/comments.json', params)
      console.log(response.data)
    } catch(error) { 
      console.error("Error posting comment", error)
    }
  }

  const handleIndex = async () => {
    console.log("handleIndex");
    try { 
      const response = await axios.get('http://localhost:3000/cities.json')
      console.log(response.data)
      setCities(response.data)
    } catch(error) { 
      console.error("Error fetching cities", error)
    }
  };

  useEffect(() => { 
    const fetchData = async () => { 
      await handleIndex();
    };
    fetchData();
  }, [])

  return ( 
    <div>
      <h1>
        Cities:
      </h1>
        <div>
          {cities.map((city) => (
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
                <p>Add a Comment:</p>
              )}
              <form onSubmit={handleComment}>
                <div>
                  <input placeholder='type comment..' name='content' type='text'></input>
                </div>
                <div>
                <input defaultValue={auth ? auth.user_id : ''} name='user_id' type='hidden'/>
                </div>
                <div>
                  <input defaultValue={city.id} name='city_id' type='hidden'></input>
                </div>
                <button type='submit'>Comment</button>
              </form>
            </div>
          ))}
        </div>
    </div>
    )
  }
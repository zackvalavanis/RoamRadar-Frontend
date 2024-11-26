import axios from 'axios'
import { useEffect, useState } from 'react'

export function CitiesPage () { 
  const [cities, setCities] = useState([])
  

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
        Your Cities
      </h1>
        <div>
          {cities.map((city) => (
            <div key={city.id}>
              <h2>{city.name}</h2>
              <h3>{city.location}</h3>
              {city.comments.length > 0 ? 
              <ul>
                {city.comments.map((comment) => (
                  <li key={comment.id}>{comment.content}</li>
                ))}
              </ul>
              : ( 
                <p>No Comments Available</p>
              )}
            </div>
          ))}
        </div>
    </div>
    )
  }
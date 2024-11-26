import axios from 'axios'
import { useEffect } from 'react'

export function CitiesPage () { 
  

  const handleIndex = async () => {
    console.log("handleIndex");
    try { 
      const response = await axios.get('http://localhost:3000/cities.json')
      console.log(response.data)
    } catch(error) { 
      console.error("Error fetching cities", error)
    }
  }

  useEffect(() => (handleIndex()), []);

  return ( 
    <div>
      <h1>
        Your Cities
      </h1>
    </div>
  )
}
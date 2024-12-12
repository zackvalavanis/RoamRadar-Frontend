import './HomePage.css'
import { useState, useEffect} from 'react'

export function HomePage () { 
  const [ currentLocation, setCurrentLocation ] = useState({
    latitude: null, 
    longitude: null, 
    error: null
  })

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
      setCurrentLocation({ ...location, error: "Geolocation is not supported by this browser." });
    }
  }, []);








  return ( 
    <div>
      <h1>
        Hello
      </h1>
    </div>
  )
}
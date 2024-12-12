import { useLoaderData } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from '../AuthenticationProvider/AuthProvider';
import axios from 'axios';

export function CityShow() {
  const { auth } = useAuth();
  const city = useLoaderData();
  const [comments, setComments] = useState({}); 
  const [cityComments, setCityComments] = useState(city.comments || []); 
  const [places, setPlaces] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const position = { lat: city.geometry.location.lat, lng: city.geometry.location.lng };

  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  const handleComment = async (event, cityId) => {
    event.preventDefault();

    if (!auth || !auth.user_id) {
      console.log('You must be logged in to post a comment');
      return;
    }

    const content = comments[cityId];
    const userId = auth.user_id;
    const params = { content, user_id: userId, city_id: cityId };

    try {
      const response = await axios.post(`${apiUrl}/comments.json`, params);
      console.log('Comment posted:', response.data);

      setCityComments((prevComments) => [
        ...prevComments,
        response.data,
      ]);

      setComments((prevComments) => ({
        ...prevComments,
        [cityId]: '',
      }));
    } catch (error) {
      console.error('Error posting comment', error);
    }
  };

  const handleContentChange = (cityId, value) => {
    setComments((prevComments) => ({
      ...prevComments,
      [cityId]: value,
    }));
  };

  useEffect(() => {
    // Function to initialize the map
    async function initMap() {
      try {
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        // Create the map
        const newMap = new Map(mapRef.current, {
          zoom: 13,
          center: position,
          mapId: "DEMO_MAP_ID",
        });
        setMap(newMap);

        // Add a marker for the city
        const cityMarkerImg = document.createElement("img");
        cityMarkerImg.src = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

        new AdvancedMarkerElement({
          map: newMap,
          position: position,
          content: cityMarkerImg,
          title: city.name,
        });

        // Find nearby places
        async function findPlaces() {
          try {
            const { Place } = await google.maps.importLibrary("places");
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

            const request = {
              textQuery: `Restaurants in ${city.name}`,
              fields: ["displayName", "location", "businessStatus"],
              includedType: "restaurant",
              locationBias: { 
                lat: city.geometry.location.lat, 
                lng: city.geometry.location.lng 
              },
              isOpenNow: true,
              language: "en-US",
              maxResultCount: 20,
              minRating: 4.0,
              region: "us",
              useStrictTypeFiltering: true,
            };

            const { places: foundPlaces } = await Place.searchByText(request);

            if (foundPlaces.length) {
              setPlaces(foundPlaces);

              const { LatLngBounds } = await google.maps.importLibrary("core");
              const bounds = new LatLngBounds();

              foundPlaces.forEach((place) => {
                new AdvancedMarkerElement({
                  map: newMap,
                  position: place.location,
                  title: place.displayName,
                });

                bounds.extend(place.location);
              });

              newMap.fitBounds(bounds);
            } else {
              console.log("No places found");
            }
          } catch (error) {
            console.error("Error finding places:", error);
          }
        }

        findPlaces();
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }

    // Only run if the map libraries are available
    if (window.google?.maps) {
      initMap();
    }
  }, [city]);

  return (
    <div>
      <h1>{city.name}</h1>
      <h2>{city.location.city}, {city.location.state}</h2>
      <img src={city.photo_url} alt={city.name} />
      
      {/* Google Map Container */}
      <div
        id="map"
        ref={mapRef} 
        style={{ height: "400px", width: "50%" }}
      ></div>

      {/* Places List */}
      <div>
        <h3>Nearby Restaurants</h3>
        {places.map((place) => (
          <div key={place.displayName}>
            {place.displayName}
          </div>
        ))}
      </div>

      {/* Display Comments */}
      {cityComments.length > 0 ? (
        <ul className="text-center">
          {cityComments.map((comment) => (
            <li key={comment.id}>{comment.content}</li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No comments yet.</p>
      )}

      {/* Comment Form */}
      {!auth || !auth.user_id ? (
        <p className="text-center">Please log in to comment</p>
      ) : (
        <form className="cities-form space-y-4" onSubmit={(e) => handleComment(e, city.id)}>
          <div className="comments-input text-center">
            <input
              className="w-full md:w-[400px] mt-1 p-2 border border-gray-300 rounded"
              placeholder="Type your comment..."
              name="content"
              type="text"
              value={comments[city.id] || ''}
              onChange={(e) => handleContentChange(city.id, e.target.value)}
              required
            />
          </div>
          <div>
            <input defaultValue={auth.user_id} name="user_id" type="hidden" />
          </div>
          <div>
            <input defaultValue={city.id} name="city_id" type="hidden" />
          </div>
          <button className="w-[150px] inline-block bg-blue-500 text-white p-2 rounded mx-auto" type="submit">
            Comment
          </button>
        </form>
      )}
    </div>
  );
}
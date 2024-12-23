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
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPlaceReviews, setCurrentPlaceReviews] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const pageSize = 3;
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const apiUrl2 = import.meta.env.VITE_GOOGLE_API_KEY;

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

      // Update the city comments state with the new comment
      setCityComments((prevComments) => [
        ...prevComments,
        response.data,
      ]);

      // Reset the comment input field
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
              fields: ["displayName", "location", "businessStatus", "rating", "reviews", "servesBeer", "hasLiveMusic", "photos", 'types'],
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
              const sortedPlaces = foundPlaces.sort((a, b) => b.rating - a.rating);
              setPlaces(sortedPlaces);
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

  const paginate = (array, page, pageSize) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return array.slice(start, end);
  };

  const handlePlaceSelection = (place) => {
    setSelectedPlace(place);
    setCurrentPage(1); // Reset to the first page of reviews
    setCurrentPlaceReviews(paginate(place.reviews || [], 1, pageSize));
  };

  const handlePageChange = (direction) => {
    const newPage = currentPage + direction;
    const totalReviews = selectedPlace?.reviews?.length || 0;
    if (newPage > 0 && newPage <= Math.ceil(totalReviews / pageSize)) {
      setCurrentPage(newPage);
      setCurrentPlaceReviews(paginate(selectedPlace.reviews, newPage, pageSize));
    }
  };

  return (
    <div>
      <div style={{ borderRadius: "10px", display: 'flex', justifyContent: "center", fontSize: "40px", padding: "10px" }}>
        <h2><b>{city.location}</b></h2>
      </div>      
     
      {/* Google Map Container */}
      {/* <div style={{ textAlign: "center", padding: "5px"}}>
        <h1><b>Map of {city.name}</b></h1>
      </div> */}
      <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "450px", // Full height for the map section
    }}
  >
    <div
      id="map"
      ref={mapRef}
      style={{
        height: "425px",
        width: "50%",
        borderRadius: "10px",
        backgroundColor: "#f0f0f0", // Visible background during testing
      }}
    />
  </div>
      <div>
        <div style={{ textAlign: "center", padding: "20px"}}>
        <h3><b>Restaurants</b></h3>
        </div>
        {places.map((place) => (
          <div key={place.displayName} onClick={() => handlePlaceSelection(place)}>
            <div style={{textAlign: "center"}}>
            <b>
              <b>{place.rating} Stars: </b>{place.displayName}
            </b>
            </div>

            {/* Photos of the place */}
            <div style={{ overflowX: "auto", whiteSpace: "nowrap", display: "flex", gap: "10px" }}>
              {place.photos &&
                place.photos.map((photo, index) => {
                  const photoName = photo.name;
                  if (!photoName || !photoName.includes("/photos/")) {
                    console.error("Invalid photo name for place:", place.displayName);
                    return null;
                  }

                  const photoReference = photoName.split("/photos/")[1];
                  if (!photoReference) {
                    console.error("Missing photo reference for place:", place.displayName);
                    return null;
                  }

                  // const imageURL = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${apiUrl2}`;

                  return (
                    <div key={index} style={{ display: "inline-block", minWidth: "300px" }}>
                      <img
                        src={imageURL}
                        alt={place.displayName}
                        width="100%"
                        height="auto"
                        style={{ borderRadius: "10px" }}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Comments Section */}
      <div>
        <h3>Comments</h3>
        {cityComments.length > 0 ? (
          <ul>
            {cityComments.map((comment) => (
              <li key={comment.id}>
                {comment.content} - {comment.user_name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

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
              value={comments[city.id] || ""}
              onChange={(e) => handleContentChange(city.id, e.target.value)}
              required
            />
          </div>
          <button
            className="w-[150px] inline-block bg-blue-500 text-white p-2 rounded mx-auto"
            type="submit"
          >
            Post Comment
          </button>
        </form>
      )}
    </div>
  );
}

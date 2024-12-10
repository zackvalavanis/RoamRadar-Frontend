import { useLoaderData } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from '../AuthenticationProvider/AuthProvider';
import axios from 'axios';

export function CityShow() {
  const { auth } = useAuth();
  const city = useLoaderData();
  const [comments, setComments] = useState({}); // Manage comment input by city
  const [cityComments, setCityComments] = useState(city.comments || []); // Manage the city's comments state
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  console.log(city);

  const mapRef = useRef(null);

  const handleComment = async (event, cityId) => {
    event.preventDefault();

    // Check if user is logged in before trying to post a comment
    if (!auth || !auth.user_id) {
      console.log('You must be logged in to post a comment');
      return;
    }

    const content = comments[cityId]; // Use content specific to the city
    const userId = auth.user_id; // User ID will be null if logged out
    const params = { content, user_id: userId, city_id: cityId };

    try {
      // Post the new comment to the API
      const response = await axios.post(`${apiUrl}/comments.json`, params);
      console.log('Comment posted:', response.data);

      // Update the comments list for the city (assuming the response returns the newly posted comment)
      setCityComments((prevComments) => [
        ...prevComments,
        response.data, // Append the new comment
      ]);

      // Clear the comment input for that specific city
      setComments((prevComments) => ({
        ...prevComments,
        [cityId]: '', // Reset comment input for that city
      }));
    } catch (error) {
      console.error('Error posting comment', error);
    }
  };

  const handleContentChange = (cityId, value) => {
    setComments((prevComments) => ({
      ...prevComments,
      [cityId]: value, // Update comment for the specific city
    }));
  };

  // Initialize and add the map
let map;

async function initMap() {
  // The location of Uluru
  const position = { lat: -25.344, lng: 131.031 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 4,
    center: position,
    mapId: "DEMO_MAP_ID",
  });

  // The marker, positioned at Uluru
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "Uluru",
  });
}

initMap();

  return (
    <div>
      <h1>{city.name}</h1>
      <h2>{city.location.city}, {city.location.state}</h2>
      <img src={city.photo_url} alt={city.name}></img>
      
      {/* Google Map Container */}
      <div
        id="map"
        ref={mapRef} // Attach the map container to the ref
        style={{ height: "400px", width: "100%" }}
      ></div>

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

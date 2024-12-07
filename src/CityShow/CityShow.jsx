import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from '../AuthenticationProvider/AuthProvider';
import axios from 'axios';

export function CityShow() {
  const { auth } = useAuth();
  const city = useLoaderData();
  const [comments, setComments] = useState({}); // Manage comment input by city
  const [cityComments, setCityComments] = useState(city.comments || []); // Manage the city's comments state
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

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

  const handleIndex = async () => {
    try {
      const response = await axios.get(`${apiUrl}/cities.json`);
      console.log('API response:', response.data);
    } catch (error) {
      console.error('Error fetching cities', error);
    }
  };

  useEffect(() => {
    if (window.google && city.location) {
      const { lat, lng } = city.location;

      const mapOptions = {
        center: { lat, lng },
        zoom: 12,
      };

      const mapElement = document.getElementById("map");
      const map = new window.google.maps.Map(mapElement, mapOptions);

      new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: city.name,
      });
    }
  }, [city]);

  const handleContentChange = (cityId, value) => {
    setComments((prevComments) => ({
      ...prevComments,
      [cityId]: value, // Update comment for the specific city
    }));
  };

  return (
    <div>
      <h1>{city.name}</h1>
      <h2>{city.location.city}, {city.location.state}</h2>
      <img src={city.photo_url} alt={city.name}></img>
      
      {/* Google Map Container */}
      <div
        id="map"
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
        <p className="text-center">No comments yet. Be the first to comment!</p>
      )}

      {/* Comment Form */}
      {!auth || !auth.user_id ? (
        <p>Please log in to comment</p>
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

import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";

export function CityShow() {
  // Fetch city data from loader
  const city = useLoaderData();

  // Log city data to the console for debugging purposes
  console.log(city);

  // Function to initialize the Google Map
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

  return (
    <div>
      <h1>{city.name}</h1>
      <h2>{city.location.city}, {city.location.state}</h2>

      {/* Google Map Container */}
      <div
        id="map"
        style={{ height: "400px", width: "100%" }}
      ></div>

      {/* Comments Section */}
      {city.comments && city.comments.length > 0 ? (
        city.comments.map((comment) => (
          <div key={comment.id}>
            <p>{comment.content}</p>
          </div>
        ))
      ) : (
        <p>No comments for this city</p>
      )}
    </div>
  );
}

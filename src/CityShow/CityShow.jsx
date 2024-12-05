import { useLoaderData } from "react-router-dom"

export function CityShow () { 
  const city = useLoaderData();
  console.log(city)

  return ( 
    <div>
      <h1>{city.name}</h1>
      <h1>{city.location}</h1>
     {city.comments && city.comments.length > 0 ? ( 
      city.comments.map((comment) => ( 
        <div key={comment.id}>
          <p>{comment.content}</p>
        </div>
      ))
    ) : (
      <p>no Comments for city</p>
     )}
    </div>
  )
}
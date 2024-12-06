import axios from "axios";
import { useState } from "react";

export function SignupPage() {
  const [errors, setErrors] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors([]);
    
    const params = new FormData(event.target);
    const data = {};
    
    params.forEach((value, key) => {
      data[key] = value;
    });

    axios
      .post(`${apiUrl}/users.json`, data)
      .then((response) => {
        console.log(response.data);
        event.target.reset();
      })
      .catch((error) => {
        console.log(error.response.data.errors);
        setErrors(error.response.data.errors || ['Unknown error']);
      });
  };

  return (
    <div id="signup">
      <h1>Signup</h1>
      <ul>
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <div>
          Name: <input name="name" type="text" />
        </div>
        <div>
          Email: <input name="email" type="email" />
        </div>
        <div>
          Password: <input name="password" type="password" />
        </div>
        <div>
          Password confirmation: <input name="password_confirmation" type="password" />
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

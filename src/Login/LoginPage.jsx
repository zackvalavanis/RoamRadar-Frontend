import axios from 'axios';
import { useState } from 'react';
import './LoginPage.css';
import { useAuth } from '../AuthenticationProvider/AuthProvider';
import { useNavigate } from 'react-router-dom';

const jwt = localStorage.getItem("jwt");
if (jwt) { 
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}

export function LoginPage () { 
  const [errors, setErrors] = useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => { 
    event.preventDefault();
    setErrors([]);
    const params = new FormData(event.target);
    
    axios
      .post("http://localhost:3000/sessions.json", params)
      .then((response) => { 
        console.log("Response data:", response.data); // Check the full response
        const { jwt, user_id, email } = response.data; // Use user_id instead of id

        if (user_id) { // Check if user_id is valid
          // Store the user information, including user_id, in localStorage
          const userData = {
            email: email,
            user_id: user_id, 
            jwt: jwt
          };

          // Log to verify user data before storing
          console.log("User data to store:", userData);

          localStorage.setItem("user", JSON.stringify(userData));  // Store user info in localStorage
        } else {
          console.error("No user ID in the response.");
        }

        login({ email, user_id, jwt });

        console.log('You are logged in');
        event.target.reset();
        navigate('/Cities')

      })
      .catch((error) => { 
        console.log(error.response);
        setErrors(["Invalid Email or Password"]);
      });
  };

  return ( 
    <div id='login'>
      <h1>Login</h1>
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <div>
          Email: <input name="email" type="email" />
        </div>
        <div>
          Password: <input name="password" type="password" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

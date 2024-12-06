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
  const apiUrl = import.meta.env.VITE_API_BASE_URL

  const handleSubmit = (event) => { 
    event.preventDefault();
    setErrors([]);
    const params = new FormData(event.target);
    
    axios
      .post(`${apiUrl}/sessions.json`, params)
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
    <div className='loginpage' id='login'>
      <h1 className='header-login'><b>Login</b></h1>
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
      <form className='form-login' onSubmit={handleSubmit}>
        <div className="mb-4"> 
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-[400px] mt-1 p-2 border border-gray-300 rounded "
            placeholder="Enter your email"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-[400px] mt-1 p-2 border border-gray-300 rounded"
            placeholder="Enter your password"
          />
        </div>

        <div className='button-login'>
          <button
            className="w-[150px] inline-block bg-blue-500 text-white p-2"
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

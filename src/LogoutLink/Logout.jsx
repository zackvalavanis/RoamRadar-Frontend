import axios from 'axios'
import { useAuth } from '../AuthenticationProvider/AuthProvider';

export function Logout () { 
  const {logout} = useAuth();

  const handleClick = (event) => { 
    event.preventDefault();
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("jwt");
    logout();

    console.log('You have been logged out')
  }

  return (
    <a href='#' onClick={handleClick}>Logout</a>
  )
}
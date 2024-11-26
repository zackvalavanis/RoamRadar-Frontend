import axios from 'axios'

export function Logout () { 
  const handleClick = (event) => { 
    event.preventDefault();
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("jwt");
    console.log('You have been logged out')
  }

  return (
    <a href='#' onClick={handleClick}>Logout</a>
  )
}
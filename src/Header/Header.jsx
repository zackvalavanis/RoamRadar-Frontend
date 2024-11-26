import './Header.css'
import { Link } from 'react-router-dom'
import { Logout } from "../LogoutLink/Logout.jsx";

export function Header () { 
  return ( 
    <div>
      <header>
      <h1>
        <Link to='/'>HomePage</Link>
        <Link to='/Cities'>Cities</Link>
        <Link to='/Login'>Login</Link>
        <Link to='/Signup'>Signup</Link>
        <Logout />
        Roam Radar
      </h1>
      </header>
    </div>
  )
}
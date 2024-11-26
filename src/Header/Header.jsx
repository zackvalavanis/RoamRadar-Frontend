import './Header.css'
import { Link } from 'react-router-dom'

export function Header () { 
  return ( 
    <div>
      <header>
      <h1>
        <Link to='/'>HomePage</Link>
        <Link to='/Cities'>Cities</Link>
        <Link to='/Login'>Login</Link>
        <Link to='/Signup'>Signup</Link>
        Roam Radar
      </h1>
      </header>
    </div>
  )
}
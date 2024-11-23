import './Header.css'
import { Link } from 'react-router-dom'

export function Header () { 
  return ( 
    <div>
      <header>
      <h1>
        <Link to='/'>HomePage</Link>
        <Link to='/Cities's>Cities</Link>
        Roam Radar
      </h1>
      </header>
    </div>
  )
}
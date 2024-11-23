import './App.css'
import { Header } from './Header/Header.jsx'
import { Footer } from './Footer/Footer.jsx'
import { HomePage } from './HomePage/HomePage.jsx'
import { createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom'


function App() {

  const router = createBrowserRouter([
    {
      element: ( 
        <div>
          <Header />
          <Outlet />
          <Footer />
        </div>
      ), 
      children: [
        { 
          path: '/',
          element: <HomePage />
        }
      ]
    }
  ])


  return (
    <RouterProvider router={router}/>
  )
}

export default App

import './App.css'
import axios from 'axios'
import { Header } from './Header/Header.jsx'
import { Footer } from './Footer/Footer.jsx'
import { HomePage } from './HomePage/HomePage.jsx'
import { CitiesPage } from './CitiesPage/CitiesPage.jsx'
import { LoginPage } from './Login/LoginPage.jsx'
import { CityShow } from './CityShow/CityShow.jsx'
import { SignupPage } from './Signup/SignupPage.jsx'
import { AuthProvider } from './AuthenticationProvider/AuthProvider.jsx'
import { createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom'
import { CitiesProvider } from './CitiesPage/CitiesContext.jsx'

function App() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL

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
        },
        { 
          path: '/Cities',
          element: <CitiesPage />
        }, 
        { 
          path: '/Login', 
          element: <LoginPage />
        }, 
        { 
          path: '/Signup', 
          element: <SignupPage />
        },
        { 
          path: '/CityShow/:id',
          element: <CityShow />, 
          loader: ({params}) => axios.get(`${apiUrl}/cities/${params.id}.json`).then((response) => { 
            console.log(response.data);
            return response.data
          })
        }
      ]
    }
  ])


  return (
    <AuthProvider>
      <CitiesProvider>
      <RouterProvider router={router}/>
      </CitiesProvider>
    </AuthProvider>
  )
}

export default App

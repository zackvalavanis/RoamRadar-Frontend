import './App.css'
import { Header } from './Header/Header.jsx'
import { Footer } from './Footer/Footer.jsx'
import { HomePage } from './HomePage/HomePage.jsx'
import { CitiesPage } from './CitiesPage/CitiesPage.jsx'
import { LoginPage } from './Login/LoginPage.jsx'
import { SignupPage } from './Signup/SignupPage.jsx'
import { AuthProvider } from './AuthenticationProvider/AuthProvider.jsx'
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
        }
      ]
    }
  ])


  return (
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  )
}

export default App

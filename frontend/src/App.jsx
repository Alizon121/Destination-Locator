import {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import LoginFormPage from "./components/LoginFormPage/LoginFormPage";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { restoreUser } from "./store/session";
import Navigation from './components/Navigation/Navigation';
import SignUpFormPage from './components/SignUpFormPage';

function Layout () {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(restoreUser()).then(() => {
      setIsLoaded(true)
    })
  }, [dispatch])

  return (
    <>
    <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet/>}
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: '/',
        element: <h1>Welcome!</h1>
      },
      {
        path: 'login',
        element: <LoginFormPage/>
      },
      {
        path: "signup",
        element: <SignUpFormPage/>
      }
    ]
  }
])

function App() {
  return (
    <RouterProvider router={router}/>
  )
}

export default App;

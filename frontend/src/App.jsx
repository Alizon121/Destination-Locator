import {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from './components/Navigation/Navigation';
import LandingPageSpots from './components/Spots/LandingPageSpots';
import SpotDetails from './components/Spots/SpotDetails';

function Layout () {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
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
        element: <LandingPageSpots/> //We need to render a component here that displays all spots: '/api/spots'
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetails/>
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

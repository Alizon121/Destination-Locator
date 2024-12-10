import {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from './components/Navigation/Navigation';
import LandingPageSpots from './components/Spots/LandingPage/LandingPageSpots';
import SpotDetails from './components/Spots/SpotDetails/SpotDetails';
import CreateSpot from './components/Spots/CreateSpot/CreateSpot';
import ManageSpots from './components/Spots/ManageSpots/ManageSpots';
import UpdateSpot from './components/Spots/UpdateSpot/UpdateSpot';

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
      },
      {
        path: '/create-spot',
        element: <CreateSpot/>
      },
      {
        path: '/manage-spots',
        element: <ManageSpots/>
      },
      {
        path: '/update-spot/:spotId',
        element: <UpdateSpot/>
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

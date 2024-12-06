import {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet, useNavigate } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from './components/Navigation/Navigation';
import LandingPageSpots from './components/Spots/LandingPageSpots';
import SpotDetails from './components/Spots/SpotDetails';
import CreateSpotModal from './components/CreateSpotModal';
import ManageSpots from './components/Spots/ManageSpots';

function Layout () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

function CreateSpotWrapper() {
  const navigate = useNavigate();
  return <CreateSpotModal navigate={navigate}/>
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
        element: <CreateSpotModal/>
      },
      {
        path: '/manage-spots',
        element: <ManageSpots.jsx/>
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

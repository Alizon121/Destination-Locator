import { useEffect } from 'react'
import { loadSpotsData } from '../../store/spots';
import { useDispatch, useSelector } from 'react-redux';

function LandingPageSpots() {
    // Local state variable for obtaining the spots
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots)
    const spotsData = Object.values(spots).map(spot =>spots[spot.id])

    useEffect(() => {
        dispatch(loadSpotsData())
    }, [dispatch])

    return (
        <div>   
            {spotsData.map((spot) => {
                return (
                  <>
                        <img src={spot.previewImage}/>
                    <ul>
                        <li>{spot.city}</li>,
                        <li>{spot.state}</li>
                        <li>{`$${spot.price}.00/night`}</li>
                        <li>★{spot.avgRating}</li>
                    </ul>
                  </>
                )
            })
            }        
        </div>
    )
}

export default LandingPageSpots

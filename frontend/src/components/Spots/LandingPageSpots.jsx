import { useEffect } from 'react'
import { loadSpotsData } from '../../store/spots';
import { useDispatch, useSelector } from 'react-redux';
import './LandingPageSpots.css'
function LandingPageSpots() {
    // Local state variable for obtaining the spots
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots)
    const spotsData = Object.values(spots).map(spot => spots[spot.id])

    useEffect(() => {
        dispatch(loadSpotsData())
    }, [dispatch])

    return (
        <div className='spot_grid'>
            {spotsData.map((spot) => {
                return (
                    <>
                        <div key={spot.id} className='spot_item'> {/* Add a key and a wrapper for each spot */}
                            <img className="spot_image" src={spot.previewImage} alt="Spot Preview" />
                            <span>
                                <ul className='spots_data'>
                                    <li className='spot_city_state'>{`${spot.city}, ${spot.state}`}</li>
                                    <li className='spot_price'>{`$${spot.price}.00/night`}</li>
                                    <li className='spot_rating'>★{spot.avgRating}</li>
                                </ul>
                            </span>
                        </div>
                    </>
                )
            })
            }
        </div>
    )
}

export default LandingPageSpots

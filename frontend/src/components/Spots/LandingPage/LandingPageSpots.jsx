import { useEffect } from 'react'
import { loadSpotsData } from '../../../store/spots';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import './LandingPageSpots.css'
function LandingPageSpots() {
    // Local state variable for obtaining the spots
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots)
    const spotsData = Object.values(spots).map(spot => spots[spot.id])

    useEffect(() => {
        dispatch(loadSpotsData())
    }, [dispatch])

    // console.log(spotsData.map(spot => spot.avgRating))
    return (
        <div className='spot_grid'>
            {spotsData.map((spot) => {
                return (
                    <NavLink key={spot.name} to={`/spots/${spot.id}`}>
                        <div className='spot_item'> {/* Add a key and a wrapper for each spot */}
                            <img className="spot_image" src={spot.previewImage} alt="Spot Preview" />
                            <div className="tooltip-container">
                                <span className="hover-element">{spot.name}</span>
                            </div>
                                <span className='spot_city_state'>{`${spot.city}, ${spot.state}`}
                                    { spot.avgRating > 0 ?( 
                                        <span className='spot_rating'>{`★${spot.avgRating}`}</span>
                                    ) : (
                                        <span className='spot_rating'>★ New</span>
                                    )}
                                </span>
                                <span className='spot_price'>{`$${spot.price}.00/night`}</span>
                        </div>
                    </NavLink>
                )
            })
            }
        </div>
    )
}

export default LandingPageSpots

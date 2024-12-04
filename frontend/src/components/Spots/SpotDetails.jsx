import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadSpotDetails } from "../../store/spots";
import './SpotDetails.css'

function SpotDetails() {
    const {spotId} = useParams();
    const spotDetails = useSelector(state => state.spots[spotId])
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(loadSpotDetails(spotId))
    }, [dispatch, spotId])

     
    if (!spotDetails || !spotDetails.SpotImages) return null

        return (
                <div className="spot_details">
                    <h2>{spotDetails.name}</h2>
                    <ul >
                        <li>{spotDetails.city}</li>
                        <li>{spotDetails.state}</li>
                        <li>{spotDetails.country}</li>
                    </ul>
                    <div>
                    {spotDetails.SpotImages.map((image, index) => 
                        ( <img className='spot_img' key={index} src={image.url} alt={`Spot Image ${index + 1}`} /> 
                    ))}
                    </div>
                    <h2>Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}</h2>
                    <p>{spotDetails.description}</p>
                    <span className="button_spot_info">
                       <div>${spotDetails.price}.00/night</div>   
                       <div>★{spotDetails.avgStarRating}</div>
                       <div>{spotDetails.numReviews} reviews</div>
                       <button>Reserve</button>
                    </span>
                    <div className="reviews_header">
                        <div>★{spotDetails.avgStarRating}</div>
                        <div>{spotDetails.numReviews} reviews</div>
                        {/* Render the reviews component */}
                    </div>
                    
                </div>
            )
    

}

export default SpotDetails
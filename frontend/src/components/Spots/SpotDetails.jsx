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
    else {
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
                        ( <img key={index} src={image.url} alt={`Spot Image ${index + 1}`} /> 
                    ))}
                    </div>
                    <h2>Hosted by</h2>
                    
                </div>
            )
    }

}

export default SpotDetails
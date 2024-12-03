import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadSpotDetails } from "../../store/spots";

function SpotDetails() {
    const {spotId} = useParams();
    const spotDetails = useSelector(state => state.spots[spotId])
    const dispatch = useDispatch();
    let content = null;

    useEffect(() => {
        dispatch(loadSpotDetails(spotId))
    }, [dispatch, spotId])

    if (!spotDetails) return null
    else {
        content = (
            <div>
                <h2>{spotDetails.name}</h2>
                <ul>
                    <li>{spotDetails.city}</li>
                    <li>{spotDetails.state}</li>
                    <li>{spotDetails.country}</li>
                </ul>

            </div>
        )
    }

    return (
        <div>
            {content}
        </div>
    )

}

export default SpotDetails
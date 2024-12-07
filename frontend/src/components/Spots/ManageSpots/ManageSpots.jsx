import { loadCurrentUserSpot } from "../../../store/spots"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem"
import UpdateSpotModal from "../../UpdateSpotModal/UpdateSpotModal"
import DeleteSpotModal from "../../DeleteSpotModal/DeleteSpotModal"
import { NavLink } from "react-router-dom"
import './ManageSpots.css'
function ManageSpots() {
const spots = useSelector(state => state.spots)
console.log(spots)
const dispatch = useDispatch();

useEffect(() => {
    dispatch(loadCurrentUserSpot())
}, [dispatch])

const spotsData = Object.values(spots)

return (
    <div className="manage_spots_info">
    <h1>Manage Spots</h1>
    <button className="manage_spots_create_spot_button">
            <NavLink to={'/create-spot'}>Create a Spot</NavLink>
    </button>
   <div className="current_data">
       {spotsData.map((spot) => {
        return (
        <div key={spot.id} className="manage_image_container">
            {spot.previewImage ? (
                <img className="preview_image" src={spot.previewImage} alt={`${spot.name} preview`} />
            ): (
                <img className="manage_spots_placeholder_image" src="https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyaminmellish-186077.jpg&fm=jpg" alt="Placeholder" />
            )}
            <div className="spot_details">
                <h2>{spot.name}</h2>
                <span id="manage_spots_price_rating">
                    ${spot.price}.00/night
                    <span>
                        ★{spot.avgRating}
                    </span>
                </span>
                <div className="manage_spot_buttons">
                    <button>
                        <OpenModalMenuItem
                        itemText={"Update Spot"}
                        modalComponent={<UpdateSpotModal spotId={spot.id}/>}
                        />
                    </button>
                    <button>
                        <OpenModalMenuItem
                        itemText={"Delete Spot"}
                        modalComponent={<DeleteSpotModal spotId = {spot.id}/>}
                        />
                    </button>
                </div>
            </div>
        </div>
        )
       })}
   </div>
    </div>
)
}

export default ManageSpots
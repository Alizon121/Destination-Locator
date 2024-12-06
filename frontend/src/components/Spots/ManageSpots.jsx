import { loadCurrentUserSpot } from "../../store/spots"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

function ManageSpots() {
// We want to display the current user's spots
// We want to have a button for updating and deleting the spot
const spots = useSelector(state => state.spots)
const dispatch = useDispatch();

useEffect(() => {
    dispatch(loadCurrentUserSpot(spots))
}, [dispatch, spots])

const spotsData = Object.values(spots)
console.log(spotsData.map(spot => spot.name));
return (
   <div className="current_data">
        <h1>Manage Spots</h1>
       {spotsData.map((spot) => {
        return (
        <div key={spot.id} className="manage_image_container">
            {spot.previewImage ? (
                <img className="preview_image" src={spot.previewImage} alt={`${spot.name} preview`} />
            ): (
                <img src="" alt="Placeholder" />
            )}
            <div className="spot_details">
                <h2>{spot.name}</h2>
                <span>{spot.description}</span>
                <button>Update Spot</button>
                <button>Delete Spot</button>
            </div>
        </div>
        )
       })}
   </div>
)
}

export default ManageSpots
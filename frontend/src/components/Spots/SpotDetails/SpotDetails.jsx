import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadSpotDetails } from "../../../store/spots";
import LoadReviews from "../../Reviews/LoadReviews/LoadReviews";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import CreateReviewModal from "../../Reviews/CreateReviewModal/CreateReviewModal";
import './SpotDetails.css'

function SpotDetails() {
    const {spotId} = useParams();
    const spotDetails = useSelector(state => state.spots[spotId])
    const reviews = useSelector(state => state.reviews);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadSpotDetails(spotId))
    }, [dispatch, spotId])


    if (!spotDetails || !spotDetails.SpotImages ) return null

    return (
        <div>
            {!reviews ? (
                    <div className="spot_details_container">
                        <div className="spot_details">
                            <h1>{spotDetails.name}</h1>
                            <div className="city_state_country_container">
                                <h2>{spotDetails.city}, {spotDetails.state} {spotDetails.country}</h2>
                            </div>
                            <div className="spot_details_images">
                                {spotDetails.SpotImages.map((image, index) =>
                                    (<img className='spot_img' key={index} src={image.url} alt={`Spot Image ${index + 1}`} />)
                                )}
                            </div>
                            <div className="host_reserve_container">
                                <div className="host_info_details">
                                    <div>
                                        <div className="reserve_spot_container">
                                            <h3>Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}</h3>
                                            <span className="reserve_">
                                                ${spotDetails.price}.00/night 
                                                {/* ★{spotDetails.avgStarRating} */}
                                                {/* {spotDetails.numReviews} reviews */}
                                                ★ New
                                                <button>Reserve</button>
                                            </span>
                                        </div>
                                    </div>
                                    <p>{spotDetails.description}</p>
                                </div>
                            </div>
                            <div className="reviews_header">
                                <h2>★ New</h2>
                                {/* <div>{spotDetails.numReviews} reviews</div> */}
                            </div>
                                <button>
                                <OpenModalMenuItem 
                                itemText={'Post Your Review'}
                                modalComponent={<CreateReviewModal spotId={spotId} />} //onCreate={()=> handleReviewCreation()}
                                />
                                </button>
                        </div>
                    </div>
                ) : (
        <div className="spot_details_container">
            <div className="spot_details">
                <h1>{spotDetails.name}</h1>
                <div className="city_state_country_container">
                    <h2>{spotDetails.city}, {spotDetails.state} {spotDetails.country}</h2>
                </div>
                <div className="spot_details_images">
                    {spotDetails.SpotImages.map((image, index) =>
                        (<img className='spot_img' key={index} src={image.url} alt={`Spot Image ${index + 1}`} />)
                    )}
                </div>
                <div className="host_reserve_container">
                    <div className="host_info_details">
                        <div>
                            <div className="reserve_spot_container">
                                <h3>Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}</h3>
                                <span className="reserve_">
                                    ${spotDetails.price}.00/night ★{spotDetails.avgStarRating}
                                    {spotDetails.numReviews} reviews
                                    <button>Reserve</button>
                                </span>
                            </div>
                        </div>
                        <p>{spotDetails.description}</p>
                    </div>
                </div>
                <div className="reviews_header">
                    <div>★{spotDetails.avgStarRating}</div>
                    <div>{spotDetails.numReviews} reviews</div>
                </div>
                <div>
                    <LoadReviews spotId={spotId}/>
                </div>
            </div>
        </div>
            )}
    </div>
);
}

export default SpotDetails
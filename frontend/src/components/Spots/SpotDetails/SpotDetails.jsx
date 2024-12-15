import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadSpotDetails } from "../../../store/spots";
import { loadReviewsThunk } from "../../../store/reviews";
import LoadReviews from "../../Reviews/LoadReviews/LoadReviews";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import CreateReviewModal from "../../Reviews/CreateReviewModal/CreateReviewModal";
import './SpotDetails.css'

function SpotDetails() {
    const {spotId} = useParams();
    const spotDetails = useSelector(state => state.spots[spotId])
    const reviews = useSelector(state => state.reviews);
    const user = useSelector(state => state.session.user)
    const userId = user ? user.id : null
    const userHasReview = Object.values(reviews).some(review => review.userId == userId)
    const [numReviews, setNumReviews] = useState(spotDetails?.numReviews || 0)
    const [avgRating, setAvgRating] = useState(spotDetails?.avgStarRating || 0)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadSpotDetails(spotId))
        dispatch(loadReviewsThunk(spotId))
    }, [dispatch, spotId])

    useEffect(() => {
        if (spotDetails) {
            setNumReviews(spotDetails.numReviews)
            setAvgRating(spotDetails.avgStarRating)
        }
    }, [spotDetails])

    const updateReviewStats = (newReview, isDelete = false) => {
        // Calculate new average rating and update the local state
        const currentTotalRating = avgRating * numReviews;

        if (isDelete) {
            const updatedNumReviews = numReviews - 1;
            const updatedAvgStarRating =
                updatedNumReviews > 0 ? (currentTotalRating - newReview.stars) / updatedNumReviews : 0;

            setNumReviews(updatedNumReviews);
            setAvgRating(updatedAvgStarRating.toFixed(1));
        } else {
            const updatedNumReviews = numReviews + 1;
            const updatedAvgStarRating =
                (currentTotalRating + newReview.stars) / updatedNumReviews;

            setNumReviews(updatedNumReviews);
            setAvgRating(updatedAvgStarRating.toFixed(1));
        }
    };

    const editReviewStats = (prevRating, editReview) => {
        const currentTotalRating = avgRating * numReviews
        const newTotalRating = currentTotalRating - prevRating + editReview.stars
        const updatedAvgStarRating = (newTotalRating/ numReviews).toFixed(1)
        setAvgRating(updatedAvgStarRating)
    }

    if (!spotDetails || !spotDetails.SpotImages ) return null

    return (
        <div>
            {(Object.values(reviews).length <= 0) ? (
                    <div className="spot_details_container">
                        <div className="spot_details">
                            <h1>{spotDetails.name}</h1>
                            <div className="city_state_country_container">
                                <h2>{spotDetails.city}, {spotDetails.state} {spotDetails.country}</h2>
                            </div>
                            <div className="spot_details_images">
                                <div className="spot_details_preview_image_container">
                                    {spotDetails.SpotImages.map((image) => 
                                        image.preview === true ? <img className="spot_details_preview_image" key={image.url} src={image.url} alt="Spot Preview" /> : null
                                    )}
                                </div>
                                <div className="spot_details_other_images">
                                    {spotDetails.SpotImages?.slice(1).map((image, index) =>
                                        (<img className='spot_img' key={index} src={image.url} alt={`Spot Image ${index + 1}`} />)
                                    )}
                                </div>
                            </div>
                            <div className="host_reserve_container">
                                <div className="host_info_details">
                                    <div>
                                        <div className="reserve_spot_container">
                                            <div className="spot_details_owner_description">
                                                <h3>Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}</h3>
                                                <p>{spotDetails.description}</p>
                                            </div>
                                            <div className="reserve_info">
                                                <span className="spot_details_price_rating">
                                                    ${spotDetails.price}.00/night 
                                                    <span>
                                                        ★ New
                                                    </span>
                                                </span>
                                                <div className="spot_details_reserve_button_container">
                                                <button onClick={() => alert('Feature is coming soon!')}>Reserve</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="reviews_header">
                                <h2>★ New</h2>
                            </div>
                            {!userHasReview && (
                                <div className="spot_details_post_review_button_container">
                                    {/* <button className="post_review_button" type="button">
                                        <OpenModalMenuItem 
                                        itemText={'Post Your Review'}
                                        modalComponent={<CreateReviewModal spotId={spotId} updateReviewStats={updateReviewStats}/>}
                                        />
                                    </button> */}
                                        <p>Be the first to post a review!</p>
                                </div>)
                            }
                        </div>
                    </div>
                ) : ( (Object.values(reviews).length === 1) ? (
                    <div className="spot_details_container">
                <div className="spot_details">
                    <h1>{spotDetails.name}</h1>
                    <div className="city_state_country_container">
                        <h2>{spotDetails.city}, {spotDetails.state} {spotDetails.country}</h2>
                    </div>
                    <div className="spot_details_images">
                        <div className="spot_details_preview_image_container">
                            {spotDetails.SpotImages.map((image) => 
                                image.preview === true ? <img className="spot_details_preview_image" key={image.url} src={image.url} alt="Spot Preview" /> : null
                            )}
                        </div>
                        <div className="spot_details_other_images">
                            {spotDetails.SpotImages?.slice(1).map((image, index) =>
                                (<img className='spot_img' key={index} src={image.url} alt={`Spot Image ${index + 1}`} />)
                            )}
                        </div>
                    </div>
                    <div className="host_reserve_container">
                        <div className="host_info_details">
                            <div>
                                <div className="reserve_spot_container">
                                    <div className="spot_details_owner_description">
                                        <h3>Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}</h3>
                                        <p>{spotDetails.description}</p>
                                    </div>
                                        <div className="reserve_info">
                                            <span className="spot_details_price_rating">
                                                 ${spotDetails.price}.00/night 
                                                <span>
                                                    {numReviews} review 
                                                    ·
                                                    ★{avgRating}
                                                </span>
                                            </span>
                                            <div className="spot_details_reserve_button_container">
                                                <button onClick={() => alert('Feature is coming soon!')}>Reserve</button>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="reviews_header">
                        <div>★{avgRating} · {numReviews} review</div>
                    </div>
                    <div>
                        <LoadReviews spotId={spotId} updateReviewStats={updateReviewStats} editReviewStats={editReviewStats}/>
                    </div>
                </div>
            </div>
                ) : ( //Object.values(reviews).length > 1
            <div className="spot_details_container">
                <div className="spot_details">
                    <h1>{spotDetails.name}</h1>
                    <div className="city_state_country_container">
                        <h2>{spotDetails.city}, {spotDetails.state} {spotDetails.country}</h2>
                    </div>
                    <div className="spot_details_images">
                        <div className="spot_details_preview_image_container">
                            {spotDetails.SpotImages.map((image) => 
                                image.preview === true ? <img className="spot_details_preview_image" key={image.url} src={image.url} alt="Spot Preview" /> : null
                            )}
                        </div>
                        <div className="spot_details_other_images">
                            {spotDetails.SpotImages?.slice(1).map((image, index) =>
                                (<img className='spot_img' key={index} src={image.url} alt={`Spot Image ${index + 1}`} />)
                            )}
                        </div>
                    </div>
                    <div className="host_reserve_container">
                        <div className="host_info_details">
                            <div>
                            <div className="reserve_spot_container">
                                    <div className="spot_details_owner_description">
                                        <h3>Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}</h3>
                                        <p>{spotDetails.description}</p>
                                    </div>
                                        <div className="reserve_info">
                                            <span className="spot_details_price_rating">
                                                 ${spotDetails.price}.00/night 
                                                <span>
                                                    {numReviews} reviews
                                                    ·
                                                    ★{avgRating}
                                                </span>
                                            </span>
                                            <div className="spot_details_reserve_button_container">
                                                <button onClick={() => alert('Feature is coming soon!')}>Reserve</button>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="reviews_header">
                        <div>★{avgRating} · {numReviews} reviews</div>
                    </div>
                    <div>
                        <LoadReviews spotId={spotId} updateReviewStats={updateReviewStats} editReviewStats={editReviewStats}/>
                    </div>
                </div>
            </div>
                )
            )}
    </div>
);
}

export default SpotDetails
import { useState, useEffect } from "react";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import { loadReviewsThunk } from "../../../store/reviews";
import { useDispatch, useSelector } from "react-redux";
import CreateReviewModal from "../CreateReviewModal/CreateReviewModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import UpdateReviewModal from "../UpdateReviewModal/UpdateReviewModal";


function LoadReviews({ spotId,updateReviewStats,editReviewStats }) {
    const dispatch = useDispatch();
    const reviews = useSelector((state) => state.reviews);
    // const spots = useSelector(state => state.spots)
    // const spotOwnerId = Object.values(spots).map(spot => spot.ownerId)[0]
    const [deletedReviewId, setDeletedReviewId] = useState(null);
    // const userId = useSelector((state) => state.session.user.id);
    const user = useSelector((state) => state.session.user);
    const userId = user ? user.id : null;
    // const reviewDates = Object.values(reviews).map((a,b) => new Date(a.createdAt) - new Date(b.createdAt))
    // if the spot belongs to the user, then don't show update, delete, create review buttons
    // We need to add logic for when the userId === ownerId, the Post Review button should not appear

    
    useEffect(() => {
        dispatch(loadReviewsThunk(spotId));
    }, [dispatch, spotId, deletedReviewId]); 

    const handleReviewDelete = (reviewId) => {
            setDeletedReviewId(reviewId)
            updateReviewStats(Object.values(reviews).find(review => review.id == reviewId), true)
    };

    const sortedReviews = Object.values(reviews)
    .filter((review) => review.createdAt) // Ensure `createdAt` exists
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const renderReview = (review) => {
        const date = new Date(review.createdAt);
        const options = { year: "numeric", month: "long" };
        const formattedDate = date.toLocaleDateString("en-US", options);
        
            return (
                <div key={review.id} className="load_reviews_container">
                    <div className="load_reviews_name_review_container">
                        <span id="load_reviews_name">{review.User?.firstName || "Unknown User"}</span>
                        <span>{formattedDate}</span>
                        <span>{review.review}</span>
                    </div>
                    {review.userId === userId ? (
                    <div className="review_buttons_update_delete">
                        <button id="review_delete_button" type="button">
                            <OpenModalMenuItem
                                itemText="Delete"
                                modalComponent={<DeleteReviewModal reviewId={review.id} onDelete={() => handleReviewDelete(review.id)} updateReviewStats={updateReviewStats}/>}
                            />
                        </button>
                        <button  id="review_update_button" type="button">
                            <OpenModalMenuItem
                                itemText="Update"
                                modalComponent={<UpdateReviewModal reviewId={review.id} prevRating={review.stars} editReviewStats={editReviewStats}/>} 
                            />
                        </button>
                    </div>
                    ) : ( Object.values(reviews).some((review) => review.userId === userId)?( 
                        <div></div>
                    ): ( user!== null ? (
                        <div key={review.id}>
                            <button className="post_review_button" type="button">
                                <OpenModalMenuItem
                                    itemText="Post a Review"
                                    modalComponent={<CreateReviewModal spotId={spotId} updateReviewStats={updateReviewStats}/>}
                                />
                            </button>
                        </div>
                    ): (
                        <div></div>
                    )
                    )
                    )}
                </div>
            );
    };

    return (
        <div>
             {sortedReviews && sortedReviews.length > 0 ? (
                sortedReviews.map(renderReview)
            ) : (
                <p>Loading reviews...</p>
            )}
        </div>
    );
}

export default LoadReviews;

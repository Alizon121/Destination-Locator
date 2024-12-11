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
    const [deletedReviewId, setDeletedReviewId] = useState(null);
    // const [updatedReviewId, setUpdatedReviewId] = useState(null);
    const userId = useSelector((state) => state.session.user.id);

    // console.log(Object.values(reviews).some((review) => review.userId === userId))
    useEffect(() => {
        dispatch(loadReviewsThunk(spotId));
    }, [dispatch, spotId, deletedReviewId]); //updatedReviewId May need to add this if editReviewStats does not work

    const handleReviewDelete = (reviewId) => {
            setDeletedReviewId(reviewId)
            updateReviewStats(Object.values(reviews).find(review => review.id == reviewId), true)
    };

//     const handleReviewUpdate = (reviewId) => {
//         setUpdatedReviewId(reviewId)
//         updateReviewStats(Object.values(reviews).find(review => review.id == reviewId), true)
// };

    const renderReview = (review) => {
        const date = new Date(review.createdAt);
        const options = { year: "numeric", month: "long" };
        const formattedDate = date.toLocaleDateString("en-US", options);

            return (
                <div key={review.id}>
                    <div>
                        <span>{review.User?.firstName || "Unknown User"}</span>
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
                                modalComponent={<UpdateReviewModal reviewId={review.id} prevRating={review.stars} editReviewStats={editReviewStats}/>} //May need to add this helper funciton for editing rating and reviews 'onUpdate={() => handleReviewUpdate(review.id)}'
                            />
                        </button>
                    </div>
                    ) : ( Object.values(reviews).some((review) => review.userId === userId)?(
                        <div></div>
                    ): (
                        <div key={review.id}>
                            <button type="button">
                                <OpenModalMenuItem
                                    itemText="Post a Review"
                                    modalComponent={<CreateReviewModal spotId={spotId} updateReviewStats={updateReviewStats}/>}
                                />
                            </button>
                        </div>

                    )
                    )}
                </div>
            );
    };

    return (
        <div>
            {reviews && Object.keys(reviews).length > 0 ? (
                Object.values(reviews).map(renderReview)
            ) : (
                <p>Loading reviews...</p>
            )}
        </div>
    );
}

export default LoadReviews;

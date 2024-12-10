import { useState, useEffect } from "react";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import { loadReviewsThunk } from "../../../store/reviews";
import { useDispatch, useSelector } from "react-redux";
import CreateReviewModal from "../CreateReviewModal/CreateReviewModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import UpdateReviewModal from "../UpdateReviewModal/UpdateReviewModal";

function LoadReviews({ spotId }) {
    const dispatch = useDispatch();
    const reviews = useSelector((state) => state.reviews);
    const [deletedReviewId, setDeletedReviewId] = useState(null);
    const userId = useSelector((state) => state.session.user.id);

    useEffect(() => {
        dispatch(loadReviewsThunk(spotId));
    }, [dispatch, spotId, deletedReviewId]);

    const handleReviewDelete = (reviewId) => {
        // Trigger delete logic (if needed)
        setDeletedReviewId(reviewId)
    };

    const renderReview = (review) => {
        const date = new Date(review.createdAt);
        const options = { year: "numeric", month: "long" };
        const formattedDate = date.toLocaleDateString("en-US", options);

        if (review.userId === userId) {
            return (
                <div key={review.id}>
                    <div>
                        <span>{review.User?.firstName || "Unknown User"}</span>
                        <span>{formattedDate}</span>
                        <span>{review.review}</span>
                    </div>
                    <div className="review_buttons_update_delete">
                        <button id="review_delete_button" type="button">
                            <OpenModalMenuItem
                                itemText="Delete"
                                modalComponent={<DeleteReviewModal reviewId={review.id} onDelete={() => handleReviewDelete(review.id)} />}
                            />
                        </button>
                        <button  id="review_update_button" type="button">
                            <OpenModalMenuItem
                                itemText="Update"
                                modalComponent={<UpdateReviewModal reviewId={review.id} />}
                            />
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div key={review.id}>
                <div>
                    <span>{review.User?.firstName || "Unknown User"}</span>
                    <span>{formattedDate}</span>
                    <span>{review.review}</span>
                </div>
                <button type="button">
                    <OpenModalMenuItem
                        itemText="Post a Review"
                        modalComponent={<CreateReviewModal spotId={spotId} />}
                    />
                </button>
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

import { loadCurrentUserReviews } from '../../../store/reviews';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import OpenModalMenuItem from '../../Navigation/OpenModalMenuItem';
// import { useModal } from '../../../context/Modal';
import UpdateReviewModal from '../UpdateReviewModal/UpdateReviewModal';
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';
import './ManageReviews.css'

function ManageReviews() {
    const dispatch = useDispatch()
    const reviews = useSelector((state) => state.reviews);
    const [deletedReviewId, setDeletedReviewId] = useState(null);


    useEffect(() => {
        dispatch(loadCurrentUserReviews())
    }, [dispatch, deletedReviewId])

    const handleReviewDelete = (reviewId) => {
        setDeletedReviewId(reviewId)
    };

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
                                modalComponent={<UpdateReviewModal reviewId={review.id}/>}
                            />
                        </button>
                    </div>
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

export default ManageReviews;
import { loadCurrentUserReviews } from '../../../store/reviews';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import OpenModalMenuItem from '../../Navigation/OpenModalMenuItem';
import UpdateReviewModal from '../UpdateReviewModal/UpdateReviewModal';
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';
import './ManageReviews.css'

function ManageReviews() {
    const dispatch = useDispatch()
    const reviews = useSelector((state) => state.reviews);
    const [deletedReviewId, setDeletedReviewId] = useState(null);
    // console.log(Object.values(reviews).map(review => review.stars))

    useEffect(() => {
        dispatch(loadCurrentUserReviews())
    }, [dispatch, deletedReviewId])

    const handleReviewDelete = (reviewId) => {
        setDeletedReviewId(reviewId)
    };

    // We need to update the stars and the review only in this section?s
    // const editReviewStats = (prevRating = null, editReview = null) => {
    //     const currentTotalRating = avgRating * numReviews
    //     const newTotalRating = currentTotalRating - prevRating + editReview.stars
    //     const updatedAvgStarRating = (newTotalRating/ numReviews).toFixed(1)
    //     setAvgRating(updatedAvgStarRating)
    // }

    const renderReview = (review) => {
        const date = new Date(review.createdAt);
        const options = { year: "numeric", month: "long" };
        const formattedDate = date.toLocaleDateString("en-US", options);

            return (
                <div className="manage_reviews_container" key={review.id}>
                    <div>
                        <h3>{review.User?.firstName || "Unknown User"}</h3>
                        <span className='manage_review_date'>{formattedDate}</span>
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
                                modalComponent={<UpdateReviewModal reviewId={review.id} prevRating={review.stars}/>}
                            />
                        </button>
                    </div>
                </div>
            );
    };

    return (
        <div>
            <h2>Manage Reviews</h2>
            {reviews && Object.keys(reviews).length > 0 ? (
                Object.values(reviews).map(renderReview)
            ) : (
                <p>Loading reviews...</p>
            )}
        </div>
    );
}

export default ManageReviews;
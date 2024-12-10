import { useEffect } from "react";
import { loadReviewsThunk } from "../../../store/reviews";
import { useDispatch, useSelector } from "react-redux";

function LoadReviews({spotId}) {
    // We want to render the reviews from the slice of state
    const dispatch = useDispatch();
    const reviews = useSelector(state => state.reviews[spotId]);
    useEffect(() => {
        dispatch(loadReviewsThunk(spotId))
    }, [dispatch, spotId]);

    return (
        <div>
            {reviews? (
                reviews.Reviews.map((review) => {
                    const date = new Date(review.createdAt);
                    const options = { year: 'numeric', month: 'long' };
                    const formattedDate = date.toLocaleDateString('en-US', options);

                    return(
                        <div key={review.id}>
                            <h3>{review.User.firstName}</h3>
                            <h4>{formattedDate}</h4>
                            <span>{review.review}</span>
                        </div>
                    )
                })
            ) : (
                <span>Loading reviews...</span>
            )}

        </div>
    )
}

export default LoadReviews;
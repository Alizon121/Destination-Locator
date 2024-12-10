import { useEffect } from "react";
import { loadReviewsThunk } from "../../../store/reviews";
import { useDispatch, useSelector } from "react-redux";

function LoadReviews({spotId}) {
    // We want to render the reviews from the slice of state
    const dispatch = useDispatch();
    const reviews = useSelector(state => state.reviews);
    // console.log(Object.values(reviews).map(review => review.User.firstName))
    
    useEffect(() => {
        dispatch(loadReviewsThunk(spotId))
    }, [dispatch, spotId]);

    return (
        <div>
            {reviews? (
                Object.values(reviews).map((review) => {
                    const date = new Date(review.createdAt);
                    const options = { year: 'numeric', month: 'long' };
                    const formattedDate = date.toLocaleDateString('en-US', options);

                    return(
                        <div key={review.id}>
                            <span>{review.User.firstName}</span>
                            <span>{formattedDate}</span>
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
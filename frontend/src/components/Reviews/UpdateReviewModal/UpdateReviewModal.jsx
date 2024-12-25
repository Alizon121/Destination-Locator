import { updateReviewThunk } from "../../../store/reviews";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";

function UpdateReviewModal({reviewId, prevRating, editReviewStats}){
    const dispatch = useDispatch();
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    // const reviews = useSelector(state => state.reviews)
    const [hover, setHover] = useState(0);
    const [errors, setErrors] = useState({})
    const [disabled, setDisabled] = useState(true)
    const updateReview = useSelector(state => state.reviews[reviewId])
    // const spots = useSelector(state => state.spots)
    const {closeModal} = useModal();
    const reviewIdString = reviewId.toString();
    // const spotId = Object.values(reviews).map((review) => review.spotId)[0]
    // const spotName = spots[spotId].name
    // console.log('SPOTS', spots)
    // console.log('SPOTS', Object.values(spots).map(spot => spot.name))

    // Validation for disabling the submit button
    useEffect(() => {
        if (review.length < 9) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }, [review])

    useEffect(() => {
        if (updateReview) {
            setReview(updateReview.review || '');
            setStars(updateReview.stars || '');
        } 
    }, [updateReview])

    const handleUpdate = async (e) => {
        e.preventDefault();

       // validations
       const newErrors = {};
       if (stars < 1 || stars > 5) { 
           newErrors.stars = "Stars must be an integer from 1 to 5.";
       }

       if (Object.keys(newErrors).length > 0) {
           setErrors(newErrors)
           return
       }

        const payload = {
            review,
            stars
        }

        const updatedReview = await dispatch(updateReviewThunk(payload, reviewIdString))
        if (updatedReview) {
            editReviewStats && (
                editReviewStats(prevRating, updatedReview)
            )
            closeModal()
        } else {
            setErrors({general: "Failed to update review."})
        }
    }

    return (
        <div>
            {/* <h1>How Was Your Stay at {spotName}?</h1> */}
            <form className="update_review_modal_form" onSubmit={handleUpdate}>
                <textarea 
                placeholder="Leave your review here"
                className="update_review_text_area"
                value={review}
                onChange={e => setReview(e.target.value)}
                >
                </textarea>
                <div className="star_rating"> 
                    {[...Array(5)].map((star, index) => 
                        { index += 1; 
                        return ( 
                        <button 
                            type="button" 
                            key={index} 
                            className={index <= (hover || stars) ? 
                            "on" : "off"} onClick={() => setStars(index)} onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(stars)} > 
                            <span className="star">&#9733;</span> 
                        </button> ); 
                    })} 
                </div>
            {errors.stars && <p className="error">{errors.stars}</p>}
            {errors.user && <p className="error">{errors.user}</p>}
            <div className="update_review_buttons">
                <button type="submit" disabled={disabled}>Submit</button>
                <button type="button" onClick={closeModal}>Cancel</button>
            </div>
            {errors.general && <p className="error">{errors.general}</p>}
            </form>
        </div>
    )
}

export default UpdateReviewModal;
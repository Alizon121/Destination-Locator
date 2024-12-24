import { createReviewThunk } from "../../../store/reviews";
import { useEffect, useState } from "react";
import { useModal } from "../../../context/Modal";
import { useDispatch, useSelector } from "react-redux";


function CreateReviewModal({spotId, updateReviewStats}) { 
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [hover, setHover] = useState(0)
    const [errors, setErrors] = useState({});
    const [disabled, setDisabled] = useState(true)
    const userId = useSelector(state => state.session.user.id)
    const reviews = useSelector(state => state.reviews)
    const spotIdNumber = Number(spotId);
    const dispatch = useDispatch();
    const {closeModal} = useModal();


    useEffect(() => {
        if (review.length < 9 || stars <= 0) {
            setDisabled(true)
        } else {
        setDisabled(false)
        }
    }, [review])

    const handleCreate = async (e) => {
        e.preventDefault();

        
        // validations

        const newErrors = {};
        if (stars < 1 || stars > 5) { 
            newErrors.stars = "Stars must be an integer from 1 to 5.";
        }

        // Make a validation for a user that already has a review
        const existingReview = Object.values(reviews).some((review) => review.spotId === spotIdNumber && review.userId === userId)
        if (existingReview) newErrors.user = "You have already reviewed this spot."
    
        if (isNaN(spotIdNumber)) {
            newErrors.general = "Invalid spot ID."
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }
    
        const payload = {
            review,
            stars
        };
    
        try {
            const newReview = await dispatch(createReviewThunk(payload, spotId));
            if (newReview) {
                updateReviewStats(newReview, false)
                closeModal();
            } else {
                setErrors({ general: "Failed to create the review. Please try again." });
            }
        } catch (error) {
            console.error('Error creating review:', error);
            setErrors({ general: "Failed to create the review. Please try again." });
        }
    };
    
    
    return (
        <div className="create_review_modal_info">
            <h1>How Was Your Stay?</h1>
            {errors.general && <p className="error">{errors.general}</p>}
            <form className="create_review_modal_form" onSubmit={handleCreate}>
                <textarea 
                placeholder="Leave your review here"
                className="create_review_text_area"
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
                    <span id="star_rating_footer">
                        Stars
                    </span>
                </div>
            {errors.stars && <p className="error">{errors.stars}</p>}
            {errors.user && <p className="error">{errors.user}</p>}
            <div className="create_review_buttons">
                <button type="submit" disabled={disabled}>Submit Your Review</button>
                {/* <button type="button" onClick={closeModal}>Cancel</button> */}
            </div>
            {errors.general && <p className="error">{errors.general}</p>}
            </form>
        </div>
    )
}

export default CreateReviewModal
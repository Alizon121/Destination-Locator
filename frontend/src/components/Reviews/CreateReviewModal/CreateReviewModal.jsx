import { createReviewThunk } from "../../store/reviews";
import { useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";


function CreateReviewModal({spotId}) { 
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [hover, setHover] = useState(0)
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const {closeModal} = useModal();
    // const user = useSelector(state => state.session)
    // const userId = user.user.id;
    // const { spotId } = useParams()
    // const spotIdNumber = Number(spotId);
    // console.log(spotIdNumber)

    const handleCreate = async (e) => {
        e.preventDefault();
    
        if (stars < 1 || stars > 5) { 
            setErrors({ stars: "Stars must be an integer from 1 to 5" }); 
            return; 
        }

        // Make a validation for a user that already has a review
        
    
        const spotIdNumber = Number(spotId);
        if (isNaN(spotIdNumber)) {
            setErrors({ general: "Invalid spot ID." });
            return;
        }
    
        const payload = {
            spotId: spotIdNumber,
            review,
            stars
        };
    
        try {
            const newReview = await dispatch(createReviewThunk(payload, spotId));
            if (newReview) {
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
        <div className="create_review_modal-info">
            <h1>How Was Your Stay?</h1>
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
                </div>
            {errors.stars && <p className="error">{errors.stars}</p>}
            <div className="create_review_buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={closeModal}>Cancel</button>
            </div>
            {errors.general && <p className="error">{errors.general}</p>}
            </form>
        </div>
    )
}

export default CreateReviewModal
import { updateReviewThunk } from "../../../store/reviews";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";

function UpdateReviewModal({reviewId}){
    const dispatch = useDispatch();
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [hover, setHover] = useState(0);
    const [errors, setErrors] = useState({})
    const {closeModal} = useModal();

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (stars < 1 || stars > 5) { 
            setErrors({ stars: "Stars must be an integer from 1 to 5" }); 
            return; 
        }

        const payload = {
            review,
            stars
        }

        const updatedReview = await dispatch(updateReviewThunk(payload, reviewId))
        if (updatedReview) {
            closeModal();
        } else {
            setErrors({general: "Failed to update review."})
        }
    }

    return (
        <div>
            <h1>How Was Your Stay?</h1>
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
            <div className="update_review_buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={closeModal}>Cancel</button>
            </div>
            {errors.general && <p className="error">{errors.general}</p>}
            </form>
        </div>
    )
}

export default UpdateReviewModal;
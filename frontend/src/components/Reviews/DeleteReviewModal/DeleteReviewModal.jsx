import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteReviewThunk } from "../../../store/reviews";


function DeleteReviewModal({reviewId, onDelete}) {
    const dispatch = useDispatch();
    const {closeModal} = useModal();

    const handleDelete = async () => {
        await dispatch(deleteReviewThunk(reviewId))
        closeModal()
        onDelete(reviewId)
    }

    return (
        <div className="delete_review_container">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <div className="delete_review_buttons">
                <button id="delete_review_button_yes" onClick={handleDelete}>Yes</button>
                <button onClick={closeModal}>No</button>
            </div> 
        </div>
    )
}

export default DeleteReviewModal;
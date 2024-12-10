import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteReviewThunk } from "../../../store/reviews";


function DeleteReviewModal({reviewId, onDelete}) {
    const dispatch = useDispatch();
    const {closeModal} = useModal();
    const handleDelete = async () => {
        await dispatch(deleteReviewThunk(reviewId))
        onDelete(reviewId)
        closeModal()
    }

    return (
        <div className="delete_review_container">
            <p>The review cannot be restored once deleted. Continue with deletion?</p>
            <div className="delete_review_buttons">
                <button onClick={handleDelete}>Yes</button>
                <button onClick={closeModal}>No</button>
            </div> 
        </div>
    )
}

export default DeleteReviewModal;
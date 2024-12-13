import { deleteSpotThunk } from '../../store/spots';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './DeleteSpotModal.css'

function DeleteSpotModal({spotId, onDelete}) {
    // we want to create a modal that can delete a spot
    const dispatch = useDispatch();
    const {closeModal} = useModal();
    const handleDelete = async () => {
        await dispatch(deleteSpotThunk(spotId))
        onDelete(spotId)
        closeModal()
    }

    return (
        <div className='delete_spot_container'>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot?</p>
            <div className='delete_spot_buttons'>
                <button id='delete_spot_button_yes' onClick={handleDelete}>Yes</button>
                <button onClick={closeModal}>No</button>
            </div>
                
        </div>
    )
}

export default DeleteSpotModal;
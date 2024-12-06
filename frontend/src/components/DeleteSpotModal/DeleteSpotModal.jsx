import { deleteSpotThunk } from '../../store/spots';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './DeleteSpotModal.css'

function DeleteSpotModal({spotId}) {
    // we want to create a modal that can delete a spot
    const dispatch = useDispatch();
    const {closeModal} = useModal();
    const handleDelete = async () => {
        await dispatch(deleteSpotThunk(spotId))
        closeModal()
    }

    return (
        <div className='delete_spot_container'>
            <p>The spot cannot be restored once deleted. Continue with deletion?</p>
            <div className='delete_spot_buttons'>
                <button onClick={handleDelete}>Yes</button>
                <button onClick={closeModal}>No</button>
            </div>
                
        </div>
    )
}

export default DeleteSpotModal;
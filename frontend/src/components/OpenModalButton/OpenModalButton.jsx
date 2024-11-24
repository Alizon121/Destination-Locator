import { useModal } from "../../context/Modal"

// modalComponent renders inside the Modal
// text of the button that opens the modal
// onModalClass: callback func that is called once button for opening modal is clicked
// onModalClose: cb fun that is called when modal is closed

function OpenModalButton({modalComponent, buttonText, onButtonClick, onModalClose}) {
    const {setModalContent, setOnModalClose} = useModal();

    const onClick = () => {
        if (onModalClose) setOnModalClose(onModalClose);
        setModalContent(modalComponent)

        if (typeof onButtonClick === "function") onButtonClick();
    }

    return <button onClick={onClick}>{buttonText}</button>
}

export default OpenModalButton
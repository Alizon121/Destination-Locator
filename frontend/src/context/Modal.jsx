// Portals in React provide a way to render React elements into an entirely separate HTML DOM element from where the React component is rendered.
import {useRef, useState, createContext, useContext } from 'react';
import ReactDOM from 'react-dom'
import './Modal.css'

const ModalContext = createContext();

export function ModalProvider({children}) {
    const modalRef = useRef();
    const [modalContent, setModalContent] = useState(null);
    const [onModalClose, setOnModalClose] = useState(null);

    // Callback to trigger the modal to close
    const closeModal = () => {
        setModalContent(null) // clear ModalContents

        if (typeof onModalClose === "function") { // if cb func is truthy, call cb and reset it
            setOnModalClose(null)
            onModalClose();
        }
    };

    const contextValue = {
        modalRef, // reference to modal div
        modalContent, // React component to render inside modal
        setModalContent, // function to set the React component to render inside modal
        setOnModalClose, // function to set the call bback function to be called when mnodal is closing
        closeModal
    }

    return (
        <>
            <ModalContext.Provider value={contextValue}>
                {children}
            </ModalContext.Provider>
            <div ref={modalRef}/>
        </>
    )
}

// Modal component 
export function Modal() {
    const { modalRef, modalContent, closeModal } = useContext(ModalContext)

    if (!modalRef || !modalRef.current || !modalContent) return null

    return ReactDOM.createPortal(
        <div id='modal'>
            <div id='modal-background' onClick={closeModal}/>
            <div id='modal-content'>{modalContent}</div>
        </div>,
        modalRef.current
    )
}

export const useModal = () => useContext(ModalContext);
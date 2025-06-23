import React, { useState, useEffect } from 'react';
import './Modal.css';

const Modal = ({ show, onClose, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [animationState, setAnimationState] = useState('');

    useEffect(() => {
        if (show) {
            setIsVisible(true);
       
            setTimeout(() => setAnimationState('entering'), 10);
        } else if (isVisible) {
            setAnimationState('exiting');
           
            setTimeout(() => {
                setIsVisible(false);
                setAnimationState('');
            }, 300);
        }
    }, [show, isVisible]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleCloseClick = () => {
        onClose();
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div 
            className={`modal-overlay ${animationState}`} 
            onClick={handleOverlayClick}
        >
            <div 
                className={`modal-content ${animationState}`} 
                onClick={e => e.stopPropagation()}
            >
                <button 
                    className="modal-close-button" 
                    onClick={handleCloseClick}
                    aria-label="Close modal"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
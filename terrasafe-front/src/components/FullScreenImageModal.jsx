import React from "react";

const FullScreenImageModal = ({ image, description, onClose }) => {
  return (
    <div className="fullscreen-modal">
      <div className="fullscreen-modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <img src={image.url} alt="place-damage" />
        <p>{description}</p>
      </div>
    </div>
  );
};

export default FullScreenImageModal;

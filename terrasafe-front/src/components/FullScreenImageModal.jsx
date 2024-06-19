import React, { useState } from "react";

const FullScreenImageModal = ({ image, description, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const maxLines = 3; // Number of lines to show initially
  const descriptionLines = description.split('\n');
  const truncatedDescription = descriptionLines.slice(0, maxLines).join('\n');
  const needsTruncation = descriptionLines.length > maxLines;

  return (
    <div className="fullscreen-modal">
      <div className="fullscreen-modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <img src={image.url} alt="place-damage" />
        <p>
          {isExpanded ? description : truncatedDescription}<br />
          {needsTruncation && (
            <span className="toggle-expand" onClick={toggleExpand}>
              {isExpanded ? "Afficher moins" : "Afficher plus"}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default FullScreenImageModal;

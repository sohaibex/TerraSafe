import React, { useState, useEffect } from "react";
const Modal = ({ show, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    /* form data structure */
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

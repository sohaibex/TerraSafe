import React, { useState } from "react";

const PopupContent = ({ feature, index, ingredientChecklist, onSubmit }) => {
  const [formState, setFormState] = useState({
    ingredients: ingredientChecklist.reduce((acc, item) => {
      acc[item] = false;
      return acc;
    }, {}),
    additionalNeeds: "",
    images: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormState((prevState) => ({
        ...prevState,
        ingredients: {
          ...prevState.ingredients,
          [name]: checked,
        },
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormState((prevState) => ({
      ...prevState,
      images: files,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState, index, feature.geometry.coordinates);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="ingredients-list">
        <strong>Ingrédients nécessaires :</strong><br />
        {ingredientChecklist.map((item) => (
          <div className="ingredient-item" key={item}>
            <input
              type="checkbox"
              id={`check-${item}-${index}`}
              name={item}
              checked={formState.ingredients[item]}
              onChange={handleChange}
            />
            <label htmlFor={`check-${item}-${index}`}>{item}</label><br />
          </div>
        ))}
      </div>
      <div className="additional-needs">
        <strong>Additional Needs:</strong><br />
        <input
          type="text"
          name="additionalNeeds"
          value={formState.additionalNeeds}
          onChange={handleChange}
        /><br /><br />
      </div>
      <div className="picture-options">
        <strong>Envoyer des photos Options:</strong><br />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        /><br /><br />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default PopupContent;

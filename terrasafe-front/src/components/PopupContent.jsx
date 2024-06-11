import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FullScreenImageModal from "./FullScreenImageModal"; // Import the modal component

const PopupContent = ({ feature, index, ingredientChecklist, onSubmit, helpRequestData, authoritiesContacts }) => {
  const [formState, setFormState] = useState({
    ingredients: ingredientChecklist.reduce((acc, item) => {
      acc[item] = false;
      return acc;
    }, {}),
    additionalNeeds: "",
    images: [],
    authoritiesContacts: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    if (helpRequestData) {
      setFormState((prevState) => ({
        ...prevState,
        ...helpRequestData,
      }));
    }
  }, [helpRequestData]);

  const convertDecimalToDMS = (decimal) => {
    const degrees = Math.floor(decimal);
    const minutesDecimal = (decimal - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = (minutesDecimal - minutes) * 60;
    return `${degrees}° ${minutes}' ${seconds.toFixed(3)}''`;
  };

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
    onSubmit(formState, index, feature.coordinates);
  };

  const place = feature.location;
  const latitude = feature.coordinates._latitude;
  const longitude = feature.coordinates._longitude;
  const latitudeDMS = convertDecimalToDMS(latitude);
  const longitudeDMS = convertDecimalToDMS(longitude);

  // Use a default object if helpRequestData is null or undefined
  const defaultHelpRequestData = {
    stuffNeeded: {},
    images: [],
  };

  const effectiveHelpRequestData = helpRequestData || defaultHelpRequestData;

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true); // Open modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="ville">
        <strong>Endroit:</strong>
        <br />
        Place: {place}
        <br />
      </div>
      <div className="coordinates">
        <strong>Coordonnées:</strong>
        <br />
        Latitude: {latitude} / N {latitudeDMS}
        <br />
        Longitude: {longitude} / E {longitudeDMS}
        <br />
      </div>
      <div className="help-request-data">
        {effectiveHelpRequestData.stuffNeeded && (
          <div className="ingredients-list">
            <strong>Ingrédients nécessaires :</strong>
            <br />
            {Object.entries(effectiveHelpRequestData.stuffNeeded).map(([key, value]) => (
              <div className="ingredient-item" key={key}>
                <input
                  type="checkbox"
                  id={`check-${key}-${index}`}
                  name={key}
                  checked={value}
                  onChange={handleChange}
                />
                <label htmlFor={`check-${key}-${index}`}>{key}</label>
                <br />
              </div>
            ))}
          </div>
        )}
        <div className="additional-needs">
          <strong>Les besoins:</strong>
          <br />
          <input
            type="text"
            name="additionalNeeds"
            value={formState.additionalNeeds}
            onChange={handleChange}
          />
          <br />
          <br />
        </div>
        
          <div className="authoritiesContacts">
            <strong>Contact des services:</strong>
            <br />
            {authoritiesContacts && (
              {authoritiesContacts}
            )}
            <input type="text" name="authoritiesContacts" value={formState.authoritiesContacts} onChange={handleChange} />
            <br />
            <br />
          </div>
        
        <div className="picture-options">
          <strong>Envoyer des photos Options:</strong>
          <br />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
          <br />
          <br />
        </div>
        <div className="images">
          {effectiveHelpRequestData.images && (
            effectiveHelpRequestData.images.length > 1 ? (
              <Slider {...sliderSettings}>
                {effectiveHelpRequestData.images.map((image) => (
                  <div key={image.id} className="image-item" onClick={() => handleImageClick(image)}>
                    <img src={image.url} alt="place-damage" />
                  </div>
                ))}
              </Slider>
            ) : (
              "No images available."
            )
          )}
        </div>
        {isModalOpen && selectedImage && (
          <FullScreenImageModal
            image={selectedImage}
            description={selectedImage.analysedImageDescription}
            onClose={handleCloseModal}
          />
        )}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default PopupContent;

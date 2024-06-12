import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";
import FullScreenImageModal from "./FullScreenImageModal"; // Import the modal component

const PopupContent = ({ feature, index, ingredientChecklist, onSubmit, helpRequestData, onClosePopup }) => {
  const [formState, setFormState] = useState({
    ingredients: {},
    additionalNeeds: "",
    images: [],
    authoritiesContacts: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (helpRequestData) {
      const updatedIngredients = ingredientChecklist.reduce((acc, item) => {
        acc[item] = helpRequestData.stuffNeeded[item] || false;
        return acc;
      }, {});

      setFormState({
        ingredients: updatedIngredients,
        additionalNeeds: helpRequestData.additionalNeeds || "",
        images: helpRequestData.images || [],
        authoritiesContacts: helpRequestData.authoritiesContacts || "",
      });
    }
  }, [helpRequestData, ingredientChecklist]);

  const convertDecimalToDMS = (decimal) => {
    const degrees = Math.floor(decimal);
    const minutesDecimal = (decimal - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = (minutesDecimal - minutes) * 60;
    return `${degrees}° ${minutes}' ${seconds.toFixed(3)}''`;
  };

  const handleChange = (e) => {
    const { name } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      ingredients: {
        ...prevState.ingredients,
        [name]: !prevState.ingredients[name], // Toggle the value
      },
    }));
  };
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormState((prevState) => ({
      ...prevState,
      images: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formState, index, feature.coordinates);
      setIsSubmitting(false);
      onClosePopup(); // Call the onClosePopup function
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
      onClosePopup();
    }
  };

  const place = feature.location;
  const latitude = feature.coordinates._latitude;
  const longitude = feature.coordinates._longitude;
  const latitudeDMS = convertDecimalToDMS(latitude);
  const longitudeDMS = convertDecimalToDMS(longitude);

  const defaultHelpRequestData = {
    stuffNeeded: {},
    images: [],
  };

  const effectiveHelpRequestData = helpRequestData || defaultHelpRequestData;

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
  };

  // Prepare the URL and message for sharing
  const stuffNeededList = Object.keys(effectiveHelpRequestData.stuffNeeded).join(", ");
  const shareUrl = window.location.href;
  const shareMessage = `Help needed for earthquake at ${place}. Ingredients required: ${stuffNeededList}. Coordinates: Latitude ${latitudeDMS}, Longitude ${longitudeDMS}.`;

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
            {Object.keys(effectiveHelpRequestData.stuffNeeded).length > 0 ? (
              <div className="ingredients-list">
                <strong>Ingrédients nécessaires :</strong>
                <br />
                {Object.entries(effectiveHelpRequestData.stuffNeeded).map(([key, value], index) => (
                  <div className="ingredient-item" key={key}>
                    <input
                      type="checkbox"
                      id={`check-${key}-${index}`}
                      name={key}
                      checked={value }
                      onChange={handleChange}
                    />
                    <label htmlFor={`check-${key}-${index}`}>{key}</label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-ingredients-message">
                Veuillez ajoutez les besoins nécessaires.
              </div>
            )}
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
          {effectiveHelpRequestData.images && effectiveHelpRequestData.images.length > 0 ? (
            effectiveHelpRequestData.images.length > 1 ? (
              <Slider {...sliderSettings}>
                {effectiveHelpRequestData.images.map((image) => (
                  <div key={image.id} className="image-item" onClick={() => handleImageClick(image)}>
                    <img src={image.url} alt="place-damage" />
                  </div>
                ))}
              </Slider>
            ) : (
              <div key={effectiveHelpRequestData.images[0].id} className="image-item" onClick={() => handleImageClick(effectiveHelpRequestData.images[0])}>
                <img src={effectiveHelpRequestData.images[0].url} alt="place-damage" />
              </div>
            )
          ) : (
            "No images available."
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
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "En cours..." : "Envoyer"}
      </button>
      {stuffNeededList && (
      <div className="social-share">
        <strong>Partager sur les réseaux:</strong>
        <br />
        <FacebookShareButton url={shareUrl} quote={shareMessage}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl} title={shareMessage}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <WhatsappShareButton url={shareUrl} title={shareMessage}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
      )}
    </form>
  );
};

export default PopupContent;
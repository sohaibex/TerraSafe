import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUpload } from '@fortawesome/free-solid-svg-icons';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const chatWithGPT3 = async (userInput) => {
    const apiEndpoint = 'https://api.openai.com/v1/engines/gpt-3.5-turbo/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer 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`
    };

    const data = {
      prompt: userInput,
      max_tokens: 150
    };

    try {
      const response = await axios.post(apiEndpoint, data, { headers });
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error communicating with the API:', error.message);
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { text: input, user: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const aiMessage = { text: '...', user: false };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    const response = await chatWithGPT3(input);
    const newAiMessage = { text: response, user: false };
    setMessages((prevMessages) => [...prevMessages.slice(0, -1), newAiMessage]);
    setInput('');
  };

  const openCamera = () => {
    setIsCameraOpen(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
      });
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const captureImage = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasRef.current.toBlob(async (blob) => {
      const userMessage = { text: 'Image sent', user: true, image: URL.createObjectURL(blob) };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      closeCamera();
      await uploadImage(blob);
    }, 'image/png');
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await fetch('https://us-central1-terrasafe-423412.cloudfunctions.net/analyzeEarthquakeImage', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Image Analysis:', result);
      const aiMessage = { text: `Image Analysis: ${result.description}`, user: false };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const userMessage = { text: 'Image sent', user: true, image: URL.createObjectURL(file) };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      await uploadImage(file);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.user ? 'user-message' : 'ai-message'}`}
          >
            {message.text}
            {message.image && <img src={message.image} alt="Captured" />}
          </div>
        ))}
      </div>
      <div className="camera-upload-buttons">
        <button onClick={openCamera}>
          <FontAwesomeIcon icon={faCamera} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button onClick={() => fileInputRef.current.click()}>
          <FontAwesomeIcon icon={faUpload} />
        </button>
      </div>
      <form className="chatbot-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écris ton message ici ..."
        />
        <button type="submit">Envoyer</button>
      </form>
      {isCameraOpen && (
        <div className="camera-container">
          <video ref={videoRef} autoPlay></video>
          <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>
          <button onClick={captureImage}>Capture</button>
          <button onClick={closeCamera}>Close Camera</button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
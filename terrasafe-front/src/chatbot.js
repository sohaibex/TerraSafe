import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

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
  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.user ? 'user-message' : 'ai-message'}`}
          >
            {message.text}
          </div>
        ))}
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
    </div>
  );
};
export default Chatbot;
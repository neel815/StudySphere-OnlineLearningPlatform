import React, { useEffect, useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return; // Prevent empty input

    // Add user message to the chat
    setMessages((prevMessages) => [...prevMessages, { text: userInput, sender: 'user' }]);

    try {
      const response = await fetch('YOUR_API_URL_HERE', { // Replace with actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_GEMINI_API_KEY}` // Ensure environment variable is correctly set
        },
        body: JSON.stringify({ message: userInput })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      // Add bot response to the chat
      setMessages((prevMessages) => [...prevMessages, { text: data.reply || "No response from bot.", sender: 'bot' }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [...prevMessages, { text: "Error fetching response", sender: 'bot' }]);
    } finally {
      setUserInput('');
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-icon" onClick={toggleChatbot}>
        <FaRobot size={40} />
      </div>
      {isOpen && (
        <div className="chatbot-window">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender === 'user' ? 'user-message' : 'bot-message'}>
                {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

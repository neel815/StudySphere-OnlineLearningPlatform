import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const sendMessage = async (message) => {
  try { 
    const response = await axios.get(`${API_URL}/chatbot/response`, {
      params: { prompt: message }
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message to AI:', error);
    throw error;
  }
}; 
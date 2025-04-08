const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

const getChatbotResponse = async (req, res) => {
    try {
        const { prompt } = req.query;
        
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); 
        
        // Start a chat session with correct history format
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "You are a helpful AI assistant for an educational platform called StudySphere. Your role is to help students with their queries about courses, learning materials, and general educational guidance. Keep your responses concise and focused on educational topics." }]
                },
                {
                    role: "model",
                    parts: [{ text: "I understand. I'll help students with their educational queries on StudySphere, providing concise and relevant information about courses, learning materials, and general educational guidance." }]
                }
            ],
        });

        // Send the message and get the response
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text });
    } catch (err) {
        console.error("Error in chatbot:", err);
        return res.status(500).json({ 
            error: "An error occurred while processing your request",
            details: err.message 
        });
    }
};

module.exports = { getChatbotResponse }; 
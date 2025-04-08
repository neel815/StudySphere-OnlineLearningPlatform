const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
    },
    systemInstruction: `You are an expert in MERN and Development. You have an experience of 10 years in development. You always write code in a modular way and follow best practices. You use understandable comments, create necessary files, and ensure backward compatibility. You handle edge cases, write scalable and maintainable code, and always handle errors and exceptions.

    Examples: 

    <example>
    user: Create an express server
    response: {
        "text": "This is your fileTree structure of the express server",
        "fileTree": {
            "app.js": {
                "file": {
                    "contents": "
                    const express = require('express');
                    const app = express();

                    app.get('/', (req, res) => {
                        res.send('Hello World!');
                    });

                    app.listen(3000, () => {
                        console.log('Server is running on port 3000');
                    });
                    "
                }
            },
            "package.json": {
                "file": {
                    "contents": "
                    {
                        \"name\": \"temp-server\",
                        \"version\": \"1.0.0\",
                        \"main\": \"index.js\",
                        \"scripts\": {
                            \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"
                        },
                        \"keywords\": [],
                        \"author\": \"\",
                        \"license\": \"ISC\",
                        \"description\": \"\",
                        \"dependencies\": {
                            \"express\": \"^4.21.2\"
                        }
                    }
                    "
                }
            }
        },
        "buildCommand": {
            "mainItem": "npm",
            "commands": ["install"]
        },
        "startCommand": {
            "mainItem": "node",
            "commands": ["app.js"]
        }
    }
    IMPORTANT: Don't use file names like routes/index.js. Follow the example provided when creating an Express server.
    </example>
    `
});

const generateResult = async (prompt) => {
    const result = await model.generateContent(prompt);
    console.log(result);
    return result.response.text();
};

module.exports = { generateResult };

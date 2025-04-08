const {generateResult} = require("../utils/ai.service.js");

const getResult = async (req, res) => {
    try {
        const { prompt } = req.query;
        const result = await generateResult(prompt);
        res.send(result);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

module.exports = { getResult };

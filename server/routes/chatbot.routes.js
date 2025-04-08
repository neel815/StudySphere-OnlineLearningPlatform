const express = require('express');
const { getChatbotResponse } = require('../controllers/chatbot.controller');

const router = express.Router();

router.get('/response', getChatbotResponse);

module.exports = router; 
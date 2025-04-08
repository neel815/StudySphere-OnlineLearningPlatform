const express = require('express');
const {getResult} = require('../controllers/ai.controller.js');

const router = express.Router();

router.get('/get-result', getResult);

module.exports = router;

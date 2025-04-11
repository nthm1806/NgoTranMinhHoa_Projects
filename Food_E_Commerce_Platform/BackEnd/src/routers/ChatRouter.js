const express = require('express');
const chatController = require('../controllers/ChatController');

const router = express.Router();

router.post('/get-question', chatController.getQuestion);
router.post('/get-chat', chatController.getChat);
router.post('/set-chat', chatController.setChat);


module.exports = router;
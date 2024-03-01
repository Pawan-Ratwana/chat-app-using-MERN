const express = require('express');
const router = express.Router();
const userController = require('../controller/user_controller');

router.post('/register', userController.register);
router.post('/login', userController.login)
router.post('/conversation', userController.conversation);
router.get('/conversation/:userId', userController.getConversation);
router.post('/message', userController.messages);
router.get('/message/:conversationId', userController.getMessage);
router.get('/allUsers', userController.allUsers);

module.exports = router;

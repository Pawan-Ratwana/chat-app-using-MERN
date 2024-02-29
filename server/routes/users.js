const express = require('express');
const router = express.Router();
const userController = require('../controller/user_controller');

router.post('/register', userController.register);
router.post('/login', userController.login)
router.post('/conversation', userController.conversation);
router.get('/conversation/:userId', userController.getConversation)

module.exports = router;
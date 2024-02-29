const express = require('express');
const router = express.Router();
const homeController = require('../controller/home_controller')

router.get('/home', homeController.home);
router.use('/api/users', require('./users'))
module.exports = router;
const express = require('express');
const userController = require('../Controllers/authController');
const router = express.Router({ mergeParams: true });

router.route('/register').post(userController.signUp);
router.route('/login').post(userController.login);

module.exports = router;

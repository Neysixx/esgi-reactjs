const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');

router.post('/signup', authController.signup);
router.post('/signup-admin', authController.signupAdmin);
router.post('/login', authController.login);
router.post('/login-admin', authController.loginAdmin);

module.exports = router;

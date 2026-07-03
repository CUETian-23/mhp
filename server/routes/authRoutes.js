const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/login/webauthn', authController.loginWithWebAuthn);
router.post('/logout', authenticate, authController.logout);
router.post('/logout/all', authenticate, authController.logoutAll);
router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, authController.updateProfile);
router.put('/preferences', authenticate, authController.updatePreferences);

module.exports = router;

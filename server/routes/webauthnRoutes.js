const express = require('express');
const router = express.Router();
const webauthnController = require('../controllers/webauthnController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/register/options', webauthnController.generateRegistrationOptions);
router.post('/register/verify', webauthnController.verifyRegistrationResponse);
router.post('/auth/options', webauthnController.generateAuthenticationOptions);
router.get('/credentials', authenticate, webauthnController.hasCredentials);
router.delete('/credentials/:credentialID', authenticate, webauthnController.removeCredential);

module.exports = router;

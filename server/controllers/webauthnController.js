const webauthnService = require('../services/webauthnService');

// Generate registration options
exports.generateRegistrationOptions = async (req, res) => {
  try {
    const { username } = req.body;
    const result = await webauthnService.generateRegistrationOptions(username);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify registration response
exports.verifyRegistrationResponse = async (req, res) => {
  try {
    const { userId, response, expectedChallenge } = req.body;
    const result = await webauthnService.verifyRegistrationResponse(
      userId,
      response,
      expectedChallenge
    );
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate authentication options
exports.generateAuthenticationOptions = async (req, res) => {
  try {
    const { username } = req.body;
    const result = await webauthnService.generateAuthenticationOptions(username);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Check if user has credentials
exports.hasCredentials = async (req, res) => {
  try {
    const hasCreds = await webauthnService.hasCredentials(req.user._id);
    res.json({
      success: true,
      hasCredentials: hasCreds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove credential
exports.removeCredential = async (req, res) => {
  try {
    const { credentialID } = req.params;
    const result = await webauthnService.removeCredential(req.user._id, credentialID);
    res.json({
      success: true,
      removed: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

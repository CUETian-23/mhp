const authService = require('../services/authService');
const webauthnService = require('../services/webauthnService');

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const result = await authService.register({ username, email, password, role });
    res.status(201).json({
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

// Login with password
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authService.loginWithPassword(username, password);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// Login with WebAuthn
exports.loginWithWebAuthn = async (req, res) => {
  try {
    const { username, response, challenge } = req.body;
    const result = await authService.loginWithWebAuthn(username, response, challenge);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    await authService.logout(token);
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Logout all sessions
exports.logoutAll = async (req, res) => {
  try {
    await authService.logoutAll(req.user._id);
    res.json({
      success: true,
      message: 'Logged out from all devices',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const result = await authService.updateProfile(req.user._id, req.body);
    res.json({
      success: true,
      user: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update preferences
exports.updatePreferences = async (req, res) => {
  try {
    const result = await authService.updatePreferences(req.user._id, req.body);
    res.json({
      success: true,
      user: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const User = require('../models/User');
const Session = require('../models/Session');
const { generateToken, verifyToken } = require('../config/auth');
const webauthnService = require('./webauthnService');

class AuthService {
  // Register new user
  async register(userData) {
    const { username, email, password, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: role || 'public',
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Create session
    await this.createSession(user._id, token);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  // Login with password
  async loginWithPassword(username, password) {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.password) {
      throw new Error('Password login not enabled for this account');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    // Generate token
    const token = generateToken(user._id);

    // Create session
    await this.createSession(user._id, token);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  // Login with WebAuthn
  async loginWithWebAuthn(username, response, challenge) {
    const result = await webauthnService.verifyAuthenticationResponse(
      username,
      response,
      challenge
    );

    if (!result.verified) {
      throw new Error('WebAuthn verification failed');
    }

    // Generate token
    const token = generateToken(result.user.id);

    // Create session
    await this.createSession(result.user.id, token);

    return {
      user: result.user,
      token,
    };
  }

  // Verify token and get user
  async verifyTokenAndGetUser(token) {
    const decoded = verifyToken(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    // Update session activity
    await Session.findOneAndUpdate(
      { token },
      { lastActivity: new Date() }
    );

    return this.sanitizeUser(user);
  }

  // Logout
  async logout(token) {
    await Session.deleteOne({ token });
    return { success: true };
  }

  // Logout all sessions
  async logoutAll(userId) {
    await Session.deleteMany({ user: userId });
    return { success: true };
  }

  // Create session
  async createSession(userId, token, deviceInfo = {}) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const session = new Session({
      user: userId,
      token,
      deviceInfo,
      expiresAt,
    });

    await session.save();
  }

  // Sanitize user object (remove sensitive data)
  sanitizeUser(user) {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }

  // Update user profile
  async updateProfile(userId, profileData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user.profile, profileData);
    await user.save();

    return this.sanitizeUser(user);
  }

  // Update user preferences
  async updatePreferences(userId, preferences) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user.preferences, preferences);
    await user.save();

    return this.sanitizeUser(user);
  }
}

module.exports = new AuthService();

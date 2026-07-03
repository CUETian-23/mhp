const { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } = require('@simplewebauthn/server');
const Credential = require('../models/Credential');
const User = require('../models/User');
const config = require('../config/webauthn');

class WebAuthnService {
  // Generate registration options for new credential
  async generateRegistrationOptions(username) {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }

    const existingCredentials = await Credential.find({ user: user._id });
    const credentialIDs = existingCredentials.map(c => c.credentialID);

    const options = await generateRegistrationOptions({
      rpName: 'Mental Health Platform',
      rpID: config.rpID,
      userID: user._id.toString(),
      userName: user.username,
      userDisplayName: user.email,
      attestationType: config.attestation,
      excludeCredentials: credentialIDs,
      authenticatorSelection: config.authenticatorSelection,
      timeout: config.timeout,
    });

    // Store challenge in session (in production, use Redis)
    return {
      options,
      user: {
        id: user._id,
        username: user.username,
      },
    };
  }

  // Verify registration response
  async verifyRegistrationResponse(userId, response, expectedChallenge) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const verification = await verifyRegistrationResponse({
      response: response,
      expectedChallenge: expectedChallenge,
      expectedOrigin: config.origin,
      expectedRPID: config.rpID,
    });

    if (!verification.verified) {
      throw new Error('Registration verification failed');
    }

    // Save credential to database
    const { registrationInfo } = verification;
    const credential = new Credential({
      user: user._id,
      credentialID: registrationInfo.credentialID,
      publicKey: registrationInfo.credentialPublicKey,
      counter: registrationInfo.counter,
      transports: response.response.transports,
      deviceType: registrationInfo.deviceType,
      backedUp: registrationInfo.backedUp,
    });

    await credential.save();

    return {
      verified: true,
      credentialID: credential.credentialID,
    };
  }

  // Generate authentication options
  async generateAuthenticationOptions(username) {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }

    const credentials = await Credential.find({ user: user._id });
    if (credentials.length === 0) {
      throw new Error('No credentials found for user');
    }

    const credentialIDs = credentials.map(c => c.credentialID);

    const options = await generateAuthenticationOptions({
      rpID: config.rpID,
      userVerification: config.authenticatorSelection.userVerification,
      allowCredentials: credentialIDs.map(id => ({
        id: id,
        type: 'public-key',
      })),
      timeout: config.timeout,
    });

    return {
      options,
      user: {
        id: user._id,
        username: user.username,
      },
    };
  }

  // Verify authentication response
  async verifyAuthenticationResponse(username, response, expectedChallenge) {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }

    const credential = await Credential.findOne({
      credentialID: response.id,
      user: user._id,
    });

    if (!credential) {
      throw new Error('Credential not found');
    }

    const verification = await verifyAuthenticationResponse({
      response: response,
      expectedChallenge: expectedChallenge,
      expectedOrigin: config.origin,
      expectedRPID: config.rpID,
      authenticator: {
        credentialID: credential.credentialID,
        credentialPublicKey: credential.publicKey,
        counter: credential.counter,
      },
    });

    if (!verification.verified) {
      throw new Error('Authentication verification failed');
    }

    // Update counter
    credential.counter = verification.authenticationInfo.newCounter;
    credential.lastUsed = new Date();
    await credential.save();

    // Update user last login
    user.lastLogin = new Date();
    await user.save();

    return {
      verified: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Check if user has WebAuthn credentials
  async hasCredentials(userId) {
    const count = await Credential.countDocuments({ user: userId });
    return count > 0;
  }

  // Remove credential
  async removeCredential(userId, credentialID) {
    const result = await Credential.findOneAndDelete({
      user: userId,
      credentialID: credentialID,
    });
    return result !== null;
  }
}

module.exports = new WebAuthnService();

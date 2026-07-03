const Credential = require('../models/Credential');

class CredentialService {
  // Get all credentials for a user
  async getUserCredentials(userId) {
    const credentials = await Credential.find({ user: userId })
      .sort({ createdAt: -1 });
    return credentials;
  }

  // Get credential by ID
  async getCredentialById(credentialId) {
    const credential = await Credential.findById(credentialId);
    return credential;
  }

  // Delete credential
  async deleteCredential(userId, credentialId) {
    const credential = await Credential.findOneAndDelete({
      _id: credentialId,
      user: userId,
    });
    return credential;
  }

  // Update credential last used
  async updateLastUsed(credentialId) {
    const credential = await Credential.findByIdAndUpdate(
      credentialId,
      { lastUsed: new Date() }
    );
    return credential;
  }
}

module.exports = new CredentialService();

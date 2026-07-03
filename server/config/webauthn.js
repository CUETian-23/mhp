const config = require('./environment');

module.exports = {
  rpID: config.webauthn.rpID,
  origin: config.webauthn.origin,
  timeout: config.webauthn.timeout,
  authenticatorSelection: {
    authenticatorAttachment: 'platform',
    userVerification: 'preferred',
  },
  attestation: 'none',
};

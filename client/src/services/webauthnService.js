import api from './api';

export const webauthnService = {
  generateRegistrationOptions: async (username) => {
    return await api.post('/webauthn/register/options', { username });
  },

  verifyRegistrationResponse: async (userId, response, expectedChallenge) => {
    return await api.post('/webauthn/register/verify', { userId, response, expectedChallenge });
  },

  generateAuthenticationOptions: async (username) => {
    return await api.post('/webauthn/auth/options', { username });
  },

  hasCredentials: async () => {
    return await api.get('/webauthn/credentials');
  },

  removeCredential: async (credentialID) => {
    return await api.delete(`/webauthn/credentials/${credentialID}`);
  },
};

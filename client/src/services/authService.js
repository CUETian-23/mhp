import api from './api';

export const authService = {
  login: async (username, password) => {
    return await api.post('/auth/login', { username, password });
  },

  loginWithWebAuthn: async (username, response, challenge) => {
    return await api.post('/auth/login/webauthn', { username, response, challenge });
  },

  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  logout: async () => {
    return await api.post('/auth/logout');
  },

  getMe: async () => {
    return await api.get('/auth/me');
  },

  updateProfile: async (profileData) => {
    return await api.put('/auth/profile', profileData);
  },

  updatePreferences: async (preferences) => {
    return await api.put('/auth/preferences', preferences);
  },
};

import api from './api';

export const moodService = {
  createMood: async (moodData) => {
    return await api.post('/mental-health/mood', moodData);
  },

  getMoodRecords: async (params) => {
    return await api.get('/mental-health/mood', { params });
  },

  getMoodStats: async (params) => {
    return await api.get('/mental-health/mood/stats', { params });
  },

  updateMood: async (id, data) => {
    return await api.put(`/mental-health/mood/${id}`, data);
  },

  deleteMood: async (id) => {
    return await api.delete(`/mental-health/mood/${id}`);
  },
};

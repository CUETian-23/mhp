import api from './api';

export const journalService = {
  createEntry: async (entryData) => {
    return await api.post('/mental-health/journal', entryData);
  },

  getEntries: async (params) => {
    return await api.get('/mental-health/journal', { params });
  },

  getEntry: async (id) => {
    return await api.get(`/mental-health/journal/${id}`);
  },

  updateEntry: async (id, data) => {
    return await api.put(`/mental-health/journal/${id}`, data);
  },

  deleteEntry: async (id) => {
    return await api.delete(`/mental-health/journal/${id}`);
  },
};

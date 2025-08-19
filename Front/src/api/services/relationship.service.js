import apiClient from '../config/axiosConfig';

export const RelationshipService = {
  getMine: async () => (await apiClient.get('/api/relationships/me')).data,
  saveProfile: async (payload) => (await apiClient.post('/api/relationships', payload)).data,
  addMilestone: async (payload) => (await apiClient.post('/api/relationships/milestones', payload)).data,
  addJournal: async (payload) => (await apiClient.post('/api/relationships/journal', payload)).data,
  addGift: async (payload) => (await apiClient.post('/api/relationships/gifts', payload)).data,
  addGoal: async (payload) => (await apiClient.post('/api/relationships/goals', payload)).data,
  updateLoveLanguages: async (payload) => (await apiClient.put('/api/relationships/love-languages', payload)).data,
};

export default RelationshipService;




import api from './api';

export const matchService = {
  async createMatch(donorId, requestId, notes = '') {
    const response = await api.post('/matches', { donorId, requestId, notes });
    return response.data;
  },

  async getMatchById(id) {
    const response = await api.get(`/matches/${id}`);
    return response.data;
  },

  async getAllMatches() {
    const response = await api.get('/matches');
    return response.data;
  },

  async getMatchesByDonor(donorId) {
    const response = await api.get(`/matches/by-donor/${donorId}`);
    return response.data;
  },

  async getMatchesByRequest(requestId) {
    const response = await api.get(`/matches/by-request/${requestId}`);
    return response.data;
  },

  async getCompatibleDonors(requestId) {
    const response = await api.get(`/matches/compatible/${requestId}`);
    return response.data;
  },

  async updateMatchStatus(id, status, notes = '') {
    const response = await api.put(`/matches/${id}/status`, { status, notes });
    return response.data;
  }
};

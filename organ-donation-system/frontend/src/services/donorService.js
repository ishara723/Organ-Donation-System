import api from './api';

export const donorService = {
  async createProfile(profileData) {
    const response = await api.post('/donors', profileData);
    return response.data;
  },

  async getMyProfile() {
    const response = await api.get('/donors/me');
    return response.data;
  },

  async getDonorById(id) {
    const response = await api.get(`/donors/${id}`);
    return response.data;
  },

  async getAllDonors() {
    const response = await api.get('/donors');
    return response.data;
  },

  async searchDonors(params) {
    const response = await api.get('/donors/search', { params });
    return response.data;
  },

  async verifyDonor(id, verified) {
    const response = await api.put(`/donors/${id}/verify`, null, {
      params: { verified }
    });
    return response.data;
  },

  async updateConsent(id, consentStatus) {
    const response = await api.put(`/donors/${id}/consent`, null, {
      params: { consentStatus }
    });
    return response.data;
  }
};

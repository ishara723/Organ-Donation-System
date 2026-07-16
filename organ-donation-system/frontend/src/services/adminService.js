import api from './api';

export const adminService = {
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  async getPendingDonors() {
    const response = await api.get('/admin/donors/pending');
    return response.data;
  },

  async getPendingRequests() {
    const response = await api.get('/admin/requests/pending');
    return response.data;
  },

  async getOrganTypes() {
    const response = await api.get('/organ-types');
    return response.data;
  }
};

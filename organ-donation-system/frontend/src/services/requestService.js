import api from './api';

export const requestService = {
  async createRequest(requestData) {
    const response = await api.post('/requests', requestData);
    return response.data;
  },

  async getRequestById(id) {
    const response = await api.get(`/requests/${id}`);
    return response.data;
  },

  async getMyRequests() {
    const response = await api.get('/requests/my-requests');
    return response.data;
  },

  async searchRequests(params) {
    const response = await api.get('/requests', { params });
    return response.data;
  },

  async getActiveRequests() {
    const response = await api.get('/requests/active');
    return response.data;
  },

  async updateStatus(id, status, notes = '') {
    const response = await api.put(`/requests/${id}/status`, { status, notes });
    return response.data;
  },

  async cancelRequest(id) {
    const response = await api.delete(`/requests/${id}`);
    return response.data;
  }
};

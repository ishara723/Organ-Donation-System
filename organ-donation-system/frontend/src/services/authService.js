import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(email, password, role) {
    const response = await api.post('/auth/register', { email, password, role });
    return response.data;
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('lifelink_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('lifelink_token');
  },

  logout() {
    localStorage.removeItem('lifelink_token');
    localStorage.removeItem('lifelink_user');
  }
};

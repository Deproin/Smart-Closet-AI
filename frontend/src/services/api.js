import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

// Add interceptor to include JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const closetApi = {
  // Auth
  getMe: () => api.get('/auth/me'),

  // Items
  getItems: () => api.get('/items/'),
  getItem: (id) => api.get(`/items/${id}`),
  addItem: (formData) => api.post('/items/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteItem: (id) => api.delete(`/items/${id}`),

  // AI & Recommendations
  getRecommendations: (data) => api.post('/ai/recommend', data),
  recognizeItem: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/ai/recognize', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default api;

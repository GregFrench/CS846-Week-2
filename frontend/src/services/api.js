import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (username, email, password, bio) =>
    api.post('/auth/register', { username, email, password, bio }),
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
};

export const postsService = {
  getFeed: () => api.get('/posts/feed'),
  createPost: (content) => api.post('/posts', { content }),
  getPost: (postId) => api.get(`/posts/${postId}`),
  likePost: (postId) => api.post(`/posts/${postId}/like`),
  unlikePost: (postId) => api.delete(`/posts/${postId}/like`),
  replyToPost: (postId, content) => api.post(`/posts/${postId}/reply`, { content }),
};

export const usersService = {
  getProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (userId, bio) => api.put(`/users/${userId}`, { bio }),
};

export default api;

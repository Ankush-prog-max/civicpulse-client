import axios from 'axios';

const API_BASE_URL = 'https://civicpulse-server-one.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('civicpulse_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('civicpulse_token');
      localStorage.removeItem('civicpulse_user');
    }
    return Promise.reject(err);
  }
);

export default api;

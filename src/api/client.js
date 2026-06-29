import axios from 'axios';

// In local dev, '/api' is relative and handled by Vite's proxy (vite.config.js)
// to localhost:5000. In production on Vercel, the frontend and backend are
// separate deployments, so VITE_API_BASE_URL must point at the deployed
// backend's URL (e.g. https://civicpulse-api.vercel.app/api).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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

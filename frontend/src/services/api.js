import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hireiq_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry / authorization errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized means the token is expired or invalid
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('hireiq_token');
      localStorage.removeItem('hireiq_email');
      localStorage.removeItem('hireiq_role');
      
      // Avoid redirect loops on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

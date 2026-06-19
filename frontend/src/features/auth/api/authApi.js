import api from '../../../services/api';

export const loginUser = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data; // Response contains: token, email, role
};

export const registerUser = async (details) => {
  const response = await api.post('/api/auth/register', details);
  return response.data; // Response contains: token, email, role
};

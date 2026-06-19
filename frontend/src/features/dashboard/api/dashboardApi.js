import api from '../../../services/api';

export const getRecruiterDashboard = async () => {
  const response = await api.get('/api/analytics/recruiter-dashboard');
  return response.data;
};

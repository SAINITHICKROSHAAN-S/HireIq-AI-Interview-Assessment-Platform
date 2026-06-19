import api from '../../../services/api';

export const getRecruiterDashboard = async () => {
  const response = await api.get('/api/analytics/recruiter-dashboard');
  return response.data;
};

export const getAssessmentAnalytics = async (assessmentId) => {
  const response = await api.get(`/api/analytics/assessment/${assessmentId}`);
  return response.data;
};

export const getQuestionAnalytics = async (questionId) => {
  const response = await api.get(`/api/analytics/question/${questionId}`);
  return response.data;
};

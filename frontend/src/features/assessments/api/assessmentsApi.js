import api from '../../../services/api';

export const getAllAssessments = async () => {
  const response = await api.get('/api/assessments');
  return response.data;
};

export const getAssessmentById = async (id) => {
  const response = await api.get(`/api/assessments/${id}`);
  return response.data;
};

export const createAssessment = async (data) => {
  const response = await api.post('/api/assessments', data);
  return response.data;
};

export const updateAssessment = async ({ id, ...data }) => {
  const response = await api.put(`/api/assessments/${id}`, data);
  return response.data;
};

export const deleteAssessment = async (id) => {
  const response = await api.delete(`/api/assessments/${id}`);
  return response.data;
};

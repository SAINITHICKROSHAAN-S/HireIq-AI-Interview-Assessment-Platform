import api from '../../../services/api';

export const getQuestionsByAssessment = async (assessmentId) => {
  const response = await api.get(`/api/assessments/${assessmentId}/questions`);
  return response.data;
};

export const getQuestionById = async (id) => {
  const response = await api.get(`/api/questions/${id}`);
  return response.data;
};

export const addQuestion = async ({ assessmentId, ...data }) => {
  const response = await api.post(`/api/assessments/${assessmentId}/questions`, data);
  return response.data;
};

export const updateQuestion = async ({ id, ...data }) => {
  const response = await api.put(`/api/questions/${id}`, data);
  return response.data;
};

export const deleteQuestion = async (id) => {
  const response = await api.delete(`/api/questions/${id}`);
  return response.data;
};

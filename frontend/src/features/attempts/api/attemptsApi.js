import api from '../../../services/api';

export const startAttempt = async (assessmentId) => {
  const response = await api.post(`/api/attempts/start/${assessmentId}`);
  return response.data;
};

export const submitAnswer = async ({ attemptId, questionId, selectedOptionId }) => {
  const response = await api.post(`/api/attempts/${attemptId}/answers`, {
    questionId,
    selectedOptionId
  });
  return response.data;
};

export const submitAttempt = async (attemptId) => {
  const response = await api.post(`/api/attempts/${attemptId}/submit`);
  return response.data;
};

export const getAttemptResult = async (attemptId) => {
  const response = await api.get(`/api/attempts/${attemptId}/results`);
  return response.data;
};

import api from '../../../services/api';

export const analyzeResume = async (resumeText) => {
  const response = await api.post('/api/resume/analyze', { resumeText });
  return response.data;
};

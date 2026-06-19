import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getQuestionsByAssessment,
  addQuestion,
  updateQuestion,
  deleteQuestion
} from '../api/questionsApi';

export const useAllQuestionsQuery = (assessments) => {
  return useQuery({
    queryKey: ['allQuestions', assessments?.map(a => a.id)],
    queryFn: async () => {
      if (!assessments || assessments.length === 0) return [];
      const promises = assessments.map(async (ass) => {
        try {
          const data = await getQuestionsByAssessment(ass.id);
          // Attach assessment details to each question
          return data.map(q => ({
            ...q,
            assessmentName: ass.title,
            assessmentId: ass.id
          }));
        } catch (e) {
          console.error(`Failed to fetch questions for assessment ${ass.id}`, e);
          return [];
        }
      });
      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: !!assessments && assessments.length > 0,
    staleTime: 10000, // cache for 10 seconds
  });
};

export const useCreateQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allQuestions'] });
    }
  });
};

export const useUpdateQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateQuestion,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['allQuestions'] });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ['question', data.id] });
      }
    }
  });
};

export const useDeleteQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allQuestions'] });
    }
  });
};

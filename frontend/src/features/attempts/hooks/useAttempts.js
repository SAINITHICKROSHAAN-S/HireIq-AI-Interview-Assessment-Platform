import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  startAttempt,
  submitAnswer,
  submitAttempt,
  getAttemptResult
} from '../api/attemptsApi';

export const useStartAttemptMutation = () => {
  return useMutation({
    mutationFn: startAttempt
  });
};

export const useSubmitAnswerMutation = () => {
  return useMutation({
    mutationFn: submitAnswer
  });
};

export const useSubmitAttemptMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitAttempt,
    onSuccess: (data) => {
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ['attemptResult', data.id] });
      }
    }
  });
};

export const useAttemptResultQuery = (attemptId) => {
  return useQuery({
    queryKey: ['attemptResult', attemptId],
    queryFn: () => getAttemptResult(attemptId),
    enabled: !!attemptId,
    retry: 1,
    staleTime: 60000 // 1 minute
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllAssessments,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} from '../api/assessmentsApi';

export const useAssessmentsQuery = () => {
  return useQuery({
    queryKey: ['assessments'],
    queryFn: getAllAssessments,
    staleTime: 10000, // Cache results for 10 seconds
  });
};

export const useCreateAssessmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });
};

export const useUpdateAssessmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAssessment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ['assessment', data.id] });
      }
    },
  });
};

export const useDeleteAssessmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });
};

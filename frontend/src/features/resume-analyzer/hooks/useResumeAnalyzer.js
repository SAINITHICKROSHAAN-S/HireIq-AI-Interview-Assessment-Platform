import { useMutation } from '@tanstack/react-query';
import { analyzeResume } from '../api/resumeApi';

export const useResumeAnalyzerMutation = () =>
  useMutation({
    mutationFn: analyzeResume
  });

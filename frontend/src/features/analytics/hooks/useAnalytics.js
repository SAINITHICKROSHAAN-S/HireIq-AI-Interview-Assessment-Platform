import { useQuery } from '@tanstack/react-query';
import {
  getRecruiterDashboard,
  getAssessmentAnalytics,
  getQuestionAnalytics
} from '../api/analyticsApi';

export const useRecruiterDashboardQuery = () =>
  useQuery({
    queryKey: ['recruiterDashboard'],
    queryFn: getRecruiterDashboard,
    staleTime: 30000
  });

export const useAssessmentAnalyticsQuery = (assessmentId) =>
  useQuery({
    queryKey: ['assessmentAnalytics', assessmentId],
    queryFn: () => getAssessmentAnalytics(assessmentId),
    enabled: !!assessmentId,
    staleTime: 30000
  });

export const useQuestionAnalyticsQuery = (questionId) =>
  useQuery({
    queryKey: ['questionAnalytics', questionId],
    queryFn: () => getQuestionAnalytics(questionId),
    enabled: !!questionId,
    staleTime: 30000
  });

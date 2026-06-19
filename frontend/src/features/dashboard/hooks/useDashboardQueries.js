import { useQuery } from '@tanstack/react-query';
import { getRecruiterDashboard } from '../api/dashboardApi';

export const useRecruiterDashboardQuery = () => {
  return useQuery({
    queryKey: ['recruiterDashboard'],
    queryFn: getRecruiterDashboard,
    staleTime: 30000, // Cache results for 30 seconds before re-fetching
  });
};

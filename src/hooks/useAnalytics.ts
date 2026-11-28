import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';

export function useAdminOverview(days = 7) {
  return useQuery({
    queryKey: ['admin-overview', days],
    queryFn: () => analyticsService.getAdminOverview(days),
  });
}

export function useBranchOverview(days = 7, branchId?: string) {
  return useQuery({
    queryKey: ['manager-overview', days, branchId || 'my-branch'],
    queryFn: () => analyticsService.getBranchOverview(days, branchId),
  });
}

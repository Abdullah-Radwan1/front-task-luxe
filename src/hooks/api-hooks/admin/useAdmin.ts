import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { api } from '#/lib/mock-data'

import { dashboardStatsSchema, type DashboardStats } from './adminSchema'

export function useDashboardStats<TData = DashboardStats>(
  options?: UseQueryOptions<DashboardStats, Error, TData>,
) {
  return useQuery<DashboardStats, Error, TData>({
    queryKey: ['dashboard-stats'],
    staleTime: 1000 * 60 * 5, // Keep data "fresh" for 5 minutes
    queryFn: async () => {
      const stats = await api.getDashboardStats()
      return dashboardStatsSchema.parse(stats)
    },
    ...options,
  })
}

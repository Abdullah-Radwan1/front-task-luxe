import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { api } from '#/lib/mock-data'

import { dashboardStatsSchema, type DashboardStats } from './adminSchema'

export function useDashboardStats<TData = DashboardStats>(
  options?: UseQueryOptions<DashboardStats, Error, TData>,
) {
  return useQuery<DashboardStats, Error, TData>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const stats = await api.getDashboardStats()
      return dashboardStatsSchema.parse(stats)
    },
    ...options,
  })
}

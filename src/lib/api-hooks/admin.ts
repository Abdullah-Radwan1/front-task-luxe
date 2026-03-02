import { useQuery } from '@tanstack/react-query'
import { api } from '../mock-data'

export function useDashboardStats() {
  // unknown shape so we let TypeScript infer as any by default
  return useQuery<Record<string, number>, Error>({
    queryKey: ['dashboard-stats'],
    queryFn: api.getDashboardStats,
  })
}

import { z } from 'zod'

export const dashboardStatsSchema = z.object({
  totalRevenue: z.number(),
  totalOrders: z.number(),
  totalProducts: z.number(),
  totalUsers: z.number(),
})

export type DashboardStats = z.infer<typeof dashboardStatsSchema>

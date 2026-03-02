import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { DollarSign, ShoppingBag, Package, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/mock-data'
import { Skeleton } from '@/components/ui/skeleton'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_admin/dashboard')({
  component: AdminDashboard,
})

const statIcons = [DollarSign, ShoppingBag, Package, Users]
const statKeys = [
  'totalRevenue',
  'totalOrders',
  'totalProducts',
  'totalUsers',
] as const

export function AdminDashboard() {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: api.getDashboardStats,
  })

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">
        {t('admin.dashboard')}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statKeys.map((key, i) => {
          const Icon = statIcons[i]
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t(`admin.${key}`)}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <p className="text-2xl font-bold">
                      {key === 'totalRevenue'
                        ? `$${data?.[key].toLocaleString()}`
                        : data?.[key]}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

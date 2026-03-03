import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowUpRight,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardStats } from '#/lib/api-hooks/admin'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_admin/dashboard')({
  component: AdminDashboard,
})

// Enhanced stat cards with gradients and dynamic colors
const statCards = [
  {
    key: 'totalRevenue',
    icon: DollarSign,
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
    prefix: '$',
    trend: '+12.5%',
    trendUp: true,
  },
  {
    key: 'totalOrders',
    icon: ShoppingBag,
    gradient: 'from-blue-500/10 to-blue-500/5',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    trend: '+8.2%',
    trendUp: true,
  },
  {
    key: 'totalProducts',
    icon: Package,
    gradient: 'from-amber-500/10 to-amber-500/5',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    trend: '+3.1%',
    trendUp: true,
  },
  {
    key: 'totalUsers',
    icon: Users,
    gradient: 'from-purple-500/10 to-purple-500/5',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
    trend: '+5.7%',
    trendUp: true,
  },
]

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function AdminDashboard() {
  const { t } = useTranslation()
  const { data, isLoading } = useDashboardStats()

  // Simulated data for trends (in real app, this would come from API)
  const lastUpdated = new Date().toLocaleTimeString()

  return (
    <div className="space-y-8">
      {/* Header with decorative elements */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Title with sparkle effect */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-xl">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {t('admin.dashboard')}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>

          {/* Quick stats pill */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-accent/5 rounded-full border border-accent/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Live Data</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          const value = data?.[stat.key as keyof typeof data]

          return (
            <motion.div key={stat.key} variants={itemVariants}>
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Gradient background that appears on hover */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-white/5 to-transparent rounded-bl-[100px]" />

                <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t(`admin.${stat.key}`)}
                  </CardTitle>
                  <div
                    className={`p-2 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
                </CardHeader>

                <CardContent className="relative">
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold">
                          {stat.prefix}
                          {value?.toLocaleString()}
                        </p>

                        {/* Trend indicator */}
                        <div
                          className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded-full ${
                            stat.trendUp
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                              : 'bg-red-500/10 text-red-600 dark:text-red-400'
                          }`}
                        >
                          {stat.trendUp ? (
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-0.5" />
                          )}
                          {stat.trend}
                        </div>
                      </div>

                      {/* Mini sparkline (simulated) */}
                      <div className="flex items-end gap-0.5 h-8 mt-2">
                        {[...Array(7)].map((_, j) => (
                          <div
                            key={j}
                            className={`w-1.5 rounded-t-sm transition-all duration-300 ${stat.iconColor.replace(
                              'text',
                              'bg',
                            )} opacity-${Math.floor(Math.random() * 50 + 30)}`}
                            style={{ height: `${Math.random() * 24 + 8}px` }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>

                {/* Bottom glow effect */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-${stat.iconColor.replace('text-', '')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}
                />
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Quick Actions or Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Recent Activity Card */}
        <Card className="relative overflow-hidden bg-linear-to-br from-primary/5 to-transparent border-primary/10">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-1.5 bg-accent/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-accent" />
              </div>
              {t('dashboard.recentActivity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-accent/50" />
                  <span className="text-muted-foreground">
                    {t('dashboard.newOrder', { orderNumber: `#123${i}` })}
                  </span>
                  <span
                    className={`ml-auto rtl:mr-auto rtl:ml-0 text-xs text-muted-foreground/60`}
                  >
                    {t('dashboard.timeAgo', { minutes: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Card */}
        <Card className="relative overflow-hidden bg-linear-to-br from-accent/5 to-transparent border-accent/10">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Package className="h-4 w-4 text-primary" />
              </div>
              {t('dashboard.inventoryStatus')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {t('dashboard.lowStockItems')}
                </span>
                <span className="font-semibold text-amber-500">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {t('dashboard.outOfStock')}
                </span>
                <span className="font-semibold text-red-500">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {t('dashboard.newThisWeek')}
                </span>
                <span className="font-semibold text-green-500">12</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ShoppingBag, ArrowRight, Package } from 'lucide-react'
import { orders } from '@/lib/mock-data'

export const Route = createFileRoute('/orders')({
  beforeLoad: () => {
    const user = useAuthStore.getState().user

    if (!user) {
      throw redirect({ to: '/login' })
    }

    if (user.role === 'admin') {
      throw redirect({ to: '/admin' })
    }
  },
  component: Orders,
})

function Orders() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // Filter orders by current user's email
  const userOrders = orders.filter((order) => order.email === user?.email)

  const getStatusColor = (
    status: 'pending' | 'completed' | 'cancelled',
  ): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400'
      case 'cancelled':
        return 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1  py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header Section */}
          <div className="mb-12 pb-8 border-b border-border/50">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start justify-between gap-4 flex-wrap"
            >
              <div>
                <h1 className="font-display text-5xl font-bold mb-2 bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                  {t('orders.title')}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {t('orders.subtitle', { count: userOrders.length })}
                </p>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="h-20 w-20 rounded-full bg-linear-to-r from-primary to-accent/50 flex items-center justify-center shrink-0"
              >
                <ShoppingBag className="h-10 w-10 text-white" />
              </motion.div>
            </motion.div>
          </div>

          {/* Empty State */}
          {userOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-6 p-4 rounded-full bg-muted">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">
                {t('orders.noOrders')}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                {t('orders.noOrdersDesc')}
              </p>
              <Button
                onClick={() => navigate({ to: '/products' })} // Fix: Navigate uses object syntax
                className="gap-2"
              >
                {t('orders.startShopping')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              {userOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-linear-to-r from-card to-muted/20">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                        {/* Order ID & Date */}
                        <div className="md:col-span-1">
                          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                            {t('orders.orderId')}
                          </p>
                          <p className="font-display font-bold break-all">
                            {order.id}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Status */}
                        <div className="md:col-span-1">
                          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                            {t('orders.status')}
                          </p>
                          <div
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(
                              order.status as
                                | 'pending'
                                | 'completed'
                                | 'cancelled',
                            )}`}
                          >
                            {t(`orders.status_${order.status}`)}
                          </div>
                        </div>

                        {/* Items Count */}
                        <div className="md:col-span-1">
                          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                            {t('orders.items')}
                          </p>
                          <p className="font-display text-xl font-bold">
                            {order.items.reduce(
                              (sum, item) => sum + item.quantity,
                              0,
                            )}
                          </p>
                        </div>

                        {/* Total Amount */}
                        <div className="md:col-span-1">
                          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide mb-2">
                            {t('orders.total')}
                          </p>
                          <p className="font-display text-2xl font-bold text-primary">
                            ${order.total.toFixed(2)}
                          </p>
                        </div>

                        {/* Action */}
                        <div className="md:col-span-1 flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-primary/20 hover:bg-primary/5"
                          >
                            {t('orders.viewDetails')}
                          </Button>
                          {order.status !== 'cancelled' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => navigate({ to: '/products' })}
                            >
                              {t('orders.reorder')}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="mt-6 pt-6 border-t border-border/30">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-3">
                          {t('orders.itemsOrdered')}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="px-3 py-1 rounded-full bg-muted text-xs"
                            >
                              {t('orders.itemCount', { count: item.quantity })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 pt-8 border-t border-border/50"
              >
                <Card className="bg-linear-to-br from-primary/5 to-accent/5 border-primary/20">
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground font-semibold mb-1">
                        {t('orders.totalOrders')}
                      </p>
                      <p className="font-display text-3xl font-bold">
                        {userOrders.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-semibold mb-1">
                        {t('orders.totalSpent')}
                      </p>
                      <p className="font-display text-3xl font-bold text-primary">
                        $
                        {userOrders
                          .reduce((sum, order) => sum + order.total, 0)
                          .toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={() => navigate({ to: '/products' })}
                        className="w-full gap-2"
                      >
                        {t('orders.continueShopping')}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}

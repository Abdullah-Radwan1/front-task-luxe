import { useNavigate } from '@tanstack/react-router'
// import { orderSuccessRoute } from "@/routeTree.gen";
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { CheckCircle, ShoppingBag, Mail, ArrowRight } from 'lucide-react'
import { orders } from '@/lib/mock-data'

// src/routes/OrderSuccess.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/orderSuccess')({
  component: OrderSuccess,
})
export default function OrderSuccess() {
  // const { orderId } = orderSuccessRoute.useParams();
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // Find the order by ID
  const order = orders.find((o) => o.id === 'orderId')
  // we can get the oder from zustand store instead of fetching btw
  // Redirect if no order found or user not authenticated
  if (!user) {
    navigate({ to: '/login' })
    return null
  }

  if (!order) {
    navigate({ to: '/products' })
    return null
  }

  // Prevent admin from viewing orders
  if (user.role === 'admin') {
    navigate({ to: '/admin' })
    return null
  }

  return (
    <main className="flex-1  mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Success Message */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="relative h-24 w-24">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <CheckCircle className="h-24 w-24 text-green-500" />
              </motion.div>
            </div>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-5xl font-bold mb-4"
          >
            {t('orderSuccess.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg"
          >
            {t('orderSuccess.subtitle')}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="bg-linear-to-br from-card to-muted/30">
              <CardHeader>
                <CardTitle>{t('orderSuccess.orderDetails')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order ID & Date */}
                <div className="grid grid-cols-2 gap-6 pb-6 border-b border-border/30">
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold mb-2">
                      {t('orders.orderId')}
                    </p>
                    <p className="font-display text-xl font-bold break-all">
                      {order.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold mb-2">
                      {t('orderSuccess.orderDate')}
                    </p>
                    <p className="font-medium">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-sm text-muted-foreground font-semibold mb-3">
                    {t('orderSuccess.itemsOrdered')}
                  </p>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        className="flex justify-between items-center p-3 rounded-lg bg-muted/30 border border-border/30"
                      >
                        <div>
                          <p className="font-medium">
                            {t('orderSuccess.productId')}: {item.productId}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t('orderSuccess.qty')}: {item.quantity}
                          </p>
                        </div>
                        <p className="font-display font-bold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div className="pt-6 border-t border-border/30">
                  <div className="flex justify-between items-center">
                    <span className="font-display text-lg font-bold">
                      {t('checkout.total')}
                    </span>
                    <span className="font-display text-3xl font-bold text-primary">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Confirmation Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-linear-to-br from-green-500/5 to-green-500/10 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400">
                  {t('orderSuccess.confirmationSent')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('orderSuccess.emailSent')}
                    </p>
                    <p className="font-medium mt-1">{order.email}</p>
                  </div>
                </div>

                {/* Status Info */}
                <div className="p-4 rounded-lg bg-white/20 dark:bg-white/5">
                  <p className="text-sm text-muted-foreground font-semibold mb-2">
                    {t('orderSuccess.status')}
                  </p>
                  <div className="inline-flex px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400">
                    {t('orders.status_pending')}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    {t('orderSuccess.processingTime')}
                  </p>
                </div>

                {/* What's Next */}
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm font-semibold mb-2 text-blue-700 dark:text-blue-400">
                    {t('orderSuccess.whatsNext')}
                  </p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>✓ {t('orderSuccess.step1')}</li>
                    <li>✓ {t('orderSuccess.step2')}</li>
                    <li>✓ {t('orderSuccess.step3')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3 mt-6">
              <Button
                onClick={() => navigate({ to: '/orders' })}
                className="w-full gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                {t('orderSuccess.viewOrders')}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/products' })}
                className="w-full"
              >
                {t('orderSuccess.continueShopping')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground font-semibold mb-2">
                {t('orderSuccess.shippingTo')}
              </p>
              <p className="font-medium">{order.customer}</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground font-semibold mb-2">
                {t('orderSuccess.supportEmail')}
              </p>
              <p className="font-medium text-primary">support@luxe.com</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground font-semibold mb-2">
                {t('orderSuccess.returnPolicy')}
              </p>
              <p className="font-medium text-primary cursor-pointer hover:underline">
                {t('orderSuccess.view')}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </main>
  )
}

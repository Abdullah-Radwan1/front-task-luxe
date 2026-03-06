import { useNavigate } from '@tanstack/react-router'
// import { orderSuccessRoute } from "@/routeTree.gen";
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { CheckCircle, ShoppingBag, Mail, ArrowRight } from 'lucide-react'

// src/routes/OrderSuccess.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/orderSuccess')({
  component: OrderSuccess,
})

// Mock order data - looks like a real order
const mockOrder = {
  id: 'ORD-2024-123456',
  date: new Date().toISOString(),
  email: 'john.doe@example.com',
  customer: 'John Doe',
  total: 549.95,
  status: 'pending',
  items: [
    {
      productId: 'LUX-WATCH-001',
      name: 'ChronoMaster Automatic',
      quantity: 1,
      price: 425.0,
    },
    {
      productId: 'LUX-STRAP-023',
      name: 'Italian Leather Strap - Brown',
      quantity: 2,
      price: 45.0,
    },
    {
      productId: 'LUX-CARE-001',
      name: 'Premium Watch Care Kit',
      quantity: 1,
      price: 34.95,
    },
  ],
  shippingAddress: {
    street: '123 Luxury Avenue',
    city: 'Beverly Hills',
    state: 'CA',
    zipCode: '90210',
    country: 'United States',
  },
  paymentMethod: 'Visa ending in 4242',
  estimatedDelivery: 'March 5-7, 2024',
}

export default function OrderSuccess() {
  // const { orderId } = orderSuccessRoute.useParams();
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Use mock order data instead of fetching from store
  const order = mockOrder

  return (
    <main className="flex-1 mx-auto py-12 px-4">
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
            {t('orderSuccess.title') || 'Thank You for Your Order!'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg"
          >
            {t('orderSuccess.subtitle') ||
              `Order #${order.id} has been confirmed`}
          </motion.p>
          <span className="text-destructive">NOTE: MOCK DATA</span>
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
                <CardTitle>
                  {t('orderSuccess.orderDetails') || 'Order Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order ID & Date */}
                <div className="grid grid-cols-2 gap-6 pb-6 border-b border-border/30">
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold mb-2">
                      {t('orders.orderId') || 'Order ID'}
                    </p>
                    <p className="font-display text-xl font-bold break-all">
                      {order.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold mb-2">
                      {t('orderSuccess.orderDate') || 'Order Date'}
                    </p>
                    <p className="font-medium">
                      {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-sm text-muted-foreground font-semibold mb-3">
                    {t('orderSuccess.itemsOrdered') || 'Items Ordered'}
                  </p>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        className="flex justify-between items-center p-3 rounded-lg bg-muted/30 border border-border/30"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-muted-foreground">
                              SKU: {item.productId}
                            </span>
                            <span className="text-muted-foreground">
                              Qty: {item.quantity}
                            </span>
                          </div>
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
                      {t('checkout.total') || 'Total'}
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
                  {t('orderSuccess.confirmationSent') || 'Confirmation Sent'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('orderSuccess.emailSent') ||
                        "We've sent a confirmation to:"}
                    </p>
                    <p className="font-medium mt-1">{order.email}</p>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="p-4 rounded-lg bg-white/20 dark:bg-white/5">
                  <p className="text-sm text-muted-foreground font-semibold mb-2">
                    Payment Method
                  </p>
                  <p className="font-medium">{order.paymentMethod}</p>
                </div>

                {/* Status Info */}
                <div className="p-4 rounded-lg bg-white/20 dark:bg-white/5">
                  <p className="text-sm text-muted-foreground font-semibold mb-2">
                    {t('orderSuccess.status') || 'Order Status'}
                  </p>
                  <div className="inline-flex px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400">
                    {t('orders.status_pending') || 'Pending'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    {t('orderSuccess.processingTime') ||
                      'Estimated delivery: ' + order.estimatedDelivery}
                  </p>
                </div>

                {/* What's Next */}
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm font-semibold mb-2 text-blue-700 dark:text-blue-400">
                    {t('orderSuccess.whatsNext') || "What's Next?"}
                  </p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>✓ Order confirmation email sent</li>
                    <li>✓ Payment verified</li>
                    <li>✓ Order processing begins</li>
                    <li>⏱️ Shipping confirmation within 24hrs</li>
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
                {t('orderSuccess.viewOrders') || 'Track This Order'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/products' })}
                className="w-full"
              >
                {t('orderSuccess.continueShopping') || 'Continue Shopping'}
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
                {t('orderSuccess.shippingTo') || 'Shipping To'}
              </p>
              <p className="font-medium">{order.customer}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {order.shippingAddress.street}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
                <br />
                {order.shippingAddress.country}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground font-semibold mb-2">
                {t('orderSuccess.supportEmail') || 'Need Help?'}
              </p>
              <p className="font-medium text-primary">support@luxe.com</p>
              <p className="text-sm text-muted-foreground mt-1">
                24/7 Customer Support
              </p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground font-semibold mb-2">
                {t('orderSuccess.returnPolicy') || 'Returns'}
              </p>
              <p className="font-medium text-primary cursor-pointer hover:underline">
                {t('orderSuccess.view') || '30-Day Return Policy'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Free returns within 30 days
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </main>
  )
}

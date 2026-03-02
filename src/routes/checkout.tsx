import { useState } from 'react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  Lock,
  ArrowRight,
  AlertCircle,
  CreditCard,
  CheckCircle2,
  Shield,
  Truck,
  User,
} from 'lucide-react'
import { useCreateOrder } from '#/lib/api-hooks/orders'

export const Route = createFileRoute('/checkout')({
  beforeLoad: () => {
    const user = useAuthStore.getState().user
    const items = useCartStore.getState().items

    if (!user) {
      throw redirect({ to: '/login' })
    }

    if (items.length === 0) {
      throw redirect({ to: '/products' })
    }
  },
  component: Checkout,
})

function Checkout() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { items, totalPrice, clearCart } = useCartStore()
  const [error, setError] = useState('')
  const createOrderMutation = useCreateOrder()

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = (): boolean => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode
    ) {
      setError(t('checkout.fillAllFields'))
      return false
    }
    if (!formData.cardNumber || formData.cardNumber.length < 16) {
      setError(t('checkout.invalidCard'))
      return false
    }
    if (!formData.expiryDate || !formData.expiryDate.includes('/')) {
      setError(t('checkout.invalidExpiry'))
      return false
    }
    if (!formData.cvv || formData.cvv.length < 3) {
      setError(t('checkout.invalidCVV'))
      return false
    }
    return true
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    const cartItemsForOrder = items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }))

    createOrderMutation.mutate(
      {
        customerName: formData.fullName,
        email: formData.email,
        cartItems: cartItemsForOrder,
        total: totalPrice(),
      },
      {
        onSuccess: (order) => {
          clearCart()
          navigate({
            to: '/orderSuccess',
            params: { orderId: order.id },
          })
        },
        onError: () => {
          setError(t('checkout.orderFailed'))
        },
      },
    )
  }

  return (
    <main className="flex-1 py-8 md:py-12 bg-linear-to-b from-background via-background to-muted/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6"
      >
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4"
          >
            <ShoppingBag className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {items.length} {t('checkout.itemsInCart')}
            </span>
          </motion.div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 bg-linear-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            {t('checkout.title')}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto md:mx-0">
            {t('checkout.subtitle')}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center md:justify-start gap-2 mb-8">
          {['Cart', 'Checkout', 'Confirmation'].map((step, i) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  i === 1
                    ? 'bg-primary text-primary-foreground'
                    : i < 1
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {i < 1 ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              {i < 2 && (
                <div className="w-12 h-0.5 bg-muted-foreground/20 mx-1" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleCheckout} className="space-y-6">
              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive"
                  >
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span className="font-medium">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Customer Information Card */}
              <Card className="overflow-hidden border-2 hover:border-primary/20 transition-colors">
                <CardHeader className="bg-linear-to-r from-primary/5 to-transparent">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <User className="h-5 w-5 text-primary" />

                    {t('checkout.customerInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="flex items-center gap-2"
                      >
                        {t('checkout.fullName')}
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder={t('checkout.fullNamePlaceholder')}
                        className="border-2 focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2 ">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        {t('user.email')}
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t('checkout.emailPlaceholder')}
                        className="border-2 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="flex items-center gap-2"
                    >
                      {t('checkout.address')}
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder={t('checkout.addressPlaceholder')}
                      className="border-2 focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">{t('checkout.city')}</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder={t('checkout.cityPlaceholder')}
                        className="border-2 focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">
                        {t('checkout.postalCode')}
                      </Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder={t('checkout.postalCodePlaceholder')}
                        className="border-2 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information Card */}
              <Card className="overflow-hidden border-2 hover:border-primary/20 transition-colors">
                <CardHeader className="bg-linear-to-r from-primary/5 to-transparent">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    {t('checkout.paymentInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {/* Credit Card Icons */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-blue-500/10 rounded">
                      <CreditCard className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="p-1.5 bg-red-500/10 rounded">
                      <CreditCard className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="p-1.5 bg-purple-500/10 rounded">
                      <CreditCard className="h-4 w-4 text-purple-500" />
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                      <Shield className="h-3 w-3" /> Secure Payment
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">
                      {t('checkout.cardNumber')}
                    </Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                      className="font-mono border-2 focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">{t('checkout.expiry')}</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="font-mono border-2 focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">{t('checkout.cvv')}</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={4}
                        type="password"
                        className="font-mono border-2 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Place Order Button */}
              <Button
                type="submit"
                size="lg"
                disabled={createOrderMutation.status === 'pending'}
                className="w-full h-14 text-lg gap-3 bg-linear-to-r from-primary to-primary/80  shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {createOrderMutation.status === 'pending' ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {t('checkout.placeOrder')}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6 z-50">
            {/* Order Summary Card */}
            <Card className="sticky top-24 overflow-hidden border-2 border-primary/10">
              <CardHeader className="bg-linear-to-r from-primary/10 to-accent/5">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                  {t('checkout.summary')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* Product List with Images */}
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors group"
                    >
                      {/* Product Image */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                        <img
                          src={item.product.image || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-0 right-0 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center rounded-bl-lg">
                          {item.quantity}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">
                          {i18n.language === 'ar'
                            ? (item.product as any).name_ar
                            : item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ${item.product.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>

                      {/* Price */}
                      <p className="font-bold text-sm">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t('checkout.subtotal')}
                    </span>
                    <span className="font-medium">
                      ${totalPrice().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Truck className="h-3 w-3" /> {t('checkout.shipping')}
                    </span>
                    <span className="text-green-600 font-medium bg-green-500/10 px-2 py-0.5 rounded-full text-xs">
                      {t('checkout.free')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span className="font-medium">
                      ${(totalPrice() * 0.1).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-dashed">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">
                      {t('checkout.total')}
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                        ${(totalPrice() * 1.1).toFixed(2)}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Including taxes
                      </p>
                    </div>
                  </div>
                </div>

                {/* Secure Checkout Badge */}
                <div className="flex items-center justify-center gap-2 pt-4 text-xs text-muted-foreground border-t">
                  <Lock className="h-3 w-3" />
                  <span>Secure SSL Encrypted Checkout</span>
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping Button */}
            <Button
              variant="outline"
              className="w-full gap-2 border-2 transition-colors"
              onClick={() => navigate({ to: '/products' })}
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              {t('checkout.continueShopping')}
            </Button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" /> 100% Secure
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <div className="flex items-center gap-1">
                <Truck className="h-3 w-3" /> Free Shipping
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add custom scrollbar styles */}
    </main>
  )
}

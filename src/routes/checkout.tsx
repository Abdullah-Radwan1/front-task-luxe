import { useState } from 'react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { ShoppingBag, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { api } from '@/lib/mock-data'

export const Route = createFileRoute('/checkout')({
  beforeLoad: () => {
    const user = useAuthStore.getState().user
    const items = useCartStore.getState().items

    // 1. Guard: Redirect to login if not authenticated
    if (!user) {
      throw redirect({ to: '/login' })
    }

    // 2. Guard: Redirect to products if cart is empty
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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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

    setIsLoading(true)
    try {
      const cartItemsForOrder = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }))

      const order = await api.createOrder(
        formData.fullName,
        formData.email,
        cartItemsForOrder,
        totalPrice(),
      )

      clearCart()
      // 3. Updated navigation to use params object
      navigate({
        to: '/orderSuccess',
        params: { orderId: order.id },
      })
    } catch (err) {
      setError(t('checkout.orderFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex-1  py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-12">
          <h1 className="font-display text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('checkout.title')}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t('checkout.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleCheckout} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <Card className="bg-gradient-to-br from-card to-muted/30">
                <CardHeader>
                  <CardTitle>{t('checkout.customerInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t('checkout.fullName')}</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder={t('checkout.fullNamePlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('user.email')}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t('checkout.emailPlaceholder')}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">{t('checkout.address')}</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder={t('checkout.addressPlaceholder')}
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
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-muted/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    {t('checkout.paymentInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      className="font-mono"
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
                        className="font-mono"
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
                        className="font-mono"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg gap-2"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {t('checkout.placeOrder')}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  {t('checkout.summary')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between items-start border-b border-border/30 pb-3"
                  >
                    <div>
                      <p className="font-medium line-clamp-1">
                        {i18n.language === 'ar'
                          ? (item.product as any).name_ar
                          : item.product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('checkout.quantity')}: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}

                <div className="space-y-2 pt-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t('checkout.subtotal')}
                    </span>
                    <span>${totalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t('checkout.shipping')}
                    </span>
                    <span className="text-green-600 font-medium">
                      {t('checkout.free')}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-between items-center">
                  <span className="font-bold">{t('checkout.total')}</span>
                  <span className="text-3xl font-bold text-primary">
                    ${(totalPrice() * 1.1).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate({ to: '/products' })}
            >
              {t('checkout.continueShopping')}
            </Button>
          </div>
        </div>
      </motion.div>
    </main>
  )
}

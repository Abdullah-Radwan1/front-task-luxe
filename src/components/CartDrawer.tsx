import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart-store'
import { useNavigate } from '@tanstack/react-router'

export function CartDrawer() {
  const { t } = useTranslation()
  const {
    items,
    isOpen,
    setCartOpen,
    removeItem,
    updateQuantity,
    totalPrice,
    clearCart,
  } = useCartStore()
  const navigate = useNavigate()
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-card border-l shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-display text-lg font-semibold">
                {t('cart.title')}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
                <ShoppingBag className="h-12 w-12" />
                <p>{t('cart.empty')}</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="flex gap-4 p-3 rounded-lg border bg-background"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-16 w-16 rounded-md object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-accent font-semibold">
                            ${item.product.price}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-6 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 self-start"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="p-6 border-t space-y-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>{t('cart.total')}</span>
                    <span>${totalPrice().toLocaleString()}</span>
                  </div>
                  <Button
                    onClick={() => {
                      navigate({ to: '/checkout' })
                      setCartOpen(false)
                    }}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                  >
                    {t('cart.checkout')}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

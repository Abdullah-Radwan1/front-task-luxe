import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { createFileRoute } from '@tanstack/react-router'

import { useWishlistStore } from '@/stores/wishlist-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/wishlist')({ component: Wishlist })

export default function Wishlist() {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const navigate = useNavigate()

  const { items, removeItem, totalItems } = useWishlistStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-12"
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
              {t('wishlist.title')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('wishlist.subtitle', { count: totalItems() })}
            </p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="h-20 w-20 rounded-full bg-linear-to-r from-accent to-primary/50 flex items-center justify-center shrink-0"
          >
            <Heart className="h-10 w-10 text-white fill-white" />
          </motion.div>
        </motion.div>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="mb-6 p-4 rounded-full bg-muted">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">
            {t('wishlist.empty')}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            {t('wishlist.emptyDesc')}
          </p>
          <Button
            onClick={() => navigate({ to: '/products' })}
            className="gap-2"
          >
            {t('wishlist.continueShopping')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      ) : (
        <>
          {/* Wishlist Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {items.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group h-full overflow-hidden bg-linear-to-br from-card to-muted/30 hover:shadow-lg transition-all duration-300">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={
                        i18n.language === 'ar'
                          ? (product as any).name_ar || product.name
                          : (product as any).name_en || product.name
                      }
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>

                  {/* Product Info */}
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h3 className="font-display text-lg font-bold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {i18n.language === 'ar'
                          ? (product as any).name_ar || product.name
                          : (product as any).name_en || product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {i18n.language === 'ar'
                          ? (product as any).description_ar ||
                            product.description
                          : (product as any).description_en ||
                            product.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="pt-2 border-t border-border/50">
                      <p className="font-display text-2xl font-bold text-primary">
                        ${product.price}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() =>
                          navigate({
                            to: '/products/$id',
                            params: { id: product.id },
                          })
                        }
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {t('wishlist.viewProduct')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive/20 hover:bg-destructive/10"
                        onClick={() => removeItem(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-linear-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {t('wishlist.totalItems')}
                  </p>
                  <p className="font-display text-3xl font-bold">
                    {totalItems()}
                  </p>
                </div>
                <Button
                  onClick={() => navigate({ to: '/products' })}
                  className="gap-2"
                >
                  {t('wishlist.continueShopping')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  )
}

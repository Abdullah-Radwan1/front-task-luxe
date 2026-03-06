import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Check, HeartPlus } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart-store'
import { useWishlistStore } from '@/stores/wishlist-store'
import { toast } from '@/hooks/use-toast'
import { useTranslation } from 'react-i18next'
import type { Product } from '#/lib/api-hooks/products/product.schema'

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product
  index?: number
}) {
  const { t, i18n } = useTranslation()
  const addItem = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist)
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id))
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    const willBeWishlisted = !isWishlisted
    toggleWishlist(product)
    // show feedback
    toast({
      title: willBeWishlisted
        ? t('products.addToWishlist')
        : t('products.removeFromWishlist'),
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group rounded-lg border bg-card overflow-hidden"
    >
      <div className="relative">
        <Link
          params={{ id: product.id }}
          to={`/products/$id`}
          className="block"
        >
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={
                i18n.language === 'ar'
                  ? (product as any).name_ar || product.name
                  : (product as any).name_en || product.name
              }
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
        {/* wishlist button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleWishlist}
          className={
            `absolute top-2 right-2 transition-colors ` +
            (isWishlisted ? 'text-destructive' : 'text-muted-foreground')
          }
        >
          <HeartPlus color="red" className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {t(`categories.${product.category}`)}
        </p>
        <h3 className="font-medium text-sm mb-1 truncate">
          <Link
            params={{ id: product.id }}
            to={`/products/$id`}
            className="hover:underline"
          >
            {i18n.language === 'ar'
              ? (product as any).name_ar || product.name
              : (product as any).name_en || product.name}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
          {i18n.language === 'ar'
            ? (product as any).description_ar || product.description
            : (product as any).description_en || product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-foreground">
            ${product.price.toLocaleString()}
          </span>
          <Button
            size="sm"
            onClick={handleAdd}
            variant={added ? 'outline' : 'default'}
            className={
              added
                ? 'bg-success/10 text-success border-success/30'
                : 'bg-accent text-accent-foreground hover:bg-accent/90'
            }
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1" />
                {t('products.added')}
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5 mr-1" />
                {t('products.addToCart')}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

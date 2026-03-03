import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Heart,
  Minus,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton' // Added Skeleton import
import { useCartStore } from '@/stores/cart-store'
import { useWishlistStore } from '@/stores/wishlist-store'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useProduct } from '#/lib/api-hooks/products'
import { products } from '@/lib/mock-data'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products/$id')({
  component: RouteComponent,
})

export default function RouteComponent() {
  const { id } = Route.useParams()

  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist)
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(id || ''))

  const cartItems = useCartStore((s) => s.items)

  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const { data: product, isLoading: productLoading } = useProduct(id)

  if (productLoading) {
    return (
      <main className="flex-1">
        {/* Back button skeleton */}
        <div className="border-b bg-muted/40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Product Section Skeleton */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info Skeleton */}
            <div className="flex flex-col space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-3/4" />

              {/* Rating Skeleton */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-4 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-4 w-20" />
              </div>

              {/* Description Skeletons */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>

              {/* Price Skeleton */}
              <Skeleton className="h-8 w-32" />

              {/* Stock Skeleton */}
              <Skeleton className="h-4 w-24" />

              {/* Quantity Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <Skeleton className="h-10 w-20 rounded-md" />
                  <Skeleton className="h-10 w-10 rounded-md" />
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Skeleton className="h-11 w-full sm:w-40 rounded-md" />
                <Skeleton className="h-11 w-full sm:w-48 rounded-md" />
                <Skeleton className="h-11 w-full sm:w-40 rounded-md" />
              </div>

              {/* Features Skeletons */}
              <div className="grid grid-cols-2 gap-4 border-t pt-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Skeleton */}
            <div className="flex justify-center">
              <Skeleton className="w-full max-w-lg aspect-square rounded-xl" />
            </div>
          </div>

          {/* Related Products Skeleton */}
          <div className="mt-20 border-t pt-12">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border bg-card overflow-hidden"
                >
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (!product) {
    return (
      <div className="flex-1 flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">{t('common.notFound')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('common.notFoundDesc')}
          </p>
          <Button onClick={() => navigate({ to: '/products' })}>
            {t('products.back')}
          </Button>
        </div>
      </div>
    )
  }

  // determine how many more items can actually be added/bought
  const existingCartItem = cartItems.find((i) => i.product.id === product.id)
  const existingQty = existingCartItem ? existingCartItem.quantity : 0
  const allowedQty = Math.max(0, product.stock - existingQty)
  const toAdd = Math.min(quantity, allowedQty)
  const canAddOrBuy = allowedQty > 0

  const displayName =
    i18n.language === 'ar'
      ? (product as any).name_ar || product.name
      : (product as any).name_en || product.name

  const displayDescription =
    i18n.language === 'ar'
      ? (product as any).description_ar || product.description
      : (product as any).description_en || product.description

  const handleAddToCart = () => {
    if (!canAddOrBuy) {
      toast({ title: t('products.limitReached') || 'Limit Reached' })
      return
    }
    // add the allowable amount, notify if we hit a cap
    for (let i = 0; i < toAdd; i++) addItem(product)
    if (toAdd < quantity) {
      toast({ title: t('products.limitReached') || 'Limit Reached' })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleWishlist = () => {
    const willBeWishlisted = !isWishlisted
    toggleWishlist(product)
    toast({
      title: willBeWishlisted
        ? t('products.addToWishlist')
        : t('products.removeFromWishlist'),
    })
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <main className="flex-1">
      {/* Back */}
      <div className="border-b bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate({ to: '/products' })}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('products.back')}
          </button>
        </div>
      </div>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Info */}
          <div className="flex flex-col">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              {t(`categories.${product.category}`)}
            </p>

            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              {displayName}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} {t('products.reviews')}
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">
              {displayDescription}
            </p>

            {/* Price */}
            <div className="text-3xl font-bold mb-4">
              ${product.price.toLocaleString()}
            </div>

            {/* Stock */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="text-sm text-green-600 font-medium">
                  {product.stock} {t('products.inStock')}
                </span>
              ) : (
                <span className="text-sm text-red-600 font-medium">
                  {t('products.outOfStock')}
                </span>
              )}
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">
                    {t('products.quantity')}
                  </label>
                  <span className="text-xs text-muted-foreground">
                    Max: {product.stock}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <div className="relative flex-1 max-w-25">
                    <Input
                      type="number"
                      value={quantity}
                      min={1}
                      max={product.stock}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        if (!isNaN(val)) {
                          setQuantity(Math.min(Math.max(1, val), product.stock))
                        }
                      }}
                      className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    disabled={quantity >= product.stock}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick quantity buttons for common selections */}
                {product.stock > 5 && (
                  <div className="flex gap-2 mt-3">
                    {[1, 2, 3, 5]
                      .filter((n) => n <= product.stock)
                      .map((num) => (
                        <Button
                          key={num}
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(num)}
                          className={quantity === num ? 'border-primary' : ''}
                        >
                          {num}
                        </Button>
                      ))}
                    {product.stock >= 10 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(10)}
                        className={quantity === 10 ? 'border-primary' : ''}
                      >
                        10
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
            {/* actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                size="lg"
                disabled={product.stock === 0 || !canAddOrBuy}
                variant={added ? 'outline' : 'default'}
                onClick={handleAddToCart}
                className="w-full sm:w-40"
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5 mr-2" /> {t('products.added')}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5 mr-2" />{' '}
                    {t('products.addToCart')}
                  </>
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleWishlist}
                className={`w-full sm:w-48 ${isWishlisted ? 'text-destructive' : ''}`}
              >
                <Heart className="h-5 w-5 mr-2" />
                {isWishlisted
                  ? t('products.removeFromWishlist')
                  : t('products.addToWishlist')}
              </Button>

              <Button
                size="lg"
                variant="default"
                className="w-full sm:w-40 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  const existingItem = cartItems.find(
                    (i) => i.product.id === product.id,
                  )

                  // Only add to cart if item doesn't exist
                  if (!existingItem) {
                    const toAdd = Math.min(quantity, product.stock)
                    for (let i = 0; i < toAdd; i++) addItem(product)
                  }

                  // Navigate to checkout regardless
                  navigate({ to: '/checkout' })
                }}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {t('checkout.title')}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 border-t pt-6">
              {[
                [Truck, 'freeShipping'],
                [Shield, 'guaranteedSafe'],
                [RotateCcw, 'easyReturns'],
                [ShoppingBag, 'qualityAssured'],
              ].map(([Icon, key]: any) => (
                <div key={key} className="flex gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {t(`products.features.${key}`)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t(`products.features.${key}Desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Image */}
          <div className="flex justify-center">
            <div className="w-full max-w-lg aspect-square rounded-xl overflow-hidden bg-muted shadow-sm">
              <img
                src={product.image}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t pt-12">
            <h2 className="text-2xl font-bold mb-8">
              {t('products.relatedProducts')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate({ to: `/products/${p.id}` })}
                  className="cursor-pointer rounded-xl border bg-card overflow-hidden hover:shadow-lg transition"
                >
                  <div className="aspect-square bg-muted">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase text-muted-foreground mb-1">
                      {t(`categories.${p.category}`)}
                    </p>
                    <h3 className="text-sm font-medium truncate mb-1">
                      {i18n.language === 'ar'
                        ? (p as any).name_ar || p.name
                        : (p as any).name_en || p.name}
                    </h3>
                    <span className="font-semibold">
                      ${p.price.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

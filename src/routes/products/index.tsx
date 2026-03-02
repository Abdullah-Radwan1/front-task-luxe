import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useSearchParams } from '@/lib/useSearchParams'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { ProductCard } from '@/components/ProductCard'
import { SkeletonCard } from '@/components/SkeletonCard'
import { TablePagination } from '@/components/TablePagination'
import { api } from '@/lib/mock-data'
import { useAuthStore } from '@/stores/auth-store'
import { createFileRoute } from '@tanstack/react-router'

const MAX_PRICE = 5000
export const Route = createFileRoute('/products/')({ component: ProductsPage })
function FiltersSidebar({ className }: { className?: string }) {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  // 1. Get initial values from URL
  const minPriceUrl = parseInt(searchParams.get('minPrice') || '0')
  const maxPriceUrl = parseInt(
    searchParams.get('maxPrice') || String(MAX_PRICE),
  )

  // 2. Local state for the slider (tracked as user drags)
  const [localRange, setLocalRange] = useState<number[]>([
    minPriceUrl,
    maxPriceUrl,
  ])

  // 3. Sync local state if search params are cleared/changed externally
  useEffect(() => {
    setLocalRange([minPriceUrl, maxPriceUrl])
  }, [minPriceUrl, maxPriceUrl])

  const activeCategories = searchParams.getAll('cat')
  const inStock = searchParams.get('inStock') === 'true'
  const categories = ['watches', 'leather', 'accessories', 'jewelry']

  const toggleCategory = (cat: string) => {
    const next = new URLSearchParams(searchParams)
    const current = next.getAll('cat')
    next.delete('cat')
    next.delete('page')
    if (current.includes(cat)) {
      current.filter((c) => c !== cat).forEach((c) => next.append('cat', c))
    } else {
      ;[...current, cat].forEach((c) => next.append('cat', c))
    }
    setSearchParams(next)
  }

  // 4. NEW: Apply function called only on button click
  const handleApplyPrice = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('page')

    if (localRange[0] > 0) next.set('minPrice', String(localRange[0]))
    else next.delete('minPrice')

    if (localRange[1] < MAX_PRICE) next.set('maxPrice', String(localRange[1]))
    else next.delete('maxPrice')

    setSearchParams(next)
  }

  const toggleInStock = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('page')
    if (!inStock) next.set('inStock', 'true')
    else next.delete('inStock')
    setSearchParams(next)
  }

  const clearFilters = () => {
    const next = new URLSearchParams()
    const search = searchParams.get('search')
    const sort = searchParams.get('sort')
    if (search) next.set('search', search)
    if (sort) next.set('sort', sort)
    setSearchParams(next)
    setLocalRange([0, MAX_PRICE]) // Reset local slider
  }

  const hasFilters =
    activeCategories.length > 0 ||
    minPriceUrl > 0 ||
    maxPriceUrl < MAX_PRICE ||
    inStock

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold">
          {t('products.filters')}
        </h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-muted-foreground"
          >
            <X className="h-3 w-3 mr-1" /> {t('products.clearFilters')}
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <p className="text-sm font-medium mb-3">{t('products.category')}</p>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat}`}
                checked={activeCategories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
              />
              <Label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">
                {t(`categories.${cat}`)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Price Range */}
      <div className="mb-6 space-y-4">
        <p className="text-sm font-medium">{t('products.priceRange')}</p>
        <Slider
          min={0}
          max={MAX_PRICE}
          step={50}
          value={localRange}
          onValueChange={setLocalRange} // Only updates local state
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${localRange[0].toLocaleString()}</span>
          <span>${localRange[1].toLocaleString()}</span>
        </div>

        {/* 5. NEW: Apply Button */}
        <Button
          size="sm"
          variant="outline"
          className="w-full text-xs h-8"
          onClick={handleApplyPrice}
          disabled={
            localRange[0] === minPriceUrl && localRange[1] === maxPriceUrl
          }
        >
          {t('products.applyPrice')}
        </Button>
      </div>

      <Separator className="mb-6" />

      {/* In Stock */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="in-stock"
          checked={inStock}
          onCheckedChange={toggleInStock}
        />
        <Label htmlFor="in-stock" className="text-sm cursor-pointer">
          {t('products.inStockOnly')}
        </Label>
      </div>
    </div>
  )
}
// src/routes/Products.tsx

export default function ProductsPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate({ to: '/admin' })
    }
  }, [user, navigate])
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') || '',
  )

  const sort = searchParams.get('sort') || 'newest'
  const page = parseInt(searchParams.get('page') || '1')
  const search = searchParams.get('search') || ''
  const activeCategories = searchParams.getAll('cat')
  const minPrice = parseInt(searchParams.get('minPrice') || '0')
  const maxPrice = parseInt(searchParams.get('maxPrice') || String(MAX_PRICE))
  const inStock = searchParams.get('inStock') === 'true'

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value && value !== '1') next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setSearchParams(next)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParam('search', searchInput)
  }

  // Fetch all products then filter client-side for sidebar filters
  const { data, isLoading } = useQuery({
    queryKey: [
      'products-page',
      sort,
      page,
      search,
      activeCategories.join(','),
      minPrice,
      maxPrice,
      inStock,
    ],
    queryFn: async () => {
      const result = await api.getProducts({ search, sort, pageSize: 100 })
      let filtered = result.products

      if (activeCategories.length > 0) {
        filtered = filtered.filter((p) => activeCategories.includes(p.category))
      }
      if (minPrice > 0) filtered = filtered.filter((p) => p.price >= minPrice)
      if (maxPrice < MAX_PRICE)
        filtered = filtered.filter((p) => p.price <= maxPrice)
      if (inStock) filtered = filtered.filter((p) => p.stock > 0)

      const pageSize = 6
      const total = filtered.length
      const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

      return {
        products: paginated,
        total,
        totalPages: Math.ceil(total / pageSize),
        page,
      }
    },
  })

  return (
    <main className="flex-1 justify-center  mx-auto container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-display text-3xl font-bold mb-2">
          {t('products.title')}
        </h1>
        <p className="text-muted-foreground">{t('products.browseAll')}</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('products.search')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </form>

        <Select value={sort} onValueChange={(v) => updateParam('sort', v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t('products.sortBy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t('products.newest')}</SelectItem>
            <SelectItem value="price-asc">{t('products.priceLow')}</SelectItem>
            <SelectItem value="price-desc">
              {t('products.priceHigh')}
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Mobile filter trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="sm:hidden gap-2">
              <SlidersHorizontal className="h-4 w-4" /> {t('products.filters')}
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>{t('products.filters')}</SheetTitle>
            </SheetHeader>
            <FiltersSidebar className="mt-4" />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden sm:block w-56 shrink-0">
          <div className="sticky top-24 rounded-lg border bg-card p-4">
            <FiltersSidebar />
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : data?.products.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              {t('products.noResults')}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
              {data && data.totalPages > 1 && (
                <TablePagination
                  page={data.page}
                  totalPages={data.totalPages}
                  onPageChange={(p) => updateParam('page', String(p))}
                />
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}

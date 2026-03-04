import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProductCard } from '@/components/ProductCard'
import { SkeletonCard } from '@/components/SkeletonCard'
import { useProducts } from '#/lib/api-hooks/products/useProducts'

export function ProductGrid() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // 1. Get search params loosely to prevent the "Invariant failed" error on Home page
  const searchParams = useSearch({ strict: false })

  // 2. Cast and provide defaults so your UI doesn't break
  const page = (searchParams as any).page || 1
  const search = (searchParams as any).search || ''
  const category = (searchParams as any).category || 'all'
  const sort = (searchParams as any).sort || 'newest'

  const [searchInput, setSearchInput] = useState(search)

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  const updateParam = (params: any) => {
    navigate({
      // Cast the whole function to 'any' to satisfy the Router's internal types
      search: ((prev: any) => ({
        ...prev,
        ...params,
        page: params.page !== undefined ? params.page : 1,
      })) as any,
      resetScroll: false,
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParam({ search: searchInput })
  }

  const { data, isLoading } = useProducts({
    category: category === 'all' ? undefined : category,
    sort,
    page,
    search,
    pageSize: 6,
  })

  const categories = ['all', 'watches', 'leather', 'accessories', 'jewelry']

  return (
    <section className="  max-w-[80%] mx-auto" id="shop">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          {t('products.title')}
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto" />
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('products.search')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </form>

        <Select
          value={category}
          onValueChange={(v) => updateParam({ category: v })}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {t(`categories.${c}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => updateParam({ sort: v })}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t('sort.newest')}</SelectItem>
            <SelectItem value="price-low">{t('sort.priceLow')}</SelectItem>
            <SelectItem value="price-high">{t('sort.priceHigh')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
        <AnimatePresence mode="wait">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SkeletonCard />
                </motion.div>
              ))
            : data?.products.map((product: any) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div dir="ltr" className="flex justify-center items-center gap-2 mt-12">
          <Button
            variant="outline"
            size="icon"
            disabled={page <= 1}
            onClick={() => updateParam({ page: page - 1 })}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: data.totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? 'default' : 'outline'}
              size="sm"
              className="w-10"
              onClick={() => updateParam({ page: i + 1 })}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            disabled={page >= data.totalPages}
            onClick={() => updateParam({ page: page + 1 })}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  )
}

import { useState } from 'react'
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
import { useProducts } from '#/hooks/api-hooks/products/useProducts'
import type { ProductsParams } from '#/hooks/api-hooks/products/product.schema'

export function ProductGrid() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const searchParams = useSearch({ strict: false }) as ProductsParams

  const page = searchParams.page ?? 1
  const search = searchParams.search ?? ''
  const category = Array.isArray(searchParams.category)
    ? (searchParams.category[0] ?? 'all')
    : (searchParams.category ?? 'all')
  const sort = searchParams.sort ?? 'newest'

  const [searchInput, setSearchInput] = useState(search)

  const updateParam = (params: any) => {
    navigate({
      search: ((prev: any) => ({
        ...prev,
        ...params,
        page: params.page ?? 1,
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
    <section className="max-w-[80%] mx-auto" id="shop">
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <form
          onSubmit={handleSearch}
          className="relative flex gap-2 flex-1 max-w-sm"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder={t('products.search')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-12" // Added pr-12 for space on the right
          />

          <Button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0" // Absolute positioned button
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {/* Category */}
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

        {/* Sort */}
        <Select value={sort} onValueChange={(v) => updateParam({ sort: v })}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="newest">{t('sort.newest')}</SelectItem>
            <SelectItem value="price-asc">{t('sort.priceLow')}</SelectItem>
            <SelectItem value="price-desc">{t('sort.priceHigh')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products */}
      <div className="grid justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={`skeleton-${i}`}>
                <SkeletonCard />
              </motion.div>
            ))
          ) : data?.products.length ? (
            data.products.map((product: any) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            <motion.div
              key="no-products"
              className="col-span-full text-center text-muted-foreground py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {t('common.notFound')} 😊
            </motion.div>
          )}
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

import { useState } from 'react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TablePagination } from '@/components/TablePagination'

import { ProductCard } from '@/components/ProductCard'

import { useProducts } from '#/hooks/api-hooks/products/useProducts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Sheet, SheetContent, SheetTrigger } from '#/components/ui/sheet'
import { FiltersSidebar } from './-components/FilterSidebar'
import {
  productsParamsSchema,
  type ProductsParams,
} from '#/hooks/api-hooks/products/product.schema'
import AllProductsPageSkeleton from './-components/AllProductsPageSkeleton'

const PAGE_SIZE = 6

export const Route = createFileRoute('/products/')({
  component: ProductsPage,
  validateSearch: productsParamsSchema,
  loader: async () => {
    return <AllProductsPageSkeleton />
  },
})

export default function ProductsPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/products/' }) as ProductsParams
  const { t } = useTranslation()

  const [searchInput, setSearchInput] = useState(search.search ?? '')

  const currentPage = search.page ?? 1

  const { data, isLoading, isFetching } = useProducts({
    search: search.search,
    sort: search.sort ?? 'newest',
    page: currentPage,
    pageSize: PAGE_SIZE,
    category: search.category,
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    inStock: search.inStock,
  })

  const totalPages = data?.totalPages ?? 1
  const products = data?.products ?? []

  const showLoading = isLoading || isFetching

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({
      search: ((prev: ProductsParams) => ({
        ...prev,
        search: searchInput || undefined,
        page: undefined,
      })) as any,
    })
  }

  // Show full page skeleton when loading
  if (showLoading) {
    return <AllProductsPageSkeleton />
  }

  return (
    <main className="flex-1 justify-center mx-auto container p-2">
      {/* Page header */}
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

      {/* Search + sort + mobile filters */}
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

        {/* Sorting */}
        <Select
          value={search.sort ?? 'newest'}
          onValueChange={(v) =>
            navigate({
              search: ((prev: ProductsParams) => ({
                ...prev,
                sort: v,
                page: undefined,
              })) as any,
            })
          }
        >
          <SelectTrigger className="w-full sm:w-48">
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

        {/* Mobile Filters Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="sm:hidden gap-2">
              <SlidersHorizontal className="h-4 w-4" /> {t('products.filters')}
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <FiltersSidebar className="mt-4" />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden sm:block w-56 shrink-0">
          <div className="sticky top-24 rounded-lg border bg-card p-4">
            <FiltersSidebar />
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {t('products.noResults')} 🤣
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <TablePagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={(p) =>
                    navigate({
                      search: ((prev: ProductsParams) => ({
                        ...prev,
                        page: p,
                      })) as any,
                    })
                  }
                />
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}

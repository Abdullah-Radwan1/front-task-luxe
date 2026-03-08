import { useState, useEffect } from 'react'
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
})

export default function ProductsPage() {
  const navigate = Route.useNavigate()
  const search = useSearch({ from: '/products/' }) as ProductsParams
  const { t } = useTranslation()

  // Internal state for the input field
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
      search: (prev: ProductsParams) => ({
        ...prev,
        search: searchInput.trim() || undefined,
        page: undefined,
      }),
    })
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

      {/* Search + Sort + Mobile Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6  ">
        <form
          onSubmit={handleSearch}
          className="flex flex-1 sm:max-w-md w-full gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('products.search')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 focus-visible:ring-accent"
            />
          </div>
        </form>

        {/* Sorting */}
        <Select
          value={search.sort ?? 'newest'}
          onValueChange={(v) =>
            navigate({
              search: (prev: any) => ({
                ...prev,
                sort: v,
                page: undefined,
              }),
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
        <Button type="submit" className="bg-accent hover:bg-accent/90 shrink-0">
          <Search className="h-4 w-4" />
        </Button>
        {/* Mobile Filters Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="sm:hidden gap-2">
              <SlidersHorizontal className="h-4 w-4" /> {t('products.filters')}
            </Button>
          </SheetTrigger>
          <SheetContent side={t('dir') === 'rtl' ? 'right' : 'left'}>
            <FiltersSidebar className="mt-4" />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Desktop */}
        <aside className="hidden sm:block w-56 shrink-0">
          <div className="sticky top-24 rounded-lg border bg-card p-4">
            <FiltersSidebar />
          </div>
        </aside>

        {/* Products Grid */}
        {showLoading ? (
          <div className="flex-1">
            <AllProductsPageSkeleton />
          </div>
        ) : (
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-24 border rounded-xl bg-muted/10">
                <p className="text-muted-foreground mb-4">
                  {t('products.noResults')}
                </p>
                {search.search && (
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchInput('')
                      navigate({
                        search: (prev: any) => ({ ...prev, search: undefined }),
                      })
                    }}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10">
                    <TablePagination
                      page={currentPage}
                      totalPages={totalPages}
                      onPageChange={(p) =>
                        navigate({
                          search: (prev: any) => ({
                            ...prev,
                            page: p,
                          }),
                        })
                      }
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

import { useState, useEffect, useMemo } from 'react'
import {
  useNavigate,
  createLazyFileRoute,
  useSearch,
} from '@tanstack/react-router'
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
import { useProducts } from '#/lib/api-hooks/products/useProducts'

const MAX_PRICE = 5000

type ProductsSearch = {
  search?: string
  sort?: 'newest' | 'price-asc' | 'price-desc'
  page?: number
  cat?: string[]
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}

export const Route = createLazyFileRoute('/products/')({
  component: ProductsPage,
})

function FiltersSidebar({
  className,
  onFilterChange,
}: {
  className?: string
  onFilterChange?: () => void
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const search = useSearch({ from: '/products/' }) as ProductsSearch

  const [localRange, setLocalRange] = useState<number[]>([
    search.minPrice ?? 0,
    search.maxPrice ?? MAX_PRICE,
  ])

  const activeCategories = search.cat ?? []
  const categories = ['watches', 'leather', 'accessories', 'jewelry']

  useEffect(() => {
    setLocalRange([search.minPrice ?? 0, search.maxPrice ?? MAX_PRICE])
  }, [search.minPrice, search.maxPrice])

  const toggleCategory = (category: string) => {
    onFilterChange?.()
    const nextCats = activeCategories.includes(category)
      ? activeCategories.filter((c) => c !== category)
      : [...activeCategories, category]

    navigate({
      search: ((prev: ProductsSearch) => ({
        ...prev,
        cat: nextCats.length ? nextCats : undefined,
        page: undefined,
      })) as any,
    })
  }

  const applyPrice = () => {
    onFilterChange?.()
    navigate({
      search: ((prev: ProductsSearch) => ({
        ...prev,
        minPrice: localRange[0] > 0 ? localRange[0] : undefined,
        maxPrice: localRange[1] < MAX_PRICE ? localRange[1] : undefined,
        page: undefined,
      })) as any,
    })
  }

  const toggleInStock = () => {
    onFilterChange?.()
    navigate({
      search: ((prev: ProductsSearch) => ({
        ...prev,
        inStock: !prev.inStock ? true : undefined,
        page: undefined,
      })) as any,
    })
  }

  const clearFilters = () => {
    onFilterChange?.()
    navigate({
      search: ((prev: ProductsSearch) => ({
        search: prev.search,
        sort: prev.sort,
      })) as any,
    })
  }

  const hasFilters =
    activeCategories.length > 0 ||
    search.inStock ||
    search.minPrice ||
    (search.maxPrice && search.maxPrice < MAX_PRICE)

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
          onValueChange={setLocalRange}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${localRange[0]}</span>
          <span>${localRange[1]}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full text-xs"
          onClick={applyPrice}
          disabled={
            localRange[0] === (search.minPrice ?? 0) &&
            localRange[1] === (search.maxPrice ?? MAX_PRICE)
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
          checked={!!search.inStock}
          onCheckedChange={toggleInStock}
        />
        <Label htmlFor="in-stock" className="text-sm cursor-pointer">
          {t('products.inStockOnly')}
        </Label>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/products/' }) as ProductsSearch

  const { t } = useTranslation()

  const [searchInput, setSearchInput] = useState(search.search ?? '')
  const [isFiltering, setIsFiltering] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsFiltering(true)
    navigate({
      search: ((prev: ProductsSearch) => ({
        ...prev,
        search: searchInput || undefined,
        page: undefined,
      })) as any,
    })
  }

  const { data, isLoading, isFetching } = useProducts({
    search: search.search ?? '',
    sort: search.sort ?? 'newest',
    page: 1,
    pageSize: 100,
  })

  // Client-side filters
  const filteredProducts = useMemo(() => {
    let products = data?.products || []
    if (search.cat?.length)
      products = products.filter((p) => search.cat?.includes(p.category))
    if (search.minPrice)
      products = products.filter((p) => p.price >= search.minPrice!)
    if (search.maxPrice)
      products = products.filter((p) => p.price <= search.maxPrice!)
    if (search.inStock) products = products.filter((p) => p.stock > 0)
    return products
  }, [data, search.cat, search.minPrice, search.maxPrice, search.inStock])

  const pageSize = 6
  const currentPage = search.page ?? 1
  const paginated = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )
  const totalPages = Math.ceil(filteredProducts.length / pageSize)
  const showLoading = isLoading || isFetching || isFiltering

  // Reset filtering state after filters applied
  useEffect(() => {
    if (!isLoading && !isFetching && isFiltering) {
      const timer = setTimeout(() => setIsFiltering(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isLoading, isFetching, isFiltering])

  return (
    <main className="flex-1 justify-center mx-auto container p-2">
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

        <Select
          value={search.sort ?? 'newest'}
          onValueChange={(v) => {
            setIsFiltering(true)
            navigate({
              search: ((prev: ProductsSearch) => ({
                ...prev,
                sort: v,
                page: undefined,
              })) as any,
            })
          }}
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
            <FiltersSidebar
              onFilterChange={() => setIsFiltering(true)}
              className="mt-4"
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-8">
        <aside className="hidden sm:block w-56 shrink-0">
          <div className="sticky top-24 rounded-lg border bg-card p-4">
            <FiltersSidebar onFilterChange={() => setIsFiltering(true)} />
          </div>
        </aside>

        <div className="flex-1">
          {showLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {t('products.noResults')} 🤣
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
              {totalPages > 1 && (
                <TablePagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={(p) => {
                    setIsFiltering(true)
                    navigate({
                      search: ((prev: ProductsSearch) => ({
                        ...prev,
                        page: p,
                      })) as any,
                    })
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}

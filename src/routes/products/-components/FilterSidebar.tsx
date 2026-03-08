import { useEffect, useState } from 'react'
import * as Route from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { X } from 'lucide-react'
import type {
  ProductCategory,
  ProductsParams,
} from '#/hooks/api-hooks/products/product.schema'

const MAX_PRICE = 5000

interface FiltersSidebarProps {
  className?: string
  onFilterChange?: () => void
}

export function FiltersSidebar({
  className,
  onFilterChange,
}: FiltersSidebarProps) {
  const { t } = useTranslation()

  /* -------------------------------------------------- */
  /* Router utilities                                   */
  /* -------------------------------------------------- */
  const searchParams = Route.useSearch({ from: '/products/' })
  const navigate = Route.useNavigate({ from: '/products/' })

  /* -------------------------------------------------- */
  /* Local state for price slider                        */
  /* -------------------------------------------------- */
  const [localRange, setLocalRange] = useState<number[]>([
    searchParams.minPrice ?? 0,
    searchParams.maxPrice ?? MAX_PRICE,
  ])

  /* -------------------------------------------------- */
  /* Active categories                                   */
  /* -------------------------------------------------- */
  const activeCategories = Array.isArray(searchParams.category)
    ? searchParams.category
    : searchParams.category
      ? [searchParams.category]
      : []

  const categories: ProductCategory[] = [
    'watches',
    'leather',
    'accessories',
    'jewelry',
  ]

  /* -------------------------------------------------- */
  /* Sync local state with search params                */

  /* -------------------------------------------------- */
  /* URL update helper                                   */
  /* -------------------------------------------------- */
  const updateParam = (params: Partial<ProductsParams>) => {
    onFilterChange?.()
    navigate({
      search: (prev) => ({
        ...prev,
        ...params,
        page: undefined, // always reset to first page on filter change
      }),
    })
  }

  /* -------------------------------------------------- */
  /* Handlers                                           */
  /* -------------------------------------------------- */
  const toggleCategory = (category: ProductCategory) => {
    const nextCats = activeCategories.includes(category)
      ? activeCategories.filter((c) => c !== category)
      : [...activeCategories, category]

    updateParam({
      category: nextCats.length ? nextCats : undefined,
    })
  }

  const applyPrice = () => {
    updateParam({
      minPrice: localRange[0] > 0 ? localRange[0] : undefined,
      maxPrice: localRange[1] < MAX_PRICE ? localRange[1] : undefined,
    })
  }

  const toggleInStock = () => {
    updateParam({
      inStock: !searchParams.inStock ? true : undefined,
    })
  }

  const clearFilters = () => {
    updateParam({
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      inStock: undefined,
    })
  }

  const hasFilters =
    activeCategories.length > 0 ||
    searchParams.inStock ||
    searchParams.minPrice ||
    (searchParams.maxPrice && searchParams.maxPrice < MAX_PRICE)

  /* -------------------------------------------------- */
  /* Render                                             */
  /* -------------------------------------------------- */
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
            localRange[0] === (searchParams.minPrice ?? 0) &&
            localRange[1] === (searchParams.maxPrice ?? MAX_PRICE)
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
          checked={!!searchParams.inStock}
          onCheckedChange={toggleInStock}
        />
        <Label htmlFor="in-stock" className="text-sm cursor-pointer">
          {t('products.inStockOnly')}
        </Label>
      </div>
    </div>
  )
}

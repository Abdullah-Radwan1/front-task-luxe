import { Skeleton } from '@/components/ui/skeleton'
import { SkeletonCard } from '@/components/SkeletonCard'
import { Separator } from '@/components/ui/separator'

export default function AllProductsPageSkeleton() {
  return (
    <main className="flex-1 justify-center mx-auto container p-2">
      {/* 1. Page Header Skeleton */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-9 w-48" /> {/* Title */}
        <Skeleton className="h-5 w-64" /> {/* Subtitle */}
      </div>

      {/* 2. Controls Skeleton (Search, Sort, Mobile Filter) */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Skeleton className="h-10 flex-1 max-w-md" /> {/* Search Input */}
        <Skeleton className="h-10 w-full sm:w-48" /> {/* Sort Select */}
        <Skeleton className="h-10 w-full sm:hidden" />{' '}
        {/* Mobile Filter Button */}
      </div>

      <div className="flex gap-8">
        {/* 3. Sidebar Skeleton */}
        <aside className="hidden sm:block w-56 shrink-0">
          <div className="sticky top-24 rounded-lg border bg-card p-4 space-y-6">
            {/* Filter Header */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-20" />
            </div>

            {/* Categories Section */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Price Range Section */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-2 w-full" /> {/* Slider track */}
              <div className="flex justify-between">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-8 w-full" /> {/* Apply button */}
            </div>

            <Separator />

            {/* Stock Toggle */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </aside>

        {/* 4. Products Grid Skeleton */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Matching your PAGE_SIZE of 6 */}
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          {/* 5. Pagination Skeleton */}
          <div className="mt-10 flex justify-center items-center gap-2 border-t pt-6">
            <Skeleton className="h-8 w-8" /> {/* Prev */}
            <div className="flex gap-1">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
            <Skeleton className="h-8 w-8" /> {/* Next */}
          </div>
        </div>
      </div>
    </main>
  )
}

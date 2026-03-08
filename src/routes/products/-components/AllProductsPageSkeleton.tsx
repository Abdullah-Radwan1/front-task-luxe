import { Skeleton } from '@/components/ui/skeleton'
import { SkeletonCard } from '@/components/SkeletonCard'

export default function AllProductsPageSkeleton() {
  return (
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
  )
}

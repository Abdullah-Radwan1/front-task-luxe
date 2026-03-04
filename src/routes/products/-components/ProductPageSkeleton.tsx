import { Skeleton } from '../../../components/ui/skeleton'

const ProductPageSkeleton = () => {
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

export default ProductPageSkeleton

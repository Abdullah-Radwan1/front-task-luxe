import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { PRODUCTS_QUERY_KEYS } from '../constants'
import { getFeaturedProducts } from '../products'
import type { Product } from './product.schema'

export function useFeaturedProducts(options?: UseQueryOptions<Product[]>) {
  return useQuery<Product[]>({
    queryKey: PRODUCTS_QUERY_KEYS.featured(),
    queryFn: getFeaturedProducts,
    staleTime: 1000 * 60 * 5, // Keep data "fresh" for 5 minutes
    ...options,
  })
}

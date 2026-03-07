import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { ProductsParams, ProductsResponse } from './product.schema'
import { PRODUCTS_QUERY_KEYS } from '../constants'
import { getProducts } from '../products'

export function useProducts(
  params?: ProductsParams,
  options?: UseQueryOptions<ProductsResponse>,
) {
  return useQuery<ProductsResponse>({
    queryKey: PRODUCTS_QUERY_KEYS.list(params),
    queryFn: () => getProducts(params),
    staleTime: 1000 * 60 * 5, // Keep data "fresh" for 5 minutes
    ...options,
  })
}

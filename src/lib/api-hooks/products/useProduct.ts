import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { PRODUCTS_QUERY_KEYS } from '../constants'
import { getProduct } from '../products'
import type { Product } from './product.schema'

export function useProduct(id: string, options?: UseQueryOptions<Product>) {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.detail(id),
    queryFn: () => getProduct(id),
    enabled: !!id,
    ...options,
  })
}

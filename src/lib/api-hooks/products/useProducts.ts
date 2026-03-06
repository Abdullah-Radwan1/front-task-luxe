import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { Product, ProductsParams } from './product.schema'
import { PRODUCTS_QUERY_KEYS } from '../constants'
import { getProducts } from '../products'

export type ProductsResponse = {
  products: Product[]
  totalPages: number
}

export function useProducts(
  params?: ProductsParams,
  options?: UseQueryOptions<ProductsResponse>,
) {
  return useQuery<ProductsResponse>({
    queryKey: PRODUCTS_QUERY_KEYS.list(params),
    queryFn: () => getProducts(params),
    ...options,
  })
}

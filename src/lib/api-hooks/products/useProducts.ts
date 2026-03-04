import { useQuery } from '@tanstack/react-query'
import type { ProductsParams } from './product.schema'
import { PRODUCTS_QUERY_KEYS } from '../constants'
import { getProducts } from '../products'

export function useProducts(params?: ProductsParams) {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.list(params),
    queryFn: () => getProducts(params),
  })
}

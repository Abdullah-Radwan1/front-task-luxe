import { useQuery } from '@tanstack/react-query'
import { PRODUCTS_QUERY_KEYS } from '../constants'
import { getProduct } from '../products'

export function useProduct(id?: string) {
  return useQuery({
    queryKey: id ? PRODUCTS_QUERY_KEYS.detail(id) : [],
    queryFn: () => getProduct(id!),
    enabled: !!id,
  })
}

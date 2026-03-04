import { useQuery } from '@tanstack/react-query'
import { PRODUCTS_QUERY_KEYS } from '../constants'
import { getFeaturedProducts } from '../products'

export function useFeaturedProducts() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.featured(),
    queryFn: getFeaturedProducts,
  })
}

import { useQuery } from '@tanstack/react-query'

import { api, type Product } from '../mock-data'
// typed response for product listing
export interface ProductsResponse {
  products: Product[]
  total: number
  totalPages: number
  page: number
}

export function useProducts(params?: {
  category?: string
  search?: string
  sort?: string
  page?: number
  pageSize?: number
}) {
  return useQuery<ProductsResponse, Error>({
    queryKey: ['products', params],
    queryFn: () => api.getProducts(params || {}),
  })
}

export function useFeaturedProducts() {
  return useQuery<Product[], Error>({
    queryKey: ['featured-products'],
    queryFn: api.getFeaturedProducts,
  })
}

export function useProduct(id?: string) {
  return useQuery<Product | null, Error>({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(id || ''),
    enabled: !!id,
  })
}

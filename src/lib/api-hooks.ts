import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { type Product, type Order, type User, api } from './mock-data'

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

export function useOrders() {
  return useQuery<Order[], Error>({
    queryKey: ['orders'],
    queryFn: api.getOrders,
  })
}

export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: api.getUsers,
  })
}

export function useDashboardStats() {
  // unknown shape so we let TypeScript infer as any by default
  return useQuery<Record<string, number>, Error>({
    queryKey: ['dashboard-stats'],
    queryFn: api.getDashboardStats,
  })
}

// mutation hooks
export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      customerName: string
      email: string
      cartItems: Array<{ productId: string; quantity: number; price: number }>
      total: number
    }) =>
      api.createOrder(
        data.customerName,
        data.email,
        data.cartItems,
        data.total,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

export function useRegisterUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      api.registerUser(data.name, data.email, data.password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useLoginUser() {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.loginUser(data.email, data.password),
  })
}

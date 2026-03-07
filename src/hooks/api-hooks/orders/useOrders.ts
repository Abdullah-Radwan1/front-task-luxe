import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { createOrderSchema, ordersResponseSchema } from './orderSchema'
import { api } from '#/lib/mock-data'
import type { z } from 'zod'

type OrdersResponse = z.infer<typeof ordersResponseSchema>

interface UseOrdersParams {
  page?: number
  pageSize?: number
}

// -----------------------------
// Fetch paginated orders
// -----------------------------
export function useOrders(
  { page = 1, pageSize = 10 }: UseOrdersParams = {},
  options?: UseQueryOptions<OrdersResponse, Error>,
) {
  return useQuery<OrdersResponse, Error>({
    queryKey: ['orders', page, pageSize],
    staleTime: 1000 * 60 * 5, // Keep data "fresh" for 5 minutes
    queryFn: async () => {
      const orders = await api.getOrders({ page, pageSize }) // Pass pagination to API
      return ordersResponseSchema.parse(orders)
    },
    ...options,
  })
}

// -----------------------------
// Create Order Mutation
// -----------------------------
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: z.infer<typeof createOrderSchema>) => {
      const parsed = createOrderSchema.parse(data)
      return api.createOrder(
        parsed.customerName,
        parsed.email,
        parsed.cartItems,
        parsed.total,
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

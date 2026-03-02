import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type Order } from '../mock-data'

export function useOrders() {
  return useQuery<Order[], Error>({
    queryKey: ['orders'],
    queryFn: api.getOrders,
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

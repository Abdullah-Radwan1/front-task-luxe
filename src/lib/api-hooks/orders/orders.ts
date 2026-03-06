import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createOrderSchema, ordersSchema, type OrdersType } from './orderSchema'
import { api } from '#/lib/mock-data'
import type z from 'zod'

export function useOrders() {
  return useQuery<OrdersType, Error>({
    queryKey: ['orders'],
    queryFn: async () => {
      const orders = await api.getOrders()
      return ordersSchema.parse(orders) // validate API response
    },
  })
}

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

// soon
// export function useOrder(id: string) {
//   return useQuery<OrderType, Error>({
//     queryKey: ['orders', id],
//     queryFn: async () => {
//       const order = await api.getOrderById(id) // افترضنا عندك API method باسم getOrderById
//       return orderSchema.parse(order) // تحقق من صحة الـ order
//     },
//     enabled: !!id, // ما تنفذ إلا إذا كان id موجود
//   })
// }

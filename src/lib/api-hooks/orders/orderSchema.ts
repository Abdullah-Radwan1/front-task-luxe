import { z } from 'zod'

// -----------------------------
// 1️⃣ Order Item Schema
// -----------------------------
export const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
})

export type OrderItem = z.infer<typeof orderItemSchema>

// -----------------------------
// 2️⃣ Create Order Input Schema
// -----------------------------
export const createOrderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  email: z.email('Invalid email address'),
  cartItems: z.array(orderItemSchema).min(1, 'Cart cannot be empty'),
  total: z.number().positive('Total must be positive'),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

// -----------------------------
// 3️⃣ Order Schema (full order from API)
// -----------------------------
export const orderSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  email: z.email(),
  cartItems: z.array(orderItemSchema),
  total: z.number(),
  createdAt: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
    message: 'Invalid ISO date',
  }),
  status: z.enum(['completed', 'pending', 'cancelled']), // <-- add this
})

export type OrderType = z.infer<typeof orderSchema>
export const ordersSchema = z.array(orderSchema)
export type OrdersType = z.infer<typeof ordersSchema>

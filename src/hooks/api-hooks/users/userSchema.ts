import { z } from 'zod'

// 1️⃣ Schema for Register
export const registerUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'), // Note: it's z.string().email(), not z.email()
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// 2️⃣ Schema for Login
export const loginUserSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// 3️⃣ Schema for the User object (Aligned with your data)
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  password: z.string(),
  role: z.enum(['admin', 'customer']), // Aligns with 'admin'
  status: z.enum(['active', 'inactive']), // Aligns with 'active'
  joinedAt: z.string(), // '2025-01-01' is a string
})
// Schema for paginated users
export const paginatedUsersSchema = z.object({
  users: z.array(userSchema),
  total: z.number(),
  totalPages: z.number(),
  page: z.number(),
  pageSize: z.number(),
})
// 4️⃣ Schema for Array of Users
export const usersSchema = z.array(userSchema)

// 5️⃣ TypeScript types
export type RegisterUserInput = z.infer<typeof registerUserSchema>
export type LoginUserInput = z.infer<typeof loginUserSchema>
export type UserType = z.infer<typeof userSchema>
export type UsersType = z.infer<typeof usersSchema>

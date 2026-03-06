import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../mock-data'
import { z } from 'zod'

import {
  userSchema,
  registerUserSchema,
  loginUserSchema,
  type UserType,
} from './userSchema' // افترضنا نفس الشيء للمستخدمين

// -----------------------------
// Users
// -----------------------------
export function useUsers() {
  return useQuery<UserType[], Error>({
    queryKey: ['users'],
    queryFn: async () => {
      const users = await api.getUsers()
      return z.array(userSchema).parse(users) // validate API response
    },
  })
}

export function useRegisterUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: z.infer<typeof registerUserSchema>) => {
      // validate input
      const parsed = registerUserSchema.parse(data)
      return api.registerUser(parsed.name, parsed.email, parsed.password)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useLoginUser() {
  return useMutation({
    mutationFn: (data: z.infer<typeof loginUserSchema>) => {
      const parsed = loginUserSchema.parse(data)
      return api.loginUser(parsed.email, parsed.password)
    },
  })
}

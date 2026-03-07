import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../../lib/mock-data'
import { z } from 'zod'

import {
  registerUserSchema,
  loginUserSchema,
  paginatedUsersSchema,
} from './userSchema' // افترضنا نفس الشيء للمستخدمين

// -----------------------------
// Users
// -----------------------------
export function useUsers(page = 1, pageSize = 6) {
  return useQuery({
    queryKey: ['users', page, pageSize],
    staleTime: 1000 * 60 * 5, // Keep data "fresh" for 5 minutes
    queryFn: async () => {
      const response = await api.getUsers({ page, pageSize })
      return paginatedUsersSchema.parse(response) // validate API response
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

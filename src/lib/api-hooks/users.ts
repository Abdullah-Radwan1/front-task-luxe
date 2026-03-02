import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type User } from '../mock-data'

export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: api.getUsers,
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

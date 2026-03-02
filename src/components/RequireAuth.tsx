import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import type { ReactNode } from 'react'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  if (!isAuthenticated || user?.role !== 'admin') {
    navigate({ to: '/admin/login' })
    return null
  }
  return { children }
}

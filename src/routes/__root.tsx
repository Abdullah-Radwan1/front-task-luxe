import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AppLayout } from './index'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createRootRoute({
  // global guard that handles authentication and role segregation
  beforeLoad: ({ location }) => {
    const { user } = useAuthStore.getState()

    if (
      user?.role !== 'admin' &&
      location.pathname.startsWith('/admin') &&
      location.pathname !== '/admin/login'
    ) {
      throw redirect({ to: '/admin/login' })
    }
  },
  component: () => (
    <AppLayout>
      {/* <CustomCursor />  enable if you want it */}
      <Outlet />
      <TanStackRouterDevtools />
    </AppLayout>
  ),
})

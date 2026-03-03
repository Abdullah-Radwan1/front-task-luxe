import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AppLayout } from './index'
import { useAuthStore } from '@/stores/auth-store'
import { CustomCursor } from '#/components/Cursor'

export const Route = createRootRoute({
  // global guard that handles authentication and role segregation
  beforeLoad: ({ location }) => {
    const { user } = useAuthStore.getState()

    // 2. now handle users who are logged in
    if (user?.role === 'admin') {
      // admins should stay within /admin and never see the public UI
      if (!location.pathname.startsWith('/admin')) {
        throw redirect({ to: '/admin' })
      }
      if (location.pathname === '/admin/login') {
        throw redirect({ to: '/admin' })
      }
    }

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

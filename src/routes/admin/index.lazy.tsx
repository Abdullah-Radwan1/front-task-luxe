import { redirect, createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/admin/')({
  component: async () => {
    // Redirect immediately when this route is loaded
    throw redirect({
      to: '/admin/dashboard',
      replace: true,
    })
  },
})

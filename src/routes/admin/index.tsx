import { redirect, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  beforeLoad: () => {
    // Redirect immediately when this route is loaded
    throw redirect({
      to: '/admin/dashboard',
      replace: true,
    })
  },
  component: () => null,
})

import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  beforeLoad: () => {
    throw redirect({
      to: '/admin/dashboard',
      replace: true, // Replaces history so the back button doesn't loop
    })
  },
})

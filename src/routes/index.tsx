import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/HeroSection'
import { FeaturedCarousel } from '@/components/FeaturedCarousel'
import { ProductGrid } from '@/components/ProductGrid'
import { useAuthStore } from '@/stores/auth-store'
import { CartDrawer } from '#/components/CartDrawer'

const queryClient = new QueryClient()

export const AppLayout = ({ children }: { children?: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className=" mx-auto aligcn-middle  ">
          <Header />
          <main className="flex-1 mx-auto ">{children}</main>
          <Footer />
          <CartDrawer />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
)

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // if an admin somehow lands here, bounce them to the panel
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate({ to: '/admin' })
    }
  }, [user, navigate])

  return (
    <div className="space-y-20 pb-12">
      <HeroSection />
      <FeaturedCarousel />

      <ProductGrid />
    </div>
  )
}

export default AppLayout

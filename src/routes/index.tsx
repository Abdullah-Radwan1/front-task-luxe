import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense, type ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '#/components/home/HeroSection'
import { FeaturedCarousel } from '#/components/home/FeaturedCarousel'
import { ProductGrid } from '#/components/home/ProductGrid'

import { CartDrawer } from '#/components/layout/CartDrawer'

const queryClient = new QueryClient()

export const AppLayout = ({ children }: { children?: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className=" mx-auto  flex min-h-screen  justify-between flex-col">
          <Header />
          <main className=" ">{children}</main>
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
  return (
    <div className="space-y-20 pb-12">
      {/* الـ HeroSection يفضل تحميله عادي لأنه أول حاجة بتظهر (LCP) */}
      <HeroSection />

      <Suspense>
        <FeaturedCarousel />
      </Suspense>

      <Suspense>
        <ProductGrid />
      </Suspense>
    </div>
  )
}

export default AppLayout

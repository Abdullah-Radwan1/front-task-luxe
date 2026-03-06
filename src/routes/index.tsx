import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
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
        <div className=" mx-auto aligcn-middle  ">
          <Header />
          <main className="flex-1 mx-auto  ">{children}</main>
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
      <HeroSection />
      <FeaturedCarousel />

      <ProductGrid />
    </div>
  )
}

export default AppLayout

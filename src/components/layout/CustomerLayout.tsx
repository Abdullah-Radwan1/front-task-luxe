import { Header } from './Header'
import { Footer } from './Footer'
import { CartDrawer } from '../CartDrawer'

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

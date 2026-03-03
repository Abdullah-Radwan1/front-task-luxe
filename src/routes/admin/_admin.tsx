import { useState } from 'react'
import {
  Outlet,
  useNavigate,
  createFileRoute,
  redirect,
  Link,
} from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAuthStore } from '@/stores/auth-store'
import { useTheme } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'

// 1. Define the Route with Security Logic
export const Route = createFileRoute('/admin/_admin')({
  beforeLoad: ({ location }) => {
    const user = useAuthStore.getState().user

    // redirect unauthorized visitors to the admin login page
    if (user?.role !== 'admin') {
      throw redirect({
        to: '/admin/login',
        search: { redirect: location.href },
      })
    }
  },
  component: AdminLayout,
})

const navItems = [
  { key: 'dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { key: 'products', path: '/admin/products', icon: Package },
  { key: 'orders', path: '/admin/orders', icon: ShoppingCart },
  { key: 'users', path: '/admin/users', icon: Users },
]

export function AdminLayout() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const { theme, toggle } = useTheme()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const switchLang = () => {
    const next = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(next)
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = next
  }

  const closeMobileMenu = () => setIsMobileOpen(false)

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
    setShowLogoutDialog(false)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile Top Bar */}
      <div className="flex items-center justify-between p-4 border-b bg-card md:hidden">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-bold">LUXE</span>
          <span className="text-xs text-muted-foreground">Admin</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card p-4 border-r flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:w-56 md:flex',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold">LUXE</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={closeMobileMenu}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ key, path, icon: Icon }) => (
            <Link
              key={key}
              to={path}
              onClick={closeMobileMenu}
              activeProps={{ className: 'bg-accent/10 text-accent' }}
              inactiveProps={{
                className:
                  'text-muted-foreground hover:text-foreground hover:bg-muted',
              }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              <Icon className="h-4 w-4" />
              {t(`admin.${key}`)}
            </Link>
          ))}
        </nav>

        <div className="space-y-1 pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3"
            onClick={switchLang}
          >
            <Globe className="h-4 w-4" />{' '}
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3"
            onClick={toggle}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            {t(theme === 'light' ? 'dark' : 'light')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setShowLogoutDialog(true)}
          >
            <LogOut className="h-4 w-4" /> {t('nav.logout')}
          </Button>
        </div>
      </motion.aside>

      {/* Main content area where child routes appear */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <Outlet />
      </main>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <span>{t('logout.title') || 'Confirm Logout'}</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('logout.confirmMessage') ||
                'Are you sure you want to log out? You will need to log in again to access the admin area.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('logout.cancel') || 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t('logout.logout') || 'Logout'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

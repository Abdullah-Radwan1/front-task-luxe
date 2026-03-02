import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import {
  ShoppingBag,
  Sun,
  Moon,
  Menu,
  Globe,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  Heart,
  Home,
  Package,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/components/ThemeProvider'
import { useCartStore } from '@/stores/cart-store'
import { useAuthStore } from '@/stores/auth-store'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'

export function Header() {
  const { t, i18n } = useTranslation()
  const { theme, toggle } = useTheme()
  const totalItems = useCartStore((s) => s.totalItems())
  const toggleCart = useCartStore((s) => s.toggleCart)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = (location as any)?.pathname || window.location.pathname

  const switchLang = () => {
    const next = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(next)
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
  }

  if (user?.role === 'admin') return null
  if (['/login', '/register', '/admin/login'].includes(pathname)) return null

  // Helper for mobile links to reduce repetition
  const MobileNavLink = ({ to, icon: Icon, children, className = '' }: any) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`flex items-center justify-between py-4 text-lg font-medium border-b border-border/50 hover:text-primary transition-colors ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-2 rounded-lg text-primary">
          <Icon className="h-5 w-5" />
        </div>
        {children}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  )

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md flex justify-center"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="font-display text-2xl font-bold tracking-tighter text-primary"
        >
          LUXE
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/products"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {t('nav.shop')}
          </Link>
          <Link
            to="/admin/login"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {t('nav.admin')}
          </Link>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Theme & Lang (Desktop Only) */}
          <div className="hidden sm:flex items-center gap-1 border-r pr-2 mr-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={switchLang}
              className="h-9 w-9"
            >
              <Globe className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="h-9 w-9"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>

          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Heart className="h-5 w-5 text-muted-foreground hover:text-destructive transition-colors" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            onClick={toggleCart}
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

          {/* AUTH DROPDOWN (Desktop) */}
          <div className="hidden md:flex">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-full px-4 border-primary/20"
                  >
                    <User className="h-4 w-4" />
                    <span>{user?.name?.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{t('nav.my_account')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" /> {t('nav.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout()
                      navigate({ to: '/login' })
                    }}
                    className="text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" className="rounded-full px-6" asChild>
                <Link to="/login">{t('nav.login')}</Link>
              </Button>
            )}
          </div>

          {/* MOBILE MENU TRIGGER */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="ml-1">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side={i18n.language === 'ar' ? 'left' : 'right'}
              className="w-[85%] sm:w-[400px] flex flex-col p-0"
            >
              <SheetHeader className="p-6 text-left border-b bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                    {isAuthenticated ? user?.name?.[0].toUpperCase() : <User />}
                  </div>
                  <div>
                    <SheetTitle className="text-left">
                      {isAuthenticated ? user?.name : 'Welcome to LUXE'}
                    </SheetTitle>
                    <p className="text-xs text-muted-foreground">
                      {isAuthenticated
                        ? user?.email
                        : 'Sign in to manage your orders'}
                    </p>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                <nav className="flex flex-col">
                  <MobileNavLink to="/" icon={Home}>
                    {t('nav.home')}
                  </MobileNavLink>
                  <MobileNavLink to="/products" icon={Package}>
                    {t('nav.shop')}
                  </MobileNavLink>
                  <MobileNavLink to="/wishlist" icon={Heart}>
                    {t('nav.wishlist')}
                  </MobileNavLink>

                  {isAuthenticated && (
                    <MobileNavLink to="/profile" icon={Settings}>
                      Settings
                    </MobileNavLink>
                  )}

                  <MobileNavLink
                    to="/admin/login"
                    icon={ShieldCheck}
                    className="border-none"
                  >
                    {t('nav.admin')}
                  </MobileNavLink>
                </nav>

                <div className="mt-8">
                  {!isAuthenticated && (
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        asChild
                        onClick={() => setMobileOpen(false)}
                      >
                        <Link to="/login">{t('nav.login')}</Link>
                      </Button>
                      <Button
                        className="w-full"
                        asChild
                        onClick={() => setMobileOpen(false)}
                      >
                        <Link to="/register">{t('nav.register')}</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <SheetFooter className="p-6 border-t mt-auto bg-muted/20">
                <div className="flex flex-col w-full gap-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Appearance & Language</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={switchLang}
                        className="rounded-full bg-background"
                      >
                        <span className="text-xs font-bold">
                          {i18n.language.toUpperCase()}
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggle}
                        className="rounded-full bg-background"
                      >
                        {theme === 'light' ? (
                          <Moon className="h-4 w-4" />
                        ) : (
                          <Sun className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {isAuthenticated && (
                    <Button
                      variant="outline"
                      className="w-full text-destructive border-destructive/20 hover:bg-destructive/10"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> {t('nav.logout')}
                    </Button>
                  )}
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}

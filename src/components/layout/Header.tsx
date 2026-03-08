import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import {
  ShoppingBag,
  Sun,
  Moon,
  Menu,
  Globe,
  User,
  LogOut,
  Settings,
  Heart,
  Home,
  Package,
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
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
import { useTheme } from '@/components/ThemeProvider'
import { useCartStore } from '@/stores/cart-store'
import { useAuthStore } from '@/stores/auth-store'
import { useState } from 'react'
import { useLanguageStore } from '#/stores/language-store'

export function Header() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const { theme, toggle } = useTheme()
  const totalItems = useCartStore((s) => s.totalItems())
  const toggleCart = useCartStore((s) => s.toggleCart)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = (location as any)?.pathname || window.location.pathname
  const { setLanguage } = useLanguageStore()

  const switchLang = () => {
    const next = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(next)
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
    setLanguage(next)
  }

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
    setLogoutDialogOpen(false)
  }
  const SPRING_TRANSITION = {
    type: 'spring',
    damping: 25,
    stiffness: 200,
  } as const
  if (['/login', '/register', '/admin/login'].includes(pathname)) return null

  // Fixed: Added motion wrapper to links for a staggered "slide-in" effect
  const MobileNavLink = ({
    to,
    icon: Icon,
    children,
    index,
    className = '',
  }: any) => (
    <motion.div
      initial={{ x: isRtl ? -20 : 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ...(SPRING_TRANSITION as any), delay: index * 0.05 }}
    >
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
        <ChevronRight
          className={`h-4 w-4 text-muted-foreground transition-transform ${isRtl ? 'rotate-180' : ''}`}
        />
      </Link>
    </motion.div>
  )

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={SPRING_TRANSITION as any}
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
            {['home', 'shop', 'admin'].map((item) => (
              <Link
                key={item}
                to={
                  item === 'home'
                    ? '/'
                    : item === 'shop'
                      ? '/products'
                      : '/admin/login'
                }
                className="text-sm font-medium hover:text-primary transition-colors relative group"
              >
                {t(`nav.${item}`)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:width-full" />
              </Link>
            ))}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-1 md:gap-2">
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
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={SPRING_TRANSITION as any}
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            {/* AUTH DROPDOWN */}
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
                      <Link
                        to="/profile"
                        className="w-full cursor-pointer flex items-center"
                      >
                        <Settings className="mr-2 h-4 w-4" /> {t('nav.profile')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setLogoutDialogOpen(true)}
                      className="text-destructive cursor-pointer flex items-center"
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

            {/* MOBILE MENU */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="ml-1">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={isRtl ? 'right' : 'left'}
                className="w-[85%] sm:w-80 flex flex-col p-0 border-none shadow-2xl"
              >
                <SheetHeader className="p-6 text-left border-b bg-muted/30">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={SPRING_TRANSITION as any}
                    className="flex items-center gap-4"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20">
                      {isAuthenticated ? (
                        user?.name?.[0].toUpperCase()
                      ) : (
                        <User />
                      )}
                    </div>
                    <div className={isRtl ? 'text-right' : 'text-left'}>
                      <SheetTitle
                        className={isRtl ? 'text-right' : 'text-left'}
                      >
                        {isAuthenticated ? user?.name : 'Welcome to LUXE'}
                      </SheetTitle>
                      <p className="text-xs text-muted-foreground">
                        {isAuthenticated
                          ? user?.email
                          : 'Sign in to manage your orders'}
                      </p>
                    </div>
                  </motion.div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <nav className="flex flex-col">
                    <MobileNavLink to="/" icon={Home} index={0}>
                      {t('nav.home')}
                    </MobileNavLink>
                    <MobileNavLink to="/products" icon={Package} index={1}>
                      {t('nav.shop')}
                    </MobileNavLink>
                    <MobileNavLink to="/wishlist" icon={Heart} index={2}>
                      {t('nav.wishlist')}
                    </MobileNavLink>
                    {isAuthenticated && (
                      <MobileNavLink to="/profile" icon={Settings} index={3}>
                        Settings
                      </MobileNavLink>
                    )}
                    <MobileNavLink
                      to="/admin/login"
                      icon={ShieldCheck}
                      index={4}
                      className="border-none"
                    >
                      {t('nav.admin')}
                    </MobileNavLink>
                  </nav>

                  {!isAuthenticated && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-8 grid grid-cols-2 gap-4"
                    >
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
                    </motion.div>
                  )}
                </div>

                <SheetFooter className="p-6 border-t mt-auto bg-muted/20">
                  <div className="flex flex-col w-full gap-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Preferences</p>
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
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      {/* Logout Dialog remains same */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <span>{t('nav.logoutConfirmTitle') || 'Confirm Logout'}</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('nav.logoutConfirmMessage') ||
                'Are you sure you want to log out?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('nav.cancel') || 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t('nav.logout')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

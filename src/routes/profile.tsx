import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { User, LogOut, ShoppingBag, Heart, AlertTriangle } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
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

export const Route = createFileRoute('/profile')({
  component: Profile,
})

export default function Profile() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  // Redirect to login if not authenticated
  if (!user) {
    navigate({ to: '/login' })
    return null
  }

  // Prevent admins from accessing customer profile
  if (user.role === 'admin') {
    navigate({ to: '/admin' })
    return null
  }

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  const menuItems = [
    { icon: ShoppingBag, label: t('profile.orders'), href: '/orders' },
    { icon: Heart, label: t('profile.wishlist'), href: '/wishlist' },
  ]

  return (
    <main className="flex-1 py-12  px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Welcome Section */}
        <div className="mb-12 pb-8 border-b border-border/50">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between gap-4"
          >
            <div>
              <h1 className="font-display text-5xl font-bold mb-2 bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('profile.welcome')}, {user.name}!
              </h1>
              <p className="text-muted-foreground text-lg">
                {t('profile.subtitle')}
              </p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="h-20 w-20 rounded-full bg-linear-to-r from-primary to-accent/50 flex items-center justify-center shrink-0"
            >
              <User className="h-10 w-10 text-white" />
            </motion.div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="h-full bg-linear-to-br from-card to-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="h-5 w-5 text-primary" />
                  {t('profile.accountInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {t('user.name')}
                  </p>
                  <p className="font-display text-xl font-bold">{user.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {t('user.email')}
                  </p>
                  <p className="font-medium text-foreground/80">{user.email}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Statistics Cards - Top Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Total Orders */}
              <div className="bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-lg p-6 flex flex-col justify-center">
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
                  {t('profile.totalOrders')}
                </p>
                <p className="font-display text-4xl font-bold text-blue-600 dark:text-blue-400">
                  0
                </p>
              </div>
              {/* Total Spent */}
              <div className="bg-linear-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-6 flex flex-col justify-center">
                <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">
                  {t('profile.totalSpent')}
                </p>
                <p className="font-display text-4xl font-bold text-accent">
                  $0
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="font-display text-2xl font-bold mb-4">
            {t('profile.quickActions')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  onClick={() => navigate({ to: item.href })}
                  className="group flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-left hover:shadow-md"
                >
                  <div className="h-12 w-12 rounded-lg bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <Icon className="h-6 w-6 text-primary group-hover:text-primary" />
                  </div>
                  <span className="font-medium group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-8 border-t border-border/50"
        >
          <Button
            variant="destructive"
            className="gap-2 px-6"
            onClick={() => setLogoutDialogOpen(true)}
          >
            <LogOut className="h-4 w-4" />
            {t('nav.logout')}
          </Button>
        </motion.div>
      </motion.div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {t('logout.title') || 'Confirm Logout'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('logout.ConfirmMessage') ||
                'Are you sure you want to log out? You will need to log in again to access your account.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('logout.cancel') || 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('logout.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}

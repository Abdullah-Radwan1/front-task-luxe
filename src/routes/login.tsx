import { useState, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'
import { useTheme } from '@/components/ThemeProvider'
import {
  Sun,
  Moon,
  Globe,
  Mail,
  Lock,
  LogIn,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'

type FormData = {
  email: string
  password: string
}

export const Route = createFileRoute('/login')({
  component: UserLogin,
})

export default function UserLogin() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const user = useAuthStore((s) => s.user)
  const { theme, toggle } = useTheme()
  const [isLoading, setIsLoading] = useState(false)

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) navigate({ to: user.role === 'admin' ? '/admin' : '/' })
  }, [user, navigate])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    // Artificial delay for UX
    await new Promise((r) => setTimeout(r, 800))

    const ok = login(data.email, data.password)
    if (ok) {
      navigate({ to: '/' })
    } else {
      // Manual error setting for failed auth
      setError('password', {
        type: 'manual',
        message: t('user.invalidCredentials'),
      })
    }
    setIsLoading(false)
  }

  const switchLang = () => {
    const next = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(next)
    const isRtl = next === 'ar'
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
    document.documentElement.lang = next
  }

  const isRtl = i18n.language === 'ar'

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-accent/5 p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top controls */}
      <div className="absolute top-0 left-0 right-0 flex justify-end gap-2 p-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={switchLang}
          className="rounded-full hover:bg-accent/10"
        >
          <Globe className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="rounded-full hover:bg-accent/10"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-105 relative z-10"
      >
        <Card className="border shadow-2xl bg-background/80 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center space-y-1 pb-8 pt-10">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="mx-auto w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-4"
            >
              <LogIn className="h-8 w-8 text-accent" />
            </motion.div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              {t('user.login')}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('user.enterCredentials')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold px-1">
                  {t('user.email')}
                </Label>
                <div className="relative group">
                  <Mail
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-accent',
                      isRtl ? 'right-3' : 'left-3',
                    )}
                  />
                  <Input
                    {...register('email', {
                      required: t('user.emailRequired') || 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message:
                          t('user.invalidEmail') || 'Invalid email address',
                      },
                    })}
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className={cn(
                      'h-12 bg-background/50 border-accent/10 transition-all focus:ring-2 focus:ring-accent/20',
                      isRtl ? 'pr-11' : 'pl-11',
                      errors.email &&
                        'border-destructive ring-destructive/20 focus:ring-destructive/20',
                    )}
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-destructive font-medium flex items-center gap-1 px-1"
                    >
                      <AlertCircle size={12} /> {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <Label htmlFor="password">{t('user.password')}</Label>
                  <Link to="/" className="text-xs text-accent hover:underline">
                    {t('user.forgotPassword')}
                  </Link>
                </div>
                <div className="relative group">
                  <Lock
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-accent',
                      isRtl ? 'right-3' : 'left-3',
                    )}
                  />
                  <Input
                    {...register('password', {
                      required:
                        t('user.passwordRequired') || 'Password is required',
                      minLength: {
                        value: 6,
                        message:
                          t('user.passwordMinLength') || 'Min 6 characters',
                      },
                    })}
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={cn(
                      'h-12 bg-background/50 border-accent/10 transition-all focus:ring-2 focus:ring-accent/20',
                      isRtl ? 'pr-11' : 'pl-11',
                      errors.password &&
                        'border-destructive ring-destructive/20',
                    )}
                  />
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-destructive font-medium flex items-center gap-1 px-1"
                    >
                      <AlertCircle size={12} /> {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-xl shadow-lg shadow-accent/20 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <span>{t('user.signIn')}</span>
                    <LogIn className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-4 pb-10 border-t bg-muted/30">
            <p className="text-sm text-muted-foreground text-center">
              {t('user.noAccount')}{' '}
              {/* FIXED: Changed to="/register" instead of to="/" */}
              <Link
                to="/register"
                className="text-accent font-bold hover:underline"
              >
                {t('user.register')}
              </Link>
            </p>

            <Link
              to="/admin/login"
              className="text-[10px] underline uppercase font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              {t('user.adminLogin')} <Lock size={10} />
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

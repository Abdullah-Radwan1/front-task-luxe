import { useState, useEffect } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
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
  UserPlus,
  AlertCircle,
  Loader2,
  User,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'

type FormData = {
  name: string
  email: string
  password: string
  confirm: string
}

export const Route = createFileRoute('/register')({
  component: Register,
})

export default function Register() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const registerUser = useAuthStore((s) => s.register)
  const user = useAuthStore((s) => s.user)
  const { theme, toggle } = useTheme()
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
  })

  const passwordValue = watch('password', '')
  const isRtl = i18n.language === 'ar'

  useEffect(() => {
    if (user) navigate({ to: user.role === 'admin' ? '/admin' : '/' })
  }, [user, navigate])

  const onSubmit = (data: FormData) => {
    setIsLoading(true)
    setServerError('')

    setTimeout(() => {
      const ok = registerUser(data.name, data.email, data.password)
      if (!ok) {
        setServerError(t('user.emailInUse'))
        setIsLoading(false)
      } else {
        navigate({ to: '/' })
      }
    }, 800)
  }

  const switchLang = () => {
    const next = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(next)
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = next
  }

  // Password Strength Helpers
  const hasMinLength = passwordValue.length >= 6
  const hasUppercase = /[A-Z]/.test(passwordValue)
  const hasNumber = /[0-9]/.test(passwordValue)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background via-background to-accent/5 relative overflow-hidden">
      {/* Decorative Background */}
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-110 z-10"
      >
        <Card className="border shadow-2xl bg-background/80 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center space-y-1 pb-6 pt-8">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              {t('user.register')}
            </CardTitle>
            <CardDescription>{t('user.createAccount')}</CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                  {t('user.name')}
                </Label>
                <div className="relative group">
                  <User
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary',
                      isRtl ? 'right-3' : 'left-3',
                    )}
                  />
                  <Input
                    {...register('name', {
                      required: t('user.nameRequired') || 'Name is required',
                    })}
                    placeholder="John Doe"
                    className={cn(
                      'h-11 bg-background/50 border-accent/10 transition-all',
                      isRtl ? 'pr-10' : 'pl-10',
                      errors.name && 'border-destructive',
                    )}
                  />
                </div>
                <AnimatePresence mode="wait">
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[11px] text-destructive flex items-center gap-1 px-1 overflow-hidden font-medium pt-1"
                    >
                      <AlertCircle size={12} /> {errors.name.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                  {t('user.email')}
                </Label>
                <div className="relative group">
                  <Mail
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary',
                      isRtl ? 'right-3' : 'left-3',
                    )}
                  />
                  <Input
                    {...register('email', {
                      required: t('user.emailRequired') || 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t('user.invalidEmail') || 'Invalid email',
                      },
                    })}
                    type="email"
                    placeholder="name@example.com"
                    className={cn(
                      'h-11 bg-background/50 border-accent/10 transition-all',
                      isRtl ? 'pr-10' : 'pl-10',
                      errors.email && 'border-destructive',
                    )}
                  />
                </div>
                <AnimatePresence mode="wait">
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[11px] text-destructive flex items-center gap-1 px-1 overflow-hidden font-medium pt-1"
                    >
                      <AlertCircle size={12} /> {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                  {t('user.password')}
                </Label>
                <div className="relative group">
                  <Lock
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary',
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
                          t('user.passwordTooShort') || 'Min 6 characters',
                      },
                      validate: {
                        hasUpper: (v) =>
                          /[A-Z]/.test(v) ||
                          t('user.needUpper') ||
                          'Need 1 uppercase',
                        hasNum: (v) =>
                          /[0-9]/.test(v) ||
                          t('user.needNum') ||
                          'Need 1 number',
                      },
                    })}
                    type="password"
                    placeholder="••••••••"
                    className={cn(
                      'h-11 bg-background/50 border-accent/10 transition-all',
                      isRtl ? 'pr-10' : 'pl-10',
                      errors.password && 'border-destructive',
                    )}
                  />
                </div>

                {/* Strength Meter */}
                <div className="pt-1 px-1">
                  <div className="flex gap-1.5 h-1">
                    <div
                      className={cn(
                        'flex-1 rounded-full transition-colors',
                        hasMinLength ? 'bg-green-500' : 'bg-muted',
                      )}
                    />
                    <div
                      className={cn(
                        'flex-1 rounded-full transition-colors',
                        hasUppercase ? 'bg-green-500' : 'bg-muted',
                      )}
                    />
                    <div
                      className={cn(
                        'flex-1 rounded-full transition-colors',
                        hasNumber ? 'bg-green-500' : 'bg-muted',
                      )}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] mt-1 font-bold text-muted-foreground uppercase tracking-tighter">
                    <span className={cn(hasMinLength && 'text-green-600')}>
                      6+ Chars
                    </span>
                    <span className={cn(hasUppercase && 'text-green-600')}>
                      Uppercase
                    </span>
                    <span className={cn(hasNumber && 'text-green-600')}>
                      Number
                    </span>
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[11px] text-destructive flex items-center gap-1 px-1 overflow-hidden font-medium pt-1"
                    >
                      <AlertCircle size={12} /> {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                  {t('user.confirmPassword')}
                </Label>
                <div className="relative group">
                  <CheckCircle2
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary',
                      isRtl ? 'right-3' : 'left-3',
                    )}
                  />
                  <Input
                    {...register('confirm', {
                      required:
                        t('user.confirmRequired') || 'Confirm your password',
                      validate: (val) =>
                        val === passwordValue ||
                        t('user.passwordsDoNotMatch') ||
                        'Passwords do not match',
                    })}
                    type="password"
                    placeholder="••••••••"
                    className={cn(
                      'h-11 bg-background/50 border-accent/10 transition-all',
                      isRtl ? 'pr-10' : 'pl-10',
                      errors.confirm && 'border-destructive',
                    )}
                  />
                </div>
                <AnimatePresence mode="wait">
                  {errors.confirm && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[11px] text-destructive flex items-center gap-1 px-1 overflow-hidden font-medium pt-1"
                    >
                      <AlertCircle size={12} /> {errors.confirm.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Server Error Message */}
              <AnimatePresence>
                {serverError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-destructive/10 text-destructive text-[11px] p-2.5 rounded-lg border border-destructive/20 flex items-center gap-2 overflow-hidden"
                  >
                    <AlertCircle size={14} /> {serverError}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  t('user.createAccount')
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pb-8 pt-4 border-t bg-muted/20">
            <p className="text-sm text-muted-foreground text-center">
              {t('user.haveAccount')}{' '}
              <Link
                to="/login"
                className="text-primary font-bold hover:underline"
              >
                {t('user.login')}
              </Link>
            </p>
            <Link
              to="/admin/login"
              className="text-[10px] uppercase font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              {t('user.adminLogin')} <Lock size={10} />
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, Link, redirect } from '@tanstack/react-router'
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
  Sparkles,
  ShoppingBag,
  Shield,
  Truck,
  Star,
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
  beforeLoad: () => {
    const user = useAuthStore.getState().user
    if (user) throw redirect({ to: '/' })
  },
})

export default function Register() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const registerUser = useAuthStore((s) => s.register)

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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-accent/5 p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse delay-1000" />

      {/* Floating elements for visual interest */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent/30 rounded-full"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-primary/20 rounded-full"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Top controls */}
      <div className="absolute top-0 left-0 right-0 flex justify-end gap-2 p-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={switchLang}
          className="rounded-full hover:bg-accent/10 backdrop-blur-sm"
        >
          <Globe className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="rounded-full hover:bg-accent/10 backdrop-blur-sm"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main content with split layout for larger screens */}
      <div className="w-full max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-8">
        {/* Left side - Text introduction */}
        <motion.div
          initial={{ opacity: 0, x: isRtl ? 30 : -30 }} // Reverse animation direction for RTL
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            'flex-1 space-y-6 px-4 lg:px-0',
            isRtl ? 'lg:text-right text-right' : 'lg:text-left text-left',
          )}
        >
          {/* Brand badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cn(
              'inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full',
              isRtl ? 'flex-row' : 'flex-row',
            )}
          >
            <span className="text-sm font-semibold">{t('brand.welcome')}</span>
            <Sparkles className="h-4 w-4" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl lg:text-5xl xl:text-6xl font-bold"
          >
            <span
              className={cn(
                'bg-clip-text text-transparent',
                isRtl ? 'bg-linear-to-l' : 'bg-linear-to-r', // Reverse gradient direction for RTL
                'from-accent to-foreground/90',
              )}
            >
              {t('brand.tagline')}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={cn(
              'text-lg text-muted-foreground max-w-xl',
              isRtl ? 'lg:mx-0 mr-auto' : 'lg:mx-0 ml-auto',
              'mx-auto',
            )}
          >
            {t('brand.description')}
          </motion.p>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4"
          >
            {[
              { icon: ShoppingBag, text: t('brand.products') },
              { icon: Shield, text: t('brand.security') },
              { icon: Truck, text: t('brand.shipping') },
              { icon: Star, text: t('brand.prices') },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border border-accent/10 rounded-xl p-3"
              >
                <item.icon className="h-5 w-5 text-accent shrink-0" />
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side - Register form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="border shadow-2xl bg-background/80 backdrop-blur-xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center space-y-1 pb-8 pt-10">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="mx-auto w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-4"
              >
                <UserPlus className="h-8 w-8 text-accent" />
              </motion.div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                {t('user.register')}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {t('user.createAccountDescription')}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold px-1">
                    {t('user.name')}
                  </Label>
                  <div className="relative group">
                    <User
                      className={cn(
                        'absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-accent',
                        isRtl ? 'right-3' : 'left-3',
                      )}
                    />
                    <Input
                      {...register('name', {
                        required: t('user.nameRequired'),
                      })}
                      id="name"
                      placeholder={isRtl ? 'محمد أحمد' : 'John Doe'}
                      className={cn(
                        'h-12 bg-background/50 border-accent/10 transition-all focus:ring-2 focus:ring-accent/20',
                        isRtl ? 'pr-11' : 'pl-11',
                        errors.name && 'border-destructive ring-destructive/20',
                      )}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-destructive font-medium flex items-center gap-1 px-1"
                      >
                        <AlertCircle size={12} /> {errors.name.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Email */}
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
                        required: t('user.emailRequired'),
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: t('user.invalidEmail'),
                        },
                      })}
                      id="email"
                      type="email"
                      placeholder={
                        isRtl ? 'الاسم@مثال.com' : 'name@example.com'
                      }
                      className={cn(
                        'h-12 bg-background/50 border-accent/10 transition-all focus:ring-2 focus:ring-accent/20',
                        isRtl ? 'pr-11' : 'pl-11',
                        errors.email &&
                          'border-destructive ring-destructive/20',
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

                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold px-1"
                  >
                    {t('user.password')}
                  </Label>
                  <div className="relative group">
                    <Lock
                      className={cn(
                        'absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-accent',
                        isRtl ? 'right-3' : 'left-3',
                      )}
                    />
                    <Input
                      {...register('password', {
                        required: t('user.passwordRequired'),
                        minLength: {
                          value: 6,
                          message: t('user.passwordTooShort'),
                        },
                        validate: {
                          hasUpper: (v) =>
                            /[A-Z]/.test(v) || t('user.needUpper'),
                          hasNum: (v) => /[0-9]/.test(v) || t('user.needNum'),
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

                  {/* Password Strength Indicator */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex gap-1.5 h-1">
                      <div
                        className={cn(
                          'flex-1 rounded-full transition-all duration-300',
                          hasMinLength ? 'bg-accent' : 'bg-muted',
                        )}
                      />
                      <div
                        className={cn(
                          'flex-1 rounded-full transition-all duration-300',
                          hasUppercase ? 'bg-accent' : 'bg-muted',
                        )}
                      />
                      <div
                        className={cn(
                          'flex-1 rounded-full transition-all duration-300',
                          hasNumber ? 'bg-accent' : 'bg-muted',
                        )}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
                      <span className={cn(hasMinLength && 'text-accent')}>
                        6+ {t('user.characters')}
                      </span>
                      <span className={cn(hasUppercase && 'text-accent')}>
                        {t('user.uppercase')}
                      </span>
                      <span className={cn(hasNumber && 'text-accent')}>
                        {t('user.number')}
                      </span>
                    </div>
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

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirm"
                    className="text-sm font-semibold px-1"
                  >
                    {t('user.confirmPassword')}
                  </Label>
                  <div className="relative group">
                    <CheckCircle2
                      className={cn(
                        'absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-accent',
                        isRtl ? 'right-3' : 'left-3',
                      )}
                    />
                    <Input
                      {...register('confirm', {
                        required: t('user.confirmRequired'),
                        validate: (val) =>
                          val === passwordValue ||
                          t('user.passwordsDoNotMatch'),
                      })}
                      id="confirm"
                      type="password"
                      placeholder="••••••••"
                      className={cn(
                        'h-12 bg-background/50 border-accent/10 transition-all focus:ring-2 focus:ring-accent/20',
                        isRtl ? 'pr-11' : 'pl-11',
                        errors.confirm &&
                          'border-destructive ring-destructive/20',
                      )}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.confirm && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-destructive font-medium flex items-center gap-1 px-1"
                      >
                        <AlertCircle size={12} /> {errors.confirm.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Server Error */}
                <AnimatePresence>
                  {serverError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-destructive/10 text-destructive text-sm p-3 rounded-xl border border-destructive/20 flex items-center gap-2 overflow-hidden"
                    >
                      <AlertCircle size={16} />
                      <span className="font-medium">{serverError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-xl shadow-lg shadow-accent/20 transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{t('user.createAccount')}</span>
                      <UserPlus className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-4 pb-10 border-t bg-muted/30">
              <p className="text-sm text-muted-foreground text-center">
                {t('user.haveAccount')}{' '}
                <Link
                  to="/login"
                  className="text-accent font-bold hover:underline"
                >
                  {t('user.login')}
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
    </div>
  )
}

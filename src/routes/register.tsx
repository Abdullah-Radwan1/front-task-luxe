import { useState, useEffect } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { Sun, Moon, Globe, Mail, Lock, UserPlus, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'

// Zod Schema
const schema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

type FormData = z.infer<typeof schema>

export const Route = createFileRoute('/register')({
  component: Register,
})

const InputField = ({
  id,
  type,
  icon: Icon,
  placeholder,
  error,
  register,
  t,
}: {
  id: string
  type: string
  icon: any
  placeholder: string
  error?: any
  register: any
  t: any
}) => (
  <div className="space-y-1">
    <Label htmlFor={id} className="text-sm font-medium">
      {t(`user.${id}`)}
    </Label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(id)}
        className={cn(
          'pl-10 py-3 rounded-lg border w-full transition-all focus:ring-2 focus:ring-accent focus:border-accent',
          error && 'border-destructive focus:ring-destructive',
        )}
        aria-invalid={!!error}
        aria-errormessage={error ? `${id}-error` : undefined}
      />
    </div>
    {error?.message && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-destructive flex items-center gap-1 mt-1"
        id={`${id}-error`}
        role="alert"
      >
        <XCircle className="h-3 w-3" /> {error.message}
      </motion.p>
    )}
  </div>
)

export default function Register() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const registerUser = useAuthStore((s) => s.register)
  const user = useAuthStore((s) => s.user)
  const { theme, toggle } = useTheme()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange', // Changed from 'onTouched' to 'onChange'
  })

  const passwordValue = watch('password', '')

  useEffect(() => {
    if (user) navigate({ to: user.role === 'admin' ? '/admin' : '/' })
  }, [user, navigate])

  const onSubmit = (data: FormData) => {
    setIsLoading(true)
    setError('')
    setTimeout(() => {
      const ok = registerUser(data.name, data.email, data.password)
      if (!ok) setError(t('user.emailInUse'))
      else navigate({ to: '/' })
      setIsLoading(false)
    }, 500)
  }

  const onInvalid = (errors: any) => {
    console.log('Validation errors:', errors)
  }

  const switchLang = () => {
    const next = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(next)
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/10 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="absolute top-4 right-4 flex gap-2 z-10">
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
        className="w-full max-w-md z-10"
      >
        <Card className="border-2 shadow-2xl bg-background/95 backdrop-blur-lg rounded-2xl overflow-hidden">
          <CardHeader className="text-center space-y-2 pb-6">
            <p className="font-display text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              LUXE
            </p>
            <CardTitle className="text-2xl font-semibold">
              {t('user.register')}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {t('user.createAccount')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit, onInvalid)}
              noValidate
              className="space-y-5"
            >
              <InputField
                id="name"
                type="text"
                icon={UserPlus}
                placeholder="Full Name"
                error={errors.name}
                register={register}
                t={t}
              />
              <InputField
                id="email"
                type="email"
                icon={Mail}
                placeholder="name@example.com"
                error={errors.email}
                register={register}
                t={t}
              />

              <div className="space-y-2">
                <InputField
                  id="password"
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                  error={errors.password}
                  register={register}
                  t={t}
                />
                <div className="grid grid-cols-3 gap-2 px-1">
                  <div
                    className={cn(
                      'h-1 rounded-full transition-colors',
                      passwordValue.length >= 6 ? 'bg-green-500' : 'bg-muted',
                    )}
                  />
                  <div
                    className={cn(
                      'h-1 rounded-full transition-colors',
                      /[A-Z]/.test(passwordValue) ? 'bg-green-500' : 'bg-muted',
                    )}
                  />
                  <div
                    className={cn(
                      'h-1 rounded-full transition-colors',
                      /[0-9]/.test(passwordValue) ? 'bg-green-500' : 'bg-muted',
                    )}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground flex justify-between px-1">
                  <span>6+ Chars</span>
                  <span>1 Uppercase</span>
                  <span>1 Number</span>
                </p>
              </div>

              <InputField
                id="confirm"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                error={errors.confirm}
                register={register}
                t={t}
              />

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground font-semibold py-4 rounded-lg shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <XCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                {isLoading ? t('user.creating') : t('user.createAccount')}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              {t('user.haveAccount')}{' '}
              <Link
                to="/login"
                className="text-accent font-semibold hover:underline"
              >
                {t('user.login')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

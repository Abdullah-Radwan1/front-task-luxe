import { useState, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
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
import { Sun, Moon, Globe, ArrowLeft, Mail, Lock, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>
export const Route = createFileRoute('/login')({
  component: UserLogin,
})
export default function UserLogin() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const user = useAuthStore((s) => s.user)
  const { theme, toggle } = useTheme()
  const [errorState, setErrorState] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) navigate({ to: user.role === 'admin' ? '/admin' : '/' })
  }, [user, navigate])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setErrorState('')
    await new Promise((r) => setTimeout(r, 500))
    const ok = login(data.email, data.password)
    if (ok) navigate({ to: '/' })
    else {
      setError('password', {
        type: 'manual',
        message: t('user.invalidCredentials'),
      })
      setErrorState(t('user.invalidCredentials'))
    }
    setIsLoading(false)
  }

  const switchLang = () => {
    const next = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(next)
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = next
  }

  const InputField = ({ id, type, icon: Icon, placeholder, error }: any) => (
    <div className="flex flex-col space-y-1">
      <Label htmlFor={id} className="text-sm font-medium text-muted-foreground">
        {t(`user.${id}`)}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={cn(
            'pl-10 py-3 rounded-lg border focus:ring-2 focus:ring-accent focus:border-accent w-full transition-all',
            error && 'border-destructive focus:ring-destructive',
          )}
          aria-invalid={!!error}
          aria-errormessage={error ? `${id}-error` : undefined}
          {...register(id)}
        />
      </div>
      {error && (
        <motion.p
          id={`${id}-error`}
          role="alert"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive mt-1 flex items-center gap-1"
        >
          • {error.message}
        </motion.p>
      )}
    </div>
  )

  const onInvalid = (errors: any) => {
    console.log('RHF errors:', errors)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

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
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-2 shadow-2xl bg-background/95 backdrop-blur-lg rounded-2xl overflow-hidden">
          <CardHeader className="text-center space-y-2 pb-6">
            <p className="font-display text-5xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              LUXE
            </p>
            <CardTitle className="text-2xl font-semibold">
              {t('user.login')}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {t('user.enterCredentials')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit, onInvalid)}
              className="space-y-5"
            >
              <InputField
                id="email"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                error={errors.email}
              />
              <InputField
                id="password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                error={errors.password}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground font-semibold py-4 rounded-lg shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <LogIn className="h-4 w-4" />
                  </motion.div>
                )}
                {!isLoading && <LogIn className="h-4 w-4" />}
                {isLoading ? t('user.signingIn') : t('user.signIn')}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              {t('user.noAccount')}{' '}
              <Link to="/register" className="text-accent underline">
                {t('user.register')}
              </Link>
            </p>
            <p className="text-xs text-accent text-center underline flex items-center justify-center gap-1">
              <Link to="/admin/login">{t('user.adminLogin')}</Link>
              <Lock size={12} />
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

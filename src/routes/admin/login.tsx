import { useState } from 'react'
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
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
import { Sun, Moon, Globe, Mail, Lock, LogIn, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>
export const Route = createFileRoute('/admin/login')({
  beforeLoad: () => {
    const user = useAuthStore.getState().user
    if (user?.role === 'admin') {
      throw redirect({ to: '/admin' })
    }
  },
  component: AdminLogin,
})
export default function AdminLogin() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const { theme, toggle } = useTheme()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'admin@luxe.com', password: 'admin123' },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError('')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    login(data.email, data.password)
      ? navigate({ to: '/admin' })
      : setError('Invalid credentials')
    setIsLoading(false)
  }

  const switchLang = () => {
    const next = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(next)
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = next
  }

  const InputField = ({ id, type, icon: Icon, placeholder, error }: any) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {t(`admin.${id}`)}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={cn('pl-9', error && 'border-destructive')}
          {...register(id)}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-destructive flex items-center gap-1 mt-1"
        >
          <span>•</span> {error.message}
        </motion.p>
      )}
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-brfrom-background via-background to-accent/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
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
        className="w-full max-w-md relative"
      >
        <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-accent/30 rounded-tl-lg" />
        <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-accent/30 rounded-br-lg" />

        <Card className="border-2 shadow-xl bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <CardHeader className="text-center space-y-4 pb-8">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
              <p className="font-display text-4xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                LUXE
              </p>
              <div className="w-16 h-1 bg-accent/30 mx-auto mt-4 rounded-full" />
            </motion.div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-display">
                {t('admin.welcomeBack')}
              </CardTitle>
              <CardDescription>{t('admin.intro')}</CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <InputField
                id="email"
                type="email"
                icon={Mail}
                placeholder="admin@luxe.com"
                error={errors.email}
              />
              <InputField
                id="password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                error={errors.password}
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground font-medium py-5 shadow-lg hover:shadow-xl disabled:opacity-70"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="mr-2"
                  >
                    <LogIn className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <LogIn className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Signing in...' : t('admin.signIn')}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-6 border-t">
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p
                className="mb-2
              "
              >
                Demo credentials
              </p>
              <code className="bg-muted px-2 py-1 rounded text-accent">
                admin@luxe.com / admin123
              </code>
            </div>
            <p dir="ltr" className="text-xs text-muted-foreground text-center">
              {t(`admin.rights`)}
            </p>
            <Link
              to={'/login'}
              className="text-xs text-accent underline text-center flex items-center gap-1"
            >
              Customers login <User size={14} />
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

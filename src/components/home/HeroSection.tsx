import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, Star, Shield, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import heroImage from '@/assets/hero.jpg'
import { Link } from '@tanstack/react-router'
import { useRef } from 'react'

export function HeroSection() {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] sm:min-h-150 flex items-center overflow-hidden"
    >
      {/* Animated Background Image with Parallax */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-r from-background/95 via-background/70 to-background/30 dark:from-background/98 dark:via-background/80 dark:to-background/40 z-10" />
        <img
          src={heroImage}
          alt={t('hero.imageAlt') || 'Luxury collection'}
          className="h-full w-full object-cover scale-105"
        />

        {/* Animated overlay particles */}
        <div className="absolute inset-0 z-5 opacity-30">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.2, 1],
                x: [0, 100, 0],
                y: [0, -100, 0],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute w-96 h-96 rounded-full bg-accent/5 blur-3xl"
              style={{
                top: `${20 + i * 30}%`,
                left: `${10 + i * 20}%`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl lg:max-w-xl"
          >
            {/* Enhanced Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-accent/20 bg-linear-to-r from-accent/10 via-accent/5 to-transparent backdrop-blur-sm px-4 py-2 text-xs font-medium text-muted-foreground mb-8"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
              <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {t('hero.secondary')}
              </span>
              <span className="w-1 h-1 rounded-full bg-accent/50" />
              <span className="text-accent font-semibold">
                {t('hero.newCollection')}
              </span>
            </motion.div>

            {/* Animated Heading with Gradient */}
            <motion.h1
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <span className="bg-linear-to-r from-foreground via-foreground to-accent bg-clip-text text-transparent">
                {t('hero.title')}
              </span>
            </motion.h1>

            {/* Subtitle with animated underline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="relative"
            >
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100px' }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="hidden lg:block h-0.5 bg-linear-to-r from-accent to-transparent rounded-full"
              />
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10"
            >
              {[
                { icon: Star, text: t('hero.premiumQuality') },
                { icon: Shield, text: t('hero.securePayment') },
                { icon: Truck, text: t('hero.freeShipping') },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-sm border border-border/50"
                >
                  <feature.icon className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="group relative overflow-hidden bg-linear-to-r from-accent to-accent/80 text-accent-foreground hover:from-accent/90 hover:to-accent px-8 py-6 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                asChild
              >
                <Link
                  to="/products"
                  className="flex items-center justify-center gap-3"
                >
                  <span>{t('hero.cta')}</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>

            {/* Stats Counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex gap-8 mt-12 justify-center lg:justify-start"
            >
              {[
                { value: '10K+', label: t('hero.happyCustomers') },
                { value: '500+', label: t('hero.premiumProducts') },
                { value: '24/7', label: t('hero.customerSupport') },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -2 }}
                  className="text-center lg:text-left"
                >
                  <div className="text-2xl font-bold bg-linear-to-r from-foreground to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block z-20"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {t('hero.scroll')}
          </span>
          <div className="w-6 h-10 border-2 border-accent/30 rounded-full flex justify-center backdrop-blur-sm">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-1.5 h-1.5 bg-accent rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-accent/20 to-transparent rounded-br-3xl z-10" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-linear-to-tl from-accent/20 to-transparent rounded-tl-3xl z-10" />
    </section>
  )
}

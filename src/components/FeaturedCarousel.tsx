import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useNavigate } from '@tanstack/react-router'
import { useFeaturedProducts } from '@/lib/api-hooks'
import { Sparkles, ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FeaturedCarousel() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const { data, isLoading } = useFeaturedProducts()

  const featuredProducts = data?.slice(0, 3)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  }

  return (
    <section className="relative w-[80%] mx-auto overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mx-auto mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-bold tracking-widest uppercase text-accent">
              {t('featured.editorChoice')}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-foreground"
          >
            {t('featured.titlePrefix')}{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                {t('featured.titleHighlight')}
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-accent/20 rounded-full blur-xl" />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            {t('featured.description')}
          </motion.p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-muted rounded-2xl" />
                <div className="mt-6 space-y-3 text-center">
                  <div className="h-6 bg-muted rounded w-3/4 mx-auto" />
                  <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 w-full mx-auto"
          >
            {featuredProducts?.map((product, index) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: 'easeOut' },
                  },
                }}
                onClick={() =>
                  navigate({
                    to: '/products/$id',
                    params: { id: product.id },
                  })
                }
                className="group relative cursor-pointer"
              >
                <div className="relative bg-card border border-border/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-accent/30">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={
                        i18n.language === 'ar'
                          ? product.name_ar
                          : product.name_en
                      }
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <div className="bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-foreground shadow-lg">
                        #{index + 1} {t('featured.pick')}
                      </div>
                      {index === 0 && (
                        <div className="bg-accent/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-accent-foreground shadow-lg">
                          {t('featured.bestSeller')}
                        </div>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                      <span className="text-xs font-bold">
                        {product.rating}
                      </span>
                    </div>

                    {/* Quick View Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-white text-sm font-medium">
                        {t('featured.quickView')}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center">
                    <h3 className="font-display text-xl lg:text-2xl font-bold mb-2 transition-colors group-hover:text-primary line-clamp-1">
                      {i18n.language === 'ar'
                        ? product.name_ar
                        : product.name_en}
                    </h3>

                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {i18n.language === 'ar'
                        ? product.description_ar
                        : product.description_en}
                    </p>

                    <div className="pt-4 border-t border-border/50">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold block mb-1">
                        {t('products.startingFrom')}
                      </span>
                      <span className="text-3xl font-display font-bold text-primary">
                        ${product.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Background Number */}
                <span className="absolute -top-8 -right-4 text-[120px] lg:text-[150px] font-display font-black text-primary/[0.03] select-none pointer-events-none group-hover:text-accent/10 transition-colors">
                  0{index + 1}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16 lg:mt-24"
        >
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate({ to: '/products' })}
            className="group relative overflow-hidden font-sans font-semibold text-base px-8 py-6 rounded-full border-2 hover:border-accent transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t('featured.exploreCollection')}
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
            </span>
            <span className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

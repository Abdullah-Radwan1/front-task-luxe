import { useTranslation } from 'react-i18next'

import { Facebook, Twitter, Instagram, Mail } from 'lucide-react'

export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <span className="font-display text-xl font-bold text-primary">
              LUXE
            </span>
            <p className="text-sm text-muted-foreground">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick spans */}
          <div>
            <h4 className="font-semibold mb-3">{t('footer.shop')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-accent transition-colors">
                  {t('footer.products')}
                </span>
              </li>
              <li>
                <span className="hover:text-accent transition-colors">
                  {t('footer.collections')}
                </span>
              </li>
              <li>
                <span className="hover:text-accent transition-colors">
                  {t('footer.newArrivals')}
                </span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-3">{t('footer.support')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-accent transition-colors">
                  {t('footer.contact')}
                </span>
              </li>
              <li>
                <span className="hover:text-accent transition-colors">
                  {t('footer.faq')}
                </span>
              </li>
              <li>
                <span className="hover:text-accent transition-colors">
                  {t('footer.shipping')}
                </span>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="font-semibold mb-3">{t('footer.connect')}</h4>
            <div className="flex gap-3 mb-3">
              <a
                href="#"
                className="p-2 bg-muted rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-muted rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-muted rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-muted rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">support@luxe.com</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} LUXE. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}

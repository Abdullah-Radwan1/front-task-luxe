import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t bg-card py-8">
      <div className=" text-center text-sm text-muted-foreground">
        <p className="font-display text-lg font-semibold text-foreground mb-2">
          LUXE
        </p>
        <p> {t(`admin.rights`)}</p>
      </div>
    </footer>
  )
}

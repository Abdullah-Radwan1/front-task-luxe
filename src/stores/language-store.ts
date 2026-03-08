import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from 'i18next'

interface LanguageState {
  language: string
  setLanguage: (lang: string) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en', // default
      setLanguage: (lang: string) => {
        i18n.changeLanguage(lang) // Update i18next
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr' // Update Layout
        document.documentElement.lang = lang
        set({ language: lang }) // Update Store
      },
    }),
    {
      name: 'app-language-storage', // key in localStorage
    },
  ),
)

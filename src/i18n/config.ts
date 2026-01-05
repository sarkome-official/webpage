import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import static files
import commonEn from './locales/en/common.json';
import commonEs from './locales/es/common.json';
import commonPt from './locales/pt/common.json';

export const defaultNS = 'common';
export const resources = {
  en: {
    common: commonEn,
  },
  es: {
    common: commonEs,
  },
  pt: {
    common: commonPt,
  },
} as const;

i18n
  // Detects user language
  .use(LanguageDetector)
  // Passes i18n down to react-i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'pt'],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    debug: false,
    defaultNS,
    resources,
    detection: {
      // Prioritize navigator (browser language) over localStorage to fix detection issues
      order: ['querystring', 'navigator', 'localStorage', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
      excludeCacheFor: ['cimode'],
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Update HTML lang attribute on change for SEO and accessibility
i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('lang', lng);
});

export default i18n;

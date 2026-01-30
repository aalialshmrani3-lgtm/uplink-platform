import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';
import frTranslations from './locales/fr.json';
import esTranslations from './locales/es.json';
import zhTranslations from './locales/zh.json';

const resources = {
  en: { translation: enTranslations },
  ar: { translation: arTranslations },
  fr: { translation: frTranslations },
  es: { translation: esTranslations },
  zh: { translation: zhTranslations },
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Fallback language
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;

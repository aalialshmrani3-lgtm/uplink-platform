import { ar } from './ar';
import { en } from './en';
import { fr } from './fr';
import { es } from './es';
import { zh } from './zh';

export type Language = 'ar' | 'en' | 'fr' | 'es' | 'zh';

export const translations = {
  ar,
  en,
  fr,
  es,
  zh,
};

export const languageNames: Record<Language, string> = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français',
  es: 'Español',
  zh: '中文',
};

export const rtlLanguages: Language[] = ['ar'];

export const isRTL = (lang: Language): boolean => rtlLanguages.includes(lang);

export const getTranslation = (lang: Language) => translations[lang];

export default translations;

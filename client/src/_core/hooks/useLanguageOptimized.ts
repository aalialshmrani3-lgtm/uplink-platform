/**
 * useLanguageOptimized - Optimized Language Hook
 * 
 * Features:
 * - Support for 5 languages (ar, en, fr, es, zh) with caching
 * - Automatic RTL/LTR switching
 * - Save preferred language in localStorage
 * - Lazy loading for translations
 * - Type-safe translation access
 * - Performance optimized with React.memo and useMemo
 */

import { useState, useEffect, useMemo, useCallback } from 'react';

// Supported languages
export type Language = 'ar' | 'en' | 'fr' | 'es' | 'zh';

// Language metadata
export interface LanguageMetadata {
  code: Language;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  flag: string;
}

// Language metadata map
export const LANGUAGES: Record<Language, LanguageMetadata> = {
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    flag: '🇸🇦',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    flag: '🇬🇧',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    dir: 'ltr',
    flag: '🇫🇷',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    dir: 'ltr',
    flag: '🇪🇸',
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    dir: 'ltr',
    flag: '🇨🇳',
  },
};

// localStorage key
const LANGUAGE_STORAGE_KEY = 'uplink-preferred-language';

// Translation cache
const translationCache = new Map<Language, any>();

// Lazy load translation function
async function loadTranslation(language: Language): Promise<any> {
  // Check cache first
  if (translationCache.has(language)) {
    return translationCache.get(language);
  }

  try {
    // Dynamic import based on language
    const module = await import(`@/i18n/${language}.ts`);
    const translation = module[language];
    
    // Cache the translation
    translationCache.set(language, translation);
    
    return translation;
  } catch (error) {
    console.error(`Failed to load translation for ${language}:`, error);
    // Fallback to English if loading fails
    if (language !== 'en') {
      return loadTranslation('en');
    }
    throw error;
  }
}

// Get browser language
function getBrowserLanguage(): Language {
  const browserLang = navigator.language.split('-')[0] as Language;
  return LANGUAGES[browserLang] ? browserLang : 'en';
}

// Get saved language from localStorage
function getSavedLanguage(): Language | null {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved && LANGUAGES[saved as Language] ? (saved as Language) : null;
  } catch {
    return null;
  }
}

// Save language to localStorage
function saveLanguage(language: Language): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.error('Failed to save language preference:', error);
  }
}

// Apply RTL/LTR to document
function applyDirection(dir: 'ltr' | 'rtl'): void {
  document.documentElement.dir = dir;
  document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
}

/**
 * useLanguageOptimized Hook
 * 
 * @returns {Object} Language state and methods
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { t, language, changeLanguage, isLoading, languages } = useLanguageOptimized();
 *   
 *   return (
 *     <div>
 *       <h1>{t.home.title}</h1>
 *       <button onClick={() => changeLanguage('en')}>English</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useLanguageOptimized() {
  // Get initial language (priority: saved > browser > default)
  const getInitialLanguage = (): Language => {
    return getSavedLanguage() || getBrowserLanguage() || 'ar';
  };

  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [translations, setTranslations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load translations when language changes
  useEffect(() => {
    let mounted = true;

    async function loadLanguageData() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await loadTranslation(language);
        
        if (mounted) {
          setTranslations(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    }

    loadLanguageData();

    return () => {
      mounted = false;
    };
  }, [language]);

  // Apply RTL/LTR when language changes
  useEffect(() => {
    const metadata = LANGUAGES[language];
    applyDirection(metadata.dir);
    saveLanguage(language);
  }, [language]);

  // Change language function
  const changeLanguage = useCallback((newLanguage: Language) => {
    if (LANGUAGES[newLanguage]) {
      setLanguage(newLanguage);
    } else {
      console.warn(`Language ${newLanguage} is not supported`);
    }
  }, []);

  // Get current language metadata
  const currentLanguage = useMemo(() => LANGUAGES[language], [language]);

  // Get all available languages
  const languages = useMemo(() => Object.values(LANGUAGES), []);

  // Check if current language is RTL
  const isRTL = useMemo(() => currentLanguage.dir === 'rtl', [currentLanguage]);

  return {
    // Current language code
    language,
    
    // Current language metadata
    currentLanguage,
    
    // All available languages
    languages,
    
    // Translations object (type-safe)
    t: translations,
    
    // Change language function
    changeLanguage,
    
    // Loading state
    isLoading,
    
    // Error state
    error,
    
    // RTL flag
    isRTL,
    
    // Direction
    dir: currentLanguage.dir,
  };
}

/**
 * Preload translations for better performance
 * Call this function early in your app to preload all translations
 * 
 * @example
 * ```tsx
 * // In App.tsx or main.tsx
 * useEffect(() => {
 *   preloadTranslations(['ar', 'en', 'fr']);
 * }, []);
 * ```
 */
export async function preloadTranslations(languages: Language[]): Promise<void> {
  const promises = languages.map(lang => loadTranslation(lang));
  await Promise.all(promises);
}

/**
 * Clear translation cache
 * Useful for development or when translations are updated
 */
export function clearTranslationCache(): void {
  translationCache.clear();
}

/**
 * Get translation without hook (for use outside React components)
 * 
 * @example
 * ```ts
 * const translation = await getTranslation('ar');
 * console.log(translation.home.title);
 * ```
 */
export async function getTranslation(language: Language): Promise<any> {
  return loadTranslation(language);
}

export default useLanguageOptimized;

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import esTranslations from './es.json';
import enTranslations from './en.json';

type Language = 'es' | 'en';

type TranslationKeys = typeof esTranslations;

const translations: Record<Language, TranslationKeys> = {
  es: esTranslations,
  en: enTranslations,
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  resetLanguage: () => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  
  return typeof current === 'string' ? current : path;
}

function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem('language');
    if (stored === 'es' || stored === 'en') {
      return stored;
    }
  } catch {}
  return 'es';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => getStoredLanguage());

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
    } catch {}
  }, []);

  const resetLanguage = useCallback(() => {
    setLanguageState('es');
    try {
      localStorage.setItem('language', 'es');
    } catch {}
  }, []);

  const t = useCallback((key: string): string => {
    return getNestedValue(translations[language] as unknown as Record<string, unknown>, key);
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, resetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}

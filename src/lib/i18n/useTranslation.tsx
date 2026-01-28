import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { translations, Language, TranslationKey } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (section: TranslationKey, key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = 'kraken-language';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ['ru', 'ua', 'en'].includes(stored)) {
        return stored as Language;
      }
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('uk')) return 'ua';
      if (browserLang.startsWith('ru')) return 'ru';
    }
    return 'ru';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'ua' ? 'uk' : lang;
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === 'ua' ? 'uk' : language;
  }, [language]);

  const t = useCallback((section: TranslationKey, key: string): string => {
    const sectionData = translations[section];
    if (!sectionData) {
      console.warn(`Translation section "${section}" not found`);
      return key;
    }
    
    const keyData = (sectionData as Record<string, Record<Language, string>>)[key];
    if (!keyData) {
      console.warn(`Translation key "${key}" not found in section "${section}"`);
      return key;
    }
    
    return keyData[language] || keyData['en'] || key;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}

// Language display names
export const languageNames: Record<Language, string> = {
  ru: 'Русский',
  ua: 'Українська',
  en: 'English',
};

// Language flags (emoji)
export const languageFlags: Record<Language, string> = {
  ru: '🇷🇺',
  ua: '🇺🇦',
  en: '🇬🇧',
};

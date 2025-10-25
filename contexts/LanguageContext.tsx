import React, { createContext, useState, ReactNode, useContext } from 'react';
import { en, ko } from '../lib/translations';

type LanguageContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  t: typeof en;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLocale = (): string => {
  const browserLanguage = navigator.language.split(/[-_]/)[0];
  return ['en', 'ko'].includes(browserLanguage) ? browserLanguage : 'en';
};

const translations: { [key: string]: typeof en } = { en, ko };

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<string>(getInitialLocale());
  const t = translations[locale] || en;

  const value = {
    locale,
    setLocale,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

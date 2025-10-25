import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useLanguage();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ko', name: '한국어' },
  ];

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLocale(lang.code)}
          className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
            locale === lang.code
              ? 'bg-sky-500 text-white font-semibold'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};

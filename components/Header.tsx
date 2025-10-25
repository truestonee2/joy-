
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
    onReset: () => void;
}

const RefreshIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.18-3.185m-3.18-3.182-3.182-3.182a8.25 8.25 0 0 0-11.664 0l-3.18 3.184" />
    </svg>
);

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  const { t } = useLanguage();
  return (
    <header className="flex justify-between items-start w-full">
      <div className="text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent animate-text-gradient bg-[200%_auto]">
              {t.headerTitle}
            </span>
          </h1>
          <p className="mt-3 text-lg text-gray-400 max-w-2xl">
            {t.headerSubtitle}
          </p>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
         <button 
            onClick={onReset}
            title={t.refreshTooltip}
            aria-label={t.refreshTooltip}
            className="p-2 rounded-full bg-gray-700/80 text-gray-300 hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 transition-all duration-200"
         >
            <RefreshIcon className="w-6 h-6" />
         </button>
         <LanguageSwitcher />
      </div>
    </header>
  );
};

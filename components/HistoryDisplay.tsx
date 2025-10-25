import React from 'react';
import { Scenario } from './OutputDisplay';
import { useLanguage } from '../contexts/LanguageContext';

interface HistoryDisplayProps {
    history: Scenario[];
    onSelect: (scenario: Scenario) => void;
}

const HistoryIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /> </svg> );

export const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ history, onSelect }) => {
    const { t } = useLanguage();

    return (
        <div className="w-full bg-gray-800/50 rounded-2xl shadow-lg border border-gray-700 p-6 animate-fade-in">
            <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none text-xl font-bold text-gray-100 hover:text-sky-400 transition-colors">
                    <div className="flex items-center gap-3">
                        <HistoryIcon className="w-6 h-6" />
                        <span>{t.historyTitle}</span>
                    </div>
                    <svg className="w-6 h-6 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </summary>
                <div className="mt-4 pt-4 border-t border-gray-700">
                    {history.length > 0 ? (
                        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {history.map((item, index) => (
                                <li key={index} className="flex justify-between items-center p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                                    <span className="font-medium text-gray-300 truncate" title={item?.title ?? t.untitledScenario}>
                                        {item?.title ?? t.untitledScenario}
                                    </span>
                                    <button
                                        onClick={() => onSelect(item)}
                                        className="px-4 py-1.5 text-sm font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 flex-shrink-0"
                                    >
                                        {t.historyLoadButton}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-4">{t.historyEmpty}</p>
                    )}
                </div>
            </details>
        </div>
    );
};


import React from 'react';
import { Scenario } from './OutputDisplay';
import { useLanguage } from '../contexts/LanguageContext';

interface HistoryDisplayProps {
    history: Scenario[];
    onSelect: (scenario: Scenario) => void;
    onDelete: (index: number) => void;
    onClear: () => void;
}

const HistoryIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /> </svg> );
const TrashIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /> </svg> );

export const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ history, onSelect, onDelete, onClear }) => {
    const { t } = useLanguage();

    return (
        <div className="w-full bg-gray-800/50 rounded-2xl shadow-lg border border-gray-700 p-6 animate-fade-in">
            <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none text-xl font-bold text-gray-100 hover:text-sky-400 transition-colors">
                    <div className="flex items-center gap-3">
                        <HistoryIcon className="w-6 h-6" />
                        <span>{t.historyTitle}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {history.length > 0 && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onClear();
                                }}
                                title={t.historyClearButton}
                                className="px-3 py-1 text-xs font-semibold text-red-400 bg-gray-700 rounded-md hover:bg-red-900/50 hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500"
                            >
                                {t.historyClearButton}
                            </button>
                        )}
                        <svg className="w-6 h-6 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </summary>
                <div className="mt-4 pt-4 border-t border-gray-700">
                    {history.length > 0 ? (
                        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {history.map((item, index) => (
                                <li key={index} className="flex justify-between items-center p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                                    <span className="font-medium text-gray-300 truncate" title={item?.title ?? t.untitledScenario}>
                                        {item?.title ?? t.untitledScenario}
                                    </span>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                        <button
                                            onClick={() => onSelect(item)}
                                            className="px-4 py-1.5 text-sm font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500"
                                        >
                                            {t.historyLoadButton}
                                        </button>
                                        <button
                                            onClick={() => onDelete(index)}
                                            aria-label={t.historyDeleteButton}
                                            title={t.historyDeleteButton}
                                            className="p-2 text-gray-400 bg-red-900/50 rounded-md hover:bg-red-800/70 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
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

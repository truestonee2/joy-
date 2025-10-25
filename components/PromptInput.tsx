
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  totalTime: number | '';
  setTotalTime: (time: number | '') => void;
  cutLength: number | '';
  setCutLength: (length: number | '') => void;
  numCuts: number | '';
  setNumCuts: (cuts: number | '') => void;
  voiceTone: string;
  setVoiceTone: (tone: string) => void;
  voiceGender: string;
  setVoiceGender: (gender: string) => void;
  voiceEmotion: string;
  setVoiceEmotion: (emotion: string) => void;
  voiceReverb: string;
  setVoiceReverb: (reverb: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const NumberInput: React.FC<{label: string, value: number | '', onChange: (value: number | '') => void, disabled: boolean}> = ({label, value, onChange, disabled}) => (
    <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
            disabled={disabled}
            className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200 text-gray-200"
        />
    </div>
);

const SelectInput: React.FC<{label: string, value: string, onChange: (value: string) => void, disabled: boolean, options: {value: string, label: string}[]}> = ({label, value, onChange, disabled, options}) => (
    <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200 text-gray-200 appearance-none"
             style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
);


export const PromptInput: React.FC<PromptInputProps> = ({ 
    prompt, setPrompt, 
    totalTime, setTotalTime,
    cutLength, setCutLength,
    numCuts, setNumCuts,
    voiceTone, setVoiceTone,
    voiceGender, setVoiceGender,
    voiceEmotion, setVoiceEmotion,
    voiceReverb, setVoiceReverb,
    onSubmit, isLoading 
}) => {
  const { t } = useLanguage();
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      onSubmit();
    }
  };

  const voiceOptions = {
    tone: [
        {value: '', label: t.optionDefault},
        {value: 'calm', label: t.toneCalm},
        {value: 'energetic', label: t.toneEnergetic},
        {value: 'dramatic', label: t.toneDramatic},
        {value: 'mysterious', label: t.toneMysterious},
        {value: 'formal', label: t.toneFormal},
    ],
    gender: [
        {value: '', label: t.optionDefault},
        {value: 'male', label: t.genderMale},
        {value: 'female', label: t.genderFemale},
        {value: 'non-binary', label: t.genderNonBinary},
    ],
    emotion: [
        {value: '', label: t.optionDefault},
        {value: 'neutral', label: t.emotionNeutral},
        {value: 'happy', label: t.emotionHappy},
        {value: 'sad', label: t.emotionSad},
        {value: 'angry', label: t.emotionAngry},
        {value: 'excited', label: t.emotionExcited},
    ],
    reverb: [
        {value: '', label: t.optionDefault},
        {value: 'none', label: t.reverbNone},
        {value: 'small-room', label: t.reverbSmallRoom},
        {value: 'large-hall', label: t.reverbLargeHall},
        {value: 'cave', label: t.reverbCave},
    ]
  };

  return (
    <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <NumberInput label={t.totalTimeLabel} value={totalTime} onChange={setTotalTime} disabled={isLoading} />
            <NumberInput label={t.cutLengthLabel} value={cutLength} onChange={setCutLength} disabled={isLoading} />
            <NumberInput label={t.numCutsLabel} value={numCuts} onChange={setNumCuts} disabled={isLoading} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SelectInput label={t.voiceToneLabel} value={voiceTone} onChange={setVoiceTone} disabled={isLoading} options={voiceOptions.tone} />
            <SelectInput label={t.voiceGenderLabel} value={voiceGender} onChange={setVoiceGender} disabled={isLoading} options={voiceOptions.gender} />
            <SelectInput label={t.voiceEmotionLabel} value={voiceEmotion} onChange={setVoiceEmotion} disabled={isLoading} options={voiceOptions.emotion} />
            <SelectInput label={t.voiceReverbLabel} value={voiceReverb} onChange={setVoiceReverb} disabled={isLoading} options={voiceOptions.reverb} />
        </div>

      <label htmlFor="prompt-input" className="text-lg font-medium text-gray-300">
        {t.promptLabel}
      </label>
      <textarea
        id="prompt-input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-40 p-4 bg-gray-900 border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200 text-gray-200 placeholder-gray-500"
        disabled={isLoading}
      />
      <div className="flex justify-end items-center">
        <span className="text-gray-500 text-sm mr-4 hidden sm:inline">
            {isLoading ? t.processingHint : t.submitHint}
        </span>
        <button
          onClick={onSubmit}
          disabled={isLoading || !prompt.trim()}
          className="relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-gray-800 border-2 border-transparent rounded-lg group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-gradient-to-br from-sky-500 to-emerald-500 rounded-md group-hover:w-full group-hover:h-full"></span>
          <span className="absolute inset-0 w-full h-full border-2 border-gray-700 rounded-lg"></span>
          <span className="relative flex items-center gap-2">
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t.generatingButton}
              </>
            ) : (
             t.submitButton
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

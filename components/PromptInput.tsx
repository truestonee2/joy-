
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export interface Character {
  name: string;
  description: string;
}

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  totalTime: number | '';
  setTotalTime: (time: number | '') => void;
  cutLength: number | '';
  setCutLength: (length: number | '') => void;
  numCuts: number | '';
  setNumCuts: (cuts: number | '') => void;
  historicalBackground: string;
  setHistoricalBackground: (bg: string) => void;
  nationalBackground: string;
  setNationalBackground: (bg: string) => void;
  voiceTone: string;
  setVoiceTone: (tone: string) => void;
  narratorDescription: string;
  setNarratorDescription: (desc: string) => void;
  voiceEmotion: string;
  setVoiceEmotion: (emotion: string) => void;
  voiceReverb: string;
  setVoiceReverb: (reverb: string) => void;
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
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

const EditableSelect: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
  listId: string;
}> = ({ label, value, onChange, disabled, options, placeholder, listId }) => (
  <div className="flex flex-col gap-1.5 flex-1">
    <label htmlFor={listId + '-input'} className="text-sm font-medium text-gray-400">{label}</label>
    <input
      id={listId + '-input'}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200 text-gray-200"
      list={listId}
      placeholder={placeholder}
    />
    <datalist id={listId}>
      {options.map((option) => (
        <option key={option.value} value={option.label} />
      ))}
    </datalist>
  </div>
);


export const PromptInput: React.FC<PromptInputProps> = ({ 
    prompt, setPrompt, 
    totalTime, setTotalTime,
    cutLength, setCutLength,
    numCuts, setNumCuts,
    historicalBackground, setHistoricalBackground,
    nationalBackground, setNationalBackground,
    voiceTone, setVoiceTone,
    narratorDescription, setNarratorDescription,
    voiceEmotion, setVoiceEmotion,
    voiceReverb, setVoiceReverb,
    characters, setCharacters,
    onSubmit, isLoading 
}) => {
  const { t } = useLanguage();
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      onSubmit();
    }
  };

  const backgroundOptions = {
    historical: [ {value: 'ancient', label: t.eraAncient}, {value: 'medieval', label: t.eraMedieval}, {value: 'modern', label: t.eraModern}, {value: 'futuristic', label: t.eraFuture}, {value: 'joseon', label: t.eraJoseon}, ],
    national: [ {value: 'korea', label: t.countryKorea}, {value: 'usa', label: t.countryUSA}, {value: 'japan', label: t.countryJapan}, {value: 'china', label: t.countryChina}, {value: 'fantasy', label: t.countryFantasy}, ]
  };

  const voiceOptions = {
    tone: [ {value: 'calm', label: t.toneCalm}, {value: 'energetic', label: t.toneEnergetic}, {value: 'dramatic', label: t.toneDramatic}, {value: 'mysterious', label: t.toneMysterious}, {value: 'formal', label: t.toneFormal} ],
    gender: [ {value: 'male', label: t.genderMale}, {value: 'female', label: t.genderFemale}, {value: 'non-binary', label: t.genderNonBinary}, {value: 'asian-male', label: t.genderAsianMale}, {value: 'asian-female', label: t.genderAsianFemale}, {value: 'black-male', label: t.genderBlackMale}, {value: 'black-female', label: t.genderBlackFemale}, {value: 'white-male', label: t.genderWhiteMale}, {value: 'white-female', label: t.genderWhiteFemale}, {value: 'hispanic-male', label: t.genderHispanicMale}, {value: 'hispanic-female', label: t.genderHispanicFemale}, {value: 'middle-eastern-male', label: t.genderMiddleEasternMale}, {value: 'middle-eastern-female', label: t.genderMiddleEasternFemale}, {value: 'south-asian-male', label: t.genderSouthAsianMale}, {value: 'south-asian-female', label: t.genderSouthAsianFemale}, ],
    emotion: [ {value: 'neutral', label: t.emotionNeutral}, {value: 'happy', label: t.emotionHappy}, {value: 'sad', label: t.emotionSad}, {value: 'angry', label: t.emotionAngry}, {value: 'excited', label: t.emotionExcited}, ],
    reverb: [ {value: 'none', label: t.reverbNone}, {value: 'small-room', label: t.reverbSmallRoom}, {value: 'large-hall', label: t.reverbLargeHall}, {value: 'cave', label: t.reverbCave}, ]
  };

  const handleAddCharacter = () => {
    setCharacters([...characters, { name: '', description: '' }]);
  };

  const handleRemoveCharacter = (index: number) => {
    setCharacters(characters.filter((_, i) => i !== index));
  };

  const handleCharacterChange = (index: number, field: 'name' | 'description', value: string) => {
    const newCharacters = [...characters];
    newCharacters[index] = { ...newCharacters[index], [field]: value };
    setCharacters(newCharacters);
  };


  return (
    <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <NumberInput label={t.totalTimeLabel} value={totalTime} onChange={setTotalTime} disabled={isLoading} />
            <NumberInput label={t.cutLengthLabel} value={cutLength} onChange={setCutLength} disabled={isLoading} />
            <NumberInput label={t.numCutsLabel} value={numCuts} onChange={setNumCuts} disabled={isLoading} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EditableSelect listId="historical-bg" label={t.historicalBackgroundLabel} value={historicalBackground} onChange={setHistoricalBackground} disabled={isLoading} options={backgroundOptions.historical} placeholder={t.optionDefault} />
            <EditableSelect listId="national-bg" label={t.nationalBackgroundLabel} value={nationalBackground} onChange={setNationalBackground} disabled={isLoading} options={backgroundOptions.national} placeholder={t.optionDefault} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <EditableSelect listId="voice-tone" label={t.voiceToneLabel} value={voiceTone} onChange={setVoiceTone} disabled={isLoading} options={voiceOptions.tone} placeholder={t.optionDefault} />
            <EditableSelect listId="narrator-desc" label={t.narratorDescriptionLabel} value={narratorDescription} onChange={setNarratorDescription} disabled={isLoading} options={voiceOptions.gender} placeholder={t.optionDefault} />
            <EditableSelect listId="voice-emotion" label={t.voiceEmotionLabel} value={voiceEmotion} onChange={setVoiceEmotion} disabled={isLoading} options={voiceOptions.emotion} placeholder={t.optionDefault} />
            <EditableSelect listId="voice-reverb" label={t.voiceReverbLabel} value={voiceReverb} onChange={setVoiceReverb} disabled={isLoading} options={voiceOptions.reverb} placeholder={t.optionDefault} />
        </div>

        <div className="flex flex-col gap-4 border-t border-gray-700 pt-4 mt-2">
            <label className="text-md font-medium text-gray-300">{t.charactersTitleInput}</label>
            <div className="flex flex-col gap-3">
                {characters.map((char, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr,2fr,auto] gap-2 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                        <input type="text" placeholder={t.characterNamePlaceholder} value={char.name} onChange={(e) => handleCharacterChange(index, 'name', e.target.value)} disabled={isLoading} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-gray-200 placeholder-gray-500" />
                        <input type="text" placeholder={t.characterDescriptionPlaceholder} value={char.description} onChange={(e) => handleCharacterChange(index, 'description', e.target.value)} disabled={isLoading} className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-gray-200 placeholder-gray-500" />
                        <button onClick={() => handleRemoveCharacter(index)} disabled={isLoading} title={t.removeCharacterButton} className="p-2 text-gray-400 bg-red-900/50 hover:bg-red-800/70 rounded-md transition-colors flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        </button>
                    </div>
                ))}
            </div>
             <button onClick={handleAddCharacter} disabled={isLoading} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-sky-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                {t.addCharacterButton}
            </button>
        </div>

      <label htmlFor="prompt-input" className="text-lg font-medium text-gray-300 mt-4">
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

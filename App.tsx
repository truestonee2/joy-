
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptInput, Character } from './components/PromptInput';
import { OutputDisplay, Scenario } from './components/OutputDisplay';
import { HistoryDisplay } from './components/HistoryDisplay';
import { generateContentFromPrompt } from './services/geminiService';
import { useLanguage } from './contexts/LanguageContext';

const DEFAULT_VIDEO_PARAMS = {
  totalTime: 60,
  cutLength: 5,
  numCuts: 12,
};

const App: React.FC = () => {
  const { locale, t } = useLanguage();
  const [prompt, setPrompt] = useState<string>('');
  const [totalTime, setTotalTime] = useState<number | ''>('');
  const [cutLength, setCutLength] = useState<number | ''>('');
  const [numCuts, setNumCuts] = useState<number | ''>('');
  
  const [historicalBackground, setHistoricalBackground] = useState<string>('');
  const [nationalBackground, setNationalBackground] = useState<string>('');
  const [voiceTone, setVoiceTone] = useState<string>('');
  const [narratorDescription, setNarratorDescription] = useState<string>('');
  const [voiceEmotion, setVoiceEmotion] = useState<string>('');
  const [voiceReverb, setVoiceReverb] = useState<string>('');
  const [characters, setCharacters] = useState<Character[]>([]);


  const [output, setOutput] = useState<Scenario | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [history, setHistory] = useState<Scenario[]>(() => {
    try {
      const savedHistory = window.localStorage.getItem('scenarioHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error("Could not parse history from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('scenarioHistory', JSON.stringify(history));
    } catch (error) {
      console.error("Could not save history to localStorage", error);
    }
  }, [history]);

  const handleSubmit = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setOutput(null);

    const voiceParams = {
        tone: voiceTone,
        narratorDescription: narratorDescription,
        emotion: voiceEmotion,
        reverb: voiceReverb
    };

    try {
      const result = await generateContentFromPrompt(
          prompt, 
          locale, 
          totalTime || DEFAULT_VIDEO_PARAMS.totalTime, 
          cutLength || DEFAULT_VIDEO_PARAMS.cutLength, 
          numCuts || DEFAULT_VIDEO_PARAMS.numCuts,
          voiceParams,
          characters,
          historicalBackground,
          nationalBackground
      );
      setOutput(result);
      setHistory(prevHistory => [result, ...prevHistory]);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading, locale, totalTime, cutLength, numCuts, voiceTone, narratorDescription, voiceEmotion, voiceReverb, characters, historicalBackground, nationalBackground]);

  const handleReset = useCallback(() => {
    setPrompt('');
    setTotalTime('');
    setCutLength('');
    setNumCuts('');
    setHistoricalBackground('');
    setNationalBackground('');
    setVoiceTone('');
    setNarratorDescription('');
    setVoiceEmotion('');
    setVoiceReverb('');
    setCharacters([]);
    setOutput(null);
    setError(null);
  }, []);

  const handleHistorySelect = useCallback((selectedScenario: Scenario) => {
    setOutput(selectedScenario);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8">
            <Header onReset={handleReset} />
        </div>
        <main>
          <div className="w-full bg-gray-800/50 rounded-2xl shadow-lg border border-gray-700 backdrop-blur-sm p-6">
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              totalTime={totalTime}
              setTotalTime={setTotalTime}
              cutLength={cutLength}
              setCutLength={setCutLength}
              numCuts={numCuts}
              setNumCuts={setNumCuts}
              historicalBackground={historicalBackground}
              setHistoricalBackground={setHistoricalBackground}
              nationalBackground={nationalBackground}
              setNationalBackground={setNationalBackground}
              voiceTone={voiceTone}
              setVoiceTone={setVoiceTone}
              narratorDescription={narratorDescription}
              setNarratorDescription={setNarratorDescription}
              voiceEmotion={voiceEmotion}
              setVoiceEmotion={setVoiceEmotion}
              voiceReverb={voiceReverb}
              setVoiceReverb={setVoiceReverb}
              characters={characters}
              setCharacters={setCharacters}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
          <div className="mt-8">
            <OutputDisplay
              output={output}
              isLoading={isLoading}
              error={error}
            />
          </div>
          <div className="mt-8">
            <HistoryDisplay history={history} onSelect={handleHistorySelect} />
          </div>
        </main>
      </div>
       <footer className="w-full max-w-4xl mx-auto mt-12 text-center text-gray-500 text-sm">
        <p>{t.poweredBy}</p>
      </footer>
    </div>
  );
};

export default App;


import React, { useState } from 'react';
import { Loader } from './Loader';
import { useLanguage } from '../contexts/LanguageContext';
import { en } from '../lib/translations';

// --- DATA INTERFACES ---
export interface Character { name: string; description: string; }
export interface Scene { scene: number; timeline: string; visualPrompt: string; cameraMovement: string; dialogue: string; dialogueStructure: string; duration: number; }
export interface Narration { script: string; voiceTags: string; }
export interface TimelineJsonItem { id: number; start_time: number; end_time: number; prompt: string; dialogue: string; }
export interface NarrationScriptJsonItem { id: number; script_segment: string; }
export interface BGM { style: string; instruments: string; mood: string; }
export interface Scenario { title: string; logline: string; characters: Character[]; scenes: Scene[]; narration: Narration; narrationScriptJson: NarrationScriptJsonItem[]; timelineJson: TimelineJsonItem[]; bgm: BGM; }

interface OutputDisplayProps { output: Scenario | null; isLoading: boolean; error: string | null; }

// --- ICONS ---
const FilmIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9a2.25 2.25 0 0 0-2.25 2.25v9A2.25 2.25 0 0 0 4.5 18.75Z" /> </svg> );
const ErrorIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /> </svg> );
const VisualsIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.418-2.209a1.012 1.012 0 0 1 1.416.023l4.418 2.209a1.012 1.012 0 0 1 0 .639l-4.418 2.209a1.012 1.012 0 0 1-1.416-.023l-4.418-2.209Z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M6.036 12.322a1.012 1.012 0 0 1 0-.639l4.418-2.209a1.012 1.012 0 0 1 1.416.023l4.418 2.209a1.012 1.012 0 0 1 0 .639l-4.418 2.209a1.012 1.012 0 0 1-1.416-.023l-4.418-2.209Z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M10.036 12.322a1.012 1.012 0 0 1 0-.639l4.418-2.209a1.012 1.012 0 0 1 1.416.023l4.418 2.209a1.012 1.012 0 0 1 0 .639l-4.418 2.209a1.012 1.012 0 0 1-1.416-.023l-4.418-2.209Z" /> </svg> );
const CameraIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5-3.75-3.75M15.75 10.5h-7.5a.75.75 0 0 0-.75.75v7.5a.75.75 0 0 0 .75.75h7.5a.75.75 0 0 0 .75-.75v-7.5a.75.75 0 0 0-.75-.75Z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Z" /> </svg> );
const DialogueIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.306 3 12c0 4.556 4.03 8.25 9 8.25Z" /> </svg> );
const DialogueStructureIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c.966 0 1.896-.166 2.731-.475a4.5 4.5 0 0 0-5.462 0A12.02 12.02 0 0 1 12 20.25ZM12 7.5A4.5 4.5 0 0 1 16.5 12a4.5 4.5 0 0 1-4.5 4.5A4.5 4.5 0 0 1 7.5 12a4.5 4.5 0 0 1 4.5-4.5Zm0 0V3.75m0 3.75A3 3 0 0 0 9 10.5m3-3A3 3 0 0 1 15 10.5m-6 0a3 3 0 0 0 3 3m3 0a3 3 0 0 0 3-3m0 0V7.5m-6 3.75v3.75m-3-3.75h.008v.008H9v-.008Zm1.5 0h.008v.008H10.5v-.008Zm1.5 0h.008v.008H12v-.008Zm1.5 0h.008v.008H13.5v-.008Zm1.5 0h.008v.008H15v-.008Zm-3 3.75h.008v.008H12v-.008Z" /> </svg> );
const ClipboardIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 0 1-2.25 2.25H9a2.25 2.25 0 0 1-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /> </svg> );
const CheckIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-emerald-400' }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /> </svg> );
const NarrationIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /> </svg> );
const JsonIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V5.75A2.25 2.25 0 0 0 18 3.5H6A2.25 2.25 0 0 0 3.75 5.75v12.5A2.25 2.25 0 0 0 6 20.25Z" /> </svg> );
const MusicIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9c0-1.921 1.002-3.616 2.5-4.5 1.498-.884 3.5.146 3.5 1.921V9M9 9v9.75M9 9H4.5M14.25 9v9.75M14.25 9h4.5m-4.5 0-2.25-2.25" /> </svg> );

// --- SUB-COMPONENTS ---
const CopyButton: React.FC<{ textToCopy: string; className?: string; title?: string }> = ({ textToCopy, className, title }) => {
    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = async () => {
        if (isCopied) return;
        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) { console.error('Failed to copy text: ', err); }
    };
    return (
        <button onClick={handleCopy} title={title ?? (isCopied ? 'Copied!' : 'Copy')} aria-label={title ?? (isCopied ? 'Copied to clipboard' : 'Copy to clipboard')} className={`p-1.5 rounded-full bg-gray-700/80 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-500 transition-all duration-200 ${className}`}>
            {isCopied ? <CheckIcon /> : <ClipboardIcon />}
        </button>
    );
};

const ErrorDisplay: React.FC<{ error: string; t: typeof en }> = ({ error, t }) => (
    <div className="flex flex-col items-center justify-center text-center text-red-400 w-full">
        <ErrorIcon className="w-12 h-12 mb-4" />
        <h3 className="text-lg font-semibold">{t.errorTitle}</h3>
        <p className="mt-2 text-red-500 bg-red-900/20 p-3 rounded-md max-w-full overflow-x-auto">{error}</p>
        <CopyButton textToCopy={error} title={t.copyErrorButton} className="mt-4" />
    </div>
);

const CharactersSection: React.FC<{ characters: Character[]; t: typeof en }> = ({ characters, t }) => (
    <div>
        <div className="mb-4 border-b-2 border-gray-600 pb-2">
            <h2 className="text-2xl font-bold text-gray-100">{t.charactersTitle}</h2>
        </div>
        <dl className="space-y-3">
            {(characters).map((char, index) => (
                <div key={index}>
                    <dt className="font-semibold text-emerald-400">{char.name}:</dt>
                    <dd className="text-gray-400 pl-2">{char.description}</dd>
                </div>
            ))}
        </dl>
    </div>
);

const BgmSection: React.FC<{ bgm: BGM | undefined; t: typeof en }> = ({ bgm, t }) => {
    if (!bgm) return null;
    const bgmText = `${t.bgmTitle}:\n${t.bgmStyleGenre}: ${bgm.style}\n${t.bgmKeyInstruments}: ${bgm.instruments}\n${t.bgmMood}: ${bgm.mood}`;
    return (
        <div className="relative bg-gray-800 rounded-lg p-5 border border-gray-700 shadow-md">
            <CopyButton textToCopy={bgmText} className="absolute top-4 right-4 z-10" />
            <div className="flex items-center border-b border-gray-700 pb-3 mb-4">
                <MusicIcon className="w-6 h-6 mr-3 text-sky-400" />
                <h3 className="text-lg font-bold text-sky-400">{t.bgmTitle}</h3>
            </div>
            <div className="space-y-3 text-sm">
                <div>
                    <h4 className="font-semibold text-gray-300">{t.bgmStyleGenre}</h4>
                    <p className="mt-1 text-gray-400 bg-gray-900 p-2 rounded-md">{bgm.style}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-300">{t.bgmKeyInstruments}</h4>
                    <p className="mt-1 text-gray-400 bg-gray-900 p-2 rounded-md">{bgm.instruments}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-300">{t.bgmMood}</h4>
                    <p className="mt-1 text-gray-400 bg-gray-900 p-2 rounded-md">{bgm.mood}</p>
                </div>
            </div>
        </div>
    );
};

const NarrationSection: React.FC<{ narration: Narration | undefined; narrationScriptJson: NarrationScriptJsonItem[] | undefined; t: typeof en }> = ({ narration, narrationScriptJson, t }) => {
    if (!narration) return null;
    const narrationText = `${t.narrationScriptLabel}:\n${narration.script}\n\n${t.voiceTagsLabel}: ${narration.voiceTags}`;
    const narrationJsonText = narrationScriptJson ? JSON.stringify(narrationScriptJson, null, 2) : '';

    return (
        <div className="relative bg-gray-800 rounded-lg p-5 border border-gray-700 shadow-md">
            <CopyButton textToCopy={narrationText} className="absolute top-4 right-4 z-10" />
            <div className="flex items-center border-b border-gray-700 pb-3 mb-4">
                <NarrationIcon className="w-6 h-6 mr-3 text-sky-400" />
                <h3 className="text-lg font-bold text-sky-400">{t.sunoTitle}</h3>
            </div>
            <div className="space-y-4 text-sm">
                <div>
                    <h4 className="font-semibold text-gray-300">{t.narrationScriptLabel}</h4>
                    <div className="mt-1 text-gray-400 bg-gray-900 p-3 rounded-md whitespace-pre-wrap max-h-48 overflow-y-auto">{narration.script}</div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-300">{t.voiceTagsLabel}</h4>
                    <p className="font-mono text-emerald-400 bg-gray-900 p-2 rounded-md">{narration.voiceTags}</p>
                </div>
            </div>
            {narrationScriptJson && narrationJsonText && (
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <details className="group">
                        <summary className="flex justify-between items-center cursor-pointer list-none text-md font-semibold text-gray-300 hover:text-sky-400 transition-colors">
                            <div className="flex items-center gap-2">
                                <JsonIcon className="w-5 h-5" />
                                <span>{t.narrationJsonTitle}</span>
                            </div>
                            <svg className="w-5 h-5 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </summary>
                        <div className="relative mt-2">
                            <CopyButton textToCopy={narrationJsonText} className="absolute top-2 right-2 z-10" />
                            <pre className="text-xs text-gray-300 bg-gray-900 p-3 rounded-md overflow-x-auto max-h-60"><code>{narrationJsonText}</code></pre>
                        </div>
                    </details>
                </div>
            )}
        </div>
    );
};

const SceneCard: React.FC<{ scene: Scene; timelineJsonItem: TimelineJsonItem | undefined; t: typeof en }> = ({ scene, timelineJsonItem, t }) => {
    const singleJsonText = timelineJsonItem ? JSON.stringify(timelineJsonItem, null, 2) : '';
    const renderDialogueWithTags = (text: string) => {
        if (!text || text.toLowerCase() === 'none') return <span className="text-gray-500 italic">{t.none}</span>;
        return text.split(/(\[.*?\])/g).map((part, i) =>
            part.startsWith('[') && part.endsWith(']') ? <strong key={i} className="text-amber-400 font-normal">{part}</strong> : part
        );
    };
    const translateDialogueStructure = (structure: string) => {
        const keyMap: { [key: string]: keyof typeof en } = {
            'Narration': 'dialogueStructureNarration', 'Monologue': 'dialogueStructureMonologue',
            '1-on-1 Conversation': 'dialogueStructure1on1', 'Multi-person Conversation': 'dialogueStructureMulti'
        };
        const key = keyMap[structure];
        return key ? t[key] : structure;
    };
    const formatSceneForCopy = (s: Scene) => `${t.cutLabel} #${s.scene}\n${t.timelineLabel}: ${s.timeline}\n${t.durationLabel}: ${s.duration}s\n\n${t.visualPromptLabel}:\n${s.visualPrompt}\n\n${t.cameraMovementLabel}:\n${s.cameraMovement}\n\n${t.dialogueStructureLabel}: ${translateDialogueStructure(s.dialogueStructure)}\n\n${t.dialogueLabel}:\n${s.dialogue}`;
    const SceneDetail: React.FC<{icon: React.ReactNode, label: string, children: React.ReactNode}> = ({icon, label, children}) => ( <div className="flex items-start gap-4"> <div className="flex-shrink-0 w-8 text-center pt-1 text-sky-400">{icon}</div> <div className="flex-1"> <h4 className="font-semibold text-gray-300">{label}</h4> <div className="text-gray-400 whitespace-pre-wrap">{children}</div> </div> </div> );

    return (
        <div className="relative bg-gray-800 rounded-lg p-5 border border-gray-700 shadow-md transition-shadow hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]">
            <CopyButton textToCopy={formatSceneForCopy(scene)} className="absolute top-4 right-4 z-10" />
            <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
                <h3 className="text-lg font-bold text-sky-400">{t.cutLabel} #{scene.scene}</h3>
                <div className="text-right flex gap-4">
                    <span className="text-xs font-mono bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{t.timelineLabel}: {scene.timeline}</span>
                    <span className="text-xs font-mono bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{t.durationLabel}: {scene.duration}s</span>
                </div>
            </div>
            <div className="space-y-4">
                <SceneDetail icon={<VisualsIcon className="w-6 h-6 mx-auto" />} label={t.visualPromptLabel}>{scene.visualPrompt}</SceneDetail>
                <SceneDetail icon={<CameraIcon className="w-6 h-6 mx-auto" />} label={t.cameraMovementLabel}>{scene.cameraMovement}</SceneDetail>
                <SceneDetail icon={<DialogueStructureIcon className="w-6 h-6 mx-auto" />} label={t.dialogueStructureLabel}>{translateDialogueStructure(scene.dialogueStructure)}</SceneDetail>
                <SceneDetail icon={<DialogueIcon className="w-6 h-6 mx-auto" />} label={t.dialogueLabel}>{renderDialogueWithTags(scene.dialogue)}</SceneDetail>
            </div>
            {timelineJsonItem && (
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <details className="group">
                        <summary className="flex justify-between items-center cursor-pointer list-none text-md font-semibold text-gray-300 hover:text-sky-400 transition-colors">
                            <div className="flex items-center gap-2"><JsonIcon className="w-5 h-5" /><span>{t.soraVeoJsonPrompt}</span></div>
                            <svg className="w-5 h-5 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </summary>
                        <div className="relative mt-2">
                            <CopyButton textToCopy={singleJsonText} className="absolute top-2 right-2 z-10" />
                            <pre className="text-xs text-gray-300 bg-gray-900 p-3 rounded-md overflow-x-auto"><code>{singleJsonText}</code></pre>
                        </div>
                    </details>
                </div>
            )}
        </div>
    );
};

// --- MAIN COMPONENT ---
export const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, isLoading, error }) => {
  const { t } = useLanguage();

  const renderContent = () => {
    if (isLoading) return <Loader />;
    if (error) return <ErrorDisplay error={error} t={t} />;
    
    if (output) {
      return (
        <div className="w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">{output?.title ?? t.untitledScenario}</h1>
          </div>
          <div>
            <blockquote className="border-l-4 border-sky-500 pl-4 py-2 bg-gray-900/50 rounded-r-lg"><p className="text-lg italic text-gray-300">"{output?.logline ?? ''}"</p></blockquote>
          </div>
          <CharactersSection characters={output?.characters ?? []} t={t} />
          <BgmSection bgm={output?.bgm} t={t} />
          <NarrationSection narration={output?.narration} narrationScriptJson={output?.narrationScriptJson} t={t} />
          <div>
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-600 pb-2 text-gray-100">{t.scenesTitle}</h2>
            <div className="space-y-4">
              {(output?.scenes ?? []).map((scene) => (
                <SceneCard
                  key={scene.scene}
                  scene={scene}
                  timelineJsonItem={output?.timelineJson?.find(item => item.id === scene.scene)}
                  t={t}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }
    return (
        <div className="flex flex-col items-center justify-center text-center text-gray-500">
            <FilmIcon className="w-12 h-12 mb-4" />
            <h3 className="text-lg font-semibold">{t.outputPlaceholderTitle}</h3>
            <p className="mt-1">{t.outputPlaceholderSubtitle}</p>
        </div>
    );
  };

  return (
    <div className="w-full bg-gray-800/50 rounded-2xl shadow-lg border border-gray-700 min-h-[20rem] p-6 flex items-start justify-center shadow-[0_0_25px_rgba(56,189,248,0.1)]">
        {renderContent()}
    </div>
  );
};

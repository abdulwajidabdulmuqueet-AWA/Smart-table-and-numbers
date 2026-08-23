import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  Tv, 
  Volume2, 
  VolumeX, 
  Bell, 
  Mic, 
  MicOff, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  Sliders,
  Award,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppSettings, RhythmSpeed, UserProgress } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/audio';
import { speechService } from '../utils/speech';
import { updateGameResults } from '../utils/storage';

export type RhythmAudioMode = 'speech' | 'metronome' | 'silent';

interface TablesLearningProps {
  selectedTable: number;
  setSelectedTable: (num: number) => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  progress: UserProgress;
  setProgress: (p: UserProgress) => void;
}

export const TablesLearning: React.FC<TablesLearningProps> = ({
  selectedTable = 2,
  setSelectedTable,
  settings,
  updateSettings,
  progress,
  setProgress
}) => {
  // Safe table fallback
  const currentTable = typeof selectedTable === 'number' && selectedTable >= 2 && selectedTable <= 20 ? selectedTable : 2;

  const t = translations[settings.language] || translations.en;
  const isUrdu = settings.language === 'ur';

  // Recitation & Beat states
  // activeStep: 1 to 10 (which equation in the table)
  const [activeStep, setActiveStep] = useState<number>(1);
  // activeBeat: 0 = idle/ready, 1 = table number blinks, 2 = multiplier blinks, 3 = product blinks
  const [activeBeat, setActiveBeat] = useState<1 | 2 | 3 | 0>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [rhythmAudioMode, setRhythmAudioMode] = useState<RhythmAudioMode>(settings.speechEnabled ? 'speech' : 'silent');
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  
  // Voice interactive mode
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string>('');
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Beat durations in milliseconds
  const beatDelays: Record<RhythmSpeed, number> = {
    'slow': 1100,
    'normal': 750,
    'fast': 480,
    'very-fast': 300,
    'custom': Math.max(200, (settings.customRhythmDelaySec * 1000) / 3)
  };

  const currentBeatDelay = beatDelays[settings.rhythmSpeed] || 750;
  const beatTimerRef = useRef<any>(null);

  const activeProduct = currentTable * activeStep;

  // Sound handler for specific beats
  const handleBeatSound = (beat: 1 | 2 | 3, stepNum: number) => {
    const prod = currentTable * stepNum;

    if (rhythmAudioMode === 'speech') {
      speechService.speakBeat(beat, currentTable, stepNum, prod, settings.language, settings.speechRate || 1.0);
    } else if (rhythmAudioMode === 'metronome') {
      if (beat === 1) {
        sounds.playClick();
      } else if (beat === 2) {
        sounds.playRhythmTick();
      } else {
        sounds.playCorrect();
      }
    }
    // 'silent' mode: no computer audio plays, allowing teacher or students to recite!
  };

  // Rhythm beat-by-beat progression engine
  useEffect(() => {
    if (!isPlaying) {
      if (beatTimerRef.current) clearTimeout(beatTimerRef.current);
      return;
    }

    // Schedule next beat
    beatTimerRef.current = setTimeout(() => {
      if (activeBeat === 0) {
        // Start Beat 1
        setActiveBeat(1);
        handleBeatSound(1, activeStep);
      } else if (activeBeat === 1) {
        // Advance to Beat 2 (Multiplier)
        setActiveBeat(2);
        handleBeatSound(2, activeStep);
      } else if (activeBeat === 2) {
        // Advance to Beat 3 (Product / Answer)
        setActiveBeat(3);
        handleBeatSound(3, activeStep);
      } else if (activeBeat === 3) {
        // Step complete! Move to next multiplier line
        if (activeStep < 10) {
          const nextStep = activeStep + 1;
          setActiveStep(nextStep);
          setActiveBeat(1);
          handleBeatSound(1, nextStep);
        } else {
          // Table 1 to 10 completed!
          setIsPlaying(false);
          setActiveBeat(0);
          sounds.playLevelComplete();
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
          const updated = updateGameResults(true, currentTable);
          setProgress(updated);
        }
      }
    }, currentBeatDelay);

    return () => {
      if (beatTimerRef.current) clearTimeout(beatTimerRef.current);
    };
  }, [isPlaying, activeBeat, activeStep, currentBeatDelay, currentTable, rhythmAudioMode, settings.language, settings.speechRate]);

  // Handle Play/Pause toggle
  const togglePlayPause = () => {
    sounds.playClick();
    if (isPlaying) {
      // Pause
      setIsPlaying(false);
    } else {
      // Start or Resume
      setIsPlaying(true);
      if (activeBeat === 0) {
        setActiveBeat(1);
        handleBeatSound(1, activeStep);
      }
    }
  };

  // Step advancement controls
  const handleNextStep = () => {
    sounds.playClick();
    if (activeStep < 10) {
      const next = activeStep + 1;
      setActiveStep(next);
      setActiveBeat(1);
      if (rhythmAudioMode !== 'silent') {
        handleBeatSound(1, next);
      }
    }
  };

  const handlePrevStep = () => {
    sounds.playClick();
    if (activeStep > 1) {
      const prev = activeStep - 1;
      setActiveStep(prev);
      setActiveBeat(1);
      if (rhythmAudioMode !== 'silent') {
        handleBeatSound(1, prev);
      }
    }
  };

  const handleRestart = () => {
    sounds.playClick();
    setActiveStep(1);
    setActiveBeat(0);
    setIsPlaying(false);
  };

  const handleSelectTable = (num: number) => {
    sounds.playClick();
    setSelectedTable(num);
    setActiveStep(1);
    setActiveBeat(0);
    setIsPlaying(false);
  };

  // Voice Mode logic
  const toggleVoiceMode = () => {
    sounds.playClick();
    if (isVoiceListening) {
      speechService.stopListening();
      setIsVoiceListening(false);
      setVoiceFeedback('');
    } else {
      setSpeechError(null);
      if (!speechService.isSTTSupported()) {
        setSpeechError(t.voiceNotSupported || 'Voice recognition not supported');
        return;
      }

      setIsVoiceListening(true);
      setIsPlaying(false);

      speechService.startListening(
        settings.language,
        (transcript) => {
          setVoiceFeedback(transcript);
          const expectedProduct = currentTable * activeStep;
          const containsProduct = transcript.includes(String(expectedProduct));

          if (containsProduct) {
            sounds.playCorrect();
            setVoiceFeedback(`🎉 "${transcript}" ✓`);
            setTimeout(() => {
              if (activeStep < 10) {
                const next = activeStep + 1;
                setActiveStep(next);
                setActiveBeat(1);
              } else {
                speechService.stopListening();
                setIsVoiceListening(false);
                sounds.playLevelComplete();
                confetti();
              }
            }, 600);
          }
        },
        (error) => {
          setIsVoiceListening(false);
          setSpeechError(t.micPermissionDenied || 'Microphone error');
        }
      );
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechService.stopListening();
      speechService.stopSpeaking();
      if (beatTimerRef.current) clearTimeout(beatTimerRef.current);
    };
  }, []);

  const allTables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  return (
    <div className={`max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 ${isUrdu ? 'font-urdu' : 'font-devanagari'}`}>
      
      {/* Top Header & Table Selection Matrix */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <span>{t.tablesHeading}</span>
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-black">
                {t.tableOf} {currentTable}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {t.tablesSubtitle}
            </p>
          </div>

          {/* Smart Board Presentation Mode Button */}
          <button
            id="start-smartboard-presentation-btn"
            onClick={() => {
              sounds.playClick();
              setIsPresentationMode(true);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm shadow-md hover:shadow-indigo-200 hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2.5"
          >
            <Tv className="w-5 h-5" />
            <span>{t.startPresentation}</span>
          </button>
        </div>

        {/* Table Selector Cards (2 to 20) */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            {t.selectTable || 'Select a Table to Learn (2 - 20):'}
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
            {allTables.map((num) => {
              const isSelected = currentTable === num;
              const stars = progress?.tablesMastery?.[num] || 0;
              return (
                <button
                  key={num}
                  id={`select-table-${num}`}
                  onClick={() => handleSelectTable(num)}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl font-black transition-all border-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105 ring-4 ring-indigo-100'
                      : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold opacity-75">
                    {t.tableOf}
                  </span>
                  <span className="text-xl sm:text-2xl font-math my-0.5">
                    {num}
                  </span>
                  <div className="flex items-center gap-0.5 text-[8px] text-amber-400">
                    {'★'.repeat(stars)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Interactive Teaching Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Active Beat Visual Equation & Full 10-Lines Stack */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active 3-Beat Rhythm Highlight Display Card */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-700/50 space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-black tracking-wide uppercase">
                  {isPlaying ? '🎵 Rhythm Recitation Active' : '⏸️ Recitation Ready'}
                </span>
              </div>
              <span className="text-xs font-bold text-indigo-300 font-math">
                Step {activeStep} / 10
              </span>
            </div>

            {/* 3-Beat Blinking Equation Blocks */}
            <div className="grid grid-cols-5 items-center gap-2 sm:gap-4 select-none my-2">
              
              {/* Beat 1: Table Number (e.g. 2) */}
              <div 
                id="rhythm-beat-table"
                className={`flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 text-center ${
                  activeBeat === 1
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-2xl scale-110 ring-4 ring-amber-300/50 animate-pulse font-black'
                    : 'bg-white/10 text-white border-white/20 font-bold'
                }`}
              >
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-extrabold opacity-80 mb-0.5">
                  1. Table
                </span>
                <span className="text-3xl sm:text-5xl md:text-6xl font-math font-black">
                  {currentTable}
                </span>
              </div>

              {/* Multiply Symbol */}
              <div className="flex items-center justify-center text-2xl sm:text-4xl md:text-5xl font-black text-indigo-300">
                ×
              </div>

              {/* Beat 2: Multiplier (e.g. 1) */}
              <div 
                id="rhythm-beat-multiplier"
                className={`flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 text-center ${
                  activeBeat === 2
                    ? 'bg-purple-500 text-white border-purple-400 shadow-2xl scale-110 ring-4 ring-purple-300/50 animate-pulse font-black'
                    : 'bg-white/10 text-white border-white/20 font-bold'
                }`}
              >
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-extrabold opacity-80 mb-0.5">
                  2. Times
                </span>
                <span className="text-3xl sm:text-5xl md:text-6xl font-math font-black">
                  {activeStep}
                </span>
              </div>

              {/* Equals Symbol */}
              <div className="flex items-center justify-center text-2xl sm:text-4xl md:text-5xl font-black text-indigo-300">
                =
              </div>

              {/* Beat 3: Product / Answer (e.g. 2) */}
              <div 
                id="rhythm-beat-product"
                className={`flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 text-center ${
                  activeBeat === 3
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-2xl scale-110 ring-4 ring-emerald-300/50 animate-pulse font-black'
                    : 'bg-white/10 text-amber-300 border-white/20 font-bold'
                }`}
              >
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-extrabold opacity-80 mb-0.5">
                  3. Answer
                </span>
                <span className="text-3xl sm:text-5xl md:text-6xl font-math font-black">
                  {activeProduct}
                </span>
              </div>

            </div>

            {/* Rhythm Status Instruction */}
            <div className="text-center pt-2">
              <p className="text-xs sm:text-sm text-indigo-200 font-medium">
                {rhythmAudioMode === 'silent' 
                  ? '🔇 Teacher / Class Recitation Mode: Sound is off so teacher & students can recite aloud in sync with blinking numbers!'
                  : rhythmAudioMode === 'metronome'
                  ? '🔔 Metronome Mode: Steady rhythmic beats guiding classroom recitation tempo.'
                  : '🎙️ Computer Audio Mode: Speaking each number beat-by-beat.'
                }
              </p>
            </div>
          </div>

          {/* 10 Lines Stack (2x1=2 to 2x10=20) */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 font-black flex items-center justify-center font-math">
                  {currentTable}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-800">
                  {t.tableOf} {currentTable} (1 to 10)
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 font-math">
                  {activeStep} / 10
                </span>
                <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 rounded-full"
                    style={{ width: `${(activeStep / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 10 Lines List */}
            <div className="space-y-2 select-none">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => {
                const isActive = activeStep === step;
                const isPast = activeStep > step;
                const product = currentTable * step;

                return (
                  <div
                    key={step}
                    id={`table-line-${currentTable}-${step}`}
                    onClick={() => {
                      sounds.playClick();
                      setActiveStep(step);
                      setActiveBeat(1);
                      if (rhythmAudioMode !== 'silent') {
                        handleBeatSound(1, step);
                      }
                    }}
                    className={`group flex items-center justify-between px-4 sm:px-6 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white border-indigo-800 shadow-lg scale-102 font-black'
                        : isPast
                        ? 'bg-indigo-50/50 text-slate-800 border-indigo-100/80 font-bold opacity-80'
                        : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-6 text-base sm:text-2xl font-math">
                      
                      {/* Factor 1 (Table) */}
                      <span className={`w-8 sm:w-10 text-center rounded-lg py-0.5 transition-all ${
                        isActive && activeBeat === 1 ? 'bg-amber-400 text-slate-950 scale-110 shadow font-black' : ''
                      }`}>
                        {currentTable}
                      </span>
                      
                      <span className={isActive ? 'text-indigo-200' : 'text-slate-400'}>×</span>
                      
                      {/* Factor 2 (Multiplier) */}
                      <span className={`w-8 sm:w-10 text-center rounded-lg py-0.5 transition-all ${
                        isActive && activeBeat === 2 ? 'bg-purple-400 text-white scale-110 shadow font-black' : ''
                      }`}>
                        {step}
                      </span>
                      
                      <span className={isActive ? 'text-indigo-200' : 'text-slate-400'}>=</span>
                      
                      {/* Product */}
                      <span className={`text-lg sm:text-2xl font-black rounded-lg px-2 py-0.5 transition-all ${
                        isActive && activeBeat === 3 
                          ? 'bg-emerald-400 text-slate-950 scale-110 shadow' 
                          : isActive 
                          ? 'text-amber-300' 
                          : 'text-slate-900'
                      }`}>
                        {product}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 text-white animate-pulse flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          Beat {activeBeat || 1}
                        </span>
                      )}
                      {isPast && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Playback Controls, Recitation Sound Mode & Visual Concept */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Controls Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <span>Rhythm & Recitation Controls</span>
              </h4>
              <button
                onClick={handleRestart}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all text-xs font-bold flex items-center gap-1"
                title={t.restart}
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.restart}</span>
              </button>
            </div>

            {/* Play/Pause Main Button and Navigation Bar */}
            <div className="grid grid-cols-4 gap-2">
              <button
                id="btn-table-prev"
                onClick={handlePrevStep}
                disabled={activeStep <= 1}
                className="py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold flex flex-col items-center justify-center gap-1 transition-all"
              >
                <SkipBack className="w-5 h-5" />
                <span className="text-[11px]">{t.previous}</span>
              </button>

              {/* Play / Pause Toggle Button */}
              <button
                id="btn-table-play-pause"
                onClick={togglePlayPause}
                className={`py-3.5 col-span-2 rounded-2xl font-black text-white flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-95 ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-600 ring-4 ring-amber-100 shadow-amber-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-6 h-6 fill-current" />
                    <span className="text-base">{t.pause || 'Pause'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-current" />
                    <span className="text-base">{t.autoRhythm || 'Start Rhythm'}</span>
                  </>
                )}
              </button>

              <button
                id="btn-table-next"
                onClick={handleNextStep}
                disabled={activeStep >= 10}
                className="py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold flex flex-col items-center justify-center gap-1 transition-all"
              >
                <SkipForward className="w-5 h-5" />
                <span className="text-[11px]">{t.next}</span>
              </button>
            </div>

            {/* Sound & Recitation Mode Selector (Teacher Silent vs Voice vs Metronome) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-extrabold text-slate-700 block">
                Recitation Audio Mode:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  id="mode-silent-recitation"
                  onClick={() => {
                    sounds.playClick();
                    setRhythmAudioMode('silent');
                  }}
                  className={`p-2.5 rounded-2xl text-xs font-extrabold flex flex-col items-center justify-center gap-1 border transition-all ${
                    rhythmAudioMode === 'silent'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-200 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <VolumeX className="w-4 h-4 text-emerald-600" />
                  <span className="text-center leading-tight">Teacher Recite (Muted)</span>
                </button>

                <button
                  id="mode-speech-recitation"
                  onClick={() => {
                    sounds.playClick();
                    setRhythmAudioMode('speech');
                    updateSettings({ speechEnabled: true });
                  }}
                  className={`p-2.5 rounded-2xl text-xs font-extrabold flex flex-col items-center justify-center gap-1 border transition-all ${
                    rhythmAudioMode === 'speech'
                      ? 'bg-indigo-50 text-indigo-800 border-indigo-300 ring-2 ring-indigo-200 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  <span className="text-center leading-tight">Computer Voice</span>
                </button>

                <button
                  id="mode-metronome-recitation"
                  onClick={() => {
                    sounds.playClick();
                    setRhythmAudioMode('metronome');
                  }}
                  className={`p-2.5 rounded-2xl text-xs font-extrabold flex flex-col items-center justify-center gap-1 border transition-all ${
                    rhythmAudioMode === 'metronome'
                      ? 'bg-purple-50 text-purple-800 border-purple-300 ring-2 ring-purple-200 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Bell className="w-4 h-4 text-purple-600" />
                  <span className="text-center leading-tight">Metronome Beats</span>
                </button>
              </div>
            </div>

            {/* Rhythm Speed Control */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>{t.speed || 'Rhythm Speed'}</span>
                <span className="text-indigo-600 font-math">{(currentBeatDelay / 1000).toFixed(2)}s per beat</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['slow', 'normal', 'fast', 'very-fast'] as RhythmSpeed[]).map((spd) => (
                  <button
                    key={spd}
                    id={`speed-btn-${spd}`}
                    onClick={() => {
                      sounds.playClick();
                      updateSettings({ rhythmSpeed: spd });
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold text-center transition-all ${
                      settings.rhythmSpeed === spd
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {spd === 'slow' ? '🐢 Slow' : spd === 'normal' ? '🚶 Normal' : spd === 'fast' ? '🏃 Fast' : '⚡ Swift'}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Interactive Mode Toggle */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                id="toggle-voice-recite-btn"
                onClick={toggleVoiceMode}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  isVoiceListening
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-md'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {isVoiceListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                <span>{isVoiceListening ? 'Voice Answer Mode: Active (Listening...)' : '🎙️ Practice Speaking via Microphone'}</span>
              </button>

              {isVoiceListening && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold space-y-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span>Say the answer for: {currentTable} × {activeStep} = ?</span>
                  </div>
                  {voiceFeedback && (
                    <div className="text-indigo-600 font-bold mt-1">
                      {voiceFeedback}
                    </div>
                  )}
                </div>
              )}

              {speechError && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                  {speechError}
                </div>
              )}
            </div>
          </div>

          {/* Visual Concept Multiplication Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 font-black text-sm sm:text-base">
                <Eye className="w-4 h-4" />
                <span>{t.visualMode || 'Visual Representation'}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black font-math">
                {currentTable} × {activeStep} = {activeProduct}
              </span>
            </div>

            {/* Visual Dot Groups */}
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-semibold">
                {activeStep} {t.groupsOf || 'groups of'} {currentTable}:
              </p>

              <div className="flex flex-wrap gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 justify-center max-h-48 overflow-y-auto">
                {[...Array(activeStep)].map((_, gIndex) => (
                  <div 
                    key={gIndex}
                    className="p-2 rounded-xl bg-white border border-indigo-100 shadow-sm flex flex-wrap gap-1 items-center justify-center max-w-[120px]"
                  >
                    {[...Array(currentTable)].map((_, dIndex) => (
                      <span 
                        key={dIndex}
                        className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xs"
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Repeated Addition Expression */}
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center space-y-1">
                <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
                  {t.repeatedAddition || 'Repeated Addition'}
                </div>
                <div className="text-sm sm:text-base font-black text-indigo-900 font-math">
                  {[...Array(activeStep)].map(() => currentTable).join(' + ')} = {activeProduct}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Classroom Smart Board Full-Screen Presentation Overlay */}
      {isPresentationMode && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-12 overflow-hidden animate-in fade-in duration-200">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-2xl bg-indigo-600 text-white text-xl sm:text-2xl font-black font-math shadow-lg">
                {t.tableOf} {currentTable}
              </span>
              <span className="text-slate-400 text-sm font-semibold hidden sm:inline">
                Smart Board Classroom Presentation Mode
              </span>
            </div>

            {/* Exit Presentation Mode */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsPresentationMode(false);
                setIsPlaying(false);
              }}
              className="px-6 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-black text-sm tracking-wide transition-all border border-white/20 flex items-center gap-2"
            >
              ✕ <span>{t.exitPresentation || 'Exit Presentation'}</span>
            </button>
          </div>

          {/* Central Mega Display with Beat-by-Beat Glow */}
          <div className="flex-1 flex flex-col items-center justify-center my-6 text-center space-y-6">
            
            <div className="w-full max-w-4xl p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-indigo-900/90 to-purple-950/95 border-2 border-indigo-400/50 shadow-2xl backdrop-blur-xl space-y-6">
              
              {/* Massive 3-Beat Highlighting Equation */}
              <div className="grid grid-cols-5 items-center gap-4 text-center select-none">
                
                {/* Beat 1 Table */}
                <div className={`p-4 sm:p-8 rounded-3xl border-2 transition-all duration-200 ${
                  activeBeat === 1
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-2xl scale-110 ring-8 ring-amber-300/40 animate-pulse font-black'
                    : 'bg-white/10 text-white border-white/20 font-bold'
                }`}>
                  <span className="text-xs uppercase tracking-wider block opacity-70 mb-1">1. Table</span>
                  <span className="text-5xl sm:text-7xl md:text-8xl font-math font-black">{currentTable}</span>
                </div>

                <div className="text-4xl sm:text-6xl font-black text-indigo-300">×</div>

                {/* Beat 2 Multiplier */}
                <div className={`p-4 sm:p-8 rounded-3xl border-2 transition-all duration-200 ${
                  activeBeat === 2
                    ? 'bg-purple-500 text-white border-purple-400 shadow-2xl scale-110 ring-8 ring-purple-300/40 animate-pulse font-black'
                    : 'bg-white/10 text-white border-white/20 font-bold'
                }`}>
                  <span className="text-xs uppercase tracking-wider block opacity-70 mb-1">2. Times</span>
                  <span className="text-5xl sm:text-7xl md:text-8xl font-math font-black">{activeStep}</span>
                </div>

                <div className="text-4xl sm:text-6xl font-black text-indigo-300">=</div>

                {/* Beat 3 Product */}
                <div className={`p-4 sm:p-8 rounded-3xl border-2 transition-all duration-200 ${
                  activeBeat === 3
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-2xl scale-110 ring-8 ring-emerald-300/40 animate-pulse font-black'
                    : 'bg-white/10 text-amber-300 border-white/20 font-bold'
                }`}>
                  <span className="text-xs uppercase tracking-wider block opacity-70 mb-1">3. Answer</span>
                  <span className="text-5xl sm:text-7xl md:text-8xl font-math font-black">{activeProduct}</span>
                </div>

              </div>

              {/* Visual Groups representation */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                {[...Array(activeStep)].map((_, gi) => (
                  <div key={gi} className="p-2 rounded-xl bg-white/10 flex gap-1.5 items-center">
                    {[...Array(currentTable)].map((_, di) => (
                      <span key={di} className="w-4 h-4 rounded-full bg-amber-400 shadow-sm" />
                    ))}
                  </div>
                ))}
              </div>

            </div>

            {/* Sequence 1 to 10 Quick Select Buttons */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    sounds.playClick();
                    setActiveStep(s);
                    setActiveBeat(1);
                  }}
                  className={`w-11 h-11 rounded-xl font-bold font-math transition-all ${
                    activeStep === s
                      ? 'bg-amber-400 text-slate-900 scale-115 font-black shadow-lg ring-2 ring-amber-200'
                      : activeStep > s
                      ? 'bg-indigo-700/80 text-white'
                      : 'bg-white/10 text-white/50 hover:bg-white/20'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

          </div>

          {/* Bottom Presentation Controls Bar */}
          <div className="max-w-4xl mx-auto w-full flex flex-wrap items-center justify-between gap-4 bg-white/10 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/20">
            
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevStep}
                disabled={activeStep <= 1}
                className="px-6 py-4 rounded-2xl bg-white/20 hover:bg-white/30 disabled:opacity-30 text-white font-black text-lg flex items-center gap-2 transition-all"
              >
                <SkipBack className="w-6 h-6" />
                <span>{t.previous}</span>
              </button>

              {/* Play / Pause Toggle in Smart Board mode */}
              <button
                onClick={togglePlayPause}
                className={`px-10 py-4 rounded-2xl font-black text-xl flex items-center gap-3 shadow-xl transition-all active:scale-95 ${
                  isPlaying ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 ring-4 ring-amber-200' : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current" />}
                <span>{isPlaying ? (t.pause || 'Pause') : (t.play || 'Start Rhythm')}</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={activeStep >= 10}
                className="px-6 py-4 rounded-2xl bg-white/20 hover:bg-white/30 disabled:opacity-30 text-white font-black text-lg flex items-center gap-2 transition-all"
              >
                <span>{t.next}</span>
                <SkipForward className="w-6 h-6" />
              </button>
            </div>

            {/* Sound Mode Switcher inside Presentation Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  const nextMode: RhythmAudioMode = rhythmAudioMode === 'silent' ? 'speech' : rhythmAudioMode === 'speech' ? 'metronome' : 'silent';
                  setRhythmAudioMode(nextMode);
                }}
                className="px-5 py-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm flex items-center gap-2"
              >
                {rhythmAudioMode === 'silent' ? (
                  <>
                    <VolumeX className="w-5 h-5 text-emerald-400" />
                    <span>Recitation: Muted (Teacher/Class)</span>
                  </>
                ) : rhythmAudioMode === 'speech' ? (
                  <>
                    <Volume2 className="w-5 h-5 text-indigo-300" />
                    <span>Recitation: Computer Voice</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-5 h-5 text-purple-300" />
                    <span>Recitation: Metronome</span>
                  </>
                )}
              </button>

              <button
                onClick={handleRestart}
                className="p-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white"
                title={t.restart}
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

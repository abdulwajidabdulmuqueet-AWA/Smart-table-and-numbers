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
  ChevronDown,
  ChevronUp,
  FastForward,
  Zap
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
  
  // Auto-play next table option (defaults to true or settings value)
  const [autoPlayNextTable, setAutoPlayNextTable] = useState<boolean>(settings.autoPlayNextTable ?? true);
  const [nextTableTransition, setNextTableTransition] = useState<{ nextTable: number; countdown: number } | null>(null);
  
  // Selector collapsed/expanded state for compact single-screen viewing
  const [isSelectorExpanded, setIsSelectorExpanded] = useState<boolean>(false);

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
  const transitionTimerRef = useRef<any>(null);

  const activeProduct = currentTable * activeStep;

  // Sound handler for specific beats
  const handleBeatSound = (beat: 1 | 2 | 3, stepNum: number, tableNum = currentTable) => {
    const prod = tableNum * stepNum;

    if (rhythmAudioMode === 'speech') {
      speechService.speakBeat(beat, tableNum, stepNum, prod, settings.language, settings.speechRate || 1.0);
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

  // Toggle Auto-Play Next Table
  const handleToggleAutoPlayNext = () => {
    sounds.playClick();
    const newVal = !autoPlayNextTable;
    setAutoPlayNextTable(newVal);
    updateSettings({ autoPlayNextTable: newVal });
  };

  // Rhythm beat-by-beat progression engine
  useEffect(() => {
    if (!isPlaying || nextTableTransition !== null) {
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
          sounds.playLevelComplete();
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
          const updated = updateGameResults(true, currentTable);
          setProgress(updated);

          // Check if Auto-Play Next Table is enabled
          if (autoPlayNextTable && currentTable < 20) {
            const nextT = currentTable + 1;
            setNextTableTransition({ nextTable: nextT, countdown: 2 });
            
            // 1.8s delay before playing next table
            transitionTimerRef.current = setTimeout(() => {
              setNextTableTransition(null);
              setSelectedTable(nextT);
              setActiveStep(1);
              setActiveBeat(1);
              handleBeatSound(1, 1, nextT);
            }, 1800);
          } else {
            setIsPlaying(false);
            setActiveBeat(0);
          }
        }
      }
    }, currentBeatDelay);

    return () => {
      if (beatTimerRef.current) clearTimeout(beatTimerRef.current);
    };
  }, [isPlaying, activeBeat, activeStep, currentBeatDelay, currentTable, rhythmAudioMode, settings.language, settings.speechRate, autoPlayNextTable, nextTableTransition]);

  // Handle immediate skip to next table during transition
  const handleImmediateNextTable = () => {
    if (!nextTableTransition) return;
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    const nextT = nextTableTransition.nextTable;
    setNextTableTransition(null);
    setSelectedTable(nextT);
    setActiveStep(1);
    setActiveBeat(1);
    handleBeatSound(1, 1, nextT);
  };

  // Cancel next table transition and stop
  const handleCancelNextTableTransition = () => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    setNextTableTransition(null);
    setIsPlaying(false);
    setActiveBeat(0);
  };

  // Handle Play/Pause toggle
  const togglePlayPause = () => {
    sounds.playClick();
    if (isPlaying) {
      // Pause
      setIsPlaying(false);
      if (nextTableTransition) {
        if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
        setNextTableTransition(null);
      }
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
    } else if (currentTable < 20) {
      // Next table
      handleSelectTable(currentTable + 1);
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
    } else if (currentTable > 2) {
      // Previous table
      handleSelectTable(currentTable - 1);
    }
  };

  const handleRestart = () => {
    sounds.playClick();
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    setNextTableTransition(null);
    setActiveStep(1);
    setActiveBeat(0);
    setIsPlaying(false);
  };

  const handleSelectTable = (num: number) => {
    sounds.playClick();
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    setNextTableTransition(null);
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
                const nextStep = activeStep + 1;
                setActiveStep(nextStep);
                setActiveBeat(1);
              } else {
                speechService.stopListening();
                setIsVoiceListening(false);
                sounds.playLevelComplete();
                confetti();
                if (autoPlayNextTable && currentTable < 20) {
                  setTimeout(() => {
                    handleSelectTable(currentTable + 1);
                  }, 1200);
                }
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
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const allTables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  return (
    <div className={`max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4 space-y-3.5 ${isUrdu ? 'font-urdu' : 'font-devanagari'}`}>
      
      {/* Sleek Compact Header Bar with Table Quick Selector & Auto-Next Toggle */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-math font-black text-xl flex items-center justify-center shadow-sm flex-shrink-0">
              {currentTable}
            </span>
            <div>
              <h2 className="text-base sm:text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                <span>{t.tableOf} {currentTable}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                  2 - 20
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium hidden sm:block">
                {t.tablesSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto Play Next Table Quick Toggle */}
            <button
              id="header-auto-next-toggle"
              onClick={handleToggleAutoPlayNext}
              title={t.autoPlayNextDesc}
              className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-xs ${
                autoPlayNextTable
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <FastForward className={`w-3.5 h-3.5 ${autoPlayNextTable ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>
                {isUrdu ? 'اگلا پہاڑہ آٹو پلے:' : settings.language === 'hi' ? 'अगला पहाड़ा:' : 'Auto Next Table:'}
              </span>
              <span className={`font-black ${autoPlayNextTable ? 'text-emerald-700' : 'text-slate-400'}`}>
                {autoPlayNextTable ? 'ON ✓' : 'OFF'}
              </span>
            </button>

            {/* Smart Board Presentation Mode Button */}
            <button
              id="start-smartboard-presentation-btn"
              onClick={() => {
                sounds.playClick();
                setIsPresentationMode(true);
              }}
              className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Tv className="w-4 h-4" />
              <span className="hidden md:inline">{t.startPresentation}</span>
              <span className="md:hidden">Smart Board</span>
            </button>

            {/* Expand / Collapse All Tables Selector */}
            <button
              onClick={() => setIsSelectorExpanded(!isSelectorExpanded)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1"
              title="All Tables 2-20"
            >
              <span className="text-[11px] hidden sm:inline">2-20</span>
              {isSelectorExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Compact Horizontal Quick-Picker (Takes minimal height so 10 lines fit on 1 screen) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
          <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap pl-0.5 pr-1">
            {t.selectTable || 'Table:'}
          </span>
          {allTables.map((num) => {
            const isSelected = currentTable === num;
            const stars = progress?.tablesMastery?.[num] || 0;
            return (
              <button
                key={num}
                id={`compact-select-table-${num}`}
                onClick={() => handleSelectTable(num)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-xl font-math font-black text-xs sm:text-sm transition-all flex items-center gap-1 border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm scale-105 ring-2 ring-indigo-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{num}</span>
                {stars > 0 && (
                  <span className="text-[9px] text-amber-400">
                    {'★'.repeat(Math.min(stars, 3))}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Expanded Grid (Only when user expands) */}
        {isSelectorExpanded && (
          <div className="pt-2 border-t border-slate-100 grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-1.5 animate-in slide-in-from-top-2 duration-150">
            {allTables.map((num) => {
              const isSelected = currentTable === num;
              const stars = progress?.tablesMastery?.[num] || 0;
              return (
                <button
                  key={num}
                  id={`select-table-${num}`}
                  onClick={() => {
                    handleSelectTable(num);
                    setIsSelectorExpanded(false);
                  }}
                  className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl font-black transition-all border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm ring-2 ring-indigo-100'
                      : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[9px] uppercase font-bold opacity-75">{t.tableOf}</span>
                  <span className="text-base sm:text-lg font-math font-black">{num}</span>
                  <div className="flex items-center gap-0.5 text-[8px] text-amber-400">
                    {'★'.repeat(stars)}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Single-Screen Interactive Teaching Layout (Fits on 1 Screen!) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 items-start">
        
        {/* Left Column: Active Beat Equation Banner + Full 10-Lines Table */}
        <div className="lg:col-span-7 space-y-3.5">
          
          {/* SECTION 1: Active 3-Beat Rhythm Highlight Display Card (Circled in user photo) */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 text-white shadow-lg border border-indigo-700/50 space-y-2.5 relative overflow-hidden">
            
            {/* Auto Next Table Countdown Notification Toast (When advancing to next table) */}
            {nextTableTransition && (
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-between gap-2 animate-bounce shadow-md">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-black">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    {isUrdu 
                      ? `🎉 پہاڑہ ${currentTable} مکمل! اگلا پہاڑہ ${nextTableTransition.nextTable} شروع ہو رہا ہے...`
                      : settings.language === 'hi'
                      ? `🎉 पहाड़ा ${currentTable} पूरा! अगला पहाड़ा ${nextTableTransition.nextTable} शुरू हो रहा है...`
                      : `🎉 Table ${currentTable} Complete! Starting Table ${nextTableTransition.nextTable}...`}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleImmediateNextTable}
                    className="px-2.5 py-1 rounded-lg bg-white text-emerald-800 text-xs font-black shadow-xs hover:bg-emerald-50"
                  >
                    ▶ {t.play || 'Start'}
                  </button>
                  <button
                    onClick={handleCancelNextTableTransition}
                    className="px-2 py-1 rounded-lg bg-black/20 text-white text-xs font-bold hover:bg-black/40"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black tracking-wide uppercase border flex items-center gap-1 ${
                  isPlaying
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/30 animate-pulse'
                    : 'bg-indigo-500/25 text-indigo-200 border-indigo-400/30'
                }`}>
                  {isPlaying ? '🎵 RECITATION PLAYING' : '⏸️ RECITATION READY'}
                </span>
                {autoPlayNextTable && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                    <FastForward className="w-3 h-3" /> Auto-Next ON
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-indigo-300 font-math bg-white/10 px-2 py-0.5 rounded-md">
                Step {activeStep} / 10
              </span>
            </div>

            {/* 3-Beat Blinking Equation Blocks (Compact, High Contrast, Crisp) */}
            <div className="grid grid-cols-5 items-center gap-1.5 sm:gap-3 select-none">
              
              {/* Beat 1: Table Number */}
              <div 
                id="rhythm-beat-table"
                className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 text-center ${
                  activeBeat === 1
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xl scale-105 ring-4 ring-amber-300/50 font-black'
                    : 'bg-white/10 text-white border-white/20 font-bold'
                }`}
              >
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold opacity-80">
                  1. Table
                </span>
                <span className="text-2xl sm:text-4xl md:text-5xl font-math font-black leading-none my-0.5">
                  {currentTable}
                </span>
              </div>

              {/* Multiply Symbol */}
              <div className="flex items-center justify-center text-xl sm:text-3xl md:text-4xl font-black text-indigo-300">
                ×
              </div>

              {/* Beat 2: Multiplier */}
              <div 
                id="rhythm-beat-multiplier"
                className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 text-center ${
                  activeBeat === 2
                    ? 'bg-purple-500 text-white border-purple-400 shadow-xl scale-105 ring-4 ring-purple-300/50 font-black'
                    : 'bg-white/10 text-white border-white/20 font-bold'
                }`}
              >
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold opacity-80">
                  2. Times
                </span>
                <span className="text-2xl sm:text-4xl md:text-5xl font-math font-black leading-none my-0.5">
                  {activeStep}
                </span>
              </div>

              {/* Equals Symbol */}
              <div className="flex items-center justify-center text-xl sm:text-3xl md:text-4xl font-black text-indigo-300">
                =
              </div>

              {/* Beat 3: Product / Answer */}
              <div 
                id="rhythm-beat-product"
                className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 text-center ${
                  activeBeat === 3
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-xl scale-105 ring-4 ring-emerald-300/50 font-black'
                    : 'bg-white/10 text-amber-300 border-white/20 font-bold'
                }`}
              >
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold opacity-80">
                  3. Answer
                </span>
                <span className="text-2xl sm:text-4xl md:text-5xl font-math font-black leading-none my-0.5">
                  {activeProduct}
                </span>
              </div>

            </div>

            {/* Audio Mode Indicator subtitle */}
            <div className="text-center pt-0.5">
              <p className="text-[11px] sm:text-xs text-indigo-200 font-medium truncate">
                {rhythmAudioMode === 'silent' 
                  ? '🔇 Teacher / Class Recitation Mode: Muted so classroom recites together.'
                  : rhythmAudioMode === 'metronome'
                  ? '🔔 Metronome Mode: Steady rhythmic tempo beats.'
                  : '🎙️ Computer Voice: Speaking each number beat-by-beat.'
                }
              </p>
            </div>
          </div>

          {/* SECTION 2: 10 Lines Stack (Table of N: 1 to 10) - Compact Single-Screen Height */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm font-math">
                  {currentTable}
                </span>
                <h3 className="text-sm sm:text-base font-black text-slate-800">
                  {t.tableOf} {currentTable} (1 to 10)
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 font-math">
                  {activeStep} / 10
                </span>
                <div className="w-20 sm:w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 rounded-full"
                    style={{ width: `${(activeStep / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 10 Lines List (Compact rows so all 10 lines 100% fit on screen) */}
            <div className="space-y-1 select-none">
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
                    className={`group flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl cursor-pointer transition-all duration-150 border ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white border-indigo-800 shadow-md font-black scale-101'
                        : isPast
                        ? 'bg-indigo-50/40 text-slate-800 border-indigo-100/70 font-bold opacity-85'
                        : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-4 text-sm sm:text-lg font-math">
                      
                      {/* Factor 1 (Table) */}
                      <span className={`w-6 sm:w-8 text-center rounded py-0.5 transition-all ${
                        isActive && activeBeat === 1 ? 'bg-amber-400 text-slate-950 font-black scale-110 shadow-xs' : ''
                      }`}>
                        {currentTable}
                      </span>
                      
                      <span className={isActive ? 'text-indigo-200' : 'text-slate-400'}>×</span>
                      
                      {/* Factor 2 (Multiplier) */}
                      <span className={`w-6 sm:w-8 text-center rounded py-0.5 transition-all ${
                        isActive && activeBeat === 2 ? 'bg-purple-400 text-white font-black scale-110 shadow-xs' : ''
                      }`}>
                        {step}
                      </span>
                      
                      <span className={isActive ? 'text-indigo-200' : 'text-slate-400'}>=</span>
                      
                      {/* Product */}
                      <span className={`text-base sm:text-lg font-black rounded px-1.5 py-0.5 transition-all ${
                        isActive && activeBeat === 3 
                          ? 'bg-emerald-400 text-slate-950 font-black scale-110 shadow-xs' 
                          : isActive 
                          ? 'text-amber-300' 
                          : 'text-slate-900'
                      }`}>
                        {product}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                          Beat {activeBeat || 1}
                        </span>
                      )}
                      {isPast && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: SECTION 3 - Rhythm & Recitation Controls (Circled in user photo) */}
        <div className="lg:col-span-5 space-y-3.5">
          
          {/* Controls Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Rhythm & Recitation Controls</span>
              </h4>
              <button
                onClick={handleRestart}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all text-xs font-bold flex items-center gap-1"
                title={t.restart}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.restart}</span>
              </button>
            </div>

            {/* Play/Pause Main Button and Step Skip Navigation */}
            <div className="grid grid-cols-4 gap-1.5">
              <button
                id="btn-table-prev"
                onClick={handlePrevStep}
                disabled={activeStep <= 1 && currentTable <= 2}
                className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95"
              >
                <SkipBack className="w-4 h-4" />
                <span className="text-[10px]">{t.previous}</span>
              </button>

              {/* Play / Pause Toggle Button */}
              <button
                id="btn-table-play-pause"
                onClick={togglePlayPause}
                className={`py-3 col-span-2 rounded-xl font-black text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-600 ring-2 ring-amber-200 shadow-amber-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span className="text-sm sm:text-base">{t.pause || 'Pause'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span className="text-sm sm:text-base">{t.autoRhythm || 'Start Rhythm'}</span>
                  </>
                )}
              </button>

              <button
                id="btn-table-next"
                onClick={handleNextStep}
                disabled={activeStep >= 10 && currentTable >= 20}
                className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95"
              >
                <SkipForward className="w-4 h-4" />
                <span className="text-[10px]">{t.next}</span>
              </button>
            </div>

            {/* Auto-Play Next Table Toggle Box (Requested Feature!) */}
            <div className={`p-2.5 rounded-xl border transition-all ${
              autoPlayNextTable 
                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 ring-1 ring-emerald-200' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    autoPlayNextTable ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <FastForward className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-800 block">
                      {t.autoPlayNextTable || 'Auto-Play Next Table (2 ➔ 20)'}
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      {autoPlayNextTable ? 'Moves to next table automatically when finished ✓' : 'Stops at 10 (Manual change)'}
                    </span>
                  </div>
                </div>

                <button
                  id="toggle-autoplay-next-table-btn"
                  onClick={handleToggleAutoPlayNext}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                    autoPlayNextTable
                      ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {autoPlayNextTable ? 'ENABLED' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Recitation Audio Mode (Silent Teacher vs Computer Voice vs Metronome) */}
            <div className="space-y-1.5 pt-1 border-t border-slate-100">
              <label className="text-xs font-extrabold text-slate-700 block">
                Recitation Audio Mode:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  id="mode-silent-recitation"
                  onClick={() => {
                    sounds.playClick();
                    setRhythmAudioMode('silent');
                  }}
                  className={`p-2 rounded-xl text-[11px] font-extrabold flex flex-col items-center justify-center gap-1 border transition-all ${
                    rhythmAudioMode === 'silent'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-200 shadow-xs'
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
                  className={`p-2 rounded-xl text-[11px] font-extrabold flex flex-col items-center justify-center gap-1 border transition-all ${
                    rhythmAudioMode === 'speech'
                      ? 'bg-indigo-50 text-indigo-800 border-indigo-300 ring-2 ring-indigo-200 shadow-xs'
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
                  className={`p-2 rounded-xl text-[11px] font-extrabold flex flex-col items-center justify-center gap-1 border transition-all ${
                    rhythmAudioMode === 'metronome'
                      ? 'bg-purple-50 text-purple-800 border-purple-300 ring-2 ring-purple-200 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Bell className="w-4 h-4 text-purple-600" />
                  <span className="text-center leading-tight">Metronome Beats</span>
                </button>
              </div>
            </div>

            {/* Rhythm Speed Control */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>{t.speed || 'Rhythm Speed'}</span>
                <span className="text-indigo-600 font-math">{(currentBeatDelay / 1000).toFixed(2)}s per beat</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {(['slow', 'normal', 'fast', 'very-fast'] as RhythmSpeed[]).map((spd) => (
                  <button
                    key={spd}
                    id={`speed-btn-${spd}`}
                    onClick={() => {
                      sounds.playClick();
                      updateSettings({ rhythmSpeed: spd });
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-bold text-center transition-all ${
                      settings.rhythmSpeed === spd
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {spd === 'slow' ? '🐢 Slow' : spd === 'normal' ? '🚶 Normal' : spd === 'fast' ? '🏃 Fast' : '⚡ Swift'}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Interactive Mode Toggle */}
            <div className="pt-1 border-t border-slate-100 space-y-1.5">
              <button
                id="toggle-voice-recite-btn"
                onClick={toggleVoiceMode}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  isVoiceListening
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {isVoiceListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                <span>{isVoiceListening ? 'Voice Answer Mode: (Listening...)' : '🎙️ Practice Speaking via Microphone'}</span>
              </button>

              {isVoiceListening && (
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>Say: {currentTable} × {activeStep} = ?</span>
                  </div>
                  {voiceFeedback && (
                    <div className="text-indigo-600 font-bold">
                      {voiceFeedback}
                    </div>
                  )}
                </div>
              )}

              {speechError && (
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                  {speechError}
                </div>
              )}
            </div>
          </div>

          {/* Visual Concept Multiplication Card (Compact & Balanced) */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-indigo-600 font-black text-xs sm:text-sm">
                <Eye className="w-4 h-4" />
                <span>{t.visualMode || 'Visual Concept Mode'}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-black font-math">
                {currentTable} × {activeStep} = {activeProduct}
              </span>
            </div>

            {/* Visual Dot Groups (Compact) */}
            <div className="space-y-1.5">
              <p className="text-[11px] text-slate-500 font-semibold">
                {activeStep} {t.groupsOf || 'groups of'} {currentTable}:
              </p>

              <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100 justify-center max-h-32 overflow-y-auto">
                {[...Array(activeStep)].map((_, gIndex) => (
                  <div 
                    key={gIndex}
                    className="p-1 rounded-lg bg-white border border-indigo-100 shadow-xs flex flex-wrap gap-1 items-center justify-center max-w-[100px]"
                  >
                    {[...Array(currentTable)].map((_, dIndex) => (
                      <span 
                        key={dIndex}
                        className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Repeated Addition Expression */}
              <div className="p-2 rounded-xl bg-indigo-50/70 border border-indigo-100 text-center space-y-0.5">
                <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                  {t.repeatedAddition || 'Repeated Addition'}
                </div>
                <div className="text-xs sm:text-sm font-black text-indigo-900 font-math truncate">
                  {[...Array(activeStep)].map(() => currentTable).join(' + ')} = {activeProduct}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Classroom Smart Board Full-Screen Presentation Overlay */}
      {isPresentationMode && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 md:p-10 overflow-hidden animate-in fade-in duration-200">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-2xl bg-indigo-600 text-white text-xl sm:text-2xl font-black font-math shadow-lg">
                {t.tableOf} {currentTable}
              </span>
              <button
                onClick={handleToggleAutoPlayNext}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 ${
                  autoPlayNextTable
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                    : 'bg-white/10 text-white/60 border-white/20'
                }`}
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Auto Next: {autoPlayNextTable ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Exit Presentation Mode */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsPresentationMode(false);
                setIsPlaying(false);
              }}
              className="px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-black text-xs sm:text-sm tracking-wide transition-all border border-white/20 flex items-center gap-2"
            >
              ✕ <span>{t.exitPresentation || 'Exit Presentation'}</span>
            </button>
          </div>

          {/* Central Mega Display with Beat-by-Beat Glow */}
          <div className="flex-1 flex flex-col items-center justify-center my-4 text-center space-y-5">
            
            {/* Auto Next Table Countdown Notification */}
            {nextTableTransition && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-between gap-4 max-w-xl w-full shadow-2xl animate-bounce">
                <div className="flex items-center gap-2 font-black text-base">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Table {currentTable} Complete! Starting Table {nextTableTransition.nextTable}...</span>
                </div>
                <button
                  onClick={handleImmediateNextTable}
                  className="px-3 py-1 rounded-xl bg-white text-emerald-900 font-black text-xs shadow-md"
                >
                  Start Now ▶
                </button>
              </div>
            )}

            <div className="w-full max-w-4xl p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-indigo-900/90 to-purple-950/95 border-2 border-indigo-400/50 shadow-2xl backdrop-blur-xl space-y-5">
              
              {/* Massive 3-Beat Highlighting Equation */}
              <div className="grid grid-cols-5 items-center gap-3 sm:gap-4 text-center select-none">
                
                {/* Beat 1 Table */}
                <div className={`p-3 sm:p-6 rounded-3xl border-2 transition-all duration-200 ${
                  activeBeat === 1
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-2xl scale-110 ring-8 ring-amber-300/40 animate-pulse font-black'
                    : 'bg-white/10 text-white border-white/20 font-bold'
                }`}>
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider block opacity-70 mb-0.5">1. Table</span>
                  <span className="text-4xl sm:text-6xl md:text-7xl font-math font-black">{currentTable}</span>
                </div>

                <div className="text-3xl sm:text-5xl font-black text-indigo-300">×</div>

                {/* Beat 2 Multiplier */}
                <div className={`p-3 sm:p-6 rounded-3xl border-2 transition-all duration-200 ${
                  activeBeat === 2
                    ? 'bg-purple-500 text-white border-purple-400 shadow-2xl scale-110 ring-8 ring-purple-300/40 animate-pulse font-black'
                    : 'bg-white/10 text-white border-white/20 font-bold'
                }`}>
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider block opacity-70 mb-0.5">2. Times</span>
                  <span className="text-4xl sm:text-6xl md:text-7xl font-math font-black">{activeStep}</span>
                </div>

                <div className="text-3xl sm:text-5xl font-black text-indigo-300">=</div>

                {/* Beat 3 Product */}
                <div className={`p-3 sm:p-6 rounded-3xl border-2 transition-all duration-200 ${
                  activeBeat === 3
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-2xl scale-110 ring-8 ring-emerald-300/40 animate-pulse font-black'
                    : 'bg-white/10 text-amber-300 border-white/20 font-bold'
                }`}>
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider block opacity-70 mb-0.5">3. Answer</span>
                  <span className="text-4xl sm:text-6xl md:text-7xl font-math font-black">{activeProduct}</span>
                </div>

              </div>

              {/* Visual Groups representation */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 max-h-28 overflow-y-auto">
                {[...Array(activeStep)].map((_, gi) => (
                  <div key={gi} className="p-1.5 rounded-xl bg-white/10 flex gap-1 items-center">
                    {[...Array(currentTable)].map((_, di) => (
                      <span key={di} className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-xs" />
                    ))}
                  </div>
                ))}
              </div>

            </div>

            {/* Sequence 1 to 10 Quick Select Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    sounds.playClick();
                    setActiveStep(s);
                    setActiveBeat(1);
                  }}
                  className={`w-9 sm:w-11 h-9 sm:h-11 rounded-xl font-bold font-math transition-all ${
                    activeStep === s
                      ? 'bg-amber-400 text-slate-900 scale-110 font-black shadow-lg ring-2 ring-amber-200'
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
          <div className="max-w-4xl mx-auto w-full flex flex-wrap items-center justify-between gap-3 bg-white/10 backdrop-blur-xl p-3 sm:p-5 rounded-3xl border border-white/20">
            
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handlePrevStep}
                disabled={activeStep <= 1 && currentTable <= 2}
                className="px-4 sm:px-6 py-3 rounded-2xl bg-white/20 hover:bg-white/30 disabled:opacity-30 text-white font-black text-base sm:text-lg flex items-center gap-2 transition-all"
              >
                <SkipBack className="w-5 h-5" />
                <span>{t.previous}</span>
              </button>

              {/* Play / Pause Toggle in Smart Board mode */}
              <button
                onClick={togglePlayPause}
                className={`px-8 sm:px-10 py-3 rounded-2xl font-black text-lg sm:text-xl flex items-center gap-2.5 shadow-xl transition-all active:scale-95 ${
                  isPlaying ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 ring-4 ring-amber-200' : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                <span>{isPlaying ? (t.pause || 'Pause') : (t.play || 'Start Rhythm')}</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={activeStep >= 10 && currentTable >= 20}
                className="px-4 sm:px-6 py-3 rounded-2xl bg-white/20 hover:bg-white/30 disabled:opacity-30 text-white font-black text-base sm:text-lg flex items-center gap-2 transition-all"
              >
                <span>{t.next}</span>
                <SkipForward className="w-5 h-5" />
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
                className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm flex items-center gap-2"
              >
                {rhythmAudioMode === 'silent' ? (
                  <>
                    <VolumeX className="w-4 h-4 text-emerald-400" />
                    <span>Recitation: Muted</span>
                  </>
                ) : rhythmAudioMode === 'speech' ? (
                  <>
                    <Volume2 className="w-4 h-4 text-indigo-300" />
                    <span>Recitation: Voice</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 text-purple-300" />
                    <span>Recitation: Metronome</span>
                  </>
                )}
              </button>

              <button
                onClick={handleRestart}
                className="p-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white"
                title={t.restart}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

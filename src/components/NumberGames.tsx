import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  RotateCcw, 
  Flame, 
  Timer, 
  ArrowLeftRight, 
  HelpCircle,
  MoveHorizontal,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { NumberGameType, AppSettings, UserProgress } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/audio';
import { updateGameResults } from '../utils/storage';
import { 
  INDIAN_PLACE_VALUES, 
  formatIndianNumber, 
  convertNumberToWords, 
  getNumberPlaceValueBreakdown 
} from '../utils/indianMath';

interface NumberGamesProps {
  settings: AppSettings;
  progress: UserProgress;
  setProgress: (p: UserProgress) => void;
  defaultGame?: NumberGameType;
}

export const NumberGames: React.FC<NumberGamesProps> = ({
  settings,
  progress,
  setProgress,
  defaultGame = 'identify-number'
}) => {
  const t = translations[settings.language];
  const isUrdu = settings.language === 'ur';

  const [activeGame, setActiveGame] = useState<NumberGameType>(defaultGame);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Common question state
  const [mcqPrompt, setMcqPrompt] = useState<string>('');
  const [mcqOptions, setMcqOptions] = useState<string[]>([]);
  const [mcqAnswer, setMcqAnswer] = useState<string>('');

  // Number builder state
  const [builderDigits, setBuilderDigits] = useState<number[]>([]);
  const [builderTarget, setBuilderTarget] = useState<'largest' | 'smallest'>('largest');
  const [userArrangement, setUserArrangement] = useState<number[]>([]);

  // Comparison state
  const [compNum1, setCompNum1] = useState<number>(0);
  const [compNum2, setCompNum2] = useState<number>(0);

  // Memory state
  const [memoryFlashNum, setMemoryFlashNum] = useState<number>(0);
  const [memoryCountdown, setMemoryCountdown] = useState<number>(3);
  const [isNumberHidden, setIsNumberHidden] = useState<boolean>(false);

  // Helper: Generate Identify Number Game
  const generateIdentifyQuestion = () => {
    const targets = [
      { words: '5 Lakh', val: 500000 },
      { words: '50 Lakh', val: 5000000 },
      { words: '1 Crore', val: 10000000 },
      { words: '25 Thousand', val: 25000 },
      { words: '7 Lakh Fifty Thousand', val: 750000 },
      { words: '12 Lakh Thirty Thousand', val: 1230000 },
      { words: '80 Lakh', val: 8000000 },
      { words: '3 Crore 50 Lakh', val: 35000000 }
    ];
    const item = targets[Math.floor(Math.random() * targets.length)];
    const correctStr = formatIndianNumber(item.val);

    const distractorSet = new Set<string>([correctStr]);
    while (distractorSet.size < 4) {
      const mult = [0.1, 10, 0.5, 2, 0.01][Math.floor(Math.random() * 5)];
      const fake = Math.max(1000, Math.floor(item.val * mult));
      distractorSet.add(formatIndianNumber(fake));
    }

    setMcqPrompt(
      settings.language === 'ur'
        ? `کون سا عدد ${item.words} کو ظاہر کرتا ہے؟`
        : settings.language === 'hi'
        ? `कौन सी संख्या ${item.words} को दर्शाती है?`
        : settings.language === 'mr'
        ? `कोणती संख्या ${item.words} दर्शवते?`
        : `Which number represents ${item.words}?`
    );
    setMcqAnswer(correctStr);
    setMcqOptions(Array.from(distractorSet).sort(() => Math.random() - 0.5));
    setFeedback(null);
  };

  // Helper: Generate Place Value Question
  const generatePlaceValueQuestion = () => {
    const num = Math.floor(100000 + Math.random() * 9000000);
    const breakdown = getNumberPlaceValueBreakdown(num, settings.language);
    const targetDigitObj = breakdown[Math.floor(Math.random() * breakdown.length)];

    const correctStr = formatIndianNumber(targetDigitObj.placeValue);
    const distractorSet = new Set<string>([correctStr]);
    distractorSet.add(String(targetDigitObj.digit)); // face value distractor
    distractorSet.add(formatIndianNumber(targetDigitObj.digit * 10));
    distractorSet.add(formatIndianNumber(targetDigitObj.multiplier));

    while (distractorSet.size < 4) {
      distractorSet.add(formatIndianNumber(targetDigitObj.digit * Math.pow(10, Math.floor(Math.random() * 6))));
    }

    setMcqPrompt(
      settings.language === 'ur'
        ? `${formatIndianNumber(num)} میں ہندسہ ${targetDigitObj.digit} کی مقامی قیمت کیا ہے؟`
        : settings.language === 'hi'
        ? `${formatIndianNumber(num)} में अंक ${targetDigitObj.digit} का स्थानीय मान क्या है?`
        : settings.language === 'mr'
        ? `${formatIndianNumber(num)} मध्ये ${targetDigitObj.digit} या अंकाची स्थानिक किंमत काय आहे?`
        : `What is the Place Value of digit ${targetDigitObj.digit} in ${formatIndianNumber(num)}?`
    );
    setMcqAnswer(correctStr);
    setMcqOptions(Array.from(distractorSet).sort(() => Math.random() - 0.5));
    setFeedback(null);
  };

  // Helper: Generate Number Builder
  const generateNumberBuilder = () => {
    const digits: number[] = [];
    while (digits.length < 5) {
      const d = Math.floor(Math.random() * 9) + 1;
      if (!digits.includes(d)) digits.push(d);
    }
    const target = Math.random() > 0.5 ? 'largest' : 'smallest';
    setBuilderDigits(digits.sort(() => Math.random() - 0.5));
    setBuilderTarget(target);
    setUserArrangement([]);
    setFeedback(null);
  };

  // Helper: Generate Comparison Question
  const generateComparisonQuestion = () => {
    const base = Math.floor(100000 + Math.random() * 9000000);
    const delta = (Math.floor(Math.random() * 5) - 2) * 1000;
    const n1 = base;
    const n2 = Math.max(10000, base + delta);

    setCompNum1(n1);
    setCompNum2(n2);
    setFeedback(null);
  };

  // Helper: Generate Sequence Question
  const generateSequenceQuestion = () => {
    const step = [1000, 5000, 10000, 50000, 100000, 500000][Math.floor(Math.random() * 6)];
    const start = Math.floor(1 + Math.random() * 5) * step;
    const s1 = start;
    const s2 = start + step;
    const s3 = start + step * 2;
    const correct = start + step * 3;

    const distractorSet = new Set<string>([formatIndianNumber(correct)]);
    distractorSet.add(formatIndianNumber(correct + step));
    distractorSet.add(formatIndianNumber(correct - step / 2));
    distractorSet.add(formatIndianNumber(correct + step * 2));

    setMcqPrompt(`${formatIndianNumber(s1)}  →  ${formatIndianNumber(s2)}  →  ${formatIndianNumber(s3)}  →  ?`);
    setMcqAnswer(formatIndianNumber(correct));
    setMcqOptions(Array.from(distractorSet).sort(() => Math.random() - 0.5));
    setFeedback(null);
  };

  // Helper: Generate Memory Question
  const generateMemoryQuestion = () => {
    const num = Math.floor(100000 + Math.random() * 9000000);
    setMemoryFlashNum(num);
    setIsNumberHidden(false);
    setMemoryCountdown(3);

    const distractorSet = new Set<string>([formatIndianNumber(num)]);
    while (distractorSet.size < 4) {
      const swapped = num + (Math.floor(Math.random() * 9) + 1) * 100 * (Math.random() > 0.5 ? 1 : -1);
      distractorSet.add(formatIndianNumber(swapped));
    }
    setMcqOptions(Array.from(distractorSet).sort(() => Math.random() - 0.5));
    setMcqAnswer(formatIndianNumber(num));
    setFeedback(null);
  };

  // Helper: Grand Math Challenge (mix of all questions)
  const generateChallengeQuestion = () => {
    const r = Math.random();
    if (r < 0.25) generateIdentifyQuestion();
    else if (r < 0.5) generatePlaceValueQuestion();
    else if (r < 0.75) generateSequenceQuestion();
    else generateComparisonQuestion();
  };

  // Dispatch game generation
  const startActiveGame = () => {
    setQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    setFeedback(null);

    if (activeGame === 'identify-number') generateIdentifyQuestion();
    else if (activeGame === 'place-value') generatePlaceValueQuestion();
    else if (activeGame === 'number-builder') generateNumberBuilder();
    else if (activeGame === 'comparison') generateComparisonQuestion();
    else if (activeGame === 'sequence') generateSequenceQuestion();
    else if (activeGame === 'number-memory') generateMemoryQuestion();
    else if (activeGame === 'number-challenge') generateChallengeQuestion();
  };

  useEffect(() => {
    startActiveGame();
  }, [activeGame]);

  // Memory countdown timer
  useEffect(() => {
    if (activeGame === 'number-memory' && !isNumberHidden && !isGameOver) {
      if (memoryCountdown > 0) {
        const timer = setTimeout(() => setMemoryCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setIsNumberHidden(true);
      }
    }
  }, [activeGame, memoryCountdown, isNumberHidden, isGameOver]);

  // Handle MCQ Selection
  const handleMCQSelect = (chosen: string) => {
    if (feedback) return;
    const isCorrect = chosen === mcqAnswer;
    const updated = updateGameResults(isCorrect);
    setProgress(updated);

    if (isCorrect) {
      sounds.playCorrect();
      setFeedback('correct');
      setScore(s => s + 15 + streak * 3);
      setStreak(st => st + 1);
    } else {
      sounds.playWrong();
      setFeedback('wrong');
      setStreak(0);
    }

    setTimeout(() => {
      if (questionIndex >= 9) {
        setIsGameOver(true);
        sounds.playLevelComplete();
        confetti();
      } else {
        setQuestionIndex(i => i + 1);
        if (activeGame === 'identify-number') generateIdentifyQuestion();
        else if (activeGame === 'place-value') generatePlaceValueQuestion();
        else if (activeGame === 'sequence') generateSequenceQuestion();
        else if (activeGame === 'number-memory') generateMemoryQuestion();
        else if (activeGame === 'number-challenge') generateChallengeQuestion();
      }
    }, 800);
  };

  // Handle Comparison Selection (>, <, =)
  const handleComparisonSelect = (symbol: '>' | '<' | '=') => {
    if (feedback) return;
    const isCorrect = 
      (symbol === '>' && compNum1 > compNum2) ||
      (symbol === '<' && compNum1 < compNum2) ||
      (symbol === '=' && compNum1 === compNum2);

    const updated = updateGameResults(isCorrect);
    setProgress(updated);

    if (isCorrect) {
      sounds.playCorrect();
      setFeedback('correct');
      setScore(s => s + 15 + streak * 3);
      setStreak(st => st + 1);
    } else {
      sounds.playWrong();
      setFeedback('wrong');
      setStreak(0);
    }

    setTimeout(() => {
      if (questionIndex >= 9) {
        setIsGameOver(true);
        sounds.playLevelComplete();
        confetti();
      } else {
        setQuestionIndex(i => i + 1);
        if (activeGame === 'number-challenge') generateChallengeQuestion();
        else generateComparisonQuestion();
      }
    }, 800);
  };

  // Handle Number Builder Digit Click
  const handleBuilderDigitClick = (digit: number) => {
    sounds.playClick();
    if (userArrangement.includes(digit)) {
      setUserArrangement(prev => prev.filter(d => d !== digit));
    } else {
      setUserArrangement(prev => [...prev, digit]);
    }
  };

  // Check Number Builder Result
  const handleBuilderSubmit = () => {
    if (userArrangement.length !== builderDigits.length) return;

    const userNumber = parseInt(userArrangement.join(''), 10);
    const sortedDigits = [...builderDigits].sort((a, b) => builderTarget === 'largest' ? b - a : a - b);
    const correctNumber = parseInt(sortedDigits.join(''), 10);

    const isCorrect = userNumber === correctNumber;
    const updated = updateGameResults(isCorrect);
    setProgress(updated);

    if (isCorrect) {
      sounds.playCorrect();
      setFeedback('correct');
      setScore(s => s + 25);
      setStreak(st => st + 1);
    } else {
      sounds.playWrong();
      setFeedback('wrong');
      setStreak(0);
    }

    setTimeout(() => {
      if (questionIndex >= 4) {
        setIsGameOver(true);
        sounds.playLevelComplete();
        confetti();
      } else {
        setQuestionIndex(i => i + 1);
        generateNumberBuilder();
      }
    }, 900);
  };

  const navGames = [
    { id: 'identify-number' as NumberGameType, title: t.gameIdentifyNumber, icon: '🔢' },
    { id: 'place-value' as NumberGameType, title: t.gamePlaceValue, icon: '🏷️' },
    { id: 'number-builder' as NumberGameType, title: t.gameNumberBuilder, icon: '🏗️' },
    { id: 'comparison' as NumberGameType, title: t.gameComparison, icon: '⚖️' },
    { id: 'sequence' as NumberGameType, title: t.gameSequence, icon: '➡️' },
    { id: 'number-memory' as NumberGameType, title: t.gameNumberMemory, icon: '🧠' },
    { id: 'number-challenge' as NumberGameType, title: t.gameChallenge, icon: '🏆' }
  ];

  return (
    <div className={`max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 ${isUrdu ? 'font-urdu' : 'font-devanagari'}`}>
      
      {/* Game Selector Strip */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            {t.numberGamesHeading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {t.numberGamesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {navGames.map((g) => {
            const isActive = activeGame === g.id;
            return (
              <button
                key={g.id}
                id={`tab-num-game-${g.id}`}
                onClick={() => {
                  sounds.playClick();
                  setActiveGame(g.id);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl text-center transition-all border ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-103'
                    : 'bg-slate-50 text-slate-700 border-slate-200/70 hover:bg-slate-100'
                }`}
              >
                <span className="text-xl mb-1">{g.icon}</span>
                <span className="text-xs font-bold leading-tight line-clamp-1">
                  {g.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm min-h-[480px] flex flex-col justify-between">
        
        {/* Game Stats Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs sm:text-sm">
              {t.score}: {score}
            </span>
            {streak > 1 && (
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-600 font-bold text-xs">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span>{streak}x Streak</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">
              {t.question} {Math.min(10, questionIndex + 1)} / {activeGame === 'number-builder' ? 5 : 10}
            </span>
            
            <button
              onClick={() => { sounds.playClick(); startActiveGame(); }}
              title={t.restart}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Win / Complete Screen */}
        {isGameOver ? (
          <div className="py-12 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg">
              <Trophy className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-4xl font-black text-slate-800">
                {t.gameOver}
              </h3>
              <p className="text-base font-bold text-emerald-600">
                {t.finalScore}: {score} Points!
              </p>
            </div>
            <button
              onClick={startActiveGame}
              className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              {t.playAgain}
            </button>
          </div>
        ) : (
          <div className="py-6 flex-1 flex flex-col justify-center">

            {/* Standard MCQ Questions (Identify Number, Place Value, Sequence, Challenge) */}
            {(activeGame === 'identify-number' || activeGame === 'place-value' || activeGame === 'sequence' || (activeGame === 'number-challenge' && compNum1 === 0)) && (
              <div className="max-w-2xl mx-auto w-full space-y-8 text-center">
                
                <div className="p-8 rounded-3xl bg-emerald-50/70 border border-emerald-100 text-slate-900">
                  <h3 className="text-2xl sm:text-3xl font-black leading-snug">
                    {mcqPrompt}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {mcqOptions.map((opt, idx) => {
                    const isSelectedAndCorrect = feedback === 'correct' && opt === mcqAnswer;
                    const isSelectedAndWrong = feedback === 'wrong' && opt !== mcqAnswer;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleMCQSelect(opt)}
                        disabled={!!feedback}
                        className={`p-6 sm:p-8 rounded-3xl text-xl sm:text-3xl font-black font-math transition-all shadow-sm active:scale-95 border-2 ${
                          isSelectedAndCorrect
                            ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-emerald-200 shadow-lg'
                            : isSelectedAndWrong
                            ? 'bg-rose-50 text-rose-700 border-rose-300'
                            : 'bg-slate-50 hover:bg-emerald-600 hover:text-white border-slate-200 hover:border-emerald-600 hover:shadow-md'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Comparison Game */}
            {(activeGame === 'comparison' || (activeGame === 'number-challenge' && compNum1 > 0)) && (
              <div className="max-w-xl mx-auto w-full text-center space-y-8">
                <p className="text-xs sm:text-sm font-bold text-slate-500">
                  {t.whichIsGreater}
                </p>

                <div className="flex items-center justify-center gap-4 sm:gap-8 p-8 rounded-3xl bg-slate-50 border border-slate-200 text-2xl sm:text-4xl font-black font-math text-slate-900">
                  <span>{formatIndianNumber(compNum1)}</span>
                  <span className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl">?</span>
                  <span>{formatIndianNumber(compNum2)}</span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {(['>', '<', '='] as ('>' | '<' | '=')[]).map((sym) => (
                    <button
                      key={sym}
                      onClick={() => handleComparisonSelect(sym)}
                      className="p-6 rounded-3xl bg-slate-50 hover:bg-indigo-600 hover:text-white border-2 border-slate-200 hover:border-indigo-600 font-math font-black text-4xl sm:text-5xl shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Number Builder Game (Interactive Tap / Reorder) */}
            {activeGame === 'number-builder' && (
              <div className="max-w-xl mx-auto w-full space-y-8 text-center">
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-purple-900 font-bold text-sm sm:text-base">
                  {builderTarget === 'largest' ? t.makeLargest : t.makeSmallest}
                </div>

                {/* Available Digit Cards */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400">Available Digits (Tap to place):</span>
                  <div className="flex justify-center gap-3">
                    {builderDigits.map((d, i) => {
                      const isUsed = userArrangement.includes(d);
                      return (
                        <button
                          key={i}
                          onClick={() => handleBuilderDigitClick(d)}
                          disabled={isUsed}
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl font-math font-black text-2xl sm:text-3xl transition-all border-2 ${
                            isUsed
                              ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                              : 'bg-white text-slate-800 border-indigo-200 hover:border-indigo-500 hover:scale-105 shadow-sm'
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Formed Number Slots */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400">Your Number:</span>
                  <div className="flex justify-center gap-2 p-4 bg-slate-50 rounded-3xl border border-slate-200 min-h-[80px] items-center">
                    {userArrangement.length === 0 ? (
                      <span className="text-sm font-semibold text-slate-400">Tap digit cards above in order</span>
                    ) : (
                      userArrangement.map((d, i) => (
                        <button
                          key={i}
                          onClick={() => handleBuilderDigitClick(d)}
                          className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-math font-black text-2xl flex items-center justify-center shadow-md animate-in zoom-in-50"
                        >
                          {d}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setUserArrangement([])}
                    className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleBuilderSubmit}
                    disabled={userArrangement.length !== builderDigits.length}
                    className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black text-sm shadow-md"
                  >
                    Check Answer
                  </button>
                </div>
              </div>
            )}

            {/* Number Memory Flash Game */}
            {activeGame === 'number-memory' && (
              <div className="max-w-md mx-auto w-full space-y-8 text-center">
                {!isNumberHidden ? (
                  <div className="p-8 rounded-3xl bg-amber-50 border border-amber-200 space-y-4 animate-in fade-in">
                    <span className="text-xs font-bold uppercase text-amber-700">
                      {t.memorizeIn} {memoryCountdown} {t.seconds}
                    </span>
                    <div className="text-4xl sm:text-5xl font-black font-math text-slate-900 tracking-wider">
                      {formatIndianNumber(memoryFlashNum)}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h4 className="text-xl font-black text-slate-800">
                      {t.whatsTheNumber}
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      {mcqOptions.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleMCQSelect(opt)}
                          className="p-6 rounded-2xl bg-slate-50 hover:bg-indigo-600 hover:text-white border-2 border-slate-200 font-math font-black text-xl sm:text-2xl transition-all"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};

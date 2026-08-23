import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Trophy, 
  RotateCcw, 
  Timer, 
  Flame, 
  Zap, 
  HelpCircle,
  Award,
  ChevronRight,
  RefreshCw,
  Shuffle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TableGameType, Difficulty, AppSettings, UserProgress } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/audio';
import { updateGameResults } from '../utils/storage';

interface TablesGamesProps {
  settings: AppSettings;
  progress: UserProgress;
  setProgress: (p: UserProgress) => void;
}

export const TablesGames: React.FC<TablesGamesProps> = ({
  settings,
  progress,
  setProgress
}) => {
  const t = translations[settings.language];
  const isUrdu = settings.language === 'ur';

  const [activeGame, setActiveGame] = useState<TableGameType>('find-answer');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [selectedTables, setSelectedTables] = useState<number[]>([2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // General game state
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Game 1 & 6: MCQ Question state
  const [currentQuestion, setCurrentQuestion] = useState<{
    table: number;
    multiplier: number;
    answer: number;
    options: number[];
    missingType?: 'product' | 'factor';
  } | null>(null);

  // Game 3: Falling Numbers state
  const [fallingBubbles, setFallingBubbles] = useState<{ id: number; value: number; x: number; y: number; speed: number }[]>([]);
  const [fallingTarget, setFallingTarget] = useState<{ table: number; multiplier: number; answer: number } | null>(null);
  const fallingAnimRef = useRef<number | null>(null);

  // Game 4: Match pairs state
  const [pairsLeft, setPairsLeft] = useState<{ id: number; text: string; answer: number; matched: boolean }[]>([]);
  const [pairsRight, setPairsRight] = useState<{ id: number; value: number; matched: boolean }[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);

  // Game 5: Speed Race
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const timerRef = useRef<any>(null);

  // Game 7: True/False state
  const [tfQuestion, setTfQuestion] = useState<{ table: number; multiplier: number; displayedProduct: number; isTrue: boolean } | null>(null);

  // Game 8: Memory Cards state
  const [memoryCards, setMemoryCards] = useState<{ id: number; label: string; matchId: number; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<number[]>([]);

  // Get active pool of tables based on difficulty
  const getTablePool = (): number[] => {
    if (difficulty === 'easy') return [selectedTables[0] || 2];
    if (difficulty === 'hard') return [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    return selectedTables.length > 0 ? selectedTables : [2, 3, 4, 5];
  };

  // Helper: Generate Random Question
  const generateMCQQuestion = (type: 'find-answer' | 'missing-number') => {
    const pool = getTablePool();
    const table = pool[Math.floor(Math.random() * pool.length)];
    const multiplier = Math.floor(Math.random() * 10) + 1;
    const answer = type === 'missing-number' ? multiplier : table * multiplier;

    // Generate 3 plausible distractors
    const optionsSet = new Set<number>([answer]);
    while (optionsSet.size < 4) {
      if (type === 'missing-number') {
        const delta = Math.floor(Math.random() * 9) + 1;
        optionsSet.add(delta);
      } else {
        const wrongMult = Math.floor(Math.random() * 10) + 1;
        const wrongTable = pool[Math.floor(Math.random() * pool.length)];
        const distractor = wrongTable * wrongMult;
        if (distractor !== answer && distractor > 0) {
          optionsSet.add(distractor);
        } else {
          optionsSet.add(answer + (Math.random() > 0.5 ? table : -table || 2));
        }
      }
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);
    setCurrentQuestion({ table, multiplier, answer, options, missingType: type === 'missing-number' ? 'factor' : 'product' });
    setFeedback(null);
  };

  // Helper: Generate Falling Numbers Question
  const generateFallingQuestion = () => {
    const pool = getTablePool();
    const table = pool[Math.floor(Math.random() * pool.length)];
    const multiplier = Math.floor(Math.random() * 10) + 1;
    const answer = table * multiplier;

    setFallingTarget({ table, multiplier, answer });

    // Create 4 falling bubbles across horizontal positions
    const bubbles = [
      { id: 1, value: answer, x: 20 + Math.random() * 15, y: 0, speed: 0.45 + Math.random() * 0.2 },
      { id: 2, value: answer + table, x: 40 + Math.random() * 15, y: -15, speed: 0.4 + Math.random() * 0.2 },
      { id: 3, value: Math.max(2, answer - table), x: 60 + Math.random() * 15, y: -30, speed: 0.5 + Math.random() * 0.2 },
      { id: 4, value: (table + 1) * multiplier, x: 75 + Math.random() * 15, y: -45, speed: 0.45 + Math.random() * 0.2 }
    ].sort(() => Math.random() - 0.5);

    setFallingBubbles(bubbles);
  };

  // Helper: Generate Matching Pairs
  const generateMatchingPairs = () => {
    const pool = getTablePool();
    const selectedPairs: { table: number; mult: number }[] = [];
    while (selectedPairs.length < 4) {
      const table = pool[Math.floor(Math.random() * pool.length)];
      const mult = Math.floor(Math.random() * 10) + 1;
      if (!selectedPairs.some(p => p.table === table && p.mult === mult)) {
        selectedPairs.push({ table, mult });
      }
    }

    const left = selectedPairs.map((p, index) => ({
      id: index + 1,
      text: `${p.table} × ${p.mult}`,
      answer: p.table * p.mult,
      matched: false
    }));

    const right = selectedPairs.map((p, index) => ({
      id: index + 1,
      value: p.table * p.mult,
      matched: false
    })).sort(() => Math.random() - 0.5);

    setPairsLeft(left);
    setPairsRight(right);
    setSelectedLeft(null);
  };

  // Helper: Generate True/False Question
  const generateTFQuestion = () => {
    const pool = getTablePool();
    const table = pool[Math.floor(Math.random() * pool.length)];
    const multiplier = Math.floor(Math.random() * 10) + 1;
    const correctProd = table * multiplier;
    const isTrue = Math.random() > 0.5;

    let displayedProduct = correctProd;
    if (!isTrue) {
      const delta = (Math.floor(Math.random() * 3) + 1) * (Math.random() > 0.5 ? 1 : -1);
      displayedProduct = Math.max(2, correctProd + delta * table);
      if (displayedProduct === correctProd) displayedProduct += 2;
    }

    setTfQuestion({ table, multiplier, displayedProduct, isTrue });
    setFeedback(null);
  };

  // Helper: Generate Memory Cards (6 pairs = 12 cards)
  const generateMemoryCards = () => {
    const pool = getTablePool();
    const pairs: { table: number; mult: number }[] = [];
    while (pairs.length < 4) {
      const table = pool[Math.floor(Math.random() * pool.length)];
      const mult = Math.floor(Math.random() * 9) + 2;
      if (!pairs.some(p => p.table === table && p.mult === mult)) {
        pairs.push({ table, mult });
      }
    }

    const cards: { id: number; label: string; matchId: number; flipped: boolean; matched: boolean }[] = [];
    pairs.forEach((p, idx) => {
      const matchId = idx + 1;
      cards.push({ id: matchId * 2 - 1, label: `${p.table} × ${p.mult}`, matchId, flipped: false, matched: false });
      cards.push({ id: matchId * 2, label: `${p.table * p.mult}`, matchId, flipped: false, matched: false });
    });

    setMemoryCards(cards.sort(() => Math.random() - 0.5));
    setFlippedCardIds([]);
  };

  // Start / Restart Active Game
  const startActiveGame = () => {
    setQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    setFeedback(null);

    if (activeGame === 'find-answer' || activeGame === 'complete-table') {
      generateMCQQuestion('find-answer');
    } else if (activeGame === 'missing-number') {
      generateMCQQuestion('missing-number');
    } else if (activeGame === 'falling-numbers') {
      generateFallingQuestion();
    } else if (activeGame === 'match-pair') {
      generateMatchingPairs();
    } else if (activeGame === 'true-false') {
      generateTFQuestion();
    } else if (activeGame === 'memory-game') {
      generateMemoryCards();
    } else if (activeGame === 'table-race') {
      setTimeLeft(30);
      generateMCQQuestion('find-answer');
    }
  };

  useEffect(() => {
    startActiveGame();
  }, [activeGame, difficulty]);

  // Speed Race Timer
  useEffect(() => {
    if (activeGame === 'table-race' && !isGameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsGameOver(true);
            sounds.playLevelComplete();
            confetti();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeGame, isGameOver]);

  // Falling Numbers animation loop
  useEffect(() => {
    if (activeGame === 'falling-numbers' && !isGameOver) {
      const interval = setInterval(() => {
        setFallingBubbles((prev) => {
          let hasReachedBottom = false;
          const updated = prev.map((b) => {
            const nextY = b.y + b.speed * 1.5;
            if (nextY > 90 && b.value === fallingTarget?.answer) {
              hasReachedBottom = true;
            }
            return { ...b, y: nextY };
          });

          if (hasReachedBottom) {
            sounds.playWrong();
            setStreak(0);
            setTimeout(() => generateFallingQuestion(), 400);
          }

          return updated;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [activeGame, isGameOver, fallingTarget]);

  // Handle MCQ Answer Click
  const handleMCQAnswer = (selectedVal: number) => {
    if (!currentQuestion || feedback) return;

    const isCorrect = selectedVal === currentQuestion.answer;
    const updated = updateGameResults(isCorrect, currentQuestion.table);
    setProgress(updated);

    if (isCorrect) {
      sounds.playCorrect();
      setFeedback('correct');
      setScore(s => s + 10 + streak * 2);
      setStreak(st => st + 1);
    } else {
      sounds.playWrong();
      setFeedback('wrong');
      setStreak(0);
    }

    setTimeout(() => {
      if (activeGame === 'table-race') {
        generateMCQQuestion('find-answer');
      } else {
        if (questionIndex >= 9) {
          setIsGameOver(true);
          sounds.playLevelComplete();
          confetti();
        } else {
          setQuestionIndex(i => i + 1);
          generateMCQQuestion(activeGame === 'missing-number' ? 'missing-number' : 'find-answer');
        }
      }
    }, 800);
  };

  // Handle True / False Click
  const handleTFAnswer = (userChoice: boolean) => {
    if (!tfQuestion || feedback) return;

    const isCorrect = userChoice === tfQuestion.isTrue;
    const updated = updateGameResults(isCorrect, tfQuestion.table);
    setProgress(updated);

    if (isCorrect) {
      sounds.playCorrect();
      setFeedback('correct');
      setScore(s => s + 10 + streak * 2);
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
        generateTFQuestion();
      }
    }, 800);
  };

  // Handle Falling Number Click
  const handleFallingBubbleClick = (bubbleValue: number) => {
    if (!fallingTarget) return;

    const isCorrect = bubbleValue === fallingTarget.answer;
    const updated = updateGameResults(isCorrect, fallingTarget.table);
    setProgress(updated);

    if (isCorrect) {
      sounds.playCorrect();
      setScore(s => s + 15);
      setStreak(st => st + 1);
      confetti({ particleCount: 30, spread: 50 });
      if (questionIndex >= 9) {
        setIsGameOver(true);
        sounds.playLevelComplete();
      } else {
        setQuestionIndex(i => i + 1);
        generateFallingQuestion();
      }
    } else {
      sounds.playWrong();
      setStreak(0);
    }
  };

  // Handle Match Pair Logic
  const handlePairLeftClick = (id: number) => {
    sounds.playClick();
    setSelectedLeft(id);
  };

  const handlePairRightClick = (item: { id: number; value: number }) => {
    if (!selectedLeft) return;
    const leftItem = pairsLeft.find(p => p.id === selectedLeft);
    if (!leftItem) return;

    const isMatch = leftItem.answer === item.value;
    const updated = updateGameResults(isMatch);
    setProgress(updated);

    if (isMatch) {
      sounds.playCorrect();
      setScore(s => s + 20);
      setPairsLeft(prev => prev.map(p => p.id === selectedLeft ? { ...p, matched: true } : p));
      setPairsRight(prev => prev.map(p => p.id === item.id ? { ...p, matched: true } : p));
      setSelectedLeft(null);

      // Check if all matched
      setTimeout(() => {
        const remaining = pairsLeft.filter(p => p.id !== selectedLeft && !p.matched).length;
        if (remaining === 0) {
          sounds.playLevelComplete();
          confetti();
          setIsGameOver(true);
        }
      }, 300);
    } else {
      sounds.playWrong();
      setSelectedLeft(null);
    }
  };

  // Handle Memory Card Flip Logic
  const handleMemoryCardClick = (cardId: number) => {
    const card = memoryCards.find(c => c.id === cardId);
    if (!card || card.flipped || card.matched || flippedCardIds.length >= 2) return;

    sounds.playClick();
    const newFlipped = [...flippedCardIds, cardId];
    setFlippedCardIds(newFlipped);
    setMemoryCards(prev => prev.map(c => c.id === cardId ? { ...c, flipped: true } : c));

    if (newFlipped.length === 2) {
      const card1 = memoryCards.find(c => c.id === newFlipped[0]);
      const card2 = card;

      if (card1 && card1.matchId === card2.matchId) {
        // Matched pair!
        sounds.playCorrect();
        setScore(s => s + 25);
        setTimeout(() => {
          setMemoryCards(prev => prev.map(c => (c.id === card1.id || c.id === card2.id) ? { ...c, matched: true } : c));
          setFlippedCardIds([]);

          const allMatched = memoryCards.filter(c => !c.matched && c.id !== card1.id && c.id !== card2.id).length === 0;
          if (allMatched) {
            sounds.playLevelComplete();
            confetti();
            setIsGameOver(true);
          }
        }, 500);
      } else {
        // Not a match
        sounds.playWrong();
        setTimeout(() => {
          setMemoryCards(prev => prev.map(c => (c.id === newFlipped[0] || c.id === newFlipped[1]) ? { ...c, flipped: false } : c));
          setFlippedCardIds([]);
        }, 1000);
      }
    }
  };

  const gameNav = [
    { id: 'find-answer' as TableGameType, title: t.gameFindAnswer, icon: '🎯' },
    { id: 'complete-table' as TableGameType, title: t.gameCompleteTable, icon: '📝' },
    { id: 'falling-numbers' as TableGameType, title: t.gameFallingNumbers, icon: '🎈' },
    { id: 'match-pair' as TableGameType, title: t.gameMatchPair, icon: '🔗' },
    { id: 'table-race' as TableGameType, title: t.gameTableRace, icon: '⏱️' },
    { id: 'missing-number' as TableGameType, title: t.gameMissingNumber, icon: '❓' },
    { id: 'true-false' as TableGameType, title: t.gameTrueFalse, icon: '⚖️' },
    { id: 'memory-game' as TableGameType, title: t.gameMemory, icon: '🃏' }
  ];

  return (
    <div className={`max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 ${isUrdu ? 'font-urdu' : 'font-devanagari'}`}>
      
      {/* Game Selector Tabs */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              {t.tableGamesHeading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {t.tableGamesSubtitle}
            </p>
          </div>

          {/* Difficulty Pill Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                id={`diff-btn-${diff}`}
                onClick={() => {
                  sounds.playClick();
                  setDifficulty(diff);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  difficulty === diff
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {diff === 'easy' ? t.diffEasy : diff === 'medium' ? t.diffMedium : t.diffHard}
              </button>
            ))}
          </div>
        </div>

        {/* 8 Game Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {gameNav.map((g) => {
            const isActive = activeGame === g.id;
            return (
              <button
                key={g.id}
                id={`tab-game-${g.id}`}
                onClick={() => {
                  sounds.playClick();
                  setActiveGame(g.id);
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl text-center transition-all border ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-103'
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
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm relative min-h-[480px] flex flex-col justify-between">
        
        {/* Game Top Score & Stats Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs sm:text-sm">
              {t.score}: {score}
            </span>
            {streak > 1 && (
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-600 font-bold text-xs animate-bounce">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span>{streak}x Streak</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {activeGame === 'table-race' ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 font-black text-sm">
                <Timer className="w-4 h-4" />
                <span>{timeLeft}s</span>
              </div>
            ) : (
              <span className="text-xs font-bold text-slate-400">
                {t.question} {Math.min(10, questionIndex + 1)} / 10
              </span>
            )}
            
            <button
              onClick={() => { sounds.playClick(); startActiveGame(); }}
              title={t.restart}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Game Completed Win Screen */}
        {isGameOver ? (
          <div className="py-12 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-lg">
              <Trophy className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-4xl font-black text-slate-800">
                {t.gameOver}
              </h3>
              <p className="text-base font-bold text-indigo-600">
                {t.finalScore}: {score} Points!
              </p>
            </div>
            <button
              onClick={startActiveGame}
              className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              {t.playAgain}
            </button>
          </div>
        ) : (
          <div className="py-6 flex-1 flex flex-col justify-center">

            {/* Game 1 & 2 & 6: MCQ Question Formats */}
            {(activeGame === 'find-answer' || activeGame === 'complete-table' || activeGame === 'missing-number' || activeGame === 'table-race') && currentQuestion && (
              <div className="max-w-2xl mx-auto w-full space-y-8 text-center">
                
                {/* Math Prompt Display */}
                <div className="p-8 rounded-3xl bg-indigo-50/70 border border-indigo-100 text-slate-900 font-math">
                  {activeGame === 'missing-number' ? (
                    <div className="text-4xl sm:text-6xl font-black flex items-center justify-center gap-3">
                      <span>{currentQuestion.table}</span>
                      <span className="text-indigo-400">×</span>
                      <span className="w-14 h-14 rounded-2xl bg-white border-2 border-indigo-300 text-indigo-600 inline-flex items-center justify-center">?</span>
                      <span className="text-indigo-400">=</span>
                      <span className="text-amber-600">{currentQuestion.table * currentQuestion.multiplier}</span>
                    </div>
                  ) : activeGame === 'complete-table' ? (
                    <div className="text-3xl sm:text-5xl font-black flex items-center justify-center gap-3">
                      <span>{currentQuestion.table}</span>
                      <span className="text-indigo-400">×</span>
                      <span>{currentQuestion.multiplier}</span>
                      <span className="text-indigo-400">=</span>
                      <span className="w-20 h-14 rounded-2xl bg-white border-2 border-dashed border-indigo-300 text-indigo-600 inline-flex items-center justify-center">?</span>
                    </div>
                  ) : (
                    <div className="text-4xl sm:text-6xl font-black flex items-center justify-center gap-4">
                      <span>{currentQuestion.table}</span>
                      <span className="text-indigo-400">×</span>
                      <span>{currentQuestion.multiplier}</span>
                      <span className="text-indigo-400">=</span>
                      <span className="text-indigo-600">?</span>
                    </div>
                  )}
                </div>

                {/* 4 Option Buttons (Extra large for Smart Board touch targets) */}
                <div className="grid grid-cols-2 gap-4">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelectedAndCorrect = feedback === 'correct' && opt === currentQuestion.answer;
                    const isSelectedAndWrong = feedback === 'wrong' && opt !== currentQuestion.answer;

                    return (
                      <button
                        key={idx}
                        id={`game-opt-${opt}`}
                        onClick={() => handleMCQAnswer(opt)}
                        disabled={!!feedback}
                        className={`p-6 sm:p-8 rounded-3xl text-2xl sm:text-4xl font-black font-math transition-all shadow-sm active:scale-95 border-2 ${
                          isSelectedAndCorrect
                            ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-emerald-200 shadow-lg'
                            : isSelectedAndWrong
                            ? 'bg-rose-50 text-rose-700 border-rose-300'
                            : 'bg-slate-50 hover:bg-indigo-600 hover:text-white border-slate-200/80 hover:border-indigo-600 hover:shadow-md'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Indicator */}
                {feedback && (
                  <div className={`text-lg font-black ${feedback === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {feedback === 'correct' ? t.excellent : t.tryAgain}
                  </div>
                )}
              </div>
            )}

            {/* Game 3: Falling Numbers Arcade */}
            {activeGame === 'falling-numbers' && fallingTarget && (
              <div className="space-y-6">
                <div className="text-center p-4 bg-indigo-50 rounded-2xl border border-indigo-100 max-w-md mx-auto">
                  <span className="text-xs font-bold text-slate-500 uppercase">{t.gameFallingNumbers}</span>
                  <div className="text-3xl sm:text-4xl font-black text-indigo-900 font-math mt-1">
                    {fallingTarget.table} × {fallingTarget.multiplier} = ?
                  </div>
                </div>

                {/* Sky falling container */}
                <div className="relative h-72 sm:h-80 bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50 rounded-3xl border-2 border-dashed border-sky-300 overflow-hidden shadow-inner select-none">
                  {fallingBubbles.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleFallingBubbleClick(b.value)}
                      style={{
                        left: `${b.x}%`,
                        top: `${b.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 hover:from-indigo-600 hover:to-purple-600 text-slate-900 hover:text-white font-black font-math text-xl sm:text-2xl shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer border-2 border-white"
                    >
                      {b.value}
                    </button>
                  ))}

                  <div className="absolute bottom-2 left-0 right-0 text-center text-xs font-bold text-slate-400">
                    Tap the correct answer before it touches the ground!
                  </div>
                </div>
              </div>
            )}

            {/* Game 4: Match the Pair */}
            {activeGame === 'match-pair' && (
              <div className="max-w-xl mx-auto w-full space-y-6">
                <p className="text-center text-xs sm:text-sm font-bold text-slate-500">
                  {t.gameMatchPairDesc}
                </p>

                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column: Equations */}
                  <div className="space-y-3">
                    {pairsLeft.map((p) => (
                      <button
                        key={p.id}
                        disabled={p.matched}
                        onClick={() => handlePairLeftClick(p.id)}
                        className={`w-full p-4 sm:p-5 rounded-2xl font-black font-math text-lg sm:text-xl transition-all border-2 text-center ${
                          p.matched
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-300 opacity-60'
                            : selectedLeft === p.id
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-103'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p.text}
                      </button>
                    ))}
                  </div>

                  {/* Right Column: Answers */}
                  <div className="space-y-3">
                    {pairsRight.map((p) => (
                      <button
                        key={p.id}
                        disabled={p.matched}
                        onClick={() => handlePairRightClick(p)}
                        className={`w-full p-4 sm:p-5 rounded-2xl font-black font-math text-lg sm:text-xl transition-all border-2 text-center ${
                          p.matched
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-300 opacity-60'
                            : 'bg-amber-50 text-slate-900 border-amber-200 hover:bg-amber-100 hover:scale-102'
                        }`}
                      >
                        {p.value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Game 7: True or False */}
            {activeGame === 'true-false' && tfQuestion && (
              <div className="max-w-md mx-auto w-full text-center space-y-8">
                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
                  <div className="text-3xl sm:text-5xl font-black font-math text-slate-800">
                    {tfQuestion.table} × {tfQuestion.multiplier} = {tfQuestion.displayedProduct}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleTFAnswer(true)}
                    className="p-6 rounded-3xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl sm:text-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                  >
                    <CheckCircle2 className="w-7 h-7" />
                    <span>True</span>
                  </button>
                  <button
                    onClick={() => handleTFAnswer(false)}
                    className="p-6 rounded-3xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xl sm:text-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                  >
                    <XCircle className="w-7 h-7" />
                    <span>False</span>
                  </button>
                </div>
              </div>
            )}

            {/* Game 8: Memory Card Match Game */}
            {activeGame === 'memory-game' && (
              <div className="max-w-xl mx-auto w-full space-y-6">
                <p className="text-center text-xs sm:text-sm font-bold text-slate-500">
                  {t.gameMemoryDesc}
                </p>

                <div className="grid grid-cols-4 gap-3">
                  {memoryCards.map((card) => {
                    const isFlippedOrMatched = card.flipped || card.matched;
                    return (
                      <button
                        key={card.id}
                        onClick={() => handleMemoryCardClick(card.id)}
                        disabled={card.matched || card.flipped}
                        className={`h-24 sm:h-28 rounded-2xl font-black font-math text-base sm:text-xl transition-all duration-300 flex items-center justify-center p-2 shadow-sm border-2 ${
                          card.matched
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 opacity-60'
                            : isFlippedOrMatched
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-102'
                            : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-amber-300 border-indigo-400 hover:scale-103'
                        }`}
                      >
                        {isFlippedOrMatched ? card.label : '❓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { 
  Hash, 
  Volume2, 
  Sparkles, 
  Shuffle, 
  Layers, 
  HelpCircle, 
  ArrowDown, 
  Check,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { AppSettings } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/audio';
import { speechService } from '../utils/speech';
import { 
  INDIAN_PLACE_VALUES, 
  formatIndianNumber, 
  convertNumberToWords, 
  getNumberPlaceValueBreakdown,
  DigitPlaceValueInfo 
} from '../utils/indianMath';

interface NumberLearningProps {
  settings: AppSettings;
}

export const NumberLearning: React.FC<NumberLearningProps> = ({ settings }) => {
  const t = translations[settings.language];
  const isUrdu = settings.language === 'ur';

  const [currentNumber, setCurrentNumber] = useState<number>(54321678);
  const [selectedDigitIndex, setSelectedDigitIndex] = useState<number | null>(0); // active digit
  const [inputVal, setInputVal] = useState<string>('5,43,21,678');

  const breakdown: DigitPlaceValueInfo[] = getNumberPlaceValueBreakdown(currentNumber, settings.language);
  const selectedInfo = selectedDigitIndex !== null ? breakdown[selectedDigitIndex] : breakdown[0];

  const wordsInCurrentLang = convertNumberToWords(currentNumber, settings.language);

  // Handle number input change
  const handleNumberChange = (raw: string) => {
    const clean = raw.replace(/\D/g, '').slice(0, 9); // limit to 9 digits (up to 99 Crore)
    if (!clean) {
      setCurrentNumber(0);
      setInputVal('');
      return;
    }
    const val = parseInt(clean, 10);
    setCurrentNumber(val);
    setInputVal(formatIndianNumber(val));
    setSelectedDigitIndex(0);
  };

  // Generate random interesting number
  const handleRandomize = () => {
    sounds.playClick();
    const presets = [
      54321678,
      1234567,
      98765432,
      500000,
      725438,
      10000000,
      4567890,
      304050
    ];
    const rand = presets[Math.floor(Math.random() * presets.length)];
    setCurrentNumber(rand);
    setInputVal(formatIndianNumber(rand));
    setSelectedDigitIndex(0);
  };

  // Speak number in words with TTS
  const handleSpeakWords = () => {
    sounds.playClick();
    speechService.speak(wordsInCurrentLang, settings.language, settings.speechRate);
  };

  const presetChips = [
    { label: '5 Lakh', val: 500000 },
    { label: '12.34 Lakh', val: 1234567 },
    { label: '5.43 Crore', val: 54321678 },
    { label: '9.87 Crore', val: 98765432 },
    { label: '1 Crore', val: 10000000 },
    { label: '75 Thousand', val: 75000 }
  ];

  return (
    <div className={`max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-8 ${isUrdu ? 'font-urdu' : 'font-devanagari'}`}>
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Hash className="w-3.5 h-3.5" />
              <span>{t.indianSystem}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
              {t.numberHeading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {t.numberSubtitle}
            </p>
          </div>

          <button
            id="random-number-btn"
            onClick={handleRandomize}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-103 active:scale-95"
          >
            <Shuffle className="w-4 h-4" />
            <span>{t.randomNumber}</span>
          </button>
        </div>

        {/* Input & Quick preset chips */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-400">Input:</span>
            <input
              id="custom-number-input"
              type="text"
              value={inputVal}
              onChange={(e) => handleNumberChange(e.target.value)}
              className="bg-transparent font-black font-math text-lg sm:text-xl text-slate-800 outline-none w-36"
              placeholder="e.g. 12,34,567"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {presetChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sounds.playClick();
                  setCurrentNumber(chip.val);
                  setInputVal(formatIndianNumber(chip.val));
                  setSelectedDigitIndex(0);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 text-xs font-bold text-slate-600 transition-all"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Place Value Board Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>{t.placeValueBoard}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {t.clickDigitToLearn}
          </p>
        </div>

        {/* Place Value Table Matrix / Columns */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex min-w-full justify-center gap-2 sm:gap-3 p-2 bg-slate-50 rounded-3xl border border-slate-200">
            {breakdown.map((item, index) => {
              const isSelected = selectedDigitIndex === index;
              return (
                <button
                  key={index}
                  id={`place-digit-${index}`}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedDigitIndex(index);
                  }}
                  className={`flex flex-col items-center min-w-[70px] sm:min-w-[95px] p-3 sm:p-4 rounded-2xl transition-all border-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg scale-105 ring-4 ring-indigo-100'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}
                >
                  {/* Column Label (Crore, Lakh, Thousand, etc.) */}
                  <span className={`text-[10px] sm:text-xs font-bold text-center uppercase tracking-tight leading-tight line-clamp-1 ${
                    isSelected ? 'text-indigo-200' : 'text-slate-500'
                  }`}>
                    {item.placeName}
                  </span>

                  {/* Big Digit Card */}
                  <span className="text-3xl sm:text-5xl font-black font-math my-1.5">
                    {item.digit}
                  </span>

                  {/* Multiplier Tag (10,00,000, 10,000, 100...) */}
                  <span className={`text-[9px] sm:text-[10px] font-math font-semibold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    ×{formatIndianNumber(item.multiplier)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Digit Detailed Place Value Inspection Card */}
        {selectedInfo && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-math font-black text-4xl flex items-center justify-center shadow-md">
                  {selectedInfo.digit}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase text-indigo-600">
                    {selectedInfo.placeName} Place
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-800 font-math">
                    {formatIndianNumber(selectedInfo.placeValue)}
                  </h4>
                </div>
              </div>

              {/* Math breakdown pills */}
              <div className="flex flex-wrap gap-2">
                <div className="px-4 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-slate-700">
                  <span className="text-slate-400">{t.faceValue}:</span> {selectedInfo.digit}
                </div>
                <div className="px-4 py-2 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-indigo-700">
                  <span className="text-slate-400">{t.placeValue}:</span> {formatIndianNumber(selectedInfo.placeValue)}
                </div>
              </div>
            </div>

            {/* Calculation Formula */}
            <div className="p-4 rounded-2xl bg-white border border-indigo-100 text-center font-math font-black text-base sm:text-xl text-indigo-900 shadow-sm">
              {selectedInfo.digit} × {formatIndianNumber(selectedInfo.multiplier)} = {formatIndianNumber(selectedInfo.placeValue)}
            </div>
          </div>
        )}

        {/* Dynamic Number In Words Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300">
                {t.inWords}
              </span>
            </div>

            <button
              id="read-aloud-number-words-btn"
              onClick={handleSpeakWords}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>{t.readAloud}</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-2xl sm:text-3xl font-black font-math text-amber-400">
              {formatIndianNumber(currentNumber)}
            </div>
            <div className="text-lg sm:text-2xl font-bold text-slate-100 leading-relaxed">
              "{wordsInCurrentLang}"
            </div>
          </div>

          {/* Expanded Form Representation */}
          <div className="pt-4 border-t border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase">
              {t.expandedForm}:
            </span>
            <div className="text-xs sm:text-sm font-math font-medium text-slate-300 break-words leading-loose">
              {breakdown.map(b => formatIndianNumber(b.placeValue)).join(' + ')} = {formatIndianNumber(currentNumber)}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

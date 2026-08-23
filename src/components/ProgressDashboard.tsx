import React, { useRef, useState } from 'react';
import { 
  Trophy, 
  Star, 
  Award, 
  Flame, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  BookOpen,
  Lock
} from 'lucide-react';
import { AppSettings, UserProgress } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/audio';
import { BADGES, DEFAULT_PROGRESS, exportProgressJson, importProgressJson, saveProgress } from '../utils/storage';

interface ProgressDashboardProps {
  settings: AppSettings;
  progress: UserProgress;
  setProgress: (p: UserProgress) => void;
  setSelectedTable: (num: number) => void;
  setCurrentView: (view: any) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  settings,
  progress,
  setProgress,
  setSelectedTable,
  setCurrentView
}) => {
  const t = translations[settings.language];
  const isUrdu = settings.language === 'ur';

  const [notification, setNotification] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accuracy = progress.totalAnswered > 0 
    ? Math.round((progress.correctAnswered / progress.totalAnswered) * 100)
    : 100;

  const totalMasteredCount = (Object.values(progress.tablesMastery) as number[]).filter(s => s >= 5).length;
  const totalStars = (Object.values(progress.tablesMastery) as number[]).reduce((a, b) => a + b, 0);

  const handleExport = () => {
    sounds.playClick();
    exportProgressJson(progress);
    setNotification(t.dataExported);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const imported = importProgressJson(content);
      if (imported) {
        sounds.playLevelComplete();
        setProgress(imported);
        setNotification(t.dataImported);
        setTimeout(() => setNotification(null), 3000);
      } else {
        sounds.playWrong();
        setNotification('Invalid JSON progress file.');
        setTimeout(() => setNotification(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    sounds.playWrong();
    saveProgress(DEFAULT_PROGRESS);
    setProgress(DEFAULT_PROGRESS);
    setShowResetModal(false);
    setNotification('Progress reset successfully.');
    setTimeout(() => setNotification(null), 3000);
  };

  const tablesList = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  return (
    <div className={`max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-8 ${isUrdu ? 'font-urdu' : 'font-devanagari'}`}>
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
            {t.progressHeading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {t.progressSubtitle}
          </p>
        </div>

        {/* Data Backup & Restore Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs sm:text-sm flex items-center gap-2 border border-indigo-200 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportData}</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 border border-slate-200 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>{t.importData}</span>
          </button>

          <button
            onClick={() => setShowResetModal(true)}
            className="p-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
            title={t.resetProgress}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm text-center animate-in fade-in">
          {notification}
        </div>
      )}

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md space-y-2">
          <div className="flex items-center justify-between opacity-80">
            <span className="text-xs font-bold uppercase">{t.tablesMastered}</span>
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-3xl sm:text-4xl font-black font-math">
            {totalMasteredCount} <span className="text-lg font-normal opacity-80">/ 19</span>
          </div>
          <p className="text-[11px] opacity-80">Tables with full 5 stars</p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 shadow-md space-y-2">
          <div className="flex items-center justify-between opacity-80">
            <span className="text-xs font-bold uppercase">Total Stars</span>
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div className="text-3xl sm:text-4xl font-black font-math">
            {totalStars} <span className="text-lg font-normal opacity-80">/ 95</span>
          </div>
          <p className="text-[11px] opacity-80">Earned through recitation</p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md space-y-2">
          <div className="flex items-center justify-between opacity-80">
            <span className="text-xs font-bold uppercase">{t.accuracyRate}</span>
            <Award className="w-5 h-5" />
          </div>
          <div className="text-3xl sm:text-4xl font-black font-math">
            {accuracy}%
          </div>
          <p className="text-[11px] opacity-80">{progress.correctAnswered} of {progress.totalAnswered} questions</p>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-md space-y-2">
          <div className="flex items-center justify-between opacity-80">
            <span className="text-xs font-bold uppercase">Best Streak</span>
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div className="text-3xl sm:text-4xl font-black font-math">
            {progress.bestStreak} 🔥
          </div>
          <p className="text-[11px] opacity-80">Consecutive correct answers</p>
        </div>

      </div>

      {/* Tables Mastery Matrix (2 to 20 with star rating) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span>Multiplication Tables Mastery (2 to 20)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {tablesList.map((num) => {
            const stars = progress.tablesMastery[num] || 0;
            const isMastered = stars >= 5;

            return (
              <div
                key={num}
                onClick={() => {
                  sounds.playClick();
                  setSelectedTable(num);
                  setCurrentView('tables-learning');
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md hover:-translate-y-1 ${
                  isMastered
                    ? 'bg-amber-50/60 border-amber-300'
                    : 'bg-slate-50 border-slate-200/80 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">{t.tableOf}</span>
                  {isMastered && <span className="text-xs">🏆</span>}
                </div>

                <div className="text-2xl font-black font-math text-slate-800 my-1">
                  {num}
                </div>

                <div className="flex items-center gap-0.5 text-amber-400 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < stars ? 'text-amber-400' : 'text-slate-200'}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements / Badges Gallery */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-indigo-600" />
          <span>{t.trophies} ({progress.unlockedBadges.length} / {BADGES.length})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = progress.unlockedBadges.includes(badge.id) || badge.isUnlocked(progress);

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-3xl border-2 transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-slate-50 to-indigo-50/40 border-indigo-200 shadow-sm'
                    : 'bg-slate-50/50 border-slate-200 opacity-60'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md ${
                  isUnlocked ? `bg-gradient-to-tr ${badge.color} text-white` : 'bg-slate-200 text-slate-400'
                }`}>
                  {isUnlocked ? badge.icon : <Lock className="w-6 h-6" />}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-800">
                      {badge.titleKey}
                    </h4>
                    {isUnlocked && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {badge.descriptionKey}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <RotateCcw className="w-7 h-7" />
            </div>
            <div className="text-center space-y-2">
              <h4 className="text-xl font-black text-slate-800">
                {t.resetProgress}
              </h4>
              <p className="text-sm text-slate-600 font-medium">
                {t.resetConfirm}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

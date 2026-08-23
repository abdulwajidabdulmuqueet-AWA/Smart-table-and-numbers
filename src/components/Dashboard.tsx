import React from 'react';
import { 
  BookOpen, 
  Gamepad2, 
  Hash, 
  Target, 
  Trophy, 
  Settings as SettingsIcon, 
  Play, 
  Sparkles, 
  Flame, 
  Award, 
  ArrowRight,
  Tv,
  BrainCircuit,
  Star
} from 'lucide-react';
import { AppView, AppSettings, UserProgress } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/audio';

interface DashboardProps {
  setCurrentView: (view: AppView) => void;
  setSelectedTable: (table: number) => void;
  settings: AppSettings;
  progress: UserProgress;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setCurrentView,
  setSelectedTable,
  settings,
  progress
}) => {
  const t = translations[settings.language];
  const isUrdu = settings.language === 'ur';

  // Calculate total stars earned across all tables
  const totalStars = (Object.values(progress.tablesMastery) as number[]).reduce((a: number, b: number) => a + b, 0);

  const mainCards = [
    {
      id: 'tables-learning' as AppView,
      title: t.navTables,
      subtitle: t.tablesSubtitle,
      icon: <BookOpen className="w-8 h-8 text-white" />,
      gradient: 'from-blue-600 via-indigo-600 to-indigo-700',
      badge: '2 to 20',
      actionText: t.startTables,
      popular: true
    },
    {
      id: 'tables-games' as AppView,
      title: t.navTableGames,
      subtitle: t.tableGamesSubtitle,
      icon: <Gamepad2 className="w-8 h-8 text-white" />,
      gradient: 'from-amber-500 via-orange-500 to-rose-500',
      badge: '8 Games',
      actionText: t.playGames,
      popular: true
    },
    {
      id: 'number-learning' as AppView,
      title: t.navNumbers,
      subtitle: t.numberSubtitle,
      icon: <Hash className="w-8 h-8 text-white" />,
      gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
      badge: '1 to 10 Cr',
      actionText: t.learnNumbers,
      popular: false
    },
    {
      id: 'number-games' as AppView,
      title: t.navNumberGames,
      subtitle: t.numberGamesSubtitle,
      icon: <Target className="w-8 h-8 text-white" />,
      gradient: 'from-purple-600 via-pink-600 to-rose-600',
      badge: '7 Games',
      actionText: t.playGames,
      popular: false
    },
    {
      id: 'practice' as AppView,
      title: t.navPractice,
      subtitle: settings.language === 'ur' ? 'تمام عنوانات سے مخلوط وقتی امتحان' : settings.language === 'hi' ? 'सभी विषयों से मिश्रित समयबद्ध परीक्षा' : settings.language === 'mr' ? 'सर्व विषयांवर आधारित संमिश्र सराव परीक्षा' : 'Comprehensive Timed Mixed Math Quiz',
      icon: <BrainCircuit className="w-8 h-8 text-white" />,
      gradient: 'from-sky-500 via-blue-600 to-indigo-700',
      badge: 'Challenge',
      actionText: '▶ Start Quiz',
      popular: false
    },
    {
      id: 'progress' as AppView,
      title: t.navProgress,
      subtitle: t.progressSubtitle,
      icon: <Trophy className="w-8 h-8 text-white" />,
      gradient: 'from-yellow-500 via-amber-500 to-orange-600',
      badge: `${progress.unlockedBadges.length} Badges`,
      actionText: t.viewProgress,
      popular: false
    },
    {
      id: 'settings' as AppView,
      title: t.navSettings,
      subtitle: t.settingsSubtitle,
      icon: <SettingsIcon className="w-8 h-8 text-white" />,
      gradient: 'from-slate-600 via-slate-700 to-slate-800',
      badge: 'Teacher',
      actionText: '⚙️ Settings',
      popular: false
    }
  ];

  const quickTables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 ${isUrdu ? 'font-urdu' : 'font-devanagari'}`}>
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-800 p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs sm:text-sm font-bold tracking-wide border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Smart Classroom Mathematics Platform</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {t.appTitle}
            </h1>
            <p className="text-sm sm:text-base text-indigo-100 font-medium">
              {t.appSubtitle}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                id="quick-start-tables-btn"
                onClick={() => { sounds.playClick(); setCurrentView('tables-learning'); }}
                className="px-4 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-sm shadow-md hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t.startTables}</span>
              </button>
              <button
                id="quick-play-games-btn"
                onClick={() => { sounds.playClick(); setCurrentView('tables-games'); }}
                className="px-4 py-2.5 rounded-xl bg-amber-400 text-slate-900 font-bold text-sm shadow-md hover:bg-amber-300 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>{t.playGames}</span>
              </button>
              <button
                id="quick-learn-numbers-btn"
                onClick={() => { sounds.playClick(); setCurrentView('number-learning'); }}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-md hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Hash className="w-4 h-4" />
                <span>{t.learnNumbers}</span>
              </button>
              <button
                id="quick-view-progress-btn"
                onClick={() => { sounds.playClick(); setCurrentView('progress'); }}
                className="px-4 py-2.5 rounded-xl bg-purple-500/40 text-white font-bold text-sm border border-white/20 hover:bg-purple-500/60 hover:scale-105 transition-all flex items-center gap-2"
              >
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>{t.viewProgress}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Badge Card */}
          <div className="flex flex-row md:flex-col gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400/20 border border-amber-300/30">
                <Star className="w-6 h-6 text-amber-300 fill-amber-300" />
              </div>
              <div>
                <div className="text-2xl font-black">{totalStars} <span className="text-xs font-normal opacity-80">/ 95</span></div>
                <div className="text-xs font-medium text-indigo-200">Total Stars</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-400/20 border border-orange-300/30">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-black">{progress.currentStreak} 🔥</div>
                <div className="text-xs font-medium text-indigo-200">Current Streak</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-400/20 border border-emerald-300/30">
                <Award className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <div className="text-2xl font-black">
                  {progress.totalAnswered > 0 
                    ? `${Math.round((progress.correctAnswered / progress.totalAnswered) * 100)}%` 
                    : '100%'}
                </div>
                <div className="text-xs font-medium text-indigo-200">{t.accuracy}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tables Quick-Select Strip */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-800">
                {t.tablesHeading}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {t.selectTable}
              </p>
            </div>
          </div>
          <button
            onClick={() => { sounds.playClick(); setCurrentView('tables-learning'); }}
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
          >
            <span>{settings.language === 'ur' ? 'سبھی دیکھیں' : settings.language === 'hi' ? 'सभी देखें' : settings.language === 'mr' ? 'सर्व पहा' : 'View All'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tables 2-20 Grid Buttons */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2.5 sm:gap-3">
          {quickTables.map((num) => {
            const stars = progress.tablesMastery[num] || 0;
            return (
              <button
                key={num}
                id={`table-quick-btn-${num}`}
                onClick={() => {
                  sounds.playClick();
                  setSelectedTable(num);
                  setCurrentView('tables-learning');
                }}
                className="group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/70 hover:bg-indigo-600 hover:border-indigo-600 text-slate-800 hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-1 active:translate-y-0"
              >
                <span className="text-xs font-semibold opacity-70 group-hover:text-indigo-200">
                  {t.tableOf}
                </span>
                <span className="text-xl sm:text-2xl font-black font-math my-0.5">
                  {num}
                </span>
                <div className="flex items-center gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`text-[9px] ${
                        i < stars 
                          ? 'text-amber-400 group-hover:text-amber-300' 
                          : 'text-slate-300 group-hover:text-white/30'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Core Learning & Games Section Cards */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">
          {t.selectTopic}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainCards.map((card) => (
            <div
              key={card.id}
              id={`dashboard-card-${card.id}`}
              onClick={() => {
                sounds.playClick();
                setCurrentView(card.id);
              }}
              className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-200">
                    {card.badge}
                  </span>
                </div>

                {/* Text Description */}
                <div>
                  <h3 className="text-xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 line-clamp-2">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                  <span>{card.actionText}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
                <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classroom Smart Board Highlight Notice */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md">
            <Tv className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black">{t.classroomMode}</h3>
            <p className="text-sm text-emerald-100 max-w-xl font-medium mt-0.5">
              {t.classroomModeDesc}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            sounds.playClick();
            setCurrentView('tables-learning');
          }}
          className="px-6 py-3 rounded-2xl bg-white text-emerald-800 font-extrabold text-sm shadow-md hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
        >
          {t.startPresentation}
        </button>
      </div>

    </div>
  );
};

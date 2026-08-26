import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Gamepad2, 
  Hash, 
  Sparkles, 
  Trophy, 
  Settings as SettingsIcon, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Tv, 
  Download, 
  Menu, 
  X,
  Languages,
  CheckCircle2
} from 'lucide-react';
import { AppView, Language, AppSettings } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/audio';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  isInstallable?: boolean;
  isInstalled?: boolean;
  onInstallClick?: () => void;
  onOpenInstallModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  settings,
  updateSettings,
  isInstallable = false,
  isInstalled = false,
  onInstallClick,
  onOpenInstallModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const t = translations[settings.language];
  const isUrdu = settings.language === 'ur';

  const handleInstallPress = () => {
    sounds.playClick();
    if (onOpenInstallModal) {
      onOpenInstallModal();
    } else if (onInstallClick) {
      onInstallClick();
    }
  };

  const toggleFullscreen = () => {
    sounds.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => console.log('Fullscreen error:', err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch(err => console.log('Exit fullscreen error:', err));
      }
    }
  };

  const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: settings.language === 'ur' ? 'ڈیش بورڈ' : settings.language === 'hi' ? 'मुख्य पृष्ठ' : settings.language === 'mr' ? 'मुख्य पृष्ठ' : 'Home', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'tables-learning', label: t.navTables, icon: <BookOpen className="w-5 h-5" /> },
    { id: 'tables-games', label: t.navTableGames, icon: <Gamepad2 className="w-5 h-5" /> },
    { id: 'number-learning', label: t.navNumbers, icon: <Hash className="w-5 h-5" /> },
    { id: 'number-games', label: t.navNumberGames, icon: <Sparkles className="w-5 h-5" /> },
    { id: 'progress', label: t.navProgress, icon: <Trophy className="w-5 h-5" /> },
    { id: 'settings', label: t.navSettings, icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'ur', label: 'Urdu', native: 'اردو' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner for Language Selection & Utilities */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* App Branding */}
        <div 
          onClick={() => { sounds.playClick(); setCurrentView('dashboard'); }}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <span className="text-2xl font-bold">2×</span>
          </div>
          <div>
            <h1 className={`text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight leading-none ${isUrdu ? 'font-urdu' : 'font-devanagari'}`}>
              {t.appTitle}
            </h1>
            <p className="text-xs font-medium text-slate-500 hidden sm:block mt-0.5">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Multilingual Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
          <div className="hidden sm:flex items-center gap-1 px-2 text-xs font-semibold text-slate-500">
            <Languages className="w-3.5 h-3.5" />
          </div>
          {languages.map((lang) => {
            const isActive = settings.language === lang.code;
            return (
              <button
                key={lang.code}
                id={`lang-select-${lang.code}`}
                onClick={() => {
                  sounds.playClick();
                  updateSettings({ language: lang.code });
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm scale-102'
                    : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-200/60'
                } ${lang.code === 'ur' ? 'font-urdu' : lang.code === 'hi' || lang.code === 'mr' ? 'font-devanagari' : ''}`}
              >
                {lang.native}
              </button>
            );
          })}
        </div>

        {/* Global Controls & Classroom Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Classroom Mode Toggle */}
          <button
            id="toggle-classroom-mode-btn"
            onClick={() => {
              sounds.playClick();
              updateSettings({ classroomMode: !settings.classroomMode });
            }}
            title={t.classroomMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
              settings.classroomMode
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md animate-pulse'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span className="hidden md:inline">Smart Board</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="toggle-sound-btn"
            onClick={() => {
              const newSound = !settings.soundEnabled;
              sounds.setSoundEnabled(newSound);
              updateSettings({ soundEnabled: newSound });
              if (newSound) sounds.playCorrect();
            }}
            title={settings.soundEnabled ? t.soundOn : t.soundOff}
            className={`p-2 rounded-xl border transition-all ${
              settings.soundEnabled
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Fullscreen Toggle for Smart Board */}
          <button
            id="toggle-fullscreen-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? t.exitFullscreen : t.fullscreen}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          {/* Install App Button (Visible on Desktop & Tablet) */}
          <button
            id="install-pwa-btn"
            onClick={handleInstallPress}
            title={isInstalled ? t.pwaInstalled : t.installModalTitle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold shadow-sm transition-all ${
              isInstalled
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-indigo-200 hover:scale-102 active:scale-95'
            }`}
          >
            {isInstalled ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Installed ✓</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 animate-bounce" />
                <span>
                  {settings.language === 'ur'
                    ? 'ایپ انسٹال کریں'
                    : settings.language === 'hi'
                    ? 'ऐप इंस्टॉल करें'
                    : settings.language === 'mr'
                    ? 'ॲप इन्स्टॉल करा'
                    : 'Install App'}
                </span>
              </>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-nav-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation Links Bar (Desktop) */}
      <div className="hidden lg:block bg-slate-100/80 border-t border-slate-200/60 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 py-1.5 overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    sounds.playClick();
                    setCurrentView(item.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md scale-102'
                      : 'text-slate-700 hover:bg-white/80 hover:text-indigo-600'
                  } ${isUrdu ? 'font-urdu' : 'font-devanagari'}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => {
                    sounds.playClick();
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-bold text-left transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  } ${isUrdu ? 'font-urdu' : 'font-devanagari'}`}
                >
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20' : 'bg-slate-200'}`}>
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            id="mobile-drawer-install-btn"
            onClick={() => {
              setMobileMenuOpen(false);
              handleInstallPress();
            }}
            className={`w-full mt-2 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md transition-all ${
              isInstalled
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
            }`}
          >
            <Download className="w-5 h-5" />
            <span>
              {isInstalled
                ? (settings.language === 'ur' ? 'ایپ پہلے سے انسٹال ہے (تفصیلات)' : settings.language === 'hi' ? 'ऐप इंस्टॉल है (विवरण)' : 'App Installed (Offline Ready)')
                : (settings.language === 'ur' ? '📱 ایپ انسٹال کریں (آف لائن استعمال)' : settings.language === 'hi' ? '📱 ऐप इंस्टॉल करें (ऑफलाइन उपयोग)' : settings.language === 'mr' ? '📱 ॲप इन्स्टॉल करा (ऑफलाइन)' : '📱 Install App (100% Offline)')}
            </span>
          </button>
        </div>
      )}
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { ViewType, AppSettings, UserProgress, TableGameType, NumberGameType } from './types';
import { loadSettings, saveSettings, loadProgress, saveProgress } from './utils/storage';
import { sounds } from './utils/audio';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { TablesLearning } from './components/TablesLearning';
import { TablesGames } from './components/TablesGames';
import { NumberLearning } from './components/NumberLearning';
import { NumberGames } from './components/NumberGames';
import { ProgressDashboard } from './components/ProgressDashboard';
import { TeacherSettings } from './components/TeacherSettings';
import { InstallModal } from './components/InstallModal';
import { translations } from './utils/translations';
import confetti from 'canvas-confetti';
import { 
  LayoutGrid, 
  BookOpen, 
  Gamepad2, 
  Hash, 
  Award, 
  Settings as SettingsIcon,
  Tv,
  Download
} from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedTable, setSelectedTable] = useState<number>(2);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);

  // Sync sound settings to audio engine
  useEffect(() => {
    sounds.setSoundEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Handle PWA Install Prompt & Standalone Mode Check
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already launched in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true);
    }

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    sounds.playClick();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
      setDeferredPrompt(null);
    } else {
      // If direct beforeinstallprompt is not available (e.g. iOS Safari, Chrome desktop if not pre-fired), open guidance modal
      setShowInstallModal(true);
    }
  };

  const handleOpenInstallModal = () => {
    sounds.playClick();
    setShowInstallModal(true);
  };

  // Update Settings with automatic persistence
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);
  };

  // Update Progress with automatic persistence
  const handleSetProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const isUrdu = settings.language === 'ur';
  const t = translations[settings.language];

  const quickNav = [
    { id: 'dashboard' as ViewType, title: t.navHome, icon: LayoutGrid },
    { id: 'tables-learning' as ViewType, title: t.navTablesLearn, icon: BookOpen },
    { id: 'tables-games' as ViewType, title: t.navTablesGames, icon: Gamepad2 },
    { id: 'number-learning' as ViewType, title: t.navNumberLearn, icon: Hash },
    { id: 'progress' as ViewType, title: t.navProgress, icon: Award }
  ];

  return (
    <div 
      dir={isUrdu ? 'rtl' : 'ltr'} 
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        settings.highContrast ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'
      } ${settings.reducedMotion ? 'motion-reduce' : ''} ${isUrdu ? 'font-urdu' : 'font-devanagari'}`}
    >
      
      {/* Multilingual Top Navigation Bar */}
      <Navbar
        settings={settings}
        updateSettings={updateSettings}
        currentView={currentView}
        setCurrentView={setCurrentView}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        onInstallClick={handleInstallApp}
        onOpenInstallModal={handleOpenInstallModal}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 sm:pb-8">
        {currentView === 'dashboard' && (
          <Dashboard
            settings={settings}
            progress={progress}
            setCurrentView={setCurrentView}
            setSelectedTable={setSelectedTable}
            isInstalled={isInstalled}
            onOpenInstallModal={handleOpenInstallModal}
            onInstallClick={handleInstallApp}
          />
        )}

        {currentView === 'tables-learning' && (
          <TablesLearning
            settings={settings}
            updateSettings={updateSettings}
            progress={progress}
            setProgress={handleSetProgress}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
          />
        )}

        {currentView === 'tables-games' && (
          <TablesGames
            settings={settings}
            progress={progress}
            setProgress={handleSetProgress}
          />
        )}

        {currentView === 'number-learning' && (
          <NumberLearning
            settings={settings}
          />
        )}

        {currentView === 'number-games' && (
          <NumberGames
            settings={settings}
            progress={progress}
            setProgress={handleSetProgress}
          />
        )}

        {currentView === 'practice' && (
          <NumberGames
            settings={settings}
            progress={progress}
            setProgress={handleSetProgress}
            defaultGame="number-challenge"
          />
        )}

        {currentView === 'progress' && (
          <ProgressDashboard
            settings={settings}
            progress={progress}
            setProgress={handleSetProgress}
            setSelectedTable={setSelectedTable}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'settings' && (
          <TeacherSettings
            settings={settings}
            updateSettings={updateSettings}
            isInstalled={isInstalled}
            onOpenInstallModal={handleOpenInstallModal}
            onInstallClick={handleInstallApp}
          />
        )}
      </main>

      {/* PWA Install Guide Modal */}
      <InstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        onInstall={handleInstallApp}
        settings={settings}
      />

      {/* Bottom Floating Quick Bar (Enhanced for touch screens & mobile phones) */}
      <nav aria-label="Bottom Navigation" className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex justify-around items-center shadow-lg">
        {quickNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sounds.playClick();
                setCurrentView(item.id);
              }}
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                isActive ? 'text-indigo-600 font-black' : 'text-slate-500 font-semibold'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.title}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}

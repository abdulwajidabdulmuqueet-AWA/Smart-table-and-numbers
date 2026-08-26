import React from 'react';
import { 
  Settings, 
  Languages, 
  Tv, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Sliders, 
  Eye, 
  Zap, 
  Download, 
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';
import { AppSettings, Language, RhythmSpeed } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/audio';

interface TeacherSettingsProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  isInstalled?: boolean;
  onOpenInstallModal?: () => void;
  onInstallClick?: () => void;
}

export const TeacherSettings: React.FC<TeacherSettingsProps> = ({
  settings,
  updateSettings,
  isInstalled = false,
  onOpenInstallModal,
  onInstallClick
}) => {
  const t = translations[settings.language];
  const isUrdu = settings.language === 'ur';

  const languages: { code: Language; name: string; native: string }[] = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी (Hindi)' },
    { code: 'mr', name: 'Marathi', native: 'मराठी (Marathi)' },
    { code: 'ur', name: 'Urdu', native: 'اردو (Urdu RTL)' }
  ];

  return (
    <div className={`max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-8 ${isUrdu ? 'font-urdu' : 'font-devanagari'}`}>
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-3">
          <Settings className="w-8 h-8 text-indigo-600" />
          <span>{t.settingsHeading}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          {t.settingsSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Language Selection Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-base">
            <Languages className="w-5 h-5" />
            <span>{t.languageSelect}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {languages.map((lang) => {
              const isSelected = settings.language === lang.code;
              return (
                <button
                  key={lang.code}
                  id={`settings-lang-${lang.code}`}
                  onClick={() => {
                    sounds.playClick();
                    updateSettings({ language: lang.code });
                  }}
                  className={`p-4 rounded-2xl border-2 text-left font-bold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  } ${lang.code === 'ur' ? 'font-urdu' : lang.code === 'hi' || lang.code === 'mr' ? 'font-devanagari' : ''}`}
                >
                  <div className="text-sm">{lang.native}</div>
                  <div className={`text-xs ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {lang.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Classroom & Smart Board Mode Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-emerald-600 font-black text-base">
            <Tv className="w-5 h-5" />
            <span>{t.smartBoardSettings}</span>
          </div>

          <div className="space-y-4">
            {/* Classroom Mode Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <div className="font-black text-sm text-slate-800">{t.classroomMode}</div>
                <div className="text-xs text-slate-500 max-w-xs">Distraction-free high-visibility presentation</div>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  updateSettings({ classroomMode: !settings.classroomMode });
                }}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  settings.classroomMode ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.classroomMode ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Auto-Play Next Table Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <div className="font-black text-sm text-slate-800">{t.autoPlayNextTable}</div>
                <div className="text-xs text-slate-500">{t.autoPlayNextDesc}</div>
              </div>
              <button
                id="settings-autoplay-next-toggle"
                onClick={() => {
                  sounds.playClick();
                  updateSettings({ autoPlayNextTable: !(settings.autoPlayNextTable ?? true) });
                }}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  (settings.autoPlayNextTable ?? true) ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  (settings.autoPlayNextTable ?? true) ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* High Contrast Mode */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <div className="font-black text-sm text-slate-800">{t.highContrast}</div>
                <div className="text-xs text-slate-500">Enhanced edge readability for projector screens</div>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  updateSettings({ highContrast: !settings.highContrast });
                }}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  settings.highContrast ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.highContrast ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <div className="font-black text-sm text-slate-800">{t.reducedMotion}</div>
                <div className="text-xs text-slate-500">Minimize animations on low-power devices</div>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  updateSettings({ reducedMotion: !settings.reducedMotion });
                }}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  settings.reducedMotion ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Audio & Recitation Configuration */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-base">
            <Volume2 className="w-5 h-5" />
            <span>{t.audioSettings}</span>
          </div>

          <div className="space-y-4">
            {/* Global Sound Effects Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <div className="font-black text-sm text-slate-800">Sound Effects</div>
                <div className="text-xs text-slate-500">Instant feedback chimes and educational cues</div>
              </div>
              <button
                onClick={() => {
                  const s = !settings.soundEnabled;
                  sounds.setSoundEnabled(s);
                  updateSettings({ soundEnabled: s });
                  if (s) sounds.playCorrect();
                }}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Read Aloud TTS Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <div className="font-black text-sm text-slate-800">{t.readAloud}</div>
                <div className="text-xs text-slate-500">Automated multilingual table narration</div>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  updateSettings({ speechEnabled: !settings.speechEnabled });
                }}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  settings.speechEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.speechEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Speech Rate Slider */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Narration Speed (TTS)</span>
                <span className="text-indigo-600">{settings.speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.4"
                step="0.1"
                value={settings.speechRate}
                onChange={(e) => updateSettings({ speechRate: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Auto Rhythm Speed Default */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-base">
            <Sliders className="w-5 h-5" />
            <span>Auto Rhythm Default Timing</span>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {(['slow', 'normal', 'fast', 'very-fast'] as RhythmSpeed[]).map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    sounds.playClick();
                    updateSettings({ rhythmSpeed: spd });
                  }}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all border ${
                    settings.rhythmSpeed === spd
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {spd === 'slow' ? t.speedSlow : spd === 'normal' ? t.speedNormal : spd === 'fast' ? t.speedFast : t.speedVeryFast}
                </button>
              ))}
            </div>

            {/* Custom delay option */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>{t.customTiming}</span>
                <span className="text-indigo-600">{settings.customRhythmDelaySec} seconds</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.5"
                value={settings.customRhythmDelaySec}
                onChange={(e) => updateSettings({ customRhythmDelaySec: parseFloat(e.target.value), rhythmSpeed: 'custom' })}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Offline PWA Ready Info Banner with Install Action */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 border border-purple-500/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-base font-black">
              {t.pwaOfflineReady}
            </h4>
            <p className="text-xs text-purple-200 mt-0.5 max-w-xl">
              IndexedDB storage keeps all stars, badges, and recitation settings permanently available on classroom devices even when disconnected.
            </p>
          </div>
        </div>

        <button
          id="settings-install-pwa-btn"
          onClick={() => {
            sounds.playClick();
            if (onOpenInstallModal) onOpenInstallModal();
            else if (onInstallClick) onInstallClick();
          }}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 font-extrabold text-xs sm:text-sm text-white shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span>
            {isInstalled
              ? (isUrdu ? 'انسٹال شدہ (رہنمائی)' : 'Installed ✓ (Guide)')
              : (isUrdu ? 'ایپ انسٹال کریں' : settings.language === 'hi' ? 'ऐप इंस्टॉल करें' : settings.language === 'mr' ? 'ॲप इन्स्टॉल करा' : 'Install App')}
          </span>
        </button>
      </div>

    </div>
  );
};

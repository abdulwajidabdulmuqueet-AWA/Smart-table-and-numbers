import React from 'react';
import { 
  Download, 
  X, 
  CheckCircle2, 
  Smartphone, 
  Laptop, 
  Apple, 
  Zap, 
  ShieldCheck, 
  Tv, 
  Share2, 
  PlusSquare,
  Sparkles
} from 'lucide-react';
import { AppSettings } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/audio';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  onInstall: () => void;
  settings: AppSettings;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isInstalled,
  onInstall,
  settings
}) => {
  if (!isOpen) return null;

  const t = translations[settings.language] || translations.en;
  const isUrdu = settings.language === 'ur';

  // Detect basic device type for customized guidance
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="pwa-install-modal"
        className={`relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden ${
          isUrdu ? 'font-urdu' : 'font-devanagari'
        }`}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 text-white relative">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white text-indigo-700 flex items-center justify-center font-black text-2xl shadow-lg">
              2×
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  PWA Offline App
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mt-0.5 tracking-tight">
                {t.installModalTitle}
              </h3>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-indigo-100 mt-2 font-medium">
            {t.installModalSubtitle}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Status / Direct Action */}
          {isInstalled ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm sm:text-base">
                  {t.alreadyInstalled}
                </h4>
                <p className="text-xs text-emerald-700 font-medium mt-0.5">
                  {t.pwaOfflineReady}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <button
                id="modal-direct-install-btn"
                onClick={() => {
                  sounds.playClick();
                  onInstall();
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-base shadow-lg shadow-indigo-200 hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Download className="w-6 h-6 animate-bounce" />
                <span>{t.installNowBtn}</span>
              </button>
            </div>
          )}

          {/* Key PWA Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
              <Zap className="w-5 h-5 text-amber-500 mb-1" />
              <span className="text-[11px] font-extrabold text-slate-800 leading-tight">
                {t.installFeatureOffline}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
              <Sparkles className="w-5 h-5 text-indigo-500 mb-1" />
              <span className="text-[11px] font-extrabold text-slate-800 leading-tight">
                {t.installFeatureFast}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
              <Tv className="w-5 h-5 text-purple-500 mb-1" />
              <span className="text-[11px] font-extrabold text-slate-800 leading-tight">
                {t.installFeatureSafe}
              </span>
            </div>
          </div>

          {/* Device Instructions */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              {t.installHowToTitle}
            </h4>

            {/* Android / Chrome Guide */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              !isIOS ? 'bg-indigo-50/70 border-indigo-200 ring-1 ring-indigo-200' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white shadow-sm text-indigo-600">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs sm:text-sm text-slate-900">
                    Android & Chrome Browser
                  </h5>
                  <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                    {t.installAndroidStep}
                  </p>
                </div>
              </div>
            </div>

            {/* iOS Safari Guide */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              isIOS ? 'bg-indigo-50/70 border-indigo-200 ring-1 ring-indigo-200' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white shadow-sm text-slate-800">
                  <Apple className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                    <span>iPhone & iPad (Safari)</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">iOS</span>
                  </h5>
                  <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                    {t.installIosStep}
                  </p>
                </div>
              </div>
            </div>

            {/* Computer & Smart Board Guide */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white shadow-sm text-indigo-600">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs sm:text-sm text-slate-900">
                    Smart Board / Windows PC / Mac
                  </h5>
                  <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                    {t.installDesktopStep}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Action */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all"
            >
              {t.close || 'Close'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

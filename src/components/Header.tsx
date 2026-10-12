import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Share2,
  Bell,
  BellRing,
  Lock,
  Globe2,
  Layers,
  Wand2,
  FileText,
  Smartphone,
  Radio,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { requestNotificationPermission } from '../utils/notifications';
import { AppTab } from './MobileBottomNav';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  pendingTasksCount: number;
  openSyncModal: () => void;
  isOnline: boolean;
  engineMode: 'neural' | 'local';
  setEngineMode: (mode: 'neural' | 'local') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pendingTasksCount,
  openSyncModal,
  isOnline,
  engineMode,
  setEngineMode,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [notificationsActive, setNotificationsActive] = useState(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );

  const handleToggleNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsActive(granted);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18 gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-rose-500 shadow-md shadow-cyan-500/20 p-0.5 shrink-0">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-lg font-black tracking-tight text-white truncate">
                  VoxCloner <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-rose-500 font-extrabold text-xs sm:text-base">Studio</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                  320kbps
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block truncate">
                Clonación & Locución Neuronal
              </p>
            </div>
          </div>

          {/* Engine Selector Toggle - Desktop */}
          <div className="hidden md:flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-xs shrink-0">
            <button
              onClick={() => setEngineMode('neural')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                engineMode === 'neural'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>IA Neuronal HD</span>
            </button>
            <button
              onClick={() => setEngineMode('local')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                engineMode === 'local'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>100% Local</span>
            </button>
          </div>

          {/* Actions: Engine (Mobile), Notifications, Sync, PWA Install */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile Compact Engine Toggle */}
            <button
              onClick={() => setEngineMode(engineMode === 'neural' ? 'local' : 'neural')}
              title={engineMode === 'neural' ? 'Modo actual: IA Neuronal. Toca para cambiar a Local' : 'Modo actual: 100% Local. Toca para cambiar a IA Neuronal'}
              className={`md:hidden px-2 py-1.5 rounded-xl text-[11px] font-bold border flex items-center gap-1 transition cursor-pointer ${
                engineMode === 'neural'
                  ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300'
                  : 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
              }`}
            >
              {engineMode === 'neural' ? (
                <>
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>IA</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Local</span>
                </>
              )}
            </button>

            {/* Notification Toggle */}
            <button
              onClick={handleToggleNotifications}
              title={notificationsActive ? 'Notificaciones activas' : 'Activar notificaciones para cola masiva'}
              className={`p-1.5 sm:p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition cursor-pointer ${
                notificationsActive
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                  : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white'
              }`}
            >
              {notificationsActive ? <BellRing className="w-3.5 h-3.5 text-cyan-400" /> : <Bell className="w-3.5 h-3.5" />}
              <span className="hidden xl:inline">{notificationsActive ? 'Avisos ON' : 'Avisar'}</span>
            </button>

            {/* Cloud Sync & E2E encryption */}
            <button
              onClick={openSyncModal}
              title="Sincronización segura cifrada E2E"
              className="p-1.5 sm:p-2 rounded-xl text-xs font-medium border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Cifrado E2E</span>
            </button>

            {/* PWA Install Button */}
            {!isInstalled && isInstallable && (
              <button
                onClick={install}
                className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-rose-500 p-1.5 sm:px-3 sm:py-2 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:opacity-95 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Instalar</span>
              </button>
            )}

            {!isInstalled && isIOS && (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-900 p-1.5 sm:px-3 sm:py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">iOS</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs (Only for Tablet/Desktop to avoid duplicate tabs on mobile) */}
        <div className="hidden md:flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 border-t border-slate-800/40 no-scrollbar">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Guión & Estudio</span>
          </button>

          <button
            onClick={() => setActiveTab('cloner')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'cloner'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>Clonar Mi Voz</span>
          </button>

          <button
            onClick={() => setActiveTab('voices')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'voices'
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Catálogo Voces</span>
          </button>

          <button
            onClick={() => setActiveTab('tuning')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'tuning'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-xs">⚡</span>
            <span>Ajustes & Calidad</span>
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer relative ${
              activeTab === 'queue'
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Cola Masiva</span>
            {pendingTasksCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                {pendingTasksCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Plantillas Virales</span>
          </button>
        </div>
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Instalar en iPhone / iPad</h3>
                <p className="text-xs text-slate-400">Acceso offline rápido sin abrir Safari</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 bg-slate-800/60 rounded-xl p-4 border border-slate-700/60">
              <div className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  Toca el botón <Share2 className="w-3.5 h-3.5 inline mx-1 text-cyan-400" /> <strong>Compartir</strong> en la barra de Safari.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  Desliza hacia abajo y selecciona <strong>Añadir a pantalla de inicio</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </span>
                <p>¡Listo! La app funcionará como una aplicación nativa con soporte para audios offline.</p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-bold text-white transition border border-slate-600"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

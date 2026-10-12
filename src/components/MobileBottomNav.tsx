import React from 'react';
import {
  FileEdit,
  Radio,
  Volume2,
  Sliders,
  Layers,
  Sparkles,
} from 'lucide-react';

export type AppTab = 'studio' | 'cloner' | 'voices' | 'tuning' | 'queue' | 'templates';

interface MobileBottomNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  pendingTasksCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  pendingTasksCount,
}) => {
  const tabs = [
    {
      id: 'studio' as AppTab,
      label: 'Guión',
      icon: FileEdit,
      color: 'text-cyan-400',
      activeBg: 'bg-cyan-500/15 text-cyan-300',
    },
    {
      id: 'cloner' as AppTab,
      label: 'Clonar',
      icon: Radio,
      color: 'text-purple-400',
      activeBg: 'bg-purple-500/15 text-purple-300',
      isHighlight: true,
    },
    {
      id: 'voices' as AppTab,
      label: 'Voces',
      icon: Volume2,
      color: 'text-sky-400',
      activeBg: 'bg-sky-500/15 text-sky-300',
    },
    {
      id: 'tuning' as AppTab,
      label: 'Ajustes',
      icon: Sliders,
      color: 'text-amber-400',
      activeBg: 'bg-amber-500/15 text-amber-300',
    },
    {
      id: 'queue' as AppTab,
      label: 'Cola',
      icon: Layers,
      color: 'text-rose-400',
      activeBg: 'bg-rose-500/15 text-rose-300',
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
    },
    {
      id: 'templates' as AppTab,
      label: 'Plantillas',
      icon: Sparkles,
      color: 'text-emerald-400',
      activeBg: 'bg-emerald-500/15 text-emerald-300',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#090d16]/95 backdrop-blur-xl border-t border-slate-800/80 px-1 py-1 pb-safe shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto flex items-center justify-between gap-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all duration-150 select-none cursor-pointer flex-1 min-w-0 ${
                isActive
                  ? `${tab.activeBg} font-bold`
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                    isActive ? `${tab.color} scale-110` : 'text-slate-400'
                  } ${tab.isHighlight && !isActive ? 'text-purple-400' : ''}`}
                />

                {/* Badge for Queue pending tasks */}
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full text-[8px] font-black bg-rose-500 text-white animate-pulse shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[9px] sm:text-[10px] mt-0.5 tracking-tight truncate max-w-full text-center ${
                  isActive ? 'text-white font-bold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>

              {/* Active neon indicator dot */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

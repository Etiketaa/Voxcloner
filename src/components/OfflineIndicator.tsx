import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-500/95 backdrop-blur-md px-4 py-2 text-xs font-semibold text-slate-950 shadow-2xl border border-amber-300 animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span>Modo Offline Activo — Generando locuciones locales gratis sin conexión.</span>
    </div>
  );
};

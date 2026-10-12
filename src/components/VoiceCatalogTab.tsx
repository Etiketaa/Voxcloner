import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  Radio,
  CheckCircle2,
  ArrowRight,
  Mic,
  Info,
} from 'lucide-react';
import { VoiceProfile } from '../types/models';
import { VoiceSelector } from './VoiceSelector';

interface VoiceCatalogTabProps {
  currentVoice: VoiceProfile;
  setCurrentVoice: (voice: VoiceProfile) => void;
  engineMode: 'neural' | 'local';
  onOpenCloner: () => void;
  onNavigateToStudio: () => void;
}

export const VoiceCatalogTab: React.FC<VoiceCatalogTabProps> = ({
  currentVoice,
  setCurrentVoice,
  engineMode,
  onOpenCloner,
  onNavigateToStudio,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSelect = (voice: VoiceProfile) => {
    setCurrentVoice(voice);
    setToastMessage(`¡Voz "${voice.name}" seleccionada para tu guión!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 bg-cyan-500/15 border border-cyan-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs text-cyan-200 shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button
            onClick={onNavigateToStudio}
            className="flex items-center gap-1 text-[11px] font-bold text-white bg-cyan-500 hover:bg-cyan-400 px-3 py-1.5 rounded-xl text-slate-950 transition shrink-0"
          >
            <span>Ir al Guión</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Header Card */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800/80 p-4 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-sky-500/15 text-sky-400 border border-sky-500/30 shrink-0">
              <Volume2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white flex flex-wrap items-center gap-2">
                <span>Catálogo de Voces</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {engineMode === 'neural' ? 'IA Neuronal' : 'Local Offline'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Selecciona la voz ideal para el estilo de tu video de TikTok
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCloner}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-rose-500 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition cursor-pointer self-stretch sm:self-auto shrink-0"
          >
            <Radio className="w-4 h-4 shrink-0" />
            <span>+ Clonar Mi Propia Voz</span>
          </button>
        </div>

        {/* Current Active Voice Card */}
        <div className="mt-4 p-3.5 bg-[#0b101e] rounded-2xl border border-cyan-500/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
              {currentVoice.gender === 'female' ? 'F' : 'M'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white truncate">{currentVoice.name}</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-cyan-500/20 text-cyan-300 shrink-0">
                  Activa
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{currentVoice.description}</p>
            </div>
          </div>

          <button
            onClick={onNavigateToStudio}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition shrink-0 cursor-pointer self-stretch sm:self-auto"
          >
            <span>Usar en Guión</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          </button>
        </div>
      </div>

      {/* Full Voice Selector Grid */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800/80 p-4 sm:p-6 shadow-xl backdrop-blur-md">
        <VoiceSelector
          selectedVoiceId={currentVoice.id}
          onSelectVoice={handleSelect}
          engineMode={engineMode}
          onOpenCloner={onOpenCloner}
        />
      </div>
    </div>
  );
};

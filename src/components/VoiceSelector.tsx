import React, { useState, useEffect } from 'react';
import { Play, Pause, Sparkles, User, Mic2, Check, Radio } from 'lucide-react';
import { VoiceProfile } from '../types/models';
import { BUILT_IN_NEURAL_VOICES, loadClonedVoices } from '../utils/storage';

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onSelectVoice: (voice: VoiceProfile) => void;
  engineMode: 'neural' | 'local';
  onOpenCloner?: () => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoiceId,
  onSelectVoice,
  engineMode,
  onOpenCloner,
}) => {
  const [tab, setTab] = useState<'neural' | 'cloned' | 'system'>(
    engineMode === 'local' ? 'system' : 'neural'
  );
  const [clonedVoices, setClonedVoices] = useState<VoiceProfile[]>([]);
  const [browserVoices, setBrowserVoices] = useState<VoiceProfile[]>([]);
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  // Sync tab with engineMode if user switches engine
  useEffect(() => {
    if (engineMode === 'local' && tab === 'neural') {
      setTab('system');
    }
  }, [engineMode, tab]);

  // Load cloned voices
  useEffect(() => {
    setClonedVoices(loadClonedVoices());
  }, [selectedVoiceId]);

  // Load system browser voices
  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        const sysVoices = window.speechSynthesis.getVoices();
        const mapped: VoiceProfile[] = sysVoices.map((v, i) => ({
          id: `browser-${i}-${v.name.replace(/\s+/g, '-').toLowerCase()}`,
          name: v.name,
          provider: 'browser',
          gender: v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('monica') || v.name.toLowerCase().includes('sabina') ? 'female' : 'male',
          description: `Voz local del sistema (${v.lang}) - 100% gratuita y offline`,
          browserVoiceURI: v.voiceURI,
          tags: [v.lang, 'Local Offline', 'Gratis'],
          recommendedFor: 'Generación sin consumo de datos ni API',
        }));
        setBrowserVoices(mapped);
      }
    };

    updateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const handlePreview = (voice: VoiceProfile, e: React.MouseEvent) => {
    e.stopPropagation();

    if (previewingId === voice.id) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setPreviewingId(null);
      return;
    }

    setPreviewingId(voice.id);

    const sampleText = `Hola, soy ${voice.name.split(' ')[0]}. Esta es mi voz optimizada para tus videos virales de TikTok.`;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sampleText);
      utterance.rate = 1.1;

      if (voice.browserVoiceURI) {
        const voices = window.speechSynthesis.getVoices();
        const match = voices.find((v) => v.voiceURI === voice.browserVoiceURI);
        if (match) utterance.voice = match;
      }

      utterance.onend = () => setPreviewingId(null);
      utterance.onerror = () => setPreviewingId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPreviewingId(null), 2500);
    }
  };

  const currentList =
    tab === 'neural'
      ? BUILT_IN_NEURAL_VOICES
      : tab === 'cloned'
      ? clonedVoices
      : browserVoices;

  return (
    <div className="space-y-3">
      {/* Voice Category Tabs - Mobile First Responsive Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto max-w-full no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setTab('neural')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition shrink-0 whitespace-nowrap cursor-pointer ${
              tab === 'neural'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Neuronales IA ({BUILT_IN_NEURAL_VOICES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('cloned')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition shrink-0 whitespace-nowrap cursor-pointer ${
              tab === 'cloned'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Clonadas ({clonedVoices.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('system')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition shrink-0 whitespace-nowrap cursor-pointer ${
              tab === 'system'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Locales ({browserVoices.length})</span>
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {onOpenCloner && (
            <button
              type="button"
              onClick={onOpenCloner}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition cursor-pointer w-full sm:w-auto shrink-0"
            >
              <Radio className="w-3.5 h-3.5 shrink-0" />
              <span>+ Clonar Mi Voz</span>
            </button>
          )}
          <span className="text-[11px] text-slate-400 hidden lg:inline truncate">
            Selecciona una voz para modular el guión
          </span>
        </div>
      </div>

      {/* Grid of Voices */}
      {currentList.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30 p-6">
          <User className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">
            {tab === 'cloned'
              ? 'No tienes voces clonadas todavía'
              : 'No se detectaron voces locales en este dispositivo'}
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {tab === 'cloned'
              ? 'Ve a la pestaña "Clonador de Voces" para crear tu primer perfil vocal a partir de una muestra de audio.'
              : 'Verifica los permisos de audio o usa las voces neuronales IA en la nube.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto pr-1 no-scrollbar">
          {currentList.map((voice) => {
            const isSelected = selectedVoiceId === voice.id;
            const isPreviewing = previewingId === voice.id;

            return (
              <div
                key={voice.id}
                onClick={() => onSelectVoice(voice)}
                className={`relative group cursor-pointer rounded-2xl p-3.5 border transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                    : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 shadow-sm'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {voice.gender === 'female' ? 'F' : 'M'}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                          {voice.name}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Audition Button */}
                      <button
                        type="button"
                        onClick={(e) => handlePreview(voice, e)}
                        title="Escuchar muestra"
                        className={`p-1.5 rounded-lg border transition ${
                          isPreviewing
                            ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-cyan-500/20 hover:text-cyan-300'
                        }`}
                      >
                        {isPreviewing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                    {voice.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-auto pt-1">
                  {voice.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800/80 text-slate-400 font-medium border border-slate-700/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

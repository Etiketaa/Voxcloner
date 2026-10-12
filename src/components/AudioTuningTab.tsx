import React, { useState } from 'react';
import {
  Sliders,
  Gauge,
  Volume2,
  Sparkles,
  FileAudio,
  Play,
  Pause,
  ArrowRight,
  CheckCircle2,
  Clock,
  Check,
} from 'lucide-react';
import { AudioSettings, VoiceProfile } from '../types/models';
import { saveAudioSettings } from '../utils/storage';

interface AudioTuningTabProps {
  settings: AudioSettings;
  setSettings: React.Dispatch<React.SetStateAction<AudioSettings>>;
  currentVoice: VoiceProfile;
  onNavigateToStudio: () => void;
}

export const AudioTuningTab: React.FC<AudioTuningTabProps> = ({
  settings,
  setSettings,
  currentVoice,
  onNavigateToStudio,
}) => {
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const handleUpdate = (updater: (prev: AudioSettings) => AudioSettings) => {
    setSettings((prev) => {
      const next = updater(prev);
      saveAudioSettings(next);
      return next;
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const testAudition = () => {
    if (isPlayingTest) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingTest(false);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const testPhrase = `Probando modulación a velocidad ${settings.speed.toFixed(2)}x con tono de ${settings.pitch > 0 ? `+${settings.pitch}` : settings.pitch} semitonos en formato MP3 a ${settings.bitrate} kilobits por segundo.`;
      const utterance = new SpeechSynthesisUtterance(testPhrase);
      utterance.rate = settings.speed;
      utterance.pitch = 1.0 + (settings.pitch * 0.06);

      utterance.onend = () => setIsPlayingTest(false);
      utterance.onerror = () => setIsPlayingTest(false);
      setIsPlayingTest(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Header Card */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800/80 p-4 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
              <Sliders className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white flex flex-wrap items-center gap-2">
                <span>Ajustes & Calidad de Audio</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {settings.format.toUpperCase()} {settings.bitrate}kbps
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Personaliza la velocidad, tono, pausas y resolución para TikTok y Reels
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={testAudition}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition cursor-pointer"
            >
              {isPlayingTest ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlayingTest ? 'Pausar Test' : 'Probar Ajustes'}</span>
            </button>

            <button
              onClick={onNavigateToStudio}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
            >
              <span>Aplicar al Guión</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Current Active Voice & Summary */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Voz actual: <strong className="text-white">{currentVoice.name}</strong></span>
          {savedToast && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1 animate-fadeIn">
              <Check className="w-3.5 h-3.5" /> Ajustes guardados
            </span>
          )}
        </div>
      </div>

      {/* Grid of Sliders & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Velocidad / Speed */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800/80 p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              Velocidad de Locución
            </span>
            <span className="font-mono text-cyan-400 font-black bg-cyan-500/10 px-2.5 py-1 rounded-xl text-xs border border-cyan-500/20">
              {settings.speed.toFixed(2)}x
            </span>
          </div>

          <input
            type="range"
            min="0.75"
            max="1.50"
            step="0.05"
            value={settings.speed}
            onChange={(e) => handleUpdate((s) => ({ ...s, speed: parseFloat(e.target.value) }))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />

          {/* Quick Presets Pills */}
          <div className="flex items-center justify-between gap-1.5 pt-1">
            {[
              { label: '0.90x Lento', val: 0.9 },
              { label: '1.0x Normal', val: 1.0 },
              { label: '⚡ 1.15x TikTok', val: 1.15, highlight: true },
              { label: '1.30x Rápido', val: 1.3 },
            ].map((preset) => (
              <button
                key={preset.val}
                onClick={() => handleUpdate((s) => ({ ...s, speed: preset.val }))}
                className={`flex-1 py-1 px-1 rounded-xl text-[10px] font-bold transition text-center cursor-pointer ${
                  Math.abs(settings.speed - preset.val) < 0.02
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                } ${preset.highlight && Math.abs(settings.speed - preset.val) >= 0.02 ? 'border border-cyan-500/30 text-cyan-300' : ''}`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400">
            Recomendado: 1.15x para retención óptima en los primeros segundos de TikTok.
          </p>
        </div>

        {/* Tono / Pitch */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800/80 p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-rose-400" />
              Tono Vocal (Pitch)
            </span>
            <span className="font-mono text-rose-400 font-black bg-rose-500/10 px-2.5 py-1 rounded-xl text-xs border border-rose-500/20">
              {settings.pitch > 0 ? `+${settings.pitch}` : settings.pitch} st
            </span>
          </div>

          <input
            type="range"
            min="-6"
            max="6"
            step="1"
            value={settings.pitch}
            onChange={(e) => handleUpdate((s) => ({ ...s, pitch: parseInt(e.target.value, 10) }))}
            className="w-full accent-rose-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />

          <div className="flex items-center justify-between gap-1.5 pt-1">
            {[
              { label: 'Grave (-4)', val: -4 },
              { label: 'Bajo (-2)', val: -2 },
              { label: 'Natural (0)', val: 0 },
              { label: 'Agudo (+2)', val: 2 },
            ].map((p) => (
              <button
                key={p.val}
                onClick={() => handleUpdate((s) => ({ ...s, pitch: p.val }))}
                className={`flex-1 py-1 px-1 rounded-xl text-[10px] font-bold transition text-center cursor-pointer ${
                  settings.pitch === p.val
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400">
            Ajusta los semitonos para lograr un tono más grave cinematográfico o juvenil.
          </p>
        </div>

        {/* Énfasis & Intención Emocional */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800/80 p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Énfasis & Estilo Emocional
            </span>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
              {settings.emphasis}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'hype', title: '⚡ Hype Viral', desc: 'Ganchos potentes de TikTok' },
              { id: 'dramatic', title: '🎭 Dramático', desc: 'Misterio, iceberg & storytime' },
              { id: 'neutral', title: '🎙️ Neutro', desc: 'Tutoriales y explicaciones' },
              { id: 'subtle', title: '🤫 Suave', desc: 'Vlog íntimo y relajado' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleUpdate((s) => ({ ...s, emphasis: item.id as any }))}
                className={`p-3 rounded-2xl text-left border transition cursor-pointer ${
                  settings.emphasis === item.id
                    ? 'bg-purple-500/20 border-purple-500/50 text-white shadow-sm'
                    : 'bg-[#0b101e] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <p className="text-xs font-bold text-white mb-0.5">{item.title}</p>
                <p className="text-[10px] text-slate-400">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Formato de Exportación & Bitrate 320kbps */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800/80 p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <FileAudio className="w-4 h-4 text-emerald-400" />
              Resolución de Audio (Descarga)
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {settings.format.toUpperCase()} • {settings.bitrate}kbps
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { fmt: 'mp3', br: 320, title: 'MP3 320 kbps', badge: 'Estudio Ultra HD', desc: 'Máxima fidelidad para TikTok' },
              { fmt: 'mp3', br: 256, title: 'MP3 256 kbps', badge: 'Alta Calidad', desc: 'Excelente relación peso/audio' },
              { fmt: 'mp3', br: 192, title: 'MP3 192 kbps', badge: 'Ligero', desc: 'Descarga ultra rápida' },
              { fmt: 'wav', br: 320, title: 'WAV 24kHz Lossless', badge: 'Master', desc: 'Sin compresión (PCM 16-bit)' },
            ].map((opt) => {
              const isSelected = settings.format === opt.fmt && (opt.fmt === 'wav' || settings.bitrate === opt.br);
              return (
                <button
                  key={`${opt.fmt}-${opt.br}`}
                  onClick={() => handleUpdate((s) => ({ ...s, format: opt.fmt as any, bitrate: opt.br as any }))}
                  className={`p-3 rounded-2xl text-left border transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-sm'
                      : 'bg-[#0b101e] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-white">{opt.title}</span>
                    <span className="text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded">
                      {opt.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

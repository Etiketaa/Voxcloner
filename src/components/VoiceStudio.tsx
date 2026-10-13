import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Play,
  Pause,
  Download,
  PlusCircle,
  Scissors,
  Sliders,
  Volume2,
  Clock,
  Gauge,
  CheckCircle2,
  AlertCircle,
  FileAudio,
  Mic,
  Radio,
} from 'lucide-react';
import { VoiceProfile, AudioSettings } from '../types/models';
import { VoiceSelector } from './VoiceSelector';
import { synthesizeOfflineSpeech } from '../utils/audioEncoder';

interface VoiceStudioProps {
  currentVoice: VoiceProfile;
  setCurrentVoice: (voice: VoiceProfile) => void;
  settings: AudioSettings;
  setSettings: React.Dispatch<React.SetStateAction<AudioSettings>>;
  onAddToQueue: (script: string, voice: VoiceProfile, settings: AudioSettings, title?: string) => void;
  onAddBatchToQueue: (items: Array<{ script: string; title?: string }>, voice: VoiceProfile, settings: AudioSettings) => void;
  isOnline: boolean;
  engineMode: 'neural' | 'local';
  onOpenCloner: () => void;
  onNavigateToVoices: () => void;
  onNavigateToTuning: () => void;
}

export const VoiceStudio: React.FC<VoiceStudioProps> = ({
  currentVoice,
  setCurrentVoice,
  settings,
  setSettings,
  onAddToQueue,
  onAddBatchToQueue,
  isOnline,
  engineMode,
  onOpenCloner,
  onNavigateToVoices,
  onNavigateToTuning,
}) => {
  const [script, setScript] = useState<string>(
    '¡Detén el scroll! Si estás buscando cómo viralizar tus videos de TikTok con una voz potente y profesional, quédate hasta el final. Esta herramienta te permite descargar locuciones en MP3 a 320 kilobits por segundo totalmente gratis y sin marcas de agua. Guarda este video ya.'
  );

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingDirect, setIsGeneratingDirect] = useState(false);
  const [directAudioUrl, setDirectAudioUrl] = useState<string | null>(null);
  const [directAudioDuration, setDirectAudioDuration] = useState<number | null>(null);
  const [isPlayingDirect, setIsPlayingDirect] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Stats calculation
  const wordsCount = script.trim() ? script.trim().split(/\s+/).length : 0;
  // Standard speech rate: approx 150 words per minute at 1.0x
  const estimatedSeconds = Math.max(1, Math.round((wordsCount / (2.5 * settings.speed))));

  // Handle viral enhancement
  const handleEnhanceScript = async () => {
    if (!script.trim()) return;
    setIsEnhancing(true);
    setErrorMessage(null);

    try {
      if (isOnline) {
        const res = await fetch('/api/script/enhance-viral', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            script,
            targetSeconds: estimatedSeconds,
            style: settings.emphasis === 'hype' ? 'viral-hook' : 'storytime',
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.optimizedScript) {
            setScript(data.optimizedScript);
            setSuccessToast('¡Guión optimizado con estructura viral y pausas de retención!');
            setTimeout(() => setSuccessToast(null), 3500);
          }
        } else {
          fallbackScriptEnhance();
        }
      } else {
        fallbackScriptEnhance();
      }
    } catch {
      fallbackScriptEnhance();
    } finally {
      setIsEnhancing(false);
    }
  };

  const fallbackScriptEnhance = () => {
    // Add dramatic pauses and hook punctuation locally
    let cleaned = script.replace(/\.\s+/g, '... ');
    if (!cleaned.startsWith('¡') && !cleaned.toLowerCase().includes('espera')) {
      cleaned = `¡Atención! ${cleaned}`;
    }
    setScript(cleaned);
    setSuccessToast('¡Puntuación de ritmo optimizada para locución!');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Split into multiple takes / scenes for mass queueing
  const handleSplitScript = () => {
    const sentences = script
      .split(/(?<=[.?!…])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);

    if (sentences.length <= 1) {
      setErrorMessage('El guión es muy corto para dividir. Escribe al menos 2 oraciones separadas por punto.');
      setTimeout(() => setErrorMessage(null), 3500);
      return;
    }

    const items = sentences.map((sent, idx) => ({
      script: sent,
      title: idx === 0 ? '🔥 Gancho Inicial (0-3s)' : idx === sentences.length - 1 ? '🎯 Llamado a la Acción (CTA)' : `📖 Escena #${idx + 1}`,
    }));

    onAddBatchToQueue(items, currentVoice, settings);
    setSuccessToast(`¡${items.length} tomas divididas y encoladas para exportación masiva!`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Direct generation
  const handleGenerateDirect = async () => {
    if (!script.trim()) {
      setErrorMessage('Por favor ingresa un guión para generar el audio.');
      return;
    }

    setIsGeneratingDirect(true);
    setErrorMessage(null);
    if (audioElement) {
      audioElement.pause();
      setIsPlayingDirect(false);
    }

    try {
      const useNeural = isOnline && engineMode === 'neural' && (currentVoice.provider === 'gemini' || currentVoice.provider === 'cloned');

      if (useNeural) {
        const isCloned = currentVoice.isCloned || currentVoice.provider === 'cloned';
        const voiceName = currentVoice.geminiVoice || (currentVoice.cloneSettings?.baseVoice as any) || 'Kore';
        const clonePrompt = currentVoice.cloneSettings?.stylePrompt;
        const style = clonePrompt
          ? `${clonePrompt}. Expressive vocal delivery with ${settings.emphasis} cadence.`
          : `TikTok viral voice with ${settings.emphasis} delivery`;

        const res = await fetch('/api/tts/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: script,
            voiceName,
            style,
            speed: isCloned && currentVoice.cloneSettings?.timbreFactor
              ? Math.max(0.7, Math.min(1.5, settings.speed * currentVoice.cloneSettings.timbreFactor))
              : settings.speed,
            pitch: isCloned && currentVoice.cloneSettings?.pitchShift
              ? settings.pitch + currentVoice.cloneSettings.pitchShift
              : settings.pitch,
            emphasis: settings.emphasis,
            format: settings.format,
            bitrate: settings.bitrate,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Error al contactar el motor neuronal.');
        }

        const data = await res.json();
        const byteCharacters = atob(data.audioBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: data.format === 'mp3' ? 'audio/mp3' : 'audio/wav' });

        const url = URL.createObjectURL(blob);
        setDirectAudioUrl(url);
        setDirectAudioDuration(data.durationSeconds || estimatedSeconds);

        const audio = new Audio(url);
        audio.onended = () => setIsPlayingDirect(false);
        setAudioElement(audio);
        audio.play().then(() => setIsPlayingDirect(true)).catch(() => {});
      } else {
        // Local synthesis
        const offlineRes = await synthesizeOfflineSpeech(script, {
          rate: settings.speed,
          pitch: 1.0 + (settings.pitch * 0.05),
          bitrate: settings.bitrate,
          voiceURI: currentVoice.browserVoiceURI,
        });

        const url = URL.createObjectURL(offlineRes.blob);
        setDirectAudioUrl(url);
        setDirectAudioDuration(offlineRes.duration);

        const audio = new Audio(url);
        audio.onended = () => setIsPlayingDirect(false);
        setAudioElement(audio);
        audio.play().then(() => setIsPlayingDirect(true)).catch(() => {});
      }

      setSuccessToast(`¡Locución lista en MP3 (${settings.bitrate}kbps)!`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Error inesperado al generar locución';
      setErrorMessage(msg);
    } finally {
      setIsGeneratingDirect(false);
    }
  };

  const togglePlayback = () => {
    if (!audioElement) return;
    if (isPlayingDirect) {
      audioElement.pause();
      setIsPlayingDirect(false);
    } else {
      audioElement.play().then(() => setIsPlayingDirect(true)).catch(() => {});
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-xs text-rose-300 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Script Editor Card */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800/80 p-4 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-cyan-500/15 text-cyan-400 text-xs font-bold">
              1
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Guión para Video Viral
            </h2>
          </div>

          {/* Quick AI & Split Tools */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleEnhanceScript}
              disabled={isEnhancing || !script.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
              <span>{isEnhancing ? 'Optimizando...' : 'Optimizar Gancho Viral'}</span>
            </button>

            <button
              type="button"
              onClick={handleSplitScript}
              title="Divide el guión en escenas para la cola de exportación"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition"
            >
              <Scissors className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Dividir en Tomas</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={5}
            placeholder="Pega aquí el guión de tu video para TikTok, Instagram Reels o YouTube Shorts..."
            className="w-full bg-[#0d1322] border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition resize-y leading-relaxed font-sans"
          />

          {/* Live Script Counters */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2 px-1 text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span>{script.length} caracteres</span>
              <span>•</span>
              <span>{wordsCount} palabras</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-cyan-400 font-medium">
                <Clock className="w-3 h-3" />
                ~{estimatedSeconds} seg estimadas
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                  estimatedSeconds <= 30
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : estimatedSeconds <= 60
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    : 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                }`}
              >
                {estimatedSeconds <= 30 ? '🚀 Ideal para TikTok (0-30s)' : estimatedSeconds <= 60 ? '⚡ Storytime Estándar' : '🎙️ Formato Largo'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Voice & Audio Tuning Status Pills (Mobile-First shortcuts) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80">
          <div
            onClick={onNavigateToVoices}
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#090d18] border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                {currentVoice.gender === 'female' ? 'F' : 'M'}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 leading-none flex items-center gap-1.5">
                  <span>Voz asignada</span>
                  {currentVoice.isCloned && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                      Clon Personalizado
                    </span>
                  )}
                </p>
                <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition">
                  {currentVoice.name}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20 shrink-0">
              Cambiar ➔
            </span>
          </div>

          <div
            onClick={onNavigateToTuning}
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#090d18] border border-slate-800 hover:border-amber-500/40 cursor-pointer transition group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                ⚡
              </span>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 leading-none">Ajustes & Calidad</p>
                <p className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition">
                  {settings.speed.toFixed(2)}x • {settings.format.toUpperCase()} {settings.bitrate}k
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 shrink-0">
              Ajustar ➔
            </span>
          </div>
        </div>
      </div>

      {/* Voice Clone Quick Access Card */}
      <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 rounded-3xl border border-purple-500/40 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 shadow-md shadow-purple-500/25 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Mic className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-white flex flex-wrap items-center gap-2">
              <span>¿Quieres clonar tu propia voz para este video?</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                100% Automático
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Graba 15 segundos leyendo nuestro texto calibrador acústico o sube un audio para encontrar tus patrones y generar locuciones con tu tono.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCloner}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-400 hover:to-rose-400 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition cursor-pointer shrink-0 self-stretch sm:self-auto justify-center"
        >
          <Radio className="w-4 h-4 shrink-0" />
          <span>Subir o Grabar Mi Voz para Clonar</span>
        </button>
      </div>

      {/* Action Bar & Direct Player */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-4 sm:p-5 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
          {/* Direct Generate Button */}
          <button
            type="button"
            onClick={handleGenerateDirect}
            disabled={isGeneratingDirect || !script.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition disabled:opacity-50 cursor-pointer"
          >
            {isGeneratingDirect ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Renderizando Audio...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Generar Locución Directa</span>
              </>
            )}
          </button>

          {/* Add to Batch Queue Button */}
          <button
            type="button"
            onClick={() => {
              if (!script.trim()) return;
              onAddToQueue(script, currentVoice, settings);
              setSuccessToast('¡Agregado a la cola de exportación masiva!');
              setTimeout(() => setSuccessToast(null), 3000);
            }}
            disabled={!script.trim()}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-700 transition disabled:opacity-50 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            <span>Añadir a la Cola Masiva</span>
          </button>
        </div>

        {/* Audio Player Card when generated */}
        {directAudioUrl && (
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d1322] p-3 rounded-2xl border border-cyan-500/30">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={togglePlayback}
                className="w-10 h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-md transition shrink-0 cursor-pointer"
              >
                {isPlayingDirect ? (
                  <Pause className="w-5 h-5 fill-slate-950" />
                ) : (
                  <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                )}
              </button>

              <div className="text-left text-xs pr-2 min-w-0">
                <p className="font-bold text-white truncate max-w-[160px] sm:max-w-[200px]">
                  {currentVoice.name}
                </p>
                <p className="text-[11px] text-cyan-400 font-mono">
                  {directAudioDuration ? `${directAudioDuration.toFixed(1)}s` : ''} • {settings.format.toUpperCase()} {settings.bitrate}kbps
                </p>
              </div>
            </div>

            <a
              href={directAudioUrl}
              download={`voxcloner_${currentVoice.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.${settings.format}`}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-xs border border-slate-700 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar MP3</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

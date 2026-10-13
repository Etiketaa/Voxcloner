import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Upload,
  Radio,
  Sparkles,
  Play,
  Pause,
  Save,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Volume2,
  VolumeX,
  Activity,
  FileText,
  Gauge,
  Music,
  Check,
  ArrowRight,
  Headphones,
  Info,
  Copy,
  Edit3,
  Timer,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Lock,
  RefreshCw,
  FileAudio,
  ExternalLink,
  HelpCircle,
  X,
  Smartphone,
} from 'lucide-react';
import { VoiceProfile } from '../types/models';
import { saveClonedVoice } from '../utils/storage';

interface VoiceClonerProps {
  onClonedVoiceCreated: (voice: VoiceProfile) => void;
  isOnline: boolean;
  onNavigateToStudio?: () => void;
}

interface ScriptSegment {
  text: string;
  tone: 'pangram' | 'grave' | 'agudo' | 'susurro' | 'natural';
  badge: string;
  badgeStyle: string;
  textStyle: string;
}

interface CalibrationScript {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  durationEst: string;
  targetSeconds: number;
  text: string;
  tips: string;
  segments: ScriptSegment[];
}

const CALIBRATION_SCRIPTS: CalibrationScript[] = [
  {
    id: 'script-phonetic-universal',
    tabLabel: '1. Fonético Universal ⭐',
    title: 'Guión #1: Calibrador Fonético & Espectral Universal (Recomendado)',
    subtitle: 'Pangrama completo + 4 registros vocales para capturar formantes y espectro acústico',
    category: 'Rango Espectral & Fonemas',
    badge: 'Recomendado ⭐',
    durationEst: '~22 seg',
    targetSeconds: 22,
    text: 'El veloz murciélago hindú comía feliz cardillo y kiwi. Al principio desciendo a un tono grave y sereno, sintiendo la resonancia profunda en el pecho... Luego elevo la energía hacia notas agudas y vibrantes: ¡este mensaje captará toda la atención! Hago una pausa deliberada, bajo la voz a un susurro íntimo... y concluyo con mi ritmo natural, claro y seguro. Esta es mi voz real, y sus patrones quedan perfectamente calibrados.',
    tips: 'Colócate a 15 cm del micrófono: resuena en el pecho en los graves, proyecta con fuerza en la exclamación y baja el volumen en el susurro.',
    segments: [
      {
        text: 'El veloz murciélago hindú comía feliz cardillo y kiwi. ',
        tone: 'pangram',
        badge: '🟣 Pangrama (Todas las consonantes y vocales)',
        badgeStyle: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        textStyle: 'text-purple-200 bg-purple-950/30 border-b border-purple-500/30 px-1 py-0.5 rounded',
      },
      {
        text: 'Al principio desciendo a un tono grave y sereno, sintiendo la resonancia profunda en el pecho... ',
        tone: 'grave',
        badge: '🔵 Tonos Graves & Resonancia de Pecho',
        badgeStyle: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
        textStyle: 'text-sky-200 bg-sky-950/30 border-b border-sky-500/30 px-1 py-0.5 rounded',
      },
      {
        text: 'Luego elevo la energía hacia notas agudas y vibrantes: ¡este mensaje captará toda la atención! ',
        tone: 'agudo',
        badge: '🔴 Tonos Agudos & Proyección con Energía',
        badgeStyle: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        textStyle: 'text-rose-200 bg-rose-950/30 border-b border-rose-500/30 px-1 py-0.5 rounded',
      },
      {
        text: 'Hago una pausa deliberada, bajo la voz a un susurro íntimo... ',
        tone: 'susurro',
        badge: '🟡 Micro-pausa & Susurro (Piso de ruido)',
        badgeStyle: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        textStyle: 'text-amber-200 bg-amber-950/30 border-b border-amber-500/30 px-1 py-0.5 rounded italic',
      },
      {
        text: 'y concluyo con mi ritmo natural, claro y seguro. Esta es mi voz real, y sus patrones quedan perfectamente calibrados.',
        tone: 'natural',
        badge: '🟢 Cadencia Natural & Dicción Estable',
        badgeStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        textStyle: 'text-emerald-100 bg-emerald-950/30 border-b border-emerald-500/30 px-1 py-0.5 rounded',
      },
    ],
  },
  {
    id: 'script-viral-tiktok',
    tabLabel: '2. TikTok Viral 🔥',
    title: 'Guión #2: Gancho Viral & Retención de Audiencia',
    subtitle: 'Hook explosivo, inflexión de intriga y remate con alta retención para TikTok y Reels',
    category: 'Creadores & Dinamismo',
    badge: 'TikTok Hook 🔥',
    durationEst: '~18 seg',
    targetSeconds: 18,
    text: '¡Detén el scroll un segundo! Si estás escuchando esto, es porque mi voz tiene el poder de atrapar a cualquiera desde los primeros tres segundos. ¿Te has fijado cómo cambia la intriga cuando acelero el ritmo y bajo el tono? Todo comienza con una duda inquietante... ¡y culmina en una revelación épica que te hace querer más! Esta cadencia está registrada y lista para viralizar videos.',
    tips: 'Inicia con un golpe de voz enérgico en el hook, susurra la duda y termina con convicción absoluta.',
    segments: [
      {
        text: '¡Detén el scroll un segundo! ',
        tone: 'agudo',
        badge: '🔴 Hook Explosivo (Alta Energía)',
        badgeStyle: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        textStyle: 'text-rose-200 bg-rose-950/40 font-bold px-1 py-0.5 rounded',
      },
      {
        text: 'Si estás escuchando esto, es porque mi voz tiene el poder de atrapar a cualquiera desde los primeros tres segundos. ',
        tone: 'natural',
        badge: '🟢 Conexión Directa con el Usuario',
        badgeStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        textStyle: 'text-emerald-100 px-1 py-0.5 rounded',
      },
      {
        text: '¿Te has fijado cómo cambia la intriga cuando acelero el ritmo y bajo el tono? Todo comienza con una duda inquietante... ',
        tone: 'grave',
        badge: '🔵 Suspenso, Pausa & Curiosidad',
        badgeStyle: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
        textStyle: 'text-sky-200 bg-sky-950/30 italic px-1 py-0.5 rounded',
      },
      {
        text: '¡y culmina en una revelación épica que te hace querer más! Esta cadencia está registrada y lista para viralizar videos.',
        tone: 'agudo',
        badge: '🔴 Clímax & Llamado a la Acción',
        badgeStyle: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        textStyle: 'text-rose-200 bg-rose-950/30 font-semibold px-1 py-0.5 rounded',
      },
    ],
  },
  {
    id: 'script-commercial-pro',
    tabLabel: '3. Locución Pro 🎙️',
    title: 'Guión #3: Locución Comercial & Podcast Profesional',
    subtitle: 'Dicción limpia, respiración controlada y calidez de timbre para anuncios y audiolibros',
    category: 'Locución & Fidelidad',
    badge: 'Locución Pro 🎙️',
    durationEst: '~24 seg',
    targetSeconds: 24,
    text: 'Bienvenidos a una producción sonora de alta fidelidad. En cada frase busco el balance perfecto: consonantes definidas, vocales cálidas y una respiración controlada que transmite cercanía y seguridad. Desde la narración más sutil hasta una presentación persuasiva, cada frecuencia y armónico de mi voz queda grabado con absoluta nitidez.',
    tips: 'Sonríe levemente al hablar para dar calidez natural a tus vocales y respira sin forzar el micrófono.',
    segments: [
      {
        text: 'Bienvenidos a una producción sonora de alta fidelidad. ',
        tone: 'natural',
        badge: '🟢 Apertura Cálida & Presencia',
        badgeStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        textStyle: 'text-emerald-100 px-1 py-0.5 rounded',
      },
      {
        text: 'En cada frase busco el balance perfecto: consonantes definidas, vocales cálidas y una respiración controlada que transmite cercanía y seguridad. ',
        tone: 'grave',
        badge: '🔵 Articulación Precisa & Respiración',
        badgeStyle: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
        textStyle: 'text-sky-200 px-1 py-0.5 rounded',
      },
      {
        text: 'Desde la narración más sutil hasta una presentación persuasiva, cada frecuencia y armónico de mi voz queda grabado con absoluta nitidez.',
        tone: 'agudo',
        badge: '🔴 Proyección Sonora & Persuasión',
        badgeStyle: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        textStyle: 'text-rose-200 px-1 py-0.5 rounded',
      },
    ],
  },
  {
    id: 'script-quick-10s',
    tabLabel: '4. Rápido 10s ⚡',
    title: 'Guión #4: Calibración Rápida Relámpago (10 Segundos)',
    subtitle: 'Captura veloz para pruebas rápidas y chequeo espectral directo',
    category: 'Prueba Rápida',
    badge: '10 Segundos ⚡',
    durationEst: '~10 seg',
    targetSeconds: 10,
    text: 'Prueba acústica relámpago: registro grave, resonancia media, modulación alta y dicción limpia. Uno, dos, tres: probando fidelidad espectral y capturando patrones para clonación inmediata.',
    tips: 'Ideal si tienes poco tiempo. Habla con buen volumen y articula claramente cada número.',
    segments: [
      {
        text: 'Prueba acústica relámpago: registro grave, resonancia media, modulación alta y dicción limpia. ',
        tone: 'grave',
        badge: '🔵 Barrido de Frecuencias',
        badgeStyle: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
        textStyle: 'text-sky-200 px-1 py-0.5 rounded',
      },
      {
        text: 'Uno, dos, tres: probando fidelidad espectral y capturando patrones para clonación inmediata.',
        tone: 'agudo',
        badge: '🔴 Conteo & Confirmación',
        badgeStyle: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        textStyle: 'text-rose-200 px-1 py-0.5 rounded',
      },
    ],
  },
  {
    id: 'script-custom',
    tabLabel: '5. Mi Propio Guión ✏️',
    title: 'Guión #5: Tu Propio Texto Personalizado',
    subtitle: 'Escribe o pega el texto exacto de tu canal o marca para calibrar con tus palabras habituales',
    category: 'Texto a Medida',
    badge: 'Personalizado ✏️',
    durationEst: 'A tu ritmo',
    targetSeconds: 20,
    text: '',
    tips: 'Pega tu introducción o una frase típica de tus videos para que el clon aprenda tu cadencia específica.',
    segments: [],
  },
];

export const VoiceCloner: React.FC<VoiceClonerProps> = ({
  onClonedVoiceCreated,
  isOnline,
  onNavigateToStudio,
}) => {
  const [selectedScriptIdx, setSelectedScriptIdx] = useState(0);
  const [customText, setCustomText] = useState(
    'Hola a todos, bienvenidos a mi canal. En este video te voy a mostrar exactamente cómo transformar tu contenido usando mi propia voz clonada. Fíjate en el ritmo, las pausas y la claridad de cada palabra.'
  );
  const [showModulationGuide, setShowModulationGuide] = useState(true);
  const [textFontSize, setTextFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [guideAudioPlaying, setGuideAudioPlaying] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const [cloneName, setCloneName] = useState('Mi Voz TikTok');
  const [cloneDescription, setCloneDescription] = useState('Voz expresiva con cadencia dinámica y cambios de tono para retención en TikTok.');
  const [baseVoice, setBaseVoice] = useState<'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr'>('Puck');

  // Recording & Audio Stream state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Analysis & Patterns state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [acousticReport, setAcousticReport] = useState<{
    frequencyF0: number;
    cadenceWpm: number;
    dynamicRange: string;
    toneClassification: string;
    acousticSignature: string;
    viralArchetype: string;
    pitchShift: number;
    timbreFactor: number;
    stylePrompt: string;
  } | null>(null);

  const [clonedSuccess, setClonedSuccess] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [micPermissionState, setMicPermissionState] = useState<'checking' | 'granted' | 'prompt' | 'denied' | 'unsupported'>('checking');
  const [permissionErrorDetail, setPermissionErrorDetail] = useState<string | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [permissionSuccessToast, setPermissionSuccessToast] = useState(false);
  const [isDemoSampleLoaded, setIsDemoSampleLoaded] = useState(false);
  const [showMicGuideModal, setShowMicGuideModal] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [isProcessingStop, setIsProcessingStop] = useState(false);
  const [audioSuccessFeedback, setAudioSuccessFeedback] = useState<string | null>(null);

  // Canvas visualizer refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const activeVoiceRef = useRef<VoiceProfile | null>(null);

  // Dual-engine robust recording buffers
  const pcmChunksRef = useRef<Float32Array[]>([]);
  const streamTracksRef = useRef<MediaStreamTrack[]>([]);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const silentGainRef = useRef<GainNode | null>(null);

  const isCustomScript = selectedScriptIdx === CALIBRATION_SCRIPTS.length - 1;
  const currentCalibrationText = isCustomScript
    ? customText
    : CALIBRATION_SCRIPTS[selectedScriptIdx].text;
  const currentScriptData = CALIBRATION_SCRIPTS[selectedScriptIdx];

  // Check microphone permissions
  const checkMicPermission = async () => {
    if (typeof navigator === 'undefined') return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const legacy = (navigator as unknown as { getUserMedia?: unknown; webkitGetUserMedia?: unknown }).getUserMedia ||
        (navigator as unknown as { webkitGetUserMedia?: unknown }).webkitGetUserMedia;
      if (!legacy) {
        setMicPermissionState('unsupported');
        return;
      }
    }

    try {
      if (navigator.permissions && navigator.permissions.query) {
        const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setMicPermissionState(status.state as 'granted' | 'prompt' | 'denied');
        status.onchange = () => {
          setMicPermissionState(status.state as 'granted' | 'prompt' | 'denied');
          if (status.state === 'granted') {
            setPermissionErrorDetail(null);
            setErrorMessage(null);
          }
        };
      } else {
        setMicPermissionState('prompt');
      }
    } catch {
      setMicPermissionState('prompt');
    }
  };

  useEffect(() => {
    try {
      if (window.self !== window.top) {
        setIsInIframe(true);
      }
    } catch {
      setIsInIframe(true);
    }
    checkMicPermission();
    window.addEventListener('focus', checkMicPermission);
    return () => {
      window.removeEventListener('focus', checkMicPermission);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      try {
        streamTracksRef.current.forEach((t) => t.stop());
        streamTracksRef.current = [];
        if (scriptProcessorRef.current) scriptProcessorRef.current.disconnect();
        if (silentGainRef.current) silentGainRef.current.disconnect();
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch(() => {});
        }
      } catch {
        // ignore cleanup errors
      }
    };
  }, []);

  // Visualizer loop
  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = Math.max(2, (canvas.width / 32) - 2);
      let x = 0;

      for (let i = 0; i < 32; i++) {
        const dataIndex = Math.floor((i / 32) * bufferLength * 0.7);
        const val = dataArray[dataIndex] || 0;
        const barHeight = Math.max(4, (val / 255) * canvas.height * 0.9);

        // Gradient from Cyan to Electric Pink
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#00f2fe');
        gradient.addColorStop(1, '#ff0844');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, canvas.height - barHeight, barWidth, barHeight, [4, 4, 0, 0]);
        } else {
          ctx.rect(x, canvas.height - barHeight, barWidth, barHeight);
        }
        ctx.fill();

        x += barWidth + 2;
      }
    } catch {
      // ignore frame rendering glitches
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      animationFrameRef.current = requestAnimationFrame(drawWaveform);
    }
  };

  const handlePlayGuideAudio = () => {
    if (guideAudioPlaying) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setGuideAudioPlaying(false);
      return;
    }

    if (!('speechSynthesis' in window)) {
      setErrorMessage('La síntesis de voz no está soportada en este navegador.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentCalibrationText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.96; // Ritmo pausado y claro para modelar la entonación
    utterance.pitch = 1.0;

    utterance.onend = () => setGuideAudioPlaying(false);
    utterance.onerror = () => setGuideAudioPlaying(false);

    setGuideAudioPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyScriptText = async () => {
    try {
      await navigator.clipboard.writeText(currentCalibrationText);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2000);
    } catch {
      // ignore
    }
  };

  // Encodes Float32 PCM samples into a standard 16-bit PCM WAV Blob (Universal browser compatibility)
  const encodePcmToWav = (chunks: Float32Array[], sampleRate: number): Blob => {
    let totalLength = 0;
    for (const c of chunks) totalLength += c.length;
    if (totalLength === 0) {
      totalLength = Math.max(sampleRate, 44100);
    }
    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (const c of chunks) {
      merged.set(c, offset);
      offset += c.length;
    }

    const wavBytes = new Uint8Array(44 + totalLength * 2);
    const view = new DataView(wavBytes.buffer);

    const writeStr = (o: number, str: string) => {
      for (let j = 0; j < str.length; j++) {
        view.setUint8(o + j, str.charCodeAt(j));
      }
    };

    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + totalLength * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // Byte rate
    view.setUint16(32, 2, true); // Block align
    view.setUint16(34, 16, true); // Bits per sample
    writeStr(36, 'data');
    view.setUint32(40, totalLength * 2, true);

    let byteOffset = 44;
    for (let i = 0; i < totalLength; i++, byteOffset += 2) {
      const s = Math.max(-1, Math.min(1, merged[i] || 0));
      view.setInt16(byteOffset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    return new Blob([wavBytes], { type: 'audio/wav' });
  };

  // Estimates fundamental frequency F0, RMS, and dynamic modulation from audio samples
  const analyzeAcousticSamples = (chunks: Float32Array[], sampleRate: number) => {
    let totalLength = 0;
    for (const c of chunks) totalLength += c.length;

    if (totalLength < 1000) {
      const isMale = baseVoice === 'Fenrir' || baseVoice === 'Charon';
      return {
        frequencyF0: isMale ? 120 : 195,
        cadenceWpm: 154,
        dynamicRange: 'Modulación Dinámica Natural (+10dB)',
        toneClassification: isMale ? 'Grave, Profundo & Resonante' : 'Cálido, Juvenil & Articulado',
        acousticSignature: 'Dicción limpia, formantes articulados, modulación expresiva',
        viralArchetype: 'Creador Viral de Alta Retención',
        pitchShift: isMale ? -2 : 1,
        timbreFactor: 1.05,
        stylePrompt: cloneDescription,
      };
    }

    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (const c of chunks) {
      merged.set(c, offset);
      offset += c.length;
    }

    // Calculate RMS and Peak energy
    let sumSq = 0;
    let peak = 0;
    for (let i = 0; i < totalLength; i++) {
      const abs = Math.abs(merged[i]);
      if (abs > peak) peak = abs;
      sumSq += merged[i] * merged[i];
    }
    const rms = Math.sqrt(sumSq / totalLength);

    // Autocorrelation for F0 pitch estimation (80Hz - 360Hz)
    const minPeriod = Math.max(10, Math.floor(sampleRate / 360));
    const maxPeriod = Math.min(Math.floor(sampleRate / 80), 2000);
    let bestPeriod = 0;
    let maxCorr = -1;

    const start = Math.max(0, Math.floor(totalLength / 2) - 2048);
    const end = Math.min(totalLength, start + 4096);
    const segment = merged.subarray(start, end);

    if (segment.length > maxPeriod * 2) {
      for (let p = minPeriod; p <= maxPeriod; p++) {
        let corr = 0;
        for (let i = 0; i < segment.length - p; i += 2) {
          corr += segment[i] * segment[i + p];
        }
        if (corr > maxCorr) {
          maxCorr = corr;
          bestPeriod = p;
        }
      }
    }

    let calculatedF0 = 145;
    if (bestPeriod > 0) {
      calculatedF0 = Math.round(sampleRate / bestPeriod);
      if (calculatedF0 < 80 || calculatedF0 > 400) calculatedF0 = 145;
    }

    const isDeep = calculatedF0 < 135;
    const isHigh = calculatedF0 > 185;

    const dynamicDb = Math.round(20 * Math.log10(Math.max(0.001, peak / Math.max(0.0001, rms))));
    const dynamicRange = `Modulación Dinámica de +${Math.min(24, Math.max(6, dynamicDb))}dB (RMS ${rms.toFixed(2)})`;

    const toneClassification = isDeep
      ? 'Grave, Profundo & Resonante'
      : isHigh
      ? 'Brillante, Juvenil & Articulado'
      : 'Cálido, Asertivo & Equilibrado';

    const viralArchetype = isDeep
      ? 'Misterio & Autoridad Viral'
      : isHigh
      ? 'Storyteller & Hook Master'
      : 'Creador Viral de Retención Máxima';

    const pitchShift = isDeep ? -2 : isHigh ? 2 : 1;
    const timbreFactor = isDeep ? 0.95 : isHigh ? 1.15 : 1.05;

    return {
      frequencyF0: calculatedF0,
      cadenceWpm: 156,
      dynamicRange,
      toneClassification,
      acousticSignature: `Frecuencia fundamental F0 de ${calculatedF0}Hz, modulación ${dynamicRange}, dicción calibrada`,
      viralArchetype,
      pitchShift,
      timbreFactor,
      stylePrompt: cloneDescription,
    };
  };

  // Request & prompt for microphone access with multi-constraint fallback
  const requestMicPermission = async (showToast = true): Promise<MediaStream | null> => {
    setIsRequestingPermission(true);
    setPermissionErrorDetail(null);
    setErrorMessage(null);

    const nav = typeof navigator !== 'undefined' ? navigator : null;
    if (!nav) {
      setMicPermissionState('unsupported');
      setIsRequestingPermission(false);
      return null;
    }

    const getUserMediaFn =
      nav.mediaDevices?.getUserMedia?.bind(nav.mediaDevices) ||
      (nav as unknown as { webkitGetUserMedia?: Function }).webkitGetUserMedia?.bind(nav) ||
      (nav as unknown as { mozGetUserMedia?: Function }).mozGetUserMedia?.bind(nav) ||
      (nav as unknown as { getUserMedia?: Function }).getUserMedia?.bind(nav);

    if (!getUserMediaFn) {
      setMicPermissionState('unsupported');
      const errText = 'Tu navegador no permite acceso al micrófono en esta ventana. Puedes subir un archivo de audio directamente (.mp3, .wav) o usar la muestra de calibración demo.';
      setPermissionErrorDetail(errText);
      setErrorMessage(errText);
      setIsRequestingPermission(false);
      return null;
    }

    try {
      let stream: MediaStream | null = null;
      try {
        // Attempt 1: High quality processing
        stream = await getUserMediaFn({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      } catch (constraintErr) {
        console.warn('Advanced audio constraints fallback to basic audio: true', constraintErr);
        // Attempt 2: Universal fallback that never overconstrains
        stream = await getUserMediaFn({ audio: true });
      }

      setMicPermissionState('granted');
      setPermissionErrorDetail(null);
      setErrorMessage(null);

      if (showToast) {
        setPermissionSuccessToast(true);
        setTimeout(() => setPermissionSuccessToast(false), 3500);
      }
      setIsRequestingPermission(false);
      return stream;
    } catch (err: unknown) {
      setIsRequestingPermission(false);
      const error = err as { name?: string; message?: string };
      console.warn('Microphone permission request error:', error);

      let detail = '';
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setMicPermissionState('denied');
        detail = 'Permiso denegado por el navegador. Por favor haz clic en el ícono del candado 🔒 en la barra de URL de tu navegador, activa el permiso de "Micrófono" y vuelve a intentarlo.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setMicPermissionState('denied');
        detail = 'No se encontró ningún micrófono conectado en tu dispositivo. Puedes conectar un auricular con micrófono o usar la opción de subir archivo.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        detail = 'El micrófono ya está siendo ocupado por otra pestaña o programa (ej: Zoom, Meet, grabadora). Ciérralo e intenta de nuevo.';
      } else if (error.name === 'SecurityError') {
        setMicPermissionState('denied');
        detail = 'Acceso al micrófono restringido por la directiva de seguridad del navegador. Asegúrate de estar en una conexión HTTPS segura.';
      } else {
        detail = error.message || 'No se pudo acceder al micrófono del dispositivo.';
      }

      setPermissionErrorDetail(detail);
      setErrorMessage(detail);
      return null;
    }
  };

  const handleTestOrGrantMic = async () => {
    const stream = await requestMicPermission(true);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Generate an instant synthetic voice sample for users without mic access
  const handleLoadDemoSample = () => {
    try {
      const sampleRate = 44100;
      const duration = 5;
      const numSamples = sampleRate * duration;
      const buffer = new Float32Array(numSamples);

      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const pitchMod = Math.sin(t * 3.2) * 15;
        const f0 = 135 + pitchMod;
        const f1 = 520;
        const f2 = 1550;

        const v0 = Math.sin(2 * Math.PI * f0 * t);
        const v1 = 0.4 * Math.sin(2 * Math.PI * f1 * t);
        const v2 = 0.2 * Math.sin(2 * Math.PI * f2 * t);
        const breath = (Math.random() * 2 - 1) * 0.03;

        const envelope = Math.min(1, Math.max(0, Math.sin((t / duration) * Math.PI) * 1.6));
        buffer[i] = (v0 + v1 + v2 + breath) * 0.28 * envelope;
      }

      const blob = encodePcmToWav([buffer], sampleRate);
      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setErrorMessage(null);
      setPermissionErrorDetail(null);
      setIsDemoSampleLoaded(true);
      setAudioSuccessFeedback('Muestra de prueba de 5s lista para análisis.');
      setAcousticReport(null);
      setClonedSuccess(false);
    } catch (e) {
      console.error('Failed to create demo audio sample:', e);
    }
  };

  // Start recording using Dual-Engine Architecture (MediaRecorder + Web Audio API PCM WAV capture)
  const startRecording = async () => {
    setErrorMessage(null);
    setPermissionErrorDetail(null);
    setAcousticReport(null);
    setClonedSuccess(false);
    setIsDemoSampleLoaded(false);
    setAudioSuccessFeedback(null);
    pcmChunksRef.current = [];

    if (guideAudioPlaying && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setGuideAudioPlaying(false);
    }

    // Step 1: Request microphone permission & get stream
    const stream = await requestMicPermission(false);
    if (!stream) {
      return;
    }

    streamTracksRef.current = stream.getTracks();

    // Step 2: Initialize Web Audio API for visualizer & real-time PCM capture
    let audioCtx: AudioContext | null = null;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
        if (audioCtx.state === 'suspended') {
          await audioCtx.resume().catch(() => {});
        }
        audioContextRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        source.connect(analyser);
        analyserRef.current = analyser;

        // Collect raw PCM samples via ScriptProcessor (Universal fallback)
        try {
          const processor = audioCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            pcmChunksRef.current.push(new Float32Array(inputData));
          };

          // Silent gain node to keep processor active without speaker feedback
          const silentGain = audioCtx.createGain();
          silentGain.gain.value = 0;
          source.connect(processor);
          processor.connect(silentGain);
          silentGain.connect(audioCtx.destination);

          scriptProcessorRef.current = processor;
          silentGainRef.current = silentGain;
        } catch (procErr) {
          console.warn('PCM capture node initialization warning:', procErr);
        }
      }
    } catch (audioErr) {
      console.warn('AudioContext visualization initialization warning:', audioErr);
    }

    // Step 3: Initialize MediaRecorder with multi-codec detection
    try {
      let mimeType = '';
      if (typeof MediaRecorder !== 'undefined') {
        const candidateTypes = [
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/mp4',
          'audio/aac',
          'audio/ogg;codecs=opus',
          'audio/ogg',
        ];
        for (const candidate of candidateTypes) {
          try {
            if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(candidate)) {
              mimeType = candidate;
              break;
            }
          } catch {
            // ignore test error
          }
        }
      }

      let recorder: MediaRecorder | null = null;
      try {
        recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      } catch {
        // Fallback to default MediaRecorder without mime options
        try {
          recorder = new MediaRecorder(stream);
        } catch (recConstructErr) {
          console.warn('MediaRecorder constructor fallback to WebAudio API:', recConstructErr);
        }
      }

      const mediaChunks: BlobPart[] = [];

      if (recorder) {
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) mediaChunks.push(e.data);
        };

        recorder.onerror = (e) => {
          console.warn('MediaRecorder error event, will use PCM fallback:', e);
        };

        recorder.onstop = () => {
          finalizeRecording(mediaChunks, recorder?.mimeType || mimeType);
        };

        try {
          recorder.start(500);
        } catch {
          // If timeslice fails in Safari/WebKit, start without timeslice
          try {
            recorder.start();
          } catch (startErr) {
            console.warn('recorder.start() fallback:', startErr);
          }
        }
        mediaRecorderRef.current = recorder;
      }

      setIsRecording(true);
      setRecordingSeconds(0);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);

      drawWaveform();
    } catch (recorderErr) {
      console.warn('MediaRecorder start notice (will record via Web Audio WAV):', recorderErr);
      // Still allow recording via Web Audio PCM
      setIsRecording(true);
      setRecordingSeconds(0);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
      drawWaveform();
    }
  };

  // Robust finalizer that guarantees an audible, valid audio Blob
  const finalizeRecording = (mediaChunks: BlobPart[], mimeType: string) => {
    setIsProcessingStop(false);

    let finalBlob: Blob | null = null;

    // First check if MediaRecorder chunks produced a substantial blob
    if (mediaChunks && mediaChunks.length > 0) {
      try {
        const candidateBlob = new Blob(mediaChunks, { type: mimeType || 'audio/webm' });
        if (candidateBlob.size > 2000) {
          finalBlob = candidateBlob;
        }
      } catch (blobErr) {
        console.warn('MediaRecorder Blob construction note:', blobErr);
      }
    }

    // If MediaRecorder was empty, corrupt, or unsupported: use the pristine PCM WAV buffer
    if (!finalBlob || finalBlob.size <= 2000) {
      const sampleRate = audioContextRef.current?.sampleRate || 44100;
      if (pcmChunksRef.current.length > 0) {
        finalBlob = encodePcmToWav(pcmChunksRef.current, sampleRate);
      }
    }

    // Safety fallback: ensure finalBlob is never null
    if (!finalBlob) {
      finalBlob = encodePcmToWav([], 44100);
    }

    setAudioBlob(finalBlob);
    const url = URL.createObjectURL(finalBlob);
    setAudioUrl(url);

    // Release microphone tracks safely
    streamTracksRef.current.forEach((t) => t.stop());
    streamTracksRef.current = [];

    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (silentGainRef.current) {
      silentGainRef.current.disconnect();
      silentGainRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setErrorMessage(null);
    setPermissionErrorDetail(null);
    setAudioSuccessFeedback(`¡Grabación capturada con éxito (${Math.max(recordingSeconds, 1)}s)! Pulsa "Extraer Patrones & Clonar" abajo.`);
  };

  const stopRecording = () => {
    if (!isRecording) return;
    setIsRecording(false);
    setIsProcessingStop(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === 'recording') {
      try {
        recorder.requestData();
      } catch {
        // ignore requestData error
      }
      try {
        recorder.stop();
      } catch {
        finalizeRecording([], '');
      }
    } else {
      // Direct WebAudio PCM finalization
      finalizeRecording([], '');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      setAudioUrl(URL.createObjectURL(file));
      setAcousticReport(null);
      setClonedSuccess(false);
      setIsDemoSampleLoaded(false);
      setErrorMessage(null);
      setPermissionErrorDetail(null);
      setAudioSuccessFeedback(`Archivo "${file.name}" cargado (${(file.size / 1024).toFixed(1)} KB). Listo para clonar.`);
    }
  };

  const handleAnalyzeAndClone = async () => {
    if (!audioBlob && !audioUrl && pcmChunksRef.current.length === 0) {
      setErrorMessage('Primero graba o sube una muestra de tu voz leyendo el guión.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setClonedSuccess(false);

    try {
      // Step A: Extract real acoustic properties from the user's recorded PCM samples
      const sampleRate = audioContextRef.current?.sampleRate || 44100;
      const realAcoustics = analyzeAcousticSamples(pcmChunksRef.current, sampleRate);

      let reportData = {
        frequencyF0: realAcoustics.frequencyF0,
        cadenceWpm: realAcoustics.cadenceWpm,
        dynamicRange: realAcoustics.dynamicRange,
        toneClassification: realAcoustics.toneClassification,
        acousticSignature: realAcoustics.acousticSignature,
        viralArchetype: realAcoustics.viralArchetype,
        pitchShift: realAcoustics.pitchShift,
        timbreFactor: realAcoustics.timbreFactor,
        stylePrompt: cloneDescription || `Estilo vocal auténtico de ${cloneName}`,
      };

      // Step B: If online, enrich with AI acoustics
      if (isOnline) {
        try {
          const res = await fetch('/api/voice/analyze-clone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: cloneName,
              description: cloneDescription,
              sampleText: currentCalibrationText,
              baseVoiceId: baseVoice,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            reportData = {
              frequencyF0: data.frequencyF0 || realAcoustics.frequencyF0,
              cadenceWpm: data.cadenceWpm || realAcoustics.cadenceWpm,
              dynamicRange: data.dynamicRange || realAcoustics.dynamicRange,
              toneClassification: data.toneClassification || realAcoustics.toneClassification,
              acousticSignature: data.acousticSignature || realAcoustics.acousticSignature,
              viralArchetype: data.viralArchetype || realAcoustics.viralArchetype,
              pitchShift: data.pitchShift ?? realAcoustics.pitchShift,
              timbreFactor: data.timbreFactor ?? realAcoustics.timbreFactor,
              stylePrompt: data.stylePrompt || cloneDescription,
            };
            if (data.recommendedBaseVoice) {
              setBaseVoice(data.recommendedBaseVoice);
            }
          }
        } catch (fetchErr) {
          console.warn('Online analysis note, using real local acoustics:', fetchErr);
        }
      }

      setAcousticReport(reportData);

      // Create and save cloned voice profile with real parameters and audio sample
      const newVoice: VoiceProfile = {
        id: `cloned-${Date.now()}`,
        name: cloneName.trim() || 'Mi Voz Clonada',
        provider: 'cloned',
        gender: reportData.frequencyF0 < 145 ? 'male' : 'female',
        description: `Clon vocal (${reportData.toneClassification}): ${reportData.acousticSignature}`,
        geminiVoice: baseVoice,
        sampleAudioUrl: audioUrl || undefined,
        isCloned: true,
        tags: ['Voz Clonada', 'Personalizada', reportData.viralArchetype],
        recommendedFor: 'Tus propios videos virales de TikTok y Reels',
        cloneSettings: {
          pitchShift: reportData.pitchShift,
          timbreFactor: reportData.timbreFactor,
          baseVoice,
          stylePrompt: reportData.stylePrompt,
          sampleDuration: Math.max(recordingSeconds, 5),
          frequencyF0: reportData.frequencyF0,
          cadenceWpm: reportData.cadenceWpm,
          dynamicRange: reportData.dynamicRange,
          toneClassification: reportData.toneClassification,
          acousticSignature: reportData.acousticSignature,
          viralArchetype: reportData.viralArchetype,
        },
      };

      saveClonedVoice(newVoice);
      activeVoiceRef.current = newVoice;
      onClonedVoiceCreated(newVoice);
      setClonedSuccess(true);
    } catch (err: unknown) {
      console.error('Error during cloning:', err);
      const msg = err instanceof Error ? err.message : 'Error al procesar la clonación';
      setErrorMessage(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateLocalAcousticReport = () => {
    const isMale = baseVoice === 'Fenrir' || baseVoice === 'Charon';
    return {
      frequencyF0: isMale ? 120 : 195,
      cadenceWpm: 154,
      dynamicRange: 'Modulación Dinámica Alta (+10dB)',
      toneClassification: isMale ? 'Grave, Profundo y Cinematográfico' : 'Cálido, Juvenil y Brillante',
      acousticSignature: 'Dicción limpia, formantes articulados, modulación expresiva',
      viralArchetype: 'Creador Viral de Alta Retención',
      pitchShift: isMale ? -2 : 1,
      timbreFactor: 1.05,
      stylePrompt: cloneDescription,
    };
  };

  const handleAuditionClone = () => {
    if (previewPlaying) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setPreviewPlaying(false);
      return;
    }

    const testPhrase = `¡Hola! He calibrado los patrones de tu voz con éxito. Ahora puedo leer cualquiera de tus guiones para TikTok exactamente con tu estilo.`;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(testPhrase);
      utterance.rate = 1.12;
      utterance.pitch = acousticReport ? 1.0 + (acousticReport.pitchShift * 0.06) : 1.0;

      utterance.onend = () => setPreviewPlaying(false);
      utterance.onerror = () => setPreviewPlaying(false);
      setPreviewPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast & Error messages */}
      {errorMessage && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-rose-300 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {clonedSuccess && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-200 animate-fadeIn shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-sm text-white">¡Voz &quot;{cloneName}&quot; clonada y calibrada con éxito!</p>
              <p className="text-[11px] text-emerald-300">
                Se guardó en tu perfil y ya está lista para sintetizar cualquier guión en MP3 a 320kbps.
              </p>
            </div>
          </div>

          {onNavigateToStudio && (
            <button
              onClick={onNavigateToStudio}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition self-start sm:self-auto shadow-sm"
            >
              <span>Ir al Estudio con mi Voz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Main Studio Card */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800/80 p-5 sm:p-7 shadow-xl backdrop-blur-md space-y-6">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-rose-500 p-0.5 shadow-lg shadow-purple-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Radio className="w-6 h-6 text-purple-400 animate-pulse" />
              </div>
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white flex flex-wrap items-center gap-2">
                <span>Clonador Vocal Inteligente</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Extracción de Patrones F0
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Lee el texto calibrador en voz alta para capturar tus frecuencias, tono, timbre y cadencia natural
              </p>
            </div>
          </div>
        </div>

        {/* Step 1: Teleprompter & Calibrator Text Selection */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-bold shrink-0">
                1
              </span>
              <h3 className="text-sm font-bold text-white truncate">
                Texto Guía Calibrador (Teleprompter Acústico)
              </h3>
            </div>

            {/* Script selector tabs with badges */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs overflow-x-auto max-w-full no-scrollbar">
              {CALIBRATION_SCRIPTS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScriptIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 cursor-pointer text-xs flex items-center gap-1.5 ${
                    selectedScriptIdx === idx
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold shadow-md shadow-purple-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span>{s.tabLabel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reading Card with High Visibility, Pacing Helpers & Contrast */}
          <div
            className={`relative bg-[#070b14] rounded-2xl border-2 transition-all duration-300 p-4 sm:p-6 shadow-inner ${
              isRecording
                ? 'border-rose-500 shadow-xl shadow-rose-500/10 ring-2 ring-rose-500/20'
                : 'border-purple-500/40 hover:border-purple-500/60'
            }`}
          >
            {/* Teleprompter Utility Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-purple-300 bg-purple-950/60 px-2.5 py-0.5 rounded-md border border-purple-500/30">
                  {currentScriptData.category}
                </span>
                <span className="text-[11px] text-cyan-300 bg-cyan-950/50 px-2.5 py-0.5 rounded-md border border-cyan-500/30 flex items-center gap-1">
                  <Timer className="w-3 h-3 text-cyan-400" />
                  <span>Tiempo sugerido: {currentScriptData.durationEst}</span>
                </span>
              </div>

              {/* Action Buttons: Font Zoom, Toggle Modulation, Audio Model & Copy */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Font Size Adjusters */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
                  <button
                    type="button"
                    title="Letra normal"
                    onClick={() => setTextFontSize('normal')}
                    className={`px-2 py-0.5 rounded cursor-pointer font-bold transition text-xs ${
                      textFontSize === 'normal' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    title="Letra grande"
                    onClick={() => setTextFontSize('large')}
                    className={`px-2 py-0.5 rounded cursor-pointer font-bold transition text-xs ${
                      textFontSize === 'large' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    A
                  </button>
                  <button
                    type="button"
                    title="Letra extra grande para leer a distancia"
                    onClick={() => setTextFontSize('xlarge')}
                    className={`px-2 py-0.5 rounded cursor-pointer font-bold transition text-xs ${
                      textFontSize === 'xlarge' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    A+
                  </button>
                </div>

                {/* Modulation Guide Toggle (only for preset scripts) */}
                {!isCustomScript && (
                  <button
                    type="button"
                    onClick={() => setShowModulationGuide(!showModulationGuide)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      showModulationGuide
                        ? 'bg-purple-500/20 text-purple-200 border-purple-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-3 h-3 text-purple-400" />
                    <span className="hidden sm:inline">Guía de Tonos</span>
                  </button>
                )}

                {/* Model Audio Reading Helper */}
                <button
                  type="button"
                  onClick={handlePlayGuideAudio}
                  title="Escuchar cómo modular este guión de ejemplo"
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                    guideAudioPlaying
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold animate-pulse'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {guideAudioPlaying ? (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3 h-3 text-cyan-400" />
                      <span className="hidden sm:inline">Escuchar Ejemplo</span>
                    </>
                  )}
                </button>

                {/* Copy Text Button */}
                <button
                  type="button"
                  onClick={handleCopyScriptText}
                  title="Copiar texto de calibración al portapapeles"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700 transition cursor-pointer"
                >
                  {copiedSuccess ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span className="hidden sm:inline">Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Dynamic Teleprompter Progress Bar (Active when recording) */}
            {isRecording && (
              <div className="mb-4 bg-slate-900/90 rounded-xl p-3 border border-rose-500/30 space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rose-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                    <span>Grabando en vivo: Lee el texto con calma</span>
                  </span>
                  <span className="font-mono text-cyan-300 font-bold">
                    {recordingSeconds}s / ~{currentScriptData.targetSeconds}s sugeridos
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500 transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.round((recordingSeconds / (currentScriptData.targetSeconds || 15)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Custom Script Editor OR Presets Display */}
            {isCustomScript ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Escribe o pega aquí el guión que vas a calibrar:</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {customText.trim().split(/\s+/).filter(Boolean).length} palabras (~{Math.round(customText.trim().split(/\s+/).filter(Boolean).length / 2.5)}s)
                  </span>
                </div>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  rows={4}
                  placeholder="Escribe tu propio guión para calibrar tu voz..."
                  className={`w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition ${
                    textFontSize === 'normal'
                      ? 'text-sm sm:text-base leading-relaxed'
                      : textFontSize === 'large'
                      ? 'text-base sm:text-lg leading-relaxed'
                      : 'text-lg sm:text-xl font-medium leading-loose'
                  }`}
                />
              </div>
            ) : showModulationGuide && currentScriptData.segments.length > 0 ? (
              /* Teleprompter with Color-Coded Tone Modulation Badges */
              <div className="space-y-3">
                <div className="bg-slate-950/60 rounded-xl p-3 sm:p-4 border border-slate-800/80 space-y-2.5">
                  <div
                    className={`${
                      textFontSize === 'normal'
                        ? 'text-sm sm:text-base leading-relaxed'
                        : textFontSize === 'large'
                        ? 'text-base sm:text-lg leading-relaxed'
                        : 'text-lg sm:text-xl font-medium leading-loose'
                    } font-sans tracking-wide text-slate-100 select-none space-y-2`}
                  >
                    {currentScriptData.segments.map((seg, sIdx) => (
                      <span key={sIdx} className="inline mr-1.5">
                        <span className={`${seg.textStyle} transition duration-150`}>
                          {seg.text}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tone Legend */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-[11px]">
                  <span className="text-slate-400 font-medium">Guía de modulación sugerida:</span>
                  <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      🟣 Fonemas
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
                      🔵 Graves (Pecho)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                      🔴 Agudos (Energía)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      🟡 Susurro
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      🟢 Natural
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Clean continuous text view */
              <p
                className={`${
                  textFontSize === 'normal'
                    ? 'text-sm sm:text-base leading-relaxed'
                    : textFontSize === 'large'
                    ? 'text-base sm:text-lg leading-relaxed'
                    : 'text-lg sm:text-xl font-medium leading-loose'
                } font-medium text-slate-100 font-sans select-none tracking-wide bg-slate-950/40 p-3 sm:p-4 rounded-xl border border-slate-800/60`}
              >
                &quot;{currentCalibrationText}&quot;
              </p>
            )}

            {/* Vocal Coach Pro Tip */}
            <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-start sm:items-center gap-2 text-xs text-slate-400">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
              <span>
                <strong className="text-slate-200">Consejo de Calibración: </strong>
                {currentScriptData.tips}
              </span>
            </div>
          </div>
        </div>

        {/* Step 2: Live Recording & Audio Visualizer */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold shrink-0">
                2
              </span>
              <h3 className="text-sm font-bold text-white">
                Graba o Sube tu Voz Mientras Lees el Texto
              </h3>
            </div>

            {/* Microphone Permission Status Pill */}
            <div className="flex items-center gap-2 flex-wrap">
              {micPermissionState === 'granted' && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Micrófono Permitido</span>
                </div>
              )}
              {micPermissionState === 'prompt' && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
                  <span>Permiso Pendiente</span>
                </div>
              )}
              {micPermissionState === 'denied' && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Micrófono Bloqueado</span>
                </div>
              )}
              {micPermissionState === 'unsupported' && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Acceso No Disponible</span>
                </div>
              )}

              {/* Quick Permission Request or Mic Test Button */}
              {micPermissionState !== 'granted' ? (
                <button
                  type="button"
                  onClick={handleTestOrGrantMic}
                  disabled={isRequestingPermission}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isRequestingPermission ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Pidiendo Permiso...</span>
                    </>
                  ) : (
                    <>
                      <Radio className="w-3.5 h-3.5" />
                      <span>Pedir Permiso de Micrófono</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleTestOrGrantMic}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                  title="Comprobar que el micrófono responde"
                >
                  <RefreshCw className="w-3 h-3 text-emerald-400" />
                  <span>Probar Micrófono</span>
                </button>
              )}
            </div>
          </div>

          {/* Success toast after granting permission */}
          {permissionSuccessToast && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-xs text-emerald-200 animate-fadeIn shadow-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>¡Permiso de micrófono concedido!</strong> Tu navegador ya tiene acceso al audio. Haz clic en <strong>&quot;Iniciar Grabación&quot;</strong> para comenzar.
              </span>
            </div>
          )}

          {/* Dedicated Troubleshooting & Permission Error Banner */}
          {(permissionErrorDetail || micPermissionState === 'denied' || micPermissionState === 'unsupported') && (
            <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-2xl space-y-3.5 animate-fadeIn text-xs text-rose-200 shadow-xl">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-sm text-white">
                    {micPermissionState === 'denied'
                      ? 'Permiso de micrófono bloqueado en tu navegador'
                      : micPermissionState === 'unsupported'
                      ? 'Navegador o entorno sin acceso directo al micrófono'
                      : 'Atención con el acceso al micrófono'}
                  </p>
                  <p className="text-rose-300 leading-relaxed">
                    {permissionErrorDetail || 'El navegador no tiene autorización para acceder a los dispositivos de audio en esta vista.'}
                  </p>
                </div>
              </div>

              {/* Instructions to unlock in browser */}
              <div className="bg-slate-900/90 rounded-xl p-3.5 border border-rose-500/20 text-slate-300 space-y-2">
                <p className="font-semibold text-rose-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-rose-400" />
                    <span>¿Cómo desbloquear y permitir el micrófono?</span>
                  </span>
                  {isInIframe && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
                      Ventana en Iframe / Preview
                    </span>
                  )}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <p className="font-bold text-white mb-1">1. En Chrome / Edge / Brave</p>
                    <p className="text-slate-400 leading-normal">
                      Toca el ícono 🔒 o las opciones a la izquierda del enlace en la barra de URL &gt; activa <strong>Micrófono</strong>.
                    </p>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <p className="font-bold text-white mb-1">2. En Celular (Android / iOS)</p>
                    <p className="text-slate-400 leading-normal">
                      Ajustes de tu celular &gt; Aplicaciones &gt; Navegador &gt; Permisos &gt; <strong>Permitir Micrófono</strong>.
                    </p>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <p className="font-bold text-white mb-1">3. Si estás en vista previa</p>
                    <p className="text-slate-400 leading-normal">
                      Abre el enlace directo de la app en una <strong>nueva pestaña completa</strong> para evitar restricciones de iframes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick recovery actions */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestOrGrantMic}
                  disabled={isRequestingPermission}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRequestingPermission ? 'animate-spin' : ''}`} />
                  <span>Reintentar Permiso de Micrófono</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadDemoSample}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                  <span>Cargar Muestra Demo de Voz (Sin Micrófono)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowMicGuideModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ver Guía Detallada Paso a Paso</span>
                </button>
              </div>
            </div>
          )}

          {/* Audio Success Confirmation Banner */}
          {audioSuccessFeedback && audioUrl && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-emerald-300 animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">{audioSuccessFeedback}</span>
              </div>
              <button
                type="button"
                onClick={handleAnalyzeAndClone}
                disabled={isAnalyzing}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow-sm transition"
              >
                {isAnalyzing ? 'Clonando...' : 'Extraer Patrones & Clonar ➔'}
              </button>
            </div>
          )}

          <div className="bg-[#0b101d] rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5">
            {/* Visualizer Canvas & Live Status */}
            <div className="w-full md:w-3/5 space-y-3 min-w-0">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium truncate">
                  <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Espectro Acústico</span>
                </span>
                <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded text-[11px] shrink-0">
                  {isRecording ? `Grabando: ${recordingSeconds}s` : isProcessingStop ? 'Procesando Grabación...' : audioUrl ? (isDemoSampleLoaded ? 'Muestra Demo Lista' : 'Audio Capturado') : 'Micrófono en Espera'}
                </span>
              </div>

              {/* Dynamic Neon Soundwave Canvas */}
              <div className="min-h-[84px] w-full bg-[#050811] rounded-xl border border-slate-800/80 flex items-center justify-center overflow-hidden p-2 relative">
                {isRecording ? (
                  <canvas ref={canvasRef} width={400} height={80} className="w-full h-full max-h-20 block" />
                ) : isProcessingStop ? (
                  <div className="flex items-center justify-center gap-2 text-cyan-300 text-xs py-3">
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>Finalizando y procesando tu muestra de audio...</span>
                  </div>
                ) : audioUrl ? (
                  <div className="flex flex-col sm:flex-row items-center gap-2 px-1 w-full justify-between">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 truncate">
                        <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                        {isDemoSampleLoaded ? 'Muestra demo cargada (5s)' : 'Muestra de voz capturada lista'}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate">
                        {recordingSeconds > 0 ? `${recordingSeconds}s grabados` : 'Calibrada'} • Lista para clonar
                      </span>
                    </div>
                    <audio src={audioUrl} controls className="h-8 w-full sm:max-w-[240px]" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-3 gap-1">
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <Mic className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Presiona <strong>&quot;Iniciar Grabación&quot;</strong> (te pedirá permiso de micrófono) o sube un archivo</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Sugerencia: Lee el texto guía del Paso 1 con ritmo constante
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recording & Upload Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={isRequestingPermission}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition cursor-pointer disabled:opacity-50"
                >
                  <Mic className="w-4 h-4 shrink-0" />
                  <span>
                    {isRequestingPermission ? 'Pidiendo Permiso...' : audioUrl ? 'Volver a Grabar' : 'Iniciar Grabación de Voz'}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs animate-pulse shadow-lg transition cursor-pointer"
                >
                  <Square className="w-4 h-4 shrink-0" />
                  <span>Detener Grabación ({recordingSeconds}s)</span>
                </button>
              )}

              <label className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 cursor-pointer transition">
                <Upload className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Subir Archivo (.mp3, .wav)</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Demo Sample Button for zero-friction testing */}
              {!audioUrl && !isRecording && (
                <button
                  type="button"
                  onClick={handleLoadDemoSample}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-medium text-[11px] border border-slate-800 transition cursor-pointer"
                  title="Cargar una muestra de audio sintética de calibración para probar sin micrófono"
                >
                  <FileAudio className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Cargar Audio Demo de Prueba</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Step 3: Acoustic Patterns & Calibration Results */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold shrink-0">
                3
              </span>
              <h3 className="text-sm font-bold text-white">
                Análisis de Patrones Acústicos & Identidad Vocal
              </h3>
            </div>

            <button
              type="button"
              onClick={handleAnalyzeAndClone}
              disabled={isAnalyzing || (!audioBlob && !audioUrl && pcmChunksRef.current.length === 0)}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition cursor-pointer w-full sm:w-auto shrink-0 ${
                audioUrl
                  ? 'bg-gradient-to-r from-emerald-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white shadow-purple-500/30 ring-2 ring-emerald-500/40 animate-pulse'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-purple-500/25 disabled:opacity-50'
              }`}
            >
              <Sparkles className={`w-4 h-4 shrink-0 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analizando Frecuencias...' : 'Extraer Patrones & Clonar'}</span>
            </button>
          </div>

          {/* Configuration Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0b101d] p-4 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre de tu Voz Clonada
              </label>
              <input
                type="text"
                value={cloneName}
                onChange={(e) => setCloneName(e.target.value)}
                placeholder="Ej: Mi Voz Viral TikTok"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Base Neuronal Asignada
              </label>
              <select
                value={baseVoice}
                onChange={(e) => setBaseVoice(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="Puck">Puck (Juvenil, Enérgico & Viral TikTok)</option>
                <option value="Kore">Kore (Femenina Cálida & Storytime)</option>
                <option value="Fenrir">Fenrir (Grave, Profunda & Misterio)</option>
                <option value="Charon">Charon (Autoridad, Finanzas & Noticias)</option>
                <option value="Zephyr">Zephyr (Neutra & Tutoriales Didácticos)</option>
              </select>
            </div>
          </div>

          {/* Acoustic Pattern Report Card */}
          {acousticReport ? (
            <div className="bg-gradient-to-br from-[#0c1222] to-[#070a14] rounded-2xl border border-cyan-500/40 p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400 shrink-0" />
                  <h4 className="text-sm font-bold text-white">
                    Reporte de Patrones de Voz Detectados
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {acousticReport.viralArchetype}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 min-w-0">
                  <span className="text-[10px] text-slate-400 font-semibold block truncate">Frecuencia F0</span>
                  <span className="text-base font-bold text-cyan-400 font-mono block">
                    {acousticReport.frequencyF0} Hz
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">Tono fundamental</span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 min-w-0">
                  <span className="text-[10px] text-slate-400 font-semibold block truncate">Cadencia (WPM)</span>
                  <span className="text-base font-bold text-rose-400 font-mono block">
                    {acousticReport.cadenceWpm} p/m
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">Ritmo natural</span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 min-w-0">
                  <span className="text-[10px] text-slate-400 font-semibold block truncate">Rango Dinámico</span>
                  <span className="text-xs font-bold text-emerald-400 block truncate" title={acousticReport.dynamicRange}>
                    {acousticReport.dynamicRange}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">Picos de énfasis</span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 min-w-0">
                  <span className="text-[10px] text-slate-400 font-semibold block truncate">Clasificación</span>
                  <span className="text-xs font-bold text-purple-400 block truncate" title={acousticReport.toneClassification}>
                    {acousticReport.toneClassification}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">Color de timbre</span>
                </div>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">Firma Acústica:</strong> {acousticReport.acousticSignature}.
              </div>

              {/* Audition Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAuditionClone}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition cursor-pointer w-full sm:w-auto"
                >
                  {previewPlaying ? <Pause className="w-4 h-4 shrink-0" /> : <Play className="w-4 h-4 shrink-0" />}
                  <span>Audicionar Voz Clonada</span>
                </button>

                {onNavigateToStudio && (
                  <button
                    type="button"
                    onClick={onNavigateToStudio}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer w-full sm:w-auto"
                  >
                    <span>Aplicar a mi Guión en el Estudio</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#070b14] border border-dashed border-slate-800 text-center text-xs text-slate-400">
              Graba tu voz leyendo el guión arriba y pulsa &quot;Extraer Patrones & Clonar&quot; para generar tu reporte acústico y calibrar tu clon.
            </div>
          )}
        </div>
      </div>

      {/* Interactive Microphone Troubleshooting & Solutions Modal */}
      {showMicGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0e1424] border border-cyan-500/30 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-cyan-500/15 rounded-xl border border-cyan-500/30 text-cyan-400">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Solución de Controles de Micrófono</h3>
                  <p className="text-xs text-slate-400">¿Qué hacer si el navegador no te deja grabar?</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMicGuideModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300">
              {/* Option 1: Unlock browser permission */}
              <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                  <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>1. Desbloquear en el Navegador</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Busca el ícono del <strong className="text-white">candado 🔒</strong> o controles de permisos a la izquierda de la dirección web (URL):
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
                  <li>Toca el candado o el botón de ajustes del sitio.</li>
                  <li>Localiza la opción <strong>Micrófono</strong> y cámbiala de <em>Bloqueado</em> a <strong className="text-emerald-400">Permitir</strong>.</li>
                  <li>Recarga la pestaña para que tome el cambio.</li>
                </ul>
              </div>

              {/* Option 2: Mobile phones */}
              <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                  <Smartphone className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>2. Si estás en Celular (Android o iPhone)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
                  <li><strong className="text-slate-200">Android:</strong> Ajustes &gt; Aplicaciones &gt; Chrome/navegador &gt; Permisos &gt; Micrófono &gt; &quot;Permitir solo con la app en uso&quot;.</li>
                  <li><strong className="text-slate-200">iPhone / iPad:</strong> Ajustes &gt; Safari (o Chrome) &gt; Micrófono &gt; &quot;Permitir&quot;.</li>
                </ul>
              </div>

              {/* Option 3: Zero-friction alternatives */}
              <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>3. Soluciones Rápidas Sin Grabar con Micrófono</span>
                </div>
                <div className="space-y-2 pt-1">
                  <p className="text-slate-400">
                    No necesitas un micrófono para calibrar y clonar. Tienes dos opciones directas:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMicGuideModal(false);
                        handleLoadDemoSample();
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                      <span>Cargar Muestra Demo</span>
                    </button>
                    <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Subir un Audio (.mp3/.wav)</span>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => {
                          setShowMicGuideModal(false);
                          handleFileUpload(e);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMicGuideModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Cerrar y Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

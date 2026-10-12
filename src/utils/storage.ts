import { VoiceProfile, ProjectTemplate, CloudSyncConfig, AudioSettings } from '../types/models';

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  speed: 1.1, // Optimal fast-paced TikTok cadence
  pitch: 0,
  emphasis: 'hype',
  pauseDurationMs: 250,
  bitrate: 320,
  format: 'mp3',
  addIntroChime: false,
  normalizeAudio: true,
};

export const BUILT_IN_NEURAL_VOICES: VoiceProfile[] = [
  {
    id: 'gemini-kore',
    name: 'Kore (Viral Storytime)',
    provider: 'gemini',
    gender: 'female',
    description: 'Voz femenina cautivadora, natural y dinámica. Ideal para narraciones personales y trends de TikTok.',
    geminiVoice: 'Kore',
    tags: ['Storytime', 'Chica TikTok', 'Empatía', 'Hacks'],
    recommendedFor: 'Storytimes, anécdotas, consejos de belleza y vlogs cotidianos.',
  },
  {
    id: 'gemini-puck',
    name: 'Puck (Enérgico & Hype)',
    provider: 'gemini',
    gender: 'male',
    description: 'Voz juvenil, rápida y sumamente magnética. Diseñada para ganchos de retención inmediata y gaming.',
    geminiVoice: 'Puck',
    tags: ['Viral Hook', 'Gaming', 'Meme', 'Hype'],
    recommendedFor: 'Ganchos de 3 segundos, gameplays, memes y tops dinámicos.',
  },
  {
    id: 'gemini-fenrir',
    name: 'Fenrir (Misterio & Deep Voice)',
    provider: 'gemini',
    gender: 'male',
    description: 'Voz grave, profunda y cinematográfica. Perfecta para temas de terror, misterio y datos perturbadores.',
    geminiVoice: 'Fenrir',
    tags: ['Misterio', 'Terror', 'Iceberg', 'Documental'],
    recommendedFor: 'Historias de suspenso, teorías conspirativas y documentales oscuros.',
  },
  {
    id: 'gemini-charon',
    name: 'Charon (Autoridad & Negocios)',
    provider: 'gemini',
    gender: 'male',
    description: 'Locutor sobrio, autoritario y persuasivo. Ideal para finanzas personales, cripto y noticias virales.',
    geminiVoice: 'Charon',
    tags: ['Finanzas', 'Autoridad', 'Noticias', 'Ventas'],
    recommendedFor: 'Videos de emprendimiento, inversiones, noticias y divulgación seria.',
  },
  {
    id: 'gemini-zephyr',
    name: 'Zephyr (Tutoriales & Reviews)',
    provider: 'gemini',
    gender: 'female',
    description: 'Tono claro, articulado y didáctico. Excelente para tutoriales paso a paso y unboxings de productos.',
    geminiVoice: 'Zephyr',
    tags: ['Tutorial', 'Tech', 'Unboxing', 'Clara'],
    recommendedFor: 'Tutoriales rápidos, reseñas de tecnología y explicaciones científicas.',
  },
];

export const BUILT_IN_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'tpl-viral-hook',
    title: 'Gancho Psicológico de 3 Segundos',
    category: 'TikTok Hook',
    description: 'Estructura comprobada de retención para frenar el scroll del usuario en el primer segundo.',
    viralScore: 98,
    targetDurationSeconds: 15,
    suggestedVoiceId: 'gemini-puck',
    suggestedSettings: { speed: 1.15, emphasis: 'hype', bitrate: 320 },
    defaultScript: '¡Detén el scroll! Si estás usando tu celular con brillo máximo antes de dormir, estás destruyendo tu melatonina en este preciso instante. Guarda este video porque lo que te voy a contar va a salvar tu sueño hoy mismo.',
  },
  {
    id: 'tpl-storytime-pov',
    title: 'Storytime POV: Confesión Inesperada',
    category: 'Storytime',
    description: 'Formato narrativo en primera persona con altos picos de suspenso y remate emocional.',
    viralScore: 95,
    targetDurationSeconds: 35,
    suggestedVoiceId: 'gemini-kore',
    suggestedSettings: { speed: 1.05, emphasis: 'dramatic', bitrate: 320 },
    defaultScript: 'Storytime de cuando descubrí que mi compañero de departamento llevaba tres meses haciéndose pasar por mí en internet. Todo empezó un martes cuando me llegó un paquete extraño con una carta que decía: Gracias por aceptar la propuesta. Ahí fue cuando se me heló la sangre.',
  },
  {
    id: 'tpl-dato-perturbador',
    title: 'Dato Perturbador / Iceberg Misterio',
    category: 'Misterio & Curiosidades',
    description: 'Narración con pausas dramáticas y tono grave para videos de teorías y misterio.',
    viralScore: 94,
    targetDurationSeconds: 28,
    suggestedVoiceId: 'gemini-fenrir',
    suggestedSettings: { speed: 0.98, pitch: -2, emphasis: 'dramatic', bitrate: 320 },
    defaultScript: 'Este es probablemente el secreto más oscuro que la NASA ocultó en su archivo de 1977. Durante 72 segundos, el radiotelescopio detectó una señal que no provenía de ninguna estrella conocida. Lo aterrador no es que existiera... lo aterrador es el patrón matemático con el que respondía.',
  },
  {
    id: 'tpl-3-errores-marketing',
    title: 'Top 3 Errores Fatales que Cometes',
    category: 'Marketing & Ventas',
    description: 'Formato lista rápida de alta retención para contenido educativo y marcas.',
    viralScore: 92,
    targetDurationSeconds: 30,
    suggestedVoiceId: 'gemini-charon',
    suggestedSettings: { speed: 1.12, emphasis: 'hype', bitrate: 320 },
    defaultScript: 'Tres errores garrafales que estás cometiendo al publicar en TikTok y por qué tu cuenta sigue en 200 vistas: Número uno, no usar un gancho sonoro en los primeros 1.5 segundos. Número dos, hablar demasiado lento. Y número tres... no compartir este video antes de que desaparezca de tu feed.',
  },
  {
    id: 'tpl-tutorial-relampago',
    title: 'Tutorial Relámpago en 20 Segundos',
    category: 'Educativo / Tutorial',
    description: 'Directo al grano, paso a paso con máxima claridad y cadencia optimizada.',
    viralScore: 91,
    targetDurationSeconds: 22,
    suggestedVoiceId: 'gemini-zephyr',
    suggestedSettings: { speed: 1.1, emphasis: 'neutral', bitrate: 320 },
    defaultScript: 'Te enseño cómo clonar cualquier voz y ponerle subtítulos automáticos en menos de un minuto. Paso uno: abre tu guión y selecciona la voz Kore. Paso dos: ajusta la velocidad a 1.1x y exporta en MP3 a 320kbps. Y paso tres: arrastra el audio directamente a CapCut. ¡Listo!',
  },
];

const KEYS = {
  SETTINGS: 'voxcloner_audio_settings',
  TEMPLATES: 'voxcloner_custom_templates',
  CLONED_VOICES: 'voxcloner_cloned_voices',
  CLOUD_CONFIG: 'voxcloner_cloud_config',
  RECENT_SCRIPTS: 'voxcloner_recent_scripts',
};

export function loadSavedAudioSettings(): AudioSettings {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    return raw ? { ...DEFAULT_AUDIO_SETTINGS, ...JSON.parse(raw) } : DEFAULT_AUDIO_SETTINGS;
  } catch {
    return DEFAULT_AUDIO_SETTINGS;
  }
}

export function saveAudioSettings(settings: AudioSettings) {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

export function loadClonedVoices(): VoiceProfile[] {
  try {
    const raw = localStorage.getItem(KEYS.CLONED_VOICES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveClonedVoice(voice: VoiceProfile) {
  try {
    const existing = loadClonedVoices().filter((v) => v.id !== voice.id);
    existing.unshift(voice);
    localStorage.setItem(KEYS.CLONED_VOICES, JSON.stringify(existing));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

export function deleteClonedVoice(id: string) {
  try {
    const existing = loadClonedVoices().filter((v) => v.id !== id);
    localStorage.setItem(KEYS.CLONED_VOICES, JSON.stringify(existing));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

export function loadCustomTemplates(): ProjectTemplate[] {
  try {
    const raw = localStorage.getItem(KEYS.TEMPLATES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomTemplate(tpl: ProjectTemplate) {
  try {
    const existing = loadCustomTemplates().filter((t) => t.id !== tpl.id);
    existing.unshift(tpl);
    localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(existing));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

export function loadCloudSyncConfig(): CloudSyncConfig {
  const defaultConfig: CloudSyncConfig = {
    enabled: false,
    storageTarget: 'local-vault',
    serverUrl: '/api/cloud-sync',
    countryCode: 'ES/LATAM',
    autoSyncOnQueueComplete: true,
  };
  try {
    const raw = localStorage.getItem(KEYS.CLOUD_CONFIG);
    return raw ? { ...defaultConfig, ...JSON.parse(raw) } : defaultConfig;
  } catch {
    return defaultConfig;
  }
}

export function saveCloudSyncConfig(config: CloudSyncConfig) {
  try {
    localStorage.setItem(KEYS.CLOUD_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

export type VoiceProvider = 'gemini' | 'browser' | 'cloned';

export type VoiceGender = 'male' | 'female' | 'neutral';

export interface VoiceProfile {
  id: string;
  name: string;
  provider: VoiceProvider;
  gender: VoiceGender;
  description: string;
  geminiVoice?: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
  browserVoiceURI?: string;
  tags: string[];
  recommendedFor: string;
  sampleAudioUrl?: string;
  isCloned?: boolean;
  cloneSettings?: {
    pitchShift: number; // in semitones or factor
    timbreFactor: number;
    baseVoice: string;
    stylePrompt: string;
    sampleDuration?: number;
    frequencyF0?: number;
    cadenceWpm?: number;
    dynamicRange?: string;
    toneClassification?: string;
    acousticSignature?: string;
    viralArchetype?: string;
  };
}

export type AudioEmphasis = 'subtle' | 'neutral' | 'dramatic' | 'hype';

export type AudioBitrate = 128 | 192 | 256 | 320;

export type AudioFormat = 'mp3' | 'wav';

export interface AudioSettings {
  speed: number;       // 0.5 - 2.0
  pitch: number;       // -12 - +12 semitones or 0.5 - 1.5
  emphasis: AudioEmphasis;
  pauseDurationMs: number; // 100 - 800
  bitrate: AudioBitrate;   // default 320kbps
  format: AudioFormat;     // default 'mp3'
  addIntroChime?: boolean;
  normalizeAudio?: boolean;
}

export type QueueTaskStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'paused';

export interface QueueTask {
  id: string;
  title: string;
  script: string;
  voiceId: string;
  voiceName: string;
  voiceProvider: VoiceProvider;
  settings: AudioSettings;
  status: QueueTaskStatus;
  progress: number; // 0 - 100
  createdAt: number;
  completedAt?: number;
  error?: string;
  audioBlobUrl?: string;
  audioBase64?: string;
  audioFormat: AudioFormat;
  audioDurationSeconds?: number;
  fileSizeBytes?: number;
  fileName: string;
}

export interface ProjectTemplate {
  id: string;
  title: string;
  category: 'TikTok Hook' | 'Storytime' | 'Misterio & Curiosidades' | 'Marketing & Ventas' | 'Educativo / Tutorial';
  description: string;
  defaultScript: string;
  suggestedVoiceId: string;
  suggestedSettings: Partial<AudioSettings>;
  viralScore: number; // 1-100
  targetDurationSeconds: number;
}

export interface CloudSyncConfig {
  enabled: boolean;
  storageTarget: 'local-vault' | 'custom-database' | 'supabase';
  serverUrl: string;
  countryCode: string;
  encryptionPassword?: string;
  lastSyncTimestamp?: number;
  autoSyncOnQueueComplete: boolean;
}

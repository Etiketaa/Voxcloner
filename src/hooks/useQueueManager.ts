import { useState, useEffect, useRef, useCallback } from 'react';
import JSZip from 'jszip';
import { QueueTask, VoiceProfile, AudioSettings } from '../types/models';
import { synthesizeOfflineSpeech, wavToMp3 } from '../utils/audioEncoder';
import { notifyQueueComplete } from '../utils/notifications';
import { loadClonedVoices } from '../utils/storage';

export function useQueueManager(isOnline: boolean) {
  const [tasks, setTasks] = useState<QueueTask[]>(() => {
    try {
      const stored = localStorage.getItem('voxcloner_queue_history');
      if (stored) {
        // Strip audioBlobUrls as they don't persist across page reloads
        const parsed: QueueTask[] = JSON.parse(stored);
        return parsed.map((t) => ({ ...t, audioBlobUrl: undefined }));
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      const toSave = tasks.slice(0, 50).map((t) => ({
        ...t,
        audioBlobUrl: undefined, // cannot serialize blob URL
      }));
      localStorage.setItem('voxcloner_queue_history', JSON.stringify(toSave));
    } catch (e) {
      console.warn('Could not save queue history:', e);
    }
  }, [tasks]);

  const addTask = useCallback((
    script: string,
    voice: VoiceProfile,
    settings: AudioSettings,
    customTitle?: string
  ) => {
    const title = customTitle || (script.slice(0, 40).trim() + (script.length > 40 ? '...' : ''));
    const newTask: QueueTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title,
      script,
      voiceId: voice.id,
      voiceName: voice.name,
      voiceProvider: voice.provider,
      settings,
      status: 'pending',
      progress: 0,
      createdAt: Date.now(),
      audioFormat: settings.format,
      fileName: `${title.toLowerCase().replace(/[^a-z0-9]/gi, '_').slice(0, 30)}_${settings.bitrate}kbps.${settings.format}`,
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask.id;
  }, []);

  const addBatchTasks = useCallback((
    items: Array<{ script: string; title?: string }>,
    voice: VoiceProfile,
    settings: AudioSettings
  ) => {
    const newTasks: QueueTask[] = items.map((item, index) => {
      const title = item.title || `Toma #${index + 1}: ${item.script.slice(0, 32).trim()}...`;
      return {
        id: `task-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
        title,
        script: item.script,
        voiceId: voice.id,
        voiceName: voice.name,
        voiceProvider: voice.provider,
        settings,
        status: 'pending',
        progress: 0,
        createdAt: Date.now(),
        audioFormat: settings.format,
        fileName: `${title.toLowerCase().replace(/[^a-z0-9]/gi, '_').slice(0, 30)}_${settings.bitrate}kbps.${settings.format}`,
      };
    });

    setTasks((prev) => [...newTasks, ...prev]);
    return newTasks.map((t) => t.id);
  }, []);

  const removeTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => t.status !== 'completed'));
  }, []);

  const retryTask = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'pending', progress: 0, error: undefined } : t))
    );
  }, []);

  // Process next pending task
  const processNextTask = useCallback(async () => {
    if (isProcessingRef.current) return;

    setTasks((currentTasks) => {
      const pendingTask = currentTasks.find((t) => t.status === 'pending');
      if (!pendingTask) {
        setIsProcessing(false);
        isProcessingRef.current = false;
        return currentTasks;
      }

      isProcessingRef.current = true;
      setIsProcessing(true);

      // Start execution for this task
      (async () => {
        const taskId = pendingTask.id;
        try {
          // Progress step 1
          setTasks((t) => t.map((item) => (item.id === taskId ? { ...item, status: 'processing', progress: 20 } : item)));

          let audioBlob: Blob;
          let audioDuration = 0;
          let base64Output = '';

          const useNeuralBackend = isOnline && (pendingTask.voiceProvider === 'gemini' || pendingTask.voiceProvider === 'cloned');

          if (useNeuralBackend) {
            setTasks((t) => t.map((item) => (item.id === taskId ? { ...item, progress: 45 } : item)));

            let chosenVoiceName = 'Kore';
            let styleDescription = `Viral TikTok voice with ${pendingTask.settings.emphasis} energy`;
            let speedMod = pendingTask.settings.speed;
            let pitchMod = pendingTask.settings.pitch;

            if (pendingTask.voiceProvider === 'cloned') {
              const allCloned = loadClonedVoices();
              const matched = allCloned.find((v) => v.id === pendingTask.voiceId);
              if (matched) {
                chosenVoiceName = matched.geminiVoice || matched.cloneSettings?.baseVoice || 'Kore';
                if (matched.cloneSettings?.stylePrompt) {
                  styleDescription = `${matched.cloneSettings.stylePrompt}. Delivery: ${pendingTask.settings.emphasis} cadence.`;
                }
                if (matched.cloneSettings?.pitchShift) {
                  pitchMod += matched.cloneSettings.pitchShift;
                }
                if (matched.cloneSettings?.timbreFactor) {
                  speedMod = Math.max(0.7, Math.min(1.5, speedMod * matched.cloneSettings.timbreFactor));
                }
              }
            } else {
              chosenVoiceName = pendingTask.voiceId.replace('gemini-', '').charAt(0).toUpperCase() + pendingTask.voiceId.replace('gemini-', '').slice(1);
            }

            const res = await fetch('/api/tts/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: pendingTask.script,
                voiceName: chosenVoiceName,
                style: styleDescription,
                speed: speedMod,
                pitch: pitchMod,
                emphasis: pendingTask.settings.emphasis,
                format: pendingTask.settings.format,
                bitrate: pendingTask.settings.bitrate,
              }),
            });

            if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              throw new Error(errData.error || `Error del servidor HTTP ${res.status}`);
            }

            const data = await res.json();
            base64Output = data.audioBase64;
            audioDuration = data.durationSeconds || Math.ceil(pendingTask.script.length / 15);

            setTasks((t) => t.map((item) => (item.id === taskId ? { ...item, progress: 85 } : item)));

            const byteCharacters = atob(base64Output);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const mimeType = data.format === 'mp3' ? 'audio/mp3' : 'audio/wav';
            audioBlob = new Blob([byteArray], { type: mimeType });
          } else {
            // Local Offline Free Engine
            setTasks((t) => t.map((item) => (item.id === taskId ? { ...item, progress: 50 } : item)));
            const offlineRes = await synthesizeOfflineSpeech(pendingTask.script, {
              rate: pendingTask.settings.speed,
              pitch: 1.0 + (pendingTask.settings.pitch * 0.05),
              bitrate: pendingTask.settings.bitrate,
            });
            audioBlob = offlineRes.blob;
            audioDuration = offlineRes.duration;
          }

          const blobUrl = URL.createObjectURL(audioBlob);

          setTasks((prev) => {
            const updated = prev.map((item) =>
              item.id === taskId
                ? {
                    ...item,
                    status: 'completed' as const,
                    progress: 100,
                    completedAt: Date.now(),
                    audioBlobUrl: blobUrl,
                    audioBase64: base64Output,
                    audioDurationSeconds: audioDuration,
                    fileSizeBytes: audioBlob.size,
                  }
                : item
            );

            // Check if all pending tasks are now complete
            const remainingPending = updated.filter((t) => t.status === 'pending');
            if (remainingPending.length === 0) {
              const completedCount = updated.filter((t) => t.status === 'completed').length;
              notifyQueueComplete(completedCount);
            }

            return updated;
          });
        } catch (err: unknown) {
          console.error(`Task ${taskId} failed:`, err);
          const errorMsg = err instanceof Error ? err.message : 'Error desconocido al procesar audio';
          setTasks((prev) =>
            prev.map((item) =>
              item.id === taskId
                ? { ...item, status: 'failed' as const, progress: 0, error: errorMsg }
                : item
            )
          );
        } finally {
          isProcessingRef.current = false;
          // Trigger next in sequence
          setTimeout(() => {
            processNextTask();
          }, 300);
        }
      })();

      return currentTasks;
    });
  }, [isOnline]);

  // Trigger processing whenever tasks change
  useEffect(() => {
    const hasPending = tasks.some((t) => t.status === 'pending');
    if (hasPending && !isProcessingRef.current) {
      processNextTask();
    }
  }, [tasks, processNextTask]);

  // Export single task MP3
  const downloadSingleTask = useCallback((task: QueueTask) => {
    if (!task.audioBlobUrl) return;
    const a = document.createElement('a');
    a.href = task.audioBlobUrl;
    a.download = task.fileName || `locucion_tiktok_${task.id}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  // Export all completed tasks as a ZIP file
  const downloadAllAsZip = useCallback(async () => {
    const completedTasks = tasks.filter((t) => t.status === 'completed' && t.audioBlobUrl);
    if (completedTasks.length === 0) return;

    const zip = new JSZip();
    const folder = zip.folder('VoxCloner_TikTok_Locuciones');

    for (let i = 0; i < completedTasks.length; i++) {
      const task = completedTasks[i];
      try {
        const response = await fetch(task.audioBlobUrl!);
        const blob = await response.blob();
        const safeName = `${String(i + 1).padStart(2, '0')}_${task.fileName}`;
        folder?.file(safeName, blob);
      } catch (err) {
        console.warn(`Could not add ${task.title} to zip:`, err);
      }
    }

    const zipContent = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipContent);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VoxCloner_Export_Masivo_${new Date().toISOString().slice(0, 10)}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [tasks]);

  return {
    tasks,
    isProcessing,
    addTask,
    addBatchTasks,
    removeTask,
    clearCompleted,
    retryTask,
    downloadSingleTask,
    downloadAllAsZip,
  };
}

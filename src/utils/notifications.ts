/**
 * Push & In-App Notification Manager for task queue completions
 */

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

export function playSuccessChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Harmonic bell chime for TikTok creator export complete
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15); // D6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  } catch (err) {
    console.debug('Audio chime playback omitted:', err);
  }
}

export function notifyQueueComplete(completedCount: number, failedCount: number = 0) {
  playSuccessChime();

  const title = `✨ ${completedCount} Locución${completedCount > 1 ? 'es' : ''} MP3 lista${completedCount > 1 ? 's' : ''}`;
  const body = failedCount > 0
    ? `${completedCount} audios procesados correctamente, ${failedCount} con error. Listos para descargar.`
    : `Todas tus locuciones se exportaron en alta fidelidad 320kbps. Listas para TikTok / Reels.`;

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        silent: false,
      });
    } catch (e) {
      console.debug('Notification trigger fallback:', e);
    }
  }
}

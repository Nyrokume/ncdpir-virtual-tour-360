const STORAGE_KEY = 'ncdpir-audio-settings-v1';

const DEFAULTS = {
  volume: 0.8,
  volumeBeforeMute: 0.8,
};

function clampVolume(value, fallback = DEFAULTS.volume) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.round(Math.max(0, Math.min(1, n)) * 20) / 20;
}

export function loadAudioSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };

    const parsed = JSON.parse(raw);
    return {
      volume: clampVolume(parsed.volume),
      volumeBeforeMute: clampVolume(parsed.volumeBeforeMute, DEFAULTS.volumeBeforeMute),
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveAudioSettings({ volume, volumeBeforeMute }) {
  try {
    const state = {
      volume: clampVolume(volume),
      volumeBeforeMute: clampVolume(volumeBeforeMute, DEFAULTS.volumeBeforeMute),
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state, null, 2));
    return state;
  } catch {
    return null;
  }
}

import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../../lib/assets';
import { loadAudioSettings, saveAudioSettings } from '../../lib/audioSettings';

export default function AudioPlayer({ src, title, autoPlay = false }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(() => loadAudioSettings().volume);
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(
    () => loadAudioSettings().volumeBeforeMute
  );
  const [needsInteraction, setNeedsInteraction] = useState(false);

  const isMuted = volume === 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = volume === 0;
  }, [volume]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveAudioSettings({ volume, volumeBeforeMute });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [volume, volumeBeforeMute]);
  useEffect(() => {
    if (!autoPlay || !src) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().then(() => setPlaying(true)).catch(() => setNeedsInteraction(true));
  }, [autoPlay, src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => {
        setPlaying(true);
        setNeedsInteraction(false);
      });
    }
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(volumeBeforeMute || 0.8);
    } else {
      setVolumeBeforeMute(volume);
      setVolume(0);
    }
  };

  const handleVolumeChange = (e) => {
    const next = Number(e.target.value);
    setVolume(next);
    if (next > 0) setVolumeBeforeMute(next);
  };

  if (!src) return null;

  return (
    <div
      className="fixed bottom-20 right-4 z-30 flex max-w-[min(100vw-2rem,360px)] items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-2 backdrop-blur-md md:bottom-6"
      data-testid="audio-player"
    >
      <audio
        ref={audioRef}
        src={assetUrl(src)}
        preload="none"
        onEnded={() => setPlaying(false)}
      />
      {needsInteraction && !playing && (
        <button
          type="button"
          onClick={togglePlay}
          className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-accent"
        >
          Слушать
        </button>
      )}
      <button
        type="button"
        onClick={togglePlay}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
        aria-label={playing ? 'Пауза' : 'Воспроизвести'}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      <button
        type="button"
        onClick={toggleMute}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
        aria-label={isMuted ? 'Включить звук' : 'Без звука'}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={handleVolumeChange}
        className="h-1 min-w-[72px] flex-1 cursor-pointer appearance-none rounded-full bg-white/20 accent-accent [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        aria-label="Громкость"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(volume * 100)}
      />
      <span className="w-8 shrink-0 text-right font-mono text-[10px] tabular-nums text-white/50">
        {Math.round(volume * 100)}%
      </span>
      {title && (
        <span className="hidden max-w-[100px] truncate font-mono text-[10px] text-white/50 lg:inline">
          {title}
        </span>
      )}
    </div>
  );
}

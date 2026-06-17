import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { countExhibits } from '../data/tourData';
import { assetUrl } from '../lib/assets';
import { preloadPanoramas } from '../lib/panoramaPreload';

export default function WelcomeScreen({ tour, onStart }) {
  const exhibitCount = countExhibits(tour.panoramas);

  useEffect(() => {
    preloadPanoramas([
      assetUrl('/panoramas/street.jpg'),
      assetUrl('/panoramas/salon.jpg'),
    ]);
  }, []);

  return (
    <div
      className="noise-bg relative flex h-full w-full flex-col items-center justify-center bg-canvas px-6"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,42,42,0.06) 0%, transparent 60%), #050505',
      }}
      data-testid="welcome-screen"
    >
      <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
          {tour.schoolFullName || tour.schoolName}
        </p>

        <h1 className="font-display mt-6 text-5xl font-semibold leading-[1.1] tracking-tight md:text-7xl">
          Тайны дома Жерехова
        </h1>

        <p className="mt-6 max-w-md text-base leading-relaxed text-white/50">
          Пройдите по маршруту как наяву. Вращайте камеру, переходите между залами
          по указателям и открывайте интерактивные экспонаты.
        </p>

        <button
          onClick={onStart}
          className="group mt-10 flex items-center gap-3 rounded-full bg-white px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-black transition-colors duration-200 hover:bg-accent hover:text-white"
          data-testid="start-tour-btn"
        >
          Начать тур
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        <div className="mt-16 grid w-full max-w-xs grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
          <Stat label="Залов" value={tour.panoramas.length} />
          <Stat label="Экспонатов" value={exhibitCount} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-canvas/80 px-4 py-5 backdrop-blur-sm">
      <span className="font-display text-2xl font-semibold">{value}</span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
        {label}
      </span>
    </div>
  );
}

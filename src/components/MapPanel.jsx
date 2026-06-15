import { X, Check } from 'lucide-react';
import { countExhibitsInPanorama } from '../data/tourData';

export default function MapPanel({
  panoramas,
  currentIndex,
  visited,
  onSelect,
  onClose,
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        data-testid="map-backdrop"
      />

      <aside
        className="fixed inset-y-0 left-0 z-40 flex w-[88vw] max-w-sm flex-col border-r border-white/10 bg-canvas/95 backdrop-blur-2xl animate-slide-in-left"
        data-testid="map-panel"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              Маршрут
            </p>
            <h3 className="font-display mt-1 text-lg font-medium">Карта тура</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition-colors hover:bg-white/10"
            aria-label="Закрыть карту"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ol className="relative flex flex-col gap-1">
            <div className="absolute bottom-4 left-[23px] top-4 w-px bg-white/10" />

            {panoramas.map((p, i) => {
              const isCurrent = i === currentIndex;
              const isVisited = visited.includes(p.id);
              const exhibits = countExhibitsInPanorama(p);

              return (
                <li key={p.id}>
                  <button
                    onClick={() => onSelect(i)}
                    className={`relative flex w-full items-start gap-4 rounded-xl px-3 py-3 text-left transition-colors hover:bg-white/5 ${
                      isCurrent ? 'bg-white/5' : ''
                    }`}
                    data-testid={`map-item-${p.id}`}
                  >
                    <span
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-mono ${
                        isCurrent
                          ? 'border-accent bg-accent text-white'
                          : isVisited
                            ? 'border-white/20 bg-white/10 text-white/60'
                            : 'border-white/10 bg-canvas text-white/40'
                      }`}
                    >
                      {isVisited && !isCurrent ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        String(p.order).padStart(2, '0')
                      )}
                    </span>

                    <div className="min-w-0 flex-1 pt-0.5">
                      <p
                        className={`font-medium ${isCurrent ? 'text-white' : 'text-white/70'}`}
                      >
                        {p.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-white/40">
                        {p.description}
                      </p>
                      {exhibits > 0 && (
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/30">
                          {exhibits} экспонат
                          {exhibits === 1 ? '' : exhibits < 5 ? 'а' : 'ов'}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>
    </>
  );
}

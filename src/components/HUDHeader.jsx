import { Map, Wrench } from 'lucide-react';

export default function HUDHeader({
  panorama,
  currentIndex,
  total,
  onToggleMap,
  onToggleDevTools,
  devToolsOpen = false,
}) {
  const order = String(currentIndex + 1).padStart(2, '0');
  const totalStr = String(total).padStart(2, '0');

  return (
    <header
      className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3 md:p-4"
      data-testid="hud-header"
    >
      <div className="pointer-events-auto flex items-center justify-between gap-3 rounded-full border border-white/10 bg-black/50 px-2 py-1.5 backdrop-blur-xl">
        <div className="flex items-center gap-1.5">
          {onToggleMap && (
            <button
              onClick={onToggleMap}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10"
              aria-label="Открыть карту маршрута"
              data-testid="map-toggle-btn"
            >
              <Map className="h-3.5 w-3.5" />
            </button>
          )}
          <span className="font-mono text-[10px] tracking-widest text-white/50">
            {order}/{totalStr}
          </span>
        </div>

        <h2 className="truncate px-2 font-display text-sm font-medium md:text-base">
          {panorama.name}
        </h2>

        <div className="flex w-[52px] shrink-0 items-center justify-end">
          {onToggleDevTools && (
            <button
              type="button"
              onClick={onToggleDevTools}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                devToolsOpen
                  ? 'bg-amber-400/20 text-amber-300'
                  : 'text-white/50 hover:bg-white/10 hover:text-amber-200'
              }`}
              aria-label="Редактор маркеров"
              title="Dev: редактор маркеров"
              data-testid="dev-tools-toggle"
            >
              <Wrench className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

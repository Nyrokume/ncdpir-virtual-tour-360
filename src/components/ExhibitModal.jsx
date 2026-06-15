import { X } from 'lucide-react';

export default function ExhibitModal({ exhibit, onClose }) {
  if (!exhibit) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        data-testid="exhibit-backdrop"
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exhibit-title"
      >
        <div
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-canvas/95 shadow-2xl backdrop-blur-2xl animate-zoom-in"
          onClick={(e) => e.stopPropagation()}
          data-testid="exhibit-modal"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur transition-colors hover:bg-black/80"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" />
          </button>

          {exhibit.image && (
            <div className="relative aspect-video w-full overflow-hidden">
              <img
                src={exhibit.image}
                alt={exhibit.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-transparent" />
            </div>
          )}

          <div className="p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              {exhibit.label || 'Экспонат'}
            </p>
            <h2
              id="exhibit-title"
              className="font-display mt-2 text-2xl font-semibold"
            >
              {exhibit.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              {exhibit.description}
            </p>
            {exhibit.link && (
              <a
                href={exhibit.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-mono text-[11px] uppercase tracking-wider text-accent transition-opacity hover:opacity-70"
              >
                Подробнее →
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

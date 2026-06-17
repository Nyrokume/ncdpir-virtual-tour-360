import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function QuizModal({ title, onClose, children }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        data-testid="quiz-backdrop"
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-canvas/95 shadow-2xl backdrop-blur-2xl animate-zoom-in max-h-[min(90vh,800px)] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          data-testid="quiz-modal"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur transition-colors hover:bg-black/80"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="p-6 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              Задание
            </p>
            <h2 className="font-display mt-2 pr-8 text-2xl font-semibold">{title}</h2>
            <div className="mt-6">{children}</div>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-full border border-white/15 bg-white/5 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-white/70 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

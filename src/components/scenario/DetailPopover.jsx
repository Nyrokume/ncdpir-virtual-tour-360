import { X } from 'lucide-react';

export default function DetailPopover({ detail, onClose }) {
  if (!detail) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
        data-testid="detail-backdrop"
      />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-[min(90vw,320px)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/15 bg-canvas/95 p-4 shadow-xl backdrop-blur-xl animate-zoom-in"
        data-testid="detail-popover"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/10"
          aria-label="Закрыть"
        >
          <X className="h-3 w-3" />
        </button>
        <p className="font-display pr-6 text-lg font-semibold">{detail.name}</p>
        {detail.udmName && (
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-accent">
            {detail.udmName}
          </p>
        )}
        {detail.description && (
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            {detail.description}
          </p>
        )}
      </div>
    </>
  );
}

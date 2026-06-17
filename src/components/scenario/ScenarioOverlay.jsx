import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ScenarioOverlay({
  title,
  description,
  ctaLabel = 'Далее',
  onContinue,
  secondaryLabel,
  onSecondary,
  showContinue = true,
  collapsible = true,
  children,
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center p-4 md:p-8"
      data-testid="scenario-overlay"
    >
      <div className="pointer-events-auto w-full max-w-xl rounded-2xl border border-white/10 bg-canvas/90 p-6 shadow-2xl backdrop-blur-2xl animate-fade-in md:p-8">
        <h2 className="font-display text-center text-xl font-semibold leading-snug md:text-2xl">
          {title}
        </h2>

        {description && (
          <div className="mt-4">
            {collapsible && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mb-2 flex w-full items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-widest text-white/40 transition hover:text-white/60"
              >
                {expanded ? 'Свернуть' : 'Подробнее'}
                {expanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
            )}
            {(expanded || !collapsible) && (
              <p className="text-center text-sm leading-relaxed text-white/60">
                {description}
              </p>
            )}
          </div>
        )}

        {children}

        {showContinue && onContinue && (
          <button
            type="button"
            onClick={onContinue}
            className="mt-6 w-full rounded-full bg-white px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-black transition hover:bg-accent hover:text-white"
            data-testid="scenario-continue-btn"
          >
            {ctaLabel}
          </button>
        )}

        {secondaryLabel && onSecondary && (
          <button
            type="button"
            onClick={onSecondary}
            className="mt-3 w-full rounded-full border border-white/15 bg-white/5 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-white/60 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
            data-testid="scenario-secondary-btn"
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
}

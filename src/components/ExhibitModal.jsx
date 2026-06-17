import { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { ZONE_LABELS } from '../data/scenarioData';
import DetailPopover from './scenario/DetailPopover';

export default function ExhibitModal({ exhibit, onClose }) {
  const [activeDetail, setActiveDetail] = useState(null);

  if (!exhibit) return null;

  const zoneText =
    exhibit.zoneLabel === 'exhibition'
      ? ZONE_LABELS.exhibition
      : exhibit.zoneLabel === 'souvenir'
        ? ZONE_LABELS.souvenir
        : null;

  const badgeLabel = zoneText || exhibit.label || 'Экспонат';

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm animate-fade-in"
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
          className="exhibit-modal relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-canvas/95 shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-2xl animate-zoom-in max-h-[min(90vh,720px)]"
          onClick={(e) => e.stopPropagation()}
          data-testid="exhibit-modal"
        >
          {exhibit.image && (
            <div className="relative shrink-0 overflow-hidden">
              <div className="relative aspect-[16/10] max-h-[240px] w-full md:max-h-[280px]">
                <img
                  src={exhibit.image}
                  alt={exhibit.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-60" />
              </div>

              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white/90 backdrop-blur-md transition hover:border-white/25 hover:bg-black/75"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>

              <span className="absolute bottom-3 left-4 inline-flex items-center rounded-full border border-white/10 bg-black/50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/70 backdrop-blur-md">
                {badgeLabel}
              </span>
            </div>
          )}

          {!exhibit.image && (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white/90 backdrop-blur-md transition hover:border-white/25 hover:bg-black/75"
              aria-label="Закрыть"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <div className="exhibit-modal-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="px-6 pb-6 pt-5 md:px-7 md:pb-7">
              {!exhibit.image && (
                <span className="inline-flex items-center rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                  {badgeLabel}
                </span>
              )}

              <h2
                id="exhibit-title"
                className={`font-display text-xl font-semibold leading-snug text-white md:text-2xl ${exhibit.image ? '' : 'mt-3 pr-10'}`}
              >
                {exhibit.title}
              </h2>

              {exhibit.description && (
                <p className="mt-4 whitespace-pre-line rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 text-sm leading-relaxed text-white/65">
                  {exhibit.description}
                </p>
              )}

              {exhibit.details?.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-3">
                    <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
                      Детали с подписями
                    </p>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                  </div>

                  <ul className="mt-3 space-y-2">
                    {exhibit.details.map((d) => (
                      <li key={d.id}>
                        <button
                          type="button"
                          onClick={() => setActiveDetail(d)}
                          className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-3 text-left transition hover:border-accent/35 hover:bg-accent/[0.06]"
                        >
                          <div className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-white/90">
                              {d.name}
                            </span>
                            {d.udmName && (
                              <span className="mt-0.5 block font-mono text-[10px] tracking-wide text-accent/75">
                                {d.udmName}
                              </span>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 text-white/25 transition group-hover:translate-x-0.5 group-hover:text-accent/80" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {exhibit.link && (
                <a
                  href={exhibit.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-accent transition hover:border-accent/50 hover:bg-accent/15"
                >
                  Подробнее
                  <ChevronRight className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {activeDetail && (
        <DetailPopover detail={activeDetail} onClose={() => setActiveDetail(null)} />
      )}
    </>
  );
}

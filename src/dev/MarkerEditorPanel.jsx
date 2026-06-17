import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Circle,
  Copy,
  Files,
  Move,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import {
  clearEditorState,
  countEditorChanges,
  exportEditorAsJson,
  exportEditorForTourData,
} from './markerEditor';

function formatSavedAt(savedAt) {
  if (!savedAt) return null;
  try {
    return new Date(savedAt).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return null;
  }
}

function saveStatusText(saveStatus, savedAt) {
  const time = formatSavedAt(savedAt);

  switch (saveStatus) {
    case 'loading':
      return 'Загрузка marker-editor-state.json…';
    case 'saving':
      return 'Сохранение в marker-editor-state.json…';
    case 'saved':
      return time
        ? `JSON + tourData.js сохранены · ${time}`
        : 'JSON + tourData.js сохранены';
    case 'error':
      return 'Ошибка записи JSON — проверьте dev-сервер';
    default:
      return 'Правки пишутся в marker-editor-state.json и tourData.js';
  }
}

export default function MarkerEditorPanel({
  panorama,
  panoramas,
  editorState,
  editMode,
  placeMode,
  placeTemplate,
  onToggleEditMode,
  onSetPlaceMode,
  onClose,
  onResetScene,
  onDeleteHotspot,
  onUpdateHotspot,
  onDuplicateHotspot,
  onCancelPlace,
  saveStatus = 'idle',
}) {
  const [copied, setCopied] = useState('');

  const sceneState = editorState.scenes[panorama.id] || {
    positions: {},
    added: [],
    removed: [],
  };

  const hotspotRows = useMemo(() => {
    const positionIds = new Set(Object.keys(sceneState.positions || {}));
    const addedIds = new Set((sceneState.added || []).map((h) => h.id));

    return (panorama.hotspots || []).map((h) => ({
      ...h,
      isNew: addedIds.has(h.id),
      isMoved: positionIds.has(h.id),
      changed: positionIds.has(h.id) || addedIds.has(h.id),
    }));
  }, [panorama.hotspots, sceneState]);

  const copyText = async (text, label) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const changeCount = countEditorChanges(editorState);

  return (
    <aside
      className="fixed bottom-4 right-4 z-50 flex max-h-[calc(100vh-2rem)] w-[min(420px,calc(100vw-2rem))] flex-col rounded-2xl border border-amber-400/30 bg-black/90 text-white shadow-2xl backdrop-blur-xl"
      data-testid="marker-editor-panel"
    >
      <header className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300">
            Dev · редактор объектов
          </p>
          <h2 className="mt-1 text-sm font-medium">{panorama.name}</h2>
          <p className="mt-1 text-xs text-white/55">
            Перетаскивайте маркеры или кликните по панораме, чтобы поставить новый.
          </p>
          <p
            className={`mt-1 font-mono text-[10px] ${
              saveStatus === 'error'
                ? 'text-red-300'
                : saveStatus === 'saving'
                  ? 'text-amber-200'
                  : 'text-emerald-300/90'
            }`}
          >
            {saveStatusText(saveStatus, editorState.savedAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
          aria-label="Скрыть панель"
        >
          <X size={16} />
        </button>
      </header>

      <div className="space-y-3 overflow-y-auto px-4 py-3">
        <button
          type="button"
          onClick={onToggleEditMode}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
            editMode
              ? 'bg-amber-400 text-black'
              : 'bg-white/10 text-white hover:bg-white/15'
          }`}
        >
          <Move size={16} />
          {editMode ? 'Режим правки включён' : 'Включить режим правки'}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              onSetPlaceMode(placeMode === 'exhibit' ? null : 'exhibit')
            }
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition ${
              placeMode === 'exhibit'
                ? 'bg-red-500/25 text-red-100 ring-1 ring-red-400/40'
                : 'bg-white/10 hover:bg-white/15'
            }`}
          >
            <Plus size={14} />
            <Circle size={12} className="text-red-300" />
            Экспонат
          </button>
          <button
            type="button"
            onClick={() => onSetPlaceMode(placeMode === 'nav' ? null : 'nav')}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition ${
              placeMode === 'nav'
                ? 'bg-white/25 text-white ring-1 ring-white/40'
                : 'bg-white/10 hover:bg-white/15'
            }`}
          >
            <Plus size={14} />
            <ArrowRight size={12} />
            Переход
          </button>
        </div>

        {placeMode && (
          <p className="rounded-lg bg-amber-400/10 px-3 py-2 text-center text-xs text-amber-100">
            Кликните по панораме, чтобы поставить маркер «
            {placeMode === 'nav' ? 'Переход' : 'Экспонат'}»
          </p>
        )}

        {placeTemplate && (
          <div className="rounded-lg bg-sky-400/10 px-3 py-2 text-center text-xs text-sky-100">
            <p>
              Кликните по панораме, чтобы поставить копию «{placeTemplate.name}»
            </p>
            <button
              type="button"
              onClick={onCancelPlace}
              className="mt-1 text-[10px] text-white/50 underline hover:text-white"
            >
              Отменить
            </button>
          </div>
        )}

        <div className="max-h-52 overflow-y-auto rounded-xl border border-white/10 bg-white/5">
          {hotspotRows.length === 0 && (
            <p className="px-3 py-4 text-center text-xs text-white/40">
              Маркеров на сцене нет
            </p>
          )}
          {hotspotRows.map((h) => (
            <div
              key={h.id}
              className="border-b border-white/5 px-3 py-2 last:border-b-0"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <input
                    type="text"
                    value={h.name}
                    onChange={(e) =>
                      onUpdateHotspot(h.id, { name: e.target.value })
                    }
                    className="w-full rounded bg-transparent text-xs font-medium text-white outline-none ring-1 ring-transparent focus:ring-amber-400/40"
                  />
                  <p className="truncate font-mono text-[10px] text-white/45">
                    {h.id}
                    {h.isNew && (
                      <span className="ml-2 text-emerald-300">новый</span>
                    )}
                    {h.isMoved && !h.isNew && (
                      <span className="ml-2 text-amber-300">сдвинут</span>
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => onDuplicateHotspot(h)}
                    className="rounded p-1 text-white/35 transition hover:bg-sky-500/20 hover:text-sky-200"
                    aria-label="Дублировать маркер"
                    title="Дублировать и расставить"
                  >
                    <Files size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteHotspot(h.id)}
                    className="rounded p-1 text-white/35 transition hover:bg-red-500/20 hover:text-red-200"
                    aria-label="Удалить маркер"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] text-white/55">
                  {h.yaw}, {h.pitch}
                </p>
                {h.type === 'nav' && (
                  <select
                    value={h.targetId || ''}
                    onChange={(e) =>
                      onUpdateHotspot(h.id, { targetId: e.target.value })
                    }
                    className="max-w-[140px] truncate rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-white outline-none ring-1 ring-white/10"
                  >
                    {panoramas.map((p) => (
                      <option key={p.id} value={p.id}>
                        → {p.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {h.type === 'exhibit' && (
                <textarea
                  value={h.exhibit?.description || ''}
                  onChange={(e) =>
                    onUpdateHotspot(h.id, { description: e.target.value })
                  }
                  rows={2}
                  placeholder="Описание экспоната"
                  className="mt-2 w-full resize-none rounded-lg bg-black/30 px-2 py-1.5 text-[11px] text-white/80 outline-none ring-1 ring-white/10 focus:ring-amber-400/30"
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => copyText(exportEditorAsJson(editorState), 'json')}
            className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs transition hover:bg-white/15"
          >
            <Copy size={14} />
            Скопировать JSON
            {changeCount > 0 && (
              <span className="text-amber-300">({changeCount})</span>
            )}
          </button>
          <button
            type="button"
            onClick={() =>
              copyText(exportEditorForTourData(panoramas, editorState), 'code')
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs transition hover:bg-white/15"
          >
            <Copy size={14} />
            Скопировать в код
          </button>
          <button
            type="button"
            onClick={onResetScene}
            className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs transition hover:bg-white/15"
          >
            <RotateCcw size={14} />
            Отменить правки сцены
          </button>
          <button
            type="button"
            onClick={async () => {
              await clearEditorState();
              window.location.reload();
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-500/15 px-3 py-2 text-xs text-red-200 transition hover:bg-red-500/25"
          >
            <Trash2 size={14} />
            Очистить всё
          </button>
        </div>

        {copied && (
          <p className="text-center font-mono text-[10px] text-amber-300">
            {copied === 'json'
              ? 'JSON скопирован в буфер'
              : 'Фрагмент для кода скопирован'}
          </p>
        )}
      </div>
    </aside>
  );
}

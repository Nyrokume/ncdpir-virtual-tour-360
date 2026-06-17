import {
  applyEditorState,
  countEditorChanges,
  emptyScene,
  emptyState,
  rehydrateEditorState,
} from './markerEditorCore';

const EDITOR_KEY = 'ncdpir-marker-editor-v2';
const LEGACY_KEY = 'ncdpir-marker-positions-v1';
const API_PATH = '/__dev/marker-editor';
const SAVE_DEBOUNCE_MS = 120;

let saveTimer = null;
let pendingState = null;
let saveChain = Promise.resolve();

export { applyEditorState, countEditorChanges, rehydrateEditorState };

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(EDITOR_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }

  try {
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const positions = JSON.parse(legacy);
      return {
        scenes: Object.fromEntries(
          Object.entries(positions).map(([sceneId, hotspots]) => [
            sceneId,
            { positions: hotspots, added: [], removed: [], meta: {} },
          ])
        ),
        savedAt: new Date().toISOString(),
      };
    }
  } catch {
    /* ignore */
  }

  return emptyState();
}

function saveToLocalStorage(state) {
  try {
    localStorage.setItem(EDITOR_KEY, JSON.stringify(state, null, 2));
  } catch {
    /* ignore */
  }
}

async function fetchEditorStateFromFile() {
  if (!import.meta.env.DEV) return null;

  const res = await fetch(API_PATH, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data?.scenes ? data : emptyState();
}

async function writeEditorStateToFile(state) {
  if (!import.meta.env.DEV) return;

  const body = JSON.stringify(state, null, 2);
  const res = await fetch(API_PATH, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  if (!res.ok) {
    throw new Error(`Save failed: HTTP ${res.status}`);
  }
}

export async function syncTourDataFromEditor() {
  if (!import.meta.env.DEV) return;

  const res = await fetch('/__dev/sync-tour-data', { method: 'POST' });
  if (!res.ok) {
    throw new Error(`Sync failed: HTTP ${res.status}`);
  }
}

export async function loadEditorState(panoramas = []) {
  let state = emptyState();

  if (import.meta.env.DEV) {
    try {
      const fileState = await fetchEditorStateFromFile();
      const hasFileData = Object.keys(fileState.scenes || {}).length > 0;

      if (hasFileData) {
        state = fileState;
      } else {
        const localState = loadFromLocalStorage();
        const hasLocalData = Object.keys(localState.scenes || {}).length > 0;

        if (hasLocalData) {
          await writeEditorStateToFile(localState);
          state = localState;
        } else {
          state = fileState;
        }
      }
    } catch {
      state = loadFromLocalStorage();
    }
  } else {
    state = loadFromLocalStorage();
  }

  if (panoramas.length) {
    state = rehydrateEditorState(panoramas, state);
  }

  return state;
}

export function prepareEditorState(state) {
  return { ...state, savedAt: new Date().toISOString() };
}

export function saveEditorState(state) {
  const next = prepareEditorState(state);
  saveToLocalStorage(next);
  queueSaveEditorState(next);
  return next;
}

export function queueSaveEditorState(state) {
  if (!import.meta.env.DEV) return Promise.resolve(state);

  pendingState = state;
  clearTimeout(saveTimer);

  return new Promise((resolve, reject) => {
    saveTimer = setTimeout(() => {
      const payload = pendingState;
      pendingState = null;

      saveChain = saveChain
        .then(() => writeEditorStateToFile(payload))
        .then(() => syncTourDataFromEditor())
        .then(() => resolve(payload))
        .catch(reject);
    }, SAVE_DEBOUNCE_MS);
  });
}

export async function flushEditorState(state) {
  clearTimeout(saveTimer);
  pendingState = null;
  const next = prepareEditorState(state);
  saveToLocalStorage(next);

  if (!import.meta.env.DEV) return next;

  await writeEditorStateToFile(next);
  await syncTourDataFromEditor();
  return next;
}

export async function clearEditorState() {
  localStorage.removeItem(EDITOR_KEY);
  localStorage.removeItem(LEGACY_KEY);

  if (import.meta.env.DEV) {
    await fetch(API_PATH, { method: 'DELETE' });
  }
}

function getScene(state, sceneId) {
  return state.scenes[sceneId] || emptyScene();
}

export function updateHotspotPosition(state, sceneId, hotspotId, yaw, pitch) {
  const scene = { ...getScene(state, sceneId) };
  const addedIdx = scene.added.findIndex((h) => h.id === hotspotId);

  if (addedIdx >= 0) {
    scene.added = scene.added.map((h, i) =>
      i === addedIdx ? { ...h, yaw, pitch } : h
    );
  } else {
    scene.positions = { ...scene.positions, [hotspotId]: { yaw, pitch } };
  }

  return {
    ...state,
    scenes: { ...state.scenes, [sceneId]: scene },
  };
}

export function addHotspot(state, sceneId, hotspot) {
  const scene = { ...getScene(state, sceneId) };
  scene.added = [...scene.added.filter((h) => h.id !== hotspot.id), hotspot];

  return {
    ...state,
    scenes: { ...state.scenes, [sceneId]: scene },
  };
}

export function removeHotspot(state, sceneId, hotspotId) {
  const scene = { ...getScene(state, sceneId) };
  const isAdded = scene.added.some((h) => h.id === hotspotId);

  if (isAdded) {
    scene.added = scene.added.filter((h) => h.id !== hotspotId);
  } else {
    scene.removed = [...new Set([...(scene.removed || []), hotspotId])];
    const { [hotspotId]: _pos, ...restPos } = scene.positions;
    scene.positions = restPos;
    const { [hotspotId]: _meta, ...restMeta } = scene.meta || {};
    scene.meta = restMeta;
  }

  const { [hotspotId]: _pos2, ...restPos2 } = scene.positions || {};
  if (_pos2 !== undefined && isAdded) {
    scene.positions = restPos2;
  }

  return {
    ...state,
    scenes: { ...state.scenes, [sceneId]: scene },
  };
}

export function updateHotspotMeta(state, sceneId, hotspotId, patch) {
  const scene = { ...getScene(state, sceneId) };
  const addedIdx = scene.added.findIndex((h) => h.id === hotspotId);

  if (addedIdx >= 0) {
    const next = { ...scene.added[addedIdx], ...patch };
    if (patch.name && next.exhibit) {
      next.exhibit = { ...next.exhibit, title: patch.name };
    }
    if (patch.description && next.exhibit) {
      next.exhibit = { ...next.exhibit, description: patch.description };
    }
    scene.added = scene.added.map((h, i) => (i === addedIdx ? next : h));
    return { ...state, scenes: { ...state.scenes, [sceneId]: scene } };
  }

  scene.meta = {
    ...scene.meta,
    [hotspotId]: { ...scene.meta?.[hotspotId], ...patch },
  };
  return { ...state, scenes: { ...state.scenes, [sceneId]: scene } };
}

export function resetScene(state, sceneId) {
  const scenes = { ...state.scenes };
  delete scenes[sceneId];
  return { ...state, scenes };
}

export function cloneHotspotForPlacement(source, panoramaId) {
  const stamp = Date.now().toString(36);
  const copy = {
    id: `${panoramaId}-copy-${stamp}`,
    type: source.type,
    name: source.name,
    yaw: source.yaw,
    pitch: source.pitch,
  };

  if (source.type === 'nav' && source.targetId) {
    copy.targetId = source.targetId;
  }

  if (source.type === 'exhibit' && source.exhibit) {
    copy.exhibit = JSON.parse(JSON.stringify(source.exhibit));
    if (!copy.exhibit.title) {
      copy.exhibit.title = source.name;
    }
  }

  return copy;
}

export function createHotspotTemplate(panorama, type, yaw, pitch, panoramas) {
  const stamp = Date.now().toString(36);
  const imagePath = panorama.url.replace(/^.*\/panoramas\//, '/panoramas/');

  if (type === 'nav') {
    const fallbackTarget =
      panoramas.find((p) => p.id !== panorama.id)?.id || panorama.id;
    return {
      id: `${panorama.id}-nav-${stamp}`,
      type: 'nav',
      name: 'Переход',
      yaw,
      pitch,
      targetId: fallbackTarget,
    };
  }

  return {
    id: `${panorama.id}-exhibit-${stamp}`,
    type: 'exhibit',
    name: 'Экспонат',
    yaw,
    pitch,
    exhibit: {
      title: 'Новый экспонат',
      description: 'Добавьте описание в редакторе.',
      image: imagePath.startsWith('/')
        ? imagePath
        : `/panoramas/${panorama.id}.jpg`,
    },
  };
}

export function exportEditorAsJson(state) {
  return JSON.stringify(state, null, 2);
}

export function exportEditorForTourData(panoramas, state) {
  const lines = [
    '// Скопируйте блоки hotspots в src/data/tourData.js',
    '// Включены: сдвинутые, новые и без удалённых маркеров',
    '',
  ];

  applyEditorState(panoramas, state).forEach((p) => {
    const scene = state.scenes[p.id];
    if (!scene) return;

    lines.push(`// ${p.order}. ${p.name} (${p.id})`);
    (p.hotspots || []).forEach((h) => {
      if (h.type === 'nav') {
        lines.push(
          `//   { id: '${h.id}', type: 'nav', name: '${h.name}', yaw: '${h.yaw}', pitch: '${h.pitch}', targetId: '${h.targetId}' },`
        );
      } else {
        lines.push(
          `//   { id: '${h.id}', type: 'exhibit', name: '${h.name}', yaw: '${h.yaw}', pitch: '${h.pitch}', exhibit: { title: '${h.exhibit?.title || h.name}', ... } },`
        );
      }
    });
    lines.push('');
  });

  return lines.join('\n');
}

export const loadMarkerOverrides = loadEditorState;
export const saveMarkerOverrides = saveEditorState;
export const clearMarkerOverrides = clearEditorState;
export const applyMarkerOverrides = applyEditorState;
export const exportOverridesAsJson = exportEditorAsJson;
export const exportOverridesForTourData = exportEditorForTourData;

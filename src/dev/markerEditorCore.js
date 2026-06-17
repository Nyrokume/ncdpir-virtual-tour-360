export function emptyScene() {
  return { positions: {}, added: [], removed: [], meta: {} };
}

export function emptyState() {
  return { scenes: {}, savedAt: null };
}

export function applyEditorState(panoramas, state) {
  if (!state?.scenes || !Object.keys(state.scenes).length) return panoramas;

  return panoramas.map((p) => {
    const scene = state.scenes[p.id];
    if (!scene) return p;

    let hotspots = (p.hotspots || []).filter(
      (h) => !scene.removed?.includes(h.id)
    );

    hotspots = hotspots.map((h) => {
      const pos = scene.positions?.[h.id];
      const meta = scene.meta?.[h.id];
      let next = h;
      if (pos) next = { ...next, yaw: pos.yaw, pitch: pos.pitch };
      if (meta) next = applyMetaToHotspot(next, meta);
      return next;
    });

    if (scene.added?.length) {
      const existingIds = new Set(hotspots.map((h) => h.id));
      const newHotspots = scene.added
        .filter((h) => !existingIds.has(h.id))
        .map((h) => {
          const pos = scene.positions?.[h.id];
          const meta = scene.meta?.[h.id];
          let next = h;
          if (pos) next = { ...next, yaw: pos.yaw, pitch: pos.pitch };
          if (meta) next = applyMetaToHotspot(next, meta);
          return next;
        });
      hotspots = [...hotspots, ...newHotspots];
    }

    return { ...p, hotspots };
  });
}

function applyMetaToHotspot(hotspot, meta) {
  let next = { ...hotspot, ...meta };

  if (next.exhibit && (meta.name || meta.description)) {
    next = {
      ...next,
      exhibit: {
        ...next.exhibit,
        ...(meta.name ? { title: meta.name } : {}),
        ...(meta.description ? { description: meta.description } : {}),
      },
    };
  }

  if (meta.name) {
    next.name = meta.name;
  }

  return next;
}

export function inferHotspotType(id) {
  if (id.includes('-nav-') || id.endsWith('-forward') || id.includes('-to-')) {
    return 'nav';
  }
  if (id.includes('-detail-') || id.startsWith('dresses-detail-')) {
    return 'detail';
  }
  if (id.includes('quiz-trigger')) {
    return 'quiz-trigger';
  }
  return 'exhibit';
}

export function createOrphanHotspot(panorama, hotspotId, pos, meta = {}) {
  const type = meta.type || inferHotspotType(hotspotId);
  const imagePath = panorama.url?.replace(/^.*\/panoramas\//, '/panoramas/') ||
    `/panoramas/${panorama.id}.jpg`;

  if (type === 'nav') {
    return {
      id: hotspotId,
      type: 'nav',
      name: meta.name || 'Переход',
      yaw: pos.yaw,
      pitch: pos.pitch,
      targetId: meta.targetId || 'salon',
    };
  }

  if (type === 'detail') {
    return {
      id: hotspotId,
      type: 'detail',
      name: meta.name || 'Деталь',
      yaw: pos.yaw,
      pitch: pos.pitch,
      detail: meta.detail || {
        id: hotspotId,
        name: meta.name || 'Деталь',
        description: meta.description || '',
      },
    };
  }

  if (type === 'quiz-trigger') {
    return {
      id: hotspotId,
      type: 'quiz-trigger',
      name: meta.name || 'Викторина',
      yaw: pos.yaw,
      pitch: pos.pitch,
    };
  }

  const name = meta.name || 'Экспонат';
  return {
    id: hotspotId,
    type: 'exhibit',
    name,
    yaw: pos.yaw,
    pitch: pos.pitch,
    exhibit: {
      title: name,
      description: meta.description || 'Добавьте описание в редакторе.',
      image: imagePath.startsWith('/') ? imagePath : `/panoramas/${panorama.id}.jpg`,
    },
  };
}

export function rehydrateEditorState(panoramas, state) {
  if (!state?.scenes) return state;

  const next = JSON.parse(JSON.stringify(state));
  const panoramaById = Object.fromEntries(panoramas.map((p) => [p.id, p]));

  Object.entries(next.scenes).forEach(([sceneId, scene]) => {
    const panorama = panoramaById[sceneId];
    if (!panorama) return;

    const baseIds = new Set((panorama.hotspots || []).map((h) => h.id));
    const addedIds = new Set((scene.added || []).map((h) => h.id));
    const removed = new Set(scene.removed || []);

    Object.entries(scene.positions || {}).forEach(([hotspotId, pos]) => {
      if (removed.has(hotspotId)) return;
      if (baseIds.has(hotspotId) || addedIds.has(hotspotId)) return;

      const meta = scene.meta?.[hotspotId] || {};
      scene.added = [
        ...(scene.added || []),
        createOrphanHotspot(panorama, hotspotId, pos, meta),
      ];
      addedIds.add(hotspotId);
    });
  });

  return next;
}

export function consolidateEditorState(editorState, mergedPanoramas) {
  const next = JSON.parse(JSON.stringify(editorState));
  const mergedByScene = Object.fromEntries(
    mergedPanoramas.map((p) => [p.id, new Set((p.hotspots || []).map((h) => h.id))])
  );

  Object.entries(next.scenes || {}).forEach(([sceneId, scene]) => {
    const bakedIds = mergedByScene[sceneId] || new Set();
    const remainingAdded = [];

    (scene.added || []).forEach((hotspot) => {
      if (bakedIds.has(hotspot.id)) {
        scene.positions = scene.positions || {};
        scene.positions[hotspot.id] = {
          yaw: hotspot.yaw,
          pitch: hotspot.pitch,
        };
      } else {
        remainingAdded.push(hotspot);
      }
    });

    scene.added = remainingAdded;
  });

  next.savedAt = new Date().toISOString();
  return next;
}

export function countEditorChanges(state) {
  return Object.values(state.scenes || {}).reduce((sum, scene) => {
    return (
      sum +
      Object.keys(scene.positions || {}).length +
      (scene.added?.length || 0) +
      (scene.removed?.length || 0) +
      Object.keys(scene.meta || {}).length
    );
  }, 0);
}

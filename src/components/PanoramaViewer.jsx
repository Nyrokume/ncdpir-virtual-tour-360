import { useEffect, useRef, useCallback, useMemo, useState, memo } from 'react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';

const ARROW_SVG = `<svg class="psv-hotspot__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

function buildMarkerHtml(hotspot, editMode, quizPending = false) {
  const isNav = hotspot.type === 'nav';
  const isDetail = hotspot.type === 'detail';
  const isQuiz = hotspot.type === 'quiz-trigger';
  const cls = [
    isQuiz
      ? 'psv-hotspot--quiz'
      : isNav
        ? 'psv-hotspot--nav'
        : isDetail
          ? 'psv-hotspot--detail'
          : 'psv-hotspot--exhibit',
    isQuiz && quizPending ? 'psv-hotspot--quiz-pending' : '',
    editMode ? 'psv-hotspot--editable' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const inner = isNav
    ? `<span class="psv-hotspot__ring"></span>${ARROW_SVG}`
    : isDetail
      ? `<span class="psv-hotspot__ring"></span><span class="psv-hotspot__dot"></span>`
      : isQuiz
        ? `<span class="psv-hotspot__pulse"></span><span class="psv-hotspot__ring"></span><span class="psv-hotspot__quiz">?</span><span class="psv-hotspot__quiz-tag">маршрут</span>`
        : `<span class="psv-hotspot__ring"></span><span class="psv-hotspot__icon"></span>`;

  return `<div class="${cls}" data-marker-id="${hotspot.id}" data-marker-type="${hotspot.type}" data-testid="hotspot-${hotspot.id}">
    ${inner}
    <span class="psv-hotspot__label">${hotspot.name}</span>
  </div>`;
}

function radToDegString(rad) {
  const deg = (rad * 180) / Math.PI;
  return `${Math.round(deg * 10) / 10}deg`;
}

function coordsFromPointer(viewer, clientX, clientY) {
  const rect = viewer.container.getBoundingClientRect();
  const spherical = viewer.dataHelper.viewerCoordsToSphericalCoords({
    x: clientX - rect.left,
    y: clientY - rect.top,
  });

  return {
    yaw: radToDegString(spherical.yaw),
    pitch: radToDegString(spherical.pitch),
  };
}

function PanoramaViewer({
  panorama,
  onHotspotClick,
  editMode = false,
  placeMode = null,
  placeTemplate = null,
  onHotspotMove,
  onHotspotCreate,
  quizPending = false,
}) {
  const viewerRef = useRef(null);
  const viewerInstanceRef = useRef(null);
  const markersPluginRef = useRef(null);
  const suppressClickRef = useRef(null);
  const placeModeRef = useRef(placeMode);
  const placeTemplateRef = useRef(placeTemplate);
  const onHotspotCreateRef = useRef(onHotspotCreate);
  const [viewerReady, setViewerReady] = useState(0);

  const placeActive = Boolean(placeMode || placeTemplate);

  useEffect(() => {
    placeModeRef.current = placeMode;
  }, [placeMode]);

  useEffect(() => {
    placeTemplateRef.current = placeTemplate;
  }, [placeTemplate]);

  useEffect(() => {
    onHotspotCreateRef.current = onHotspotCreate;
  }, [onHotspotCreate]);

  const markers = useMemo(() => {
    const seen = new Set();

    return (panorama.hotspots || [])
      .filter((h) => {
        if (seen.has(h.id)) return false;
        seen.add(h.id);
        if (h.type === 'quiz-trigger' && !quizPending) return false;
        return true;
      })
      .map((h) => ({
        id: h.id,
        position: { yaw: h.yaw, pitch: h.pitch },
        html: buildMarkerHtml(
          h,
          editMode,
          quizPending && h.type === 'quiz-trigger'
        ),
        anchor: 'center center',
        data: { hotspot: h },
      }));
  }, [panorama.hotspots, editMode, quizPending]);

  const handleReady = useCallback(
    (instance) => {
      viewerInstanceRef.current = instance;
      setViewerReady((n) => n + 1);
      const plugin = instance.getPlugin(MarkersPlugin);
      markersPluginRef.current = plugin;

      plugin.addEventListener('select-marker', ({ marker }) => {
        if (editMode || placeModeRef.current) return;
        if (marker?.data?.hotspot) {
          onHotspotClick(marker.data.hotspot);
        }
      });
    },
    [onHotspotClick, editMode]
  );

  useEffect(() => {
    const plugin = markersPluginRef.current;
    if (!plugin) return;

    const prevIds = new Set(
      (plugin.getMarkers?.() || []).map((marker) => marker.id)
    );
    const nextIds = new Set(markers.map((marker) => marker.id));

    prevIds.forEach((id) => {
      if (!nextIds.has(id)) {
        try {
          plugin.removeMarker(id);
        } catch {
          /* marker may already be gone */
        }
      }
    });

    plugin.setMarkers(markers);
  }, [panorama.id, markers]);

  useEffect(() => {
    const handleClick = (e) => {
      const el = e.target.closest('[data-marker-id]');
      if (!el) return;

      const id = el.dataset.markerId;
      if (
        suppressClickRef.current?.id === id &&
        Date.now() < suppressClickRef.current.until
      ) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      if (editMode || placeActive) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const hotspot = panorama.hotspots?.find((h) => h.id === id);
      if (hotspot) onHotspotClick(hotspot);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [panorama, onHotspotClick, editMode, placeActive]);

  useEffect(() => {
    if (!placeActive) return undefined;

    const container = viewerInstanceRef.current?.container;
    if (!container) return undefined;

    const onPointerDown = (e) => {
      if (e.button !== 0) return;
      if (e.target.closest('[data-marker-id]')) return;

      const viewer = viewerInstanceRef.current;
      if (!viewer) return;
      if (!placeModeRef.current && !placeTemplateRef.current) return;

      const { yaw, pitch } = coordsFromPointer(viewer, e.clientX, e.clientY);
      onHotspotCreateRef.current?.(yaw, pitch);

      e.preventDefault();
      e.stopPropagation();
    };

    container.addEventListener('pointerdown', onPointerDown, true);
    return () => container.removeEventListener('pointerdown', onPointerDown, true);
  }, [placeActive, viewerReady]);

  useEffect(() => {
    if (!editMode) return undefined;

    const onPointerDown = (e) => {
      if (e.button !== 0) return;
      if (placeModeRef.current || placeTemplateRef.current) return;

      const el = e.target.closest('[data-marker-id]');
      if (!el) return;

      const markerId = el.dataset.markerId;
      const viewer = viewerInstanceRef.current;
      const plugin = markersPluginRef.current;
      if (!viewer || !plugin) return;

      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      let moved = false;

      const updatePosition = (clientX, clientY) => {
        const { yaw, pitch } = coordsFromPointer(viewer, clientX, clientY);

        plugin.updateMarker({
          id: markerId,
          position: { yaw, pitch },
        });

        onHotspotMove?.(markerId, yaw, pitch);
      };

      const onPointerMove = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (!moved && Math.hypot(dx, dy) < 4) return;

        moved = true;
        updatePosition(ev.clientX, ev.clientY);
      };

      const onPointerUp = (ev) => {
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);

        if (moved) {
          suppressClickRef.current = {
            id: markerId,
            until: Date.now() + 400,
          };
          updatePosition(ev.clientX, ev.clientY);
        }
      };

      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    };

    const container = viewerInstanceRef.current?.container;
    if (!container) return undefined;

    container.addEventListener('pointerdown', onPointerDown, true);
    return () => container.removeEventListener('pointerdown', onPointerDown, true);
  }, [editMode, placeActive, onHotspotMove, panorama.id, viewerReady]);

  const plugins = useMemo(() => [[MarkersPlugin, { markers }]], [markers]);

  const modeClass = [
    editMode ? 'marker-edit-mode' : '',
    placeActive ? 'marker-place-mode' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`absolute inset-0 ${modeClass}`}
      data-testid="panorama-viewer"
    >
      <ReactPhotoSphereViewer
        ref={viewerRef}
        src={panorama.url}
        height="100vh"
        width="100%"
        plugins={plugins}
        navbar={false}
        defaultZoomLvl={20}
        minFov={40}
        maxFov={90}
        mousewheel
        touchmoveTwoFingers={false}
        loadingTxt="Загрузка панорамы..."
        defaultTransition={{ speed: 700, rotation: true, effect: 'fade' }}
        onReady={handleReady}
      />
    </div>
  );
}

export default memo(PanoramaViewer);

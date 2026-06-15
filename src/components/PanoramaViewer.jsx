import { useEffect, useRef, useCallback, useMemo } from 'react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';

const ARROW_SVG = `<svg class="psv-hotspot__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

function buildMarkerHtml(hotspot) {
  const isNav = hotspot.type === 'nav';
  const cls = isNav ? 'psv-hotspot--nav' : 'psv-hotspot--exhibit';

  const inner = isNav
    ? `<span class="psv-hotspot__ring"></span>${ARROW_SVG}`
    : `<span class="psv-hotspot__ring"></span><span class="psv-hotspot__icon"></span>`;

  return `<div class="${cls}" data-marker-id="${hotspot.id}" data-marker-type="${hotspot.type}" data-testid="hotspot-${hotspot.id}">
    ${inner}
    <span class="psv-hotspot__label">${hotspot.name}</span>
  </div>`;
}

export default function PanoramaViewer({ panorama, onHotspotClick }) {
  const viewerRef = useRef(null);
  const markersPluginRef = useRef(null);

  const markers = useMemo(
    () =>
      (panorama.hotspots || []).map((h) => ({
        id: h.id,
        position: { yaw: h.yaw, pitch: h.pitch },
        html: buildMarkerHtml(h),
        anchor: 'center center',
        data: { hotspot: h },
      })),
    [panorama.hotspots]
  );

  const handleReady = useCallback(
    (instance) => {
      const plugin = instance.getPlugin(MarkersPlugin);
      markersPluginRef.current = plugin;

      plugin.addEventListener('select-marker', ({ marker }) => {
        if (marker?.data?.hotspot) {
          onHotspotClick(marker.data.hotspot);
        }
      });
    },
    [onHotspotClick]
  );

  useEffect(() => {
    const plugin = markersPluginRef.current;
    if (plugin) {
      plugin.setMarkers(markers);
    }
  }, [panorama.id, markers]);

  useEffect(() => {
    const handleClick = (e) => {
      const el = e.target.closest('[data-marker-id]');
      if (!el) return;
      const id = el.dataset.markerId;
      const hotspot = panorama.hotspots?.find((h) => h.id === id);
      if (hotspot) onHotspotClick(hotspot);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [panorama, onHotspotClick]);

  return (
    <div className="absolute inset-0" data-testid="panorama-viewer">
      <ReactPhotoSphereViewer
        ref={viewerRef}
        src={panorama.url}
        height="100vh"
        width="100%"
        plugins={[[MarkersPlugin, { markers }]]}
        navbar={false}
        defaultZoomLvl={20}
        minFov={40}
        maxFov={90}
        mousewheel
        touchmoveTwoFingers={false}
        loadingTxt="Загрузка панорамы..."
        defaultTransition={{ speed: 1500, rotation: true, effect: 'fade' }}
        onReady={handleReady}
      />
    </div>
  );
}

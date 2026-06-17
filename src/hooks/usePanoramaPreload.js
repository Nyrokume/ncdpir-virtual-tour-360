import { useEffect } from 'react';
import { preloadPanoramas, urlsForPanoramaIds } from '../lib/panoramaPreload';

/**
 * Prefetch likely next panoramas: scenario next, nav hotspots, recommended step.
 */
export function usePanoramaPreload({
  panoramas,
  currentPanorama,
  getNextPanoramaId,
  getRecommendedPanoramaId,
}) {
  useEffect(() => {
    if (!currentPanorama) return;

    const ids = new Set();

    const scenarioNext = getNextPanoramaId?.(currentPanorama.id);
    if (scenarioNext) ids.add(scenarioNext);

    const recommended = getRecommendedPanoramaId?.();
    if (recommended) ids.add(recommended);

    (currentPanorama.hotspots || []).forEach((h) => {
      if (h.type === 'nav' && h.targetId) ids.add(h.targetId);
    });

    ids.delete(currentPanorama.id);

    preloadPanoramas(urlsForPanoramaIds(panoramas, [...ids]));
  }, [
    panoramas,
    currentPanorama,
    getNextPanoramaId,
    getRecommendedPanoramaId,
  ]);
}

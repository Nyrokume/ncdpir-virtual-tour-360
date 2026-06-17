import { assetUrl } from '../lib/assets';
import { enrichTourData } from './tourEnrichment';

export function resolveTourAssets(tour) {
  const enriched = enrichTourData(tour);

  return {
    ...enriched,
    panoramas: enriched.panoramas.map((p) => ({
      ...p,
      url: assetUrl(p.url),
      hotspots: (p.hotspots || []).map((h) => ({
        ...h,
        exhibit: h.exhibit
          ? {
              ...h.exhibit,
              image: h.exhibit.image ? assetUrl(h.exhibit.image) : undefined,
            }
          : undefined,
      })),
    })),
  };
}

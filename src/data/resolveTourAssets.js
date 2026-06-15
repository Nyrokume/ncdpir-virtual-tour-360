import { assetUrl } from '../lib/assets';

export function resolveTourAssets(tour) {
  return {
    ...tour,
    panoramas: tour.panoramas.map((p) => ({
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

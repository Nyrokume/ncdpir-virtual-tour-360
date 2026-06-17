const prefetched = new Set();

/** Prefetch a panorama image (deduped, low priority). */
export function preloadPanorama(url) {
  if (!url || prefetched.has(url)) return;
  prefetched.add(url);

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'image';
  link.href = url;
  document.head.appendChild(link);

  const img = new Image();
  img.decoding = 'async';
  img.src = url;
}

export function preloadPanoramas(urls) {
  urls.forEach(preloadPanorama);
}

/** Collect unique panorama URLs by id from a list. */
export function urlsForPanoramaIds(panoramas, ids) {
  const byId = new Map(panoramas.map((p) => [p.id, p.url]));
  return [...new Set(ids.map((id) => byId.get(id)).filter(Boolean))];
}

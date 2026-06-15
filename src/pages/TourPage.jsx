import { useState, useCallback } from 'react';
import { TOUR_DATA } from '../data/tourData';
import { resolveTourAssets } from '../data/resolveTourAssets';
import WelcomeScreen from '../components/WelcomeScreen';
import PanoramaViewer from '../components/PanoramaViewer';
import HUDHeader from '../components/HUDHeader';
import MapPanel from '../components/MapPanel';
import ExhibitModal from '../components/ExhibitModal';
import '../App.css';

export default function TourPage() {
  const [tour] = useState(() => resolveTourAssets(TOUR_DATA));
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeExhibit, setActiveExhibit] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [visited, setVisited] = useState([]);

  const panoramas = tour.panoramas;
  const current = panoramas[currentIndex];

  const goTo = useCallback(
    (index) => {
      if (index < 0 || index >= panoramas.length) return;
      setCurrentIndex(index);
      setActiveExhibit(null);
      setVisited((prev) => {
        const id = panoramas[index].id;
        return prev.includes(id) ? prev : [...prev, id];
      });
    },
    [panoramas]
  );

  const handleStart = () => {
    setStarted(true);
    setVisited([panoramas[0].id]);
  };

  const handleHotspotClick = useCallback(
    (hotspot) => {
      if (hotspot.type === 'nav') {
        const idx = panoramas.findIndex((p) => p.id === hotspot.targetId);
        if (idx >= 0) goTo(idx);
        return;
      }
      setActiveExhibit(hotspot.exhibit);
    },
    [panoramas, goTo]
  );

  if (!started) {
    return <WelcomeScreen tour={tour} onStart={handleStart} />;
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-canvas" data-testid="tour-page">
      <PanoramaViewer panorama={current} onHotspotClick={handleHotspotClick} />

      <HUDHeader
        panorama={current}
        currentIndex={currentIndex}
        total={panoramas.length}
        onToggleMap={() => setMapOpen((o) => !o)}
      />

      {mapOpen && (
        <MapPanel
          panoramas={panoramas}
          currentIndex={currentIndex}
          visited={visited}
          onSelect={(i) => {
            goTo(i);
            setMapOpen(false);
          }}
          onClose={() => setMapOpen(false)}
        />
      )}

      {activeExhibit && (
        <ExhibitModal
          exhibit={activeExhibit}
          onClose={() => setActiveExhibit(null)}
        />
      )}
    </div>
  );
}

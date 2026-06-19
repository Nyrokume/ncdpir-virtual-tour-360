import { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import { TOUR_DATA } from '../data/tourData';
import { resolveTourAssets } from '../data/resolveTourAssets';
import { getStepByPanoramaId, getPanoramaAudio, getQuizAudio } from '../data/scenarioData';
import { useScenarioProgress } from '../hooks/useScenarioProgress';
import { usePanoramaPreload } from '../hooks/usePanoramaPreload';
import WelcomeScreen from '../components/WelcomeScreen';
import HUDHeader from '../components/HUDHeader';
import ScenarioOverlay from '../components/scenario/ScenarioOverlay';
import AudioPlayer from '../components/scenario/AudioPlayer';
import DetailPopover from '../components/scenario/DetailPopover';
import {
  addHotspot,
  applyEditorState,
  cloneHotspotForPlacement,
  createHotspotTemplate,
  loadEditorState,
  queueSaveEditorState,
  removeHotspot,
  resetScene,
  saveEditorState,
  updateHotspotMeta,
  updateHotspotPosition,
} from '../dev/markerEditor';
import '../App.css';

const PanoramaViewer = lazy(() => import('../components/PanoramaViewer'));
const MapPanel = lazy(() => import('../components/MapPanel'));
const ExhibitModal = lazy(() => import('../components/ExhibitModal'));
const QuizRunner = lazy(() => import('../components/scenario/QuizRunner'));
const MarkerEditorPanel = lazy(() => import('../dev/MarkerEditorPanel'));

const IS_DEV = import.meta.env.DEV;
const MARKER_EDIT_ENABLED = IS_DEV;
const MARKER_EDIT_AUTO_OPEN =
  IS_DEV && new URLSearchParams(window.location.search).has('markerEdit');

const ROUTE_BTN_BASE =
  'fixed bottom-20 left-4 z-30 rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-wider backdrop-blur-md transition md:bottom-6 md:px-6 md:py-3 md:text-sm';

/** При переходе по nav-маркеру сразу открыть вводную карточку зала */
const NAV_HALL_INTRO = {
  sewing: 'sewing-machine',
  music: 'music-hall-info',
};

function PanoramaLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-canvas">
      <p className="font-mono text-xs uppercase tracking-widest text-white/40">
        Загрузка панорамы…
      </p>
    </div>
  );
}

export default function TourPage() {
  const [tour] = useState(() => resolveTourAssets(TOUR_DATA));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeExhibit, setActiveExhibit] = useState(null);
  const [activeDetail, setActiveDetail] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [visited, setVisited] = useState([]);
  const [editorState, setEditorState] = useState({ scenes: {}, savedAt: null });
  const [saveStatus, setSaveStatus] = useState(MARKER_EDIT_AUTO_OPEN ? 'loading' : 'idle');
  const [editMode, setEditMode] = useState(MARKER_EDIT_AUTO_OPEN);
  const [placeMode, setPlaceMode] = useState(null);
  const [placeTemplate, setPlaceTemplate] = useState(null);
  const [editorOpen, setEditorOpen] = useState(MARKER_EDIT_AUTO_OPEN);
  const [welcomeSeen, setWelcomeSeen] = useState(false);

  const basePanoramas = tour.panoramas;

  const panoramas = useMemo(() => {
    if (!MARKER_EDIT_ENABLED || !editorOpen) return basePanoramas;
    return applyEditorState(basePanoramas, editorState);
  }, [basePanoramas, editorState, editorOpen]);

  const scenario = useScenarioProgress(panoramas);
  const current = panoramas[currentIndex];

  usePanoramaPreload({
    panoramas,
    currentPanorama: welcomeSeen ? current : null,
    getNextPanoramaId: scenario.getNextPanoramaId,
    getRecommendedPanoramaId: scenario.getRecommendedPanoramaId,
  });

  useEffect(() => {
    if (!MARKER_EDIT_ENABLED) return;
    loadEditorState(basePanoramas)
      .then((state) => {
        setEditorState(state);
        setSaveStatus(state.savedAt ? 'saved' : 'idle');
      })
      .catch(() => setSaveStatus('error'));
  }, [basePanoramas]);

  const persistEditor = useCallback((updater) => {
    setEditorState((prev) => {
      const updated = updater(prev);
      const next = saveEditorState(updated);
      setSaveStatus('saving');
      queueSaveEditorState(next)
        .then(() => setSaveStatus('saved'))
        .catch(() => setSaveStatus('error'));
      return next;
    });
  }, []);

  const goTo = useCallback(
    (index, { exhibit = null } = {}) => {
      if (index < 0 || index >= panoramas.length) return;
      setCurrentIndex(index);
      setActiveExhibit(exhibit);
      setActiveDetail(null);
      setPlaceMode(null);
      setPlaceTemplate(null);
      const id = panoramas[index].id;
      setVisited((prev) => (prev.includes(id) ? prev : [...prev, id]));
    },
    [panoramas]
  );

  const goToId = useCallback(
    (panoramaId) => {
      const idx = panoramas.findIndex((p) => p.id === panoramaId);
      if (idx >= 0) goTo(idx);
    },
    [panoramas, goTo]
  );

  useEffect(() => {
    if (scenario.started && visited.length === 0) {
      setVisited(['street']);
    }
  }, [scenario.started, visited.length]);

  useEffect(() => {
    if (scenario.started && current?.id) {
      scenario.onEnterPanorama(current.id);
    }
    // onEnterPanorama is stable enough per panorama change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.started, current?.id]);

  const handleWelcome = () => {
    setWelcomeSeen(true);
  };

  const handleStart = () => {
    scenario.handleStart();
    scenario.handleIntroContinue();
    setVisited(['street']);
    goToId('salon');
  };

  const handleHotspotClick = useCallback(
    (hotspot) => {
      if (editMode) return;

      if (hotspot.type === 'nav') {
        const idx = panoramas.findIndex((p) => p.id === hotspot.targetId);
        if (idx >= 0) {
          const introId = NAV_HALL_INTRO[hotspot.targetId];
          const intro = introId
            ? panoramas[idx].hotspots?.find((h) => h.id === introId)
            : null;
          goTo(idx, { exhibit: intro?.exhibit ?? null });
        }
        return;
      }

      if (hotspot.type === 'detail') {
        setActiveDetail(hotspot.detail);
        return;
      }

      if (hotspot.type === 'quiz-trigger') {
        scenario.openQuizForPanorama(current.id);
        return;
      }

      if (hotspot.type === 'exhibit') {
        setActiveExhibit(hotspot.exhibit);
      }
    },
    [panoramas, goTo, editMode, scenario, current.id]
  );

  const handleProceed = useCallback(() => {
    const nextId = scenario.getNextPanoramaId(current.id);
    if (nextId) {
      goToId(nextId);
    } else {
      scenario.setShowTourComplete(true);
    }
  }, [current.id, scenario, goToId]);

  const handleHotspotMove = useCallback(
    (hotspotId, yaw, pitch) => {
      if (!MARKER_EDIT_ENABLED) return;
      persistEditor((prev) =>
        updateHotspotPosition(prev, current.id, hotspotId, yaw, pitch)
      );
    },
    [current.id, persistEditor]
  );

  const handleHotspotCreate = useCallback(
    (yaw, pitch) => {
      if (!MARKER_EDIT_ENABLED) return;
      if (placeTemplate) {
        const hotspot = { ...placeTemplate, yaw, pitch };
        persistEditor((prev) => addHotspot(prev, current.id, hotspot));
        setPlaceTemplate(null);
        setPlaceMode(null);
        return;
      }
      if (!placeMode) return;
      const hotspot = createHotspotTemplate(
        current,
        placeMode,
        yaw,
        pitch,
        basePanoramas
      );
      persistEditor((prev) => addHotspot(prev, current.id, hotspot));
      setPlaceMode(null);
    },
    [current, basePanoramas, persistEditor, placeMode, placeTemplate]
  );

  const handleDuplicateHotspot = useCallback(
    (hotspot) => {
      if (!MARKER_EDIT_ENABLED) return;
      setEditMode(true);
      setPlaceMode(null);
      setPlaceTemplate(cloneHotspotForPlacement(hotspot, current.id));
    },
    [current.id]
  );

  const handleHotspotDelete = useCallback(
    (hotspotId) => {
      if (!MARKER_EDIT_ENABLED) return;
      if (!window.confirm('Удалить этот объект с панорамы?')) return;
      persistEditor((prev) => removeHotspot(prev, current.id, hotspotId));
    },
    [current.id, persistEditor]
  );

  const handleHotspotUpdate = useCallback(
    (hotspotId, patch) => {
      persistEditor((prev) =>
        updateHotspotMeta(prev, current.id, hotspotId, patch)
      );
    },
    [current.id, persistEditor]
  );

  const handleResetScene = useCallback(() => {
    persistEditor((prev) => resetScene(prev, current.id));
    setPlaceMode(null);
    setPlaceTemplate(null);
  }, [current.id, persistEditor]);

  const step = getStepByPanoramaId(current.id);
  const hallQuizActivity =
    step?.activity?.type === 'quiz' || step?.activity?.type === 'explore-quiz'
      ? step.activity
      : null;

  const quizPending =
    scenario.started &&
    step &&
    (step.activity?.type === 'quiz' || step.activity?.type === 'explore-quiz') &&
    !scenario.isActivityComplete(current.id);

  const showInfoOnlyOverlay =
    scenario.started &&
    step?.activity?.type === 'info-only' &&
    !scenario.isActivityComplete(current.id);

  const recommendedPanoramaId = scenario.getRecommendedPanoramaId();
  const allStepsComplete = scenario.scenarioSteps.every((s) =>
    scenario.isActivityComplete(s.panoramaId)
  );

  const showRouteHint =
    scenario.started &&
    !scenario.activeQuiz &&
    !showInfoOnlyOverlay &&
    !scenario.showTourComplete &&
    !scenario.quizToast &&
    ((recommendedPanoramaId &&
      (recommendedPanoramaId !== current.id ||
        scenario.isActivityComplete(current.id))) ||
      allStepsComplete);

  const handleFollowRoute = useCallback(() => {
    if (allStepsComplete && !recommendedPanoramaId) {
      scenario.setShowTourComplete(true);
      return;
    }
    const targetId =
      recommendedPanoramaId && recommendedPanoramaId !== current.id
        ? recommendedPanoramaId
        : scenario.getNextPanoramaId(current.id);
    if (targetId) {
      goToId(targetId);
      return;
    }
    handleProceed();
  }, [
    allStepsComplete,
    recommendedPanoramaId,
    current.id,
    scenario,
    goToId,
    handleProceed,
  ]);

  const routeHintLabel = useMemo(() => {
    if (allStepsComplete && !recommendedPanoramaId) {
      return 'Завершить тур';
    }
    const targetId =
      recommendedPanoramaId && recommendedPanoramaId !== current.id
        ? recommendedPanoramaId
        : scenario.getNextPanoramaId(current.id);
    if (!targetId) return scenario.getProceedLabel(current.id);
    const target = panoramas.find((p) => p.id === targetId);
    return target ? `По маршруту: ${target.name}` : 'По маршруту';
  }, [
    allStepsComplete,
    recommendedPanoramaId,
    current.id,
    scenario,
    panoramas,
  ]);

  const activeAudio = useMemo(() => {
    if (!scenario.started) return null;
    if (scenario.activeQuizId) {
      return getQuizAudio(scenario.activeQuizId);
    }
    return getPanoramaAudio(current.id);
  }, [scenario.started, scenario.activeQuizId, current.id]);

  if (!welcomeSeen) {
    return <WelcomeScreen tour={tour} onStart={handleWelcome} />;
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-canvas"
      data-testid={scenario.started ? 'tour-page' : 'tour-entry'}
    >
      <Suspense fallback={<PanoramaLoader />}>
        <PanoramaViewer
          key={current.id}
          panorama={current}
          onHotspotClick={scenario.started ? handleHotspotClick : () => {}}
          editMode={editMode}
          placeMode={placeMode}
          placeTemplate={placeTemplate}
          onHotspotMove={handleHotspotMove}
          onHotspotCreate={handleHotspotCreate}
          quizPending={quizPending}
        />
      </Suspense>

      {(scenario.started || MARKER_EDIT_ENABLED) && welcomeSeen && (
        <HUDHeader
          panorama={current}
          currentIndex={currentIndex}
          total={panoramas.length}
          onToggleMap={scenario.started ? () => setMapOpen((o) => !o) : undefined}
          tourTitle={tour.tourTitle}
          onToggleDevTools={
            MARKER_EDIT_ENABLED
              ? () => {
                  setEditorOpen((open) => {
                    const next = !open;
                    if (next) setEditMode(true);
                    return next;
                  });
                }
              : undefined
          }
          devToolsOpen={editorOpen}
        />
      )}

      {!scenario.started && (
        <ScenarioOverlay
          title={scenario.entryOverlay.title}
          description={scenario.entryOverlay.description}
          ctaLabel={scenario.entryOverlay.ctaLabel}
          onContinue={handleStart}
          showContinue
        />
      )}

      {activeAudio && (
        <AudioPlayer
          key={activeAudio.audio}
          src={activeAudio.audio}
          title={activeAudio.audioTitle}
          autoPlay
        />
      )}

      {scenario.started &&
        hallQuizActivity &&
        !scenario.isActivityComplete(current.id) &&
        !scenario.activeQuiz && (
          <button
            type="button"
            onClick={() => scenario.openQuizForPanorama(current.id)}
            className={`${ROUTE_BTN_BASE} border border-white/10 bg-black/70 text-white/80 hover:bg-black/90`}
          >
            {step?.activity?.type === 'explore-quiz'
              ? 'Пройти викторину'
              : 'Начать задание'}
          </button>
        )}

      {scenario.started && showRouteHint && (
        <button
          type="button"
          onClick={handleFollowRoute}
          className={`${ROUTE_BTN_BASE} border border-accent/30 bg-black/75 text-accent hover:border-accent/50 hover:bg-black/90`}
        >
          {routeHintLabel}
        </button>
      )}

      {MARKER_EDIT_ENABLED && editorOpen && (
        <Suspense fallback={null}>
          <MarkerEditorPanel
          panorama={current}
          panoramas={basePanoramas}
          editorState={editorState}
          editMode={editMode}
          placeMode={placeMode}
          placeTemplate={placeTemplate}
          onToggleEditMode={() => {
            setEditMode((v) => !v);
            setPlaceMode(null);
            setPlaceTemplate(null);
          }}
          onSetPlaceMode={(mode) => {
            if (mode) {
              setEditMode(true);
              setPlaceTemplate(null);
            }
            setPlaceMode(mode);
          }}
          onClose={() => {
            setEditorOpen(false);
            setPlaceMode(null);
            setPlaceTemplate(null);
          }}
          onResetScene={handleResetScene}
          onDeleteHotspot={handleHotspotDelete}
          onUpdateHotspot={handleHotspotUpdate}
          onDuplicateHotspot={handleDuplicateHotspot}
          onCancelPlace={() => {
            setPlaceMode(null);
            setPlaceTemplate(null);
          }}
          saveStatus={saveStatus}
        />
        </Suspense>
      )}

      {scenario.started && mapOpen && (
        <Suspense fallback={null}>
          <MapPanel
          panoramas={panoramas}
          currentIndex={currentIndex}
          visited={visited}
          bonusPanoramaIds={scenario.bonusPanoramaIds}
          scenarioSteps={scenario.scenarioSteps}
          recommendedPanoramaId={scenario.getRecommendedPanoramaId()}
          onSelect={(i) => {
            goTo(i);
            setMapOpen(false);
          }}
          onClose={() => setMapOpen(false)}
        />
        </Suspense>
      )}

      {activeExhibit && (
        <Suspense fallback={null}>
          <ExhibitModal
          exhibit={activeExhibit}
          onClose={() => setActiveExhibit(null)}
        />
        </Suspense>
      )}

      {activeDetail && (
        <DetailPopover detail={activeDetail} onClose={() => setActiveDetail(null)} />
      )}

      {scenario.started && showInfoOnlyOverlay && (
        <ScenarioOverlay
          title={current.name}
          description="Ознакомьтесь с информацией в зале. Когда будете готовы идти дальше, нажмите «По маршруту» внизу слева."
          ctaLabel="Понятно"
          collapsible={false}
          onContinue={() => scenario.handleInfoAcknowledge(current.id)}
        />
      )}

      {scenario.quizToast && (
        <div
          className="fixed bottom-24 left-1/2 z-30 max-w-md -translate-x-1/2 rounded-xl border border-white/10 bg-black/80 px-4 py-3 text-center text-sm text-white/80 backdrop-blur-md animate-fade-in md:bottom-8"
          role="status"
        >
          {scenario.quizToast}
        </div>
      )}

      {scenario.showTourComplete && (
        <ScenarioOverlay
          title={scenario.tourCompletionOverlay.title}
          description={scenario.tourCompletionOverlay.description}
          ctaLabel={scenario.tourCompletionOverlay.ctaLabel}
          collapsible={false}
          onContinue={() => scenario.setShowTourComplete(false)}
        />
      )}

      {scenario.activeQuiz && (
        <Suspense fallback={null}>
          <QuizRunner
          quiz={scenario.activeQuiz}
          onClose={() => scenario.setActiveQuizId(null)}
          onComplete={(message) => scenario.handleQuizComplete(current.id, message)}
        />
        </Suspense>
      )}
    </div>
  );
}

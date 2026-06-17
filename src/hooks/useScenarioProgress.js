import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  SCENARIO_STEPS,
  BONUS_PANORAMA_IDS,
  ENTRY_OVERLAY,
  TOUR_COMPLETION_OVERLAY,
  getStepByPanoramaId,
  getStepIndex,
  activityKey,
  getQuiz,
} from '../data/scenarioData';

export function useScenarioProgress(panoramas) {
  const [started, setStarted] = useState(false);
  const [completedActivities, setCompletedActivities] = useState(() => new Set());
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [quizToast, setQuizToast] = useState(null);
  const [showTourComplete, setShowTourComplete] = useState(false);
  const [introDismissed, setIntroDismissed] = useState(false);

  useEffect(() => {
    if (!quizToast) return undefined;
    const timer = window.setTimeout(() => setQuizToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [quizToast]);

  const currentStepIndex = useCallback(
    (panoramaId) => getStepIndex(panoramaId),
    []
  );

  const isActivityComplete = useCallback(
    (panoramaId) => {
      const step = getStepByPanoramaId(panoramaId);
      if (!step) return true;

      const { activity } = step;
      if (activity.type === 'intro') return introDismissed;
      if (activity.type === 'info-only') return completedActivities.has(`${panoramaId}:info`);
      if (activity.type === 'quiz') {
        return completedActivities.has(activityKey(panoramaId, activity.quizId));
      }
      if (activity.type === 'explore-quiz') {
        return completedActivities.has(
          activityKey(panoramaId, activity.quizId)
        );
      }
      return true;
    },
    [completedActivities, introDismissed]
  );

  const canProceedFrom = useCallback(
    (panoramaId) => isActivityComplete(panoramaId),
    [isActivityComplete]
  );

  const markActivityComplete = useCallback((key) => {
    setCompletedActivities((prev) => new Set([...prev, key]));
  }, []);

  const handleStart = useCallback(() => {
    setStarted(true);
  }, []);

  const handleIntroContinue = useCallback(() => {
    setIntroDismissed(true);
    markActivityComplete('street:intro');
  }, [markActivityComplete]);

  const openQuizForPanorama = useCallback((panoramaId) => {
    const step = getStepByPanoramaId(panoramaId);
    if (!step) return;
    const quizId =
      step.activity.quizId ||
      (step.activity.type === 'explore-quiz' ? step.activity.quizId : null);
    if (quizId) setActiveQuizId(quizId);
  }, []);

  const onEnterPanorama = useCallback(() => {
    setQuizToast(null);
  }, []);

  const handleQuizComplete = useCallback(
    (panoramaId, message) => {
      const step = getStepByPanoramaId(panoramaId);
      if (!step) return;
      const key =
        step.activity.quizId
          ? activityKey(panoramaId, step.activity.quizId)
          : `${panoramaId}:quiz`;
      markActivityComplete(key);
      setActiveQuizId(null);
      setQuizToast(message ?? 'Задание выполнено!');
    },
    [markActivityComplete]
  );

  const handleInfoAcknowledge = useCallback(
    (panoramaId) => {
      markActivityComplete(`${panoramaId}:info`);
    },
    [markActivityComplete]
  );

  const getNextPanoramaId = useCallback((panoramaId) => {
    const step = getStepByPanoramaId(panoramaId);
    return step?.nextPanoramaId ?? null;
  }, []);

  const canVisitViaMap = useCallback(() => true, []);

  const getRecommendedPanoramaId = useCallback(() => {
    for (const step of SCENARIO_STEPS) {
      if (!isActivityComplete(step.panoramaId)) {
        return step.panoramaId;
      }
    }
    return null;
  }, [isActivityComplete]);

  const activeQuiz = activeQuizId ? getQuiz(activeQuizId) : null;

  const getProceedLabel = useCallback((panoramaId) => {
    const next = getNextPanoramaId(panoramaId);
    if (!next) return 'Завершить тур';
    const nextPanorama = panoramas.find((p) => p.id === next);
    return nextPanorama ? `Далее: ${nextPanorama.name}` : 'Далее';
  }, [getNextPanoramaId, panoramas]);

  return {
    started,
    handleStart,
    introDismissed,
    handleIntroContinue,
    completedActivities,
    isActivityComplete,
    canProceedFrom,
    activeQuiz,
    activeQuizId,
    setActiveQuizId,
    quizToast,
    showTourComplete,
    setShowTourComplete,
    onEnterPanorama,
    handleQuizComplete,
    handleInfoAcknowledge,
    openQuizForPanorama,
    getNextPanoramaId,
    canVisitViaMap,
    getRecommendedPanoramaId,
    getProceedLabel,
    entryOverlay: ENTRY_OVERLAY,
    tourCompletionOverlay: TOUR_COMPLETION_OVERLAY,
    scenarioSteps: SCENARIO_STEPS,
    bonusPanoramaIds: BONUS_PANORAMA_IDS,
    currentStepIndex,
  };
}

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const TourPage = lazy(() => import('./pages/TourPage'));

function PageLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-canvas font-mono text-xs uppercase tracking-widest text-white/40">
      Загрузка тура…
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="*" element={<TourPage />} />
      </Routes>
    </Suspense>
  );
}

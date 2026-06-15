import { Routes, Route } from 'react-router-dom';
import TourPage from './pages/TourPage';

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<TourPage />} />
    </Routes>
  );
}

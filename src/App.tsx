import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { ResultsPage } from './pages/ResultsPage';
import { StandardDetailPage } from './pages/StandardDetailPage';
import { BasketPage } from './pages/BasketPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/standard/:id" element={<StandardDetailPage />} />
        <Route path="/basket" element={<BasketPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}

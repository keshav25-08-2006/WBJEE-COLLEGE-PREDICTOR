import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App';
import { WbjeePage } from './pages/WbjeePage';
import { JeeMainPage } from './pages/JeeMainPage';
import { JeeAdvancedPage } from './pages/JeeAdvancedPage';
import { CsabPage } from './pages/CsabPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Navigate to="/wbjee" replace />} />
          <Route path="wbjee" element={<WbjeePage />} />
          <Route path="jee-main" element={<JeeMainPage />} />
          <Route path="jee-advanced" element={<JeeAdvancedPage />} />
          <Route path="csab" element={<CsabPage />} />
          <Route path="*" element={<Navigate to="/wbjee" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

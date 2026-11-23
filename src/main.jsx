import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home.jsx';
import { Admin } from './pages/Admin.jsx';
import '@fontsource-variable/schibsted-grotesk';
import './styles.css';

// Só esconde os elementos para animar quando o JavaScript está rodando.
document.documentElement.classList.add('js-anima');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

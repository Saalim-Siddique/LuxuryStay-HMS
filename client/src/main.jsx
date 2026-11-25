import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Bootstrap 5 grid & base utilities
import 'bootstrap/dist/css/bootstrap.min.css';

// LuxuryStay Design System tokens, global styles & component styles
import './styles/global.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

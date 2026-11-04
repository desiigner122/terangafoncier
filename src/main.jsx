
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// 🛡️ PATCH GLOBAL ANTI-CRASH TOAST - Import du système de protection
import '@/lib/global-toast-patch';
// 🚨 PATCH D'URGENCE POUR ÉLIMINER TOUTES LES ERREURS TOAST
import '@/lib/emergency-toast-patch';
import { logger } from '@/lib/logger';

// Vérification de sécurité pour l'élément root
const rootElement = document.getElementById('root');
if (!rootElement) {
  logger.error('❌ Element #root not found in DOM');
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <Router>
        <App />
      </Router>
    </HelmetProvider>
  </React.StrictMode>
);


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/UnifiedAuthContext';
import { HelmetProvider } from 'react-helmet-async';

// 🛡️ PATCH GLOBAL ANTI-CRASH TOAST - Import du système de protection
import '@/lib/global-toast-patch';
// 🚨 PATCH D'URGENCE POUR ÉLIMINER TOUTES LES ERREURS TOAST
import '@/lib/emergency-toast-patch';

// Vérification de sécurité pour l'élément root
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Element #root not found in DOM');
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <App />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);

// Register/unregister service worker for PWA with environment guards
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const isProd = import.meta.env.PROD === true || import.meta.env.MODE === 'production';
      const isSecure = window.isSecureContext;
      if (isProd && isSecure) {
        await navigator.serviceWorker.register('/sw.js');
      } else {
        // In dev or non-secure context, ensure any existing SW is unregistered to avoid intercept issues
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
    } catch (err) {
      console.warn('Service worker setup error:', err);
    }
  });
}

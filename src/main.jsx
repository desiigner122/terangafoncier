
import React from 'react';
import ReactDOM from 'react-dom/client';
import SimpleApp from '@/SimpleApp';
import '@/index.css';
import { SimpleSupabaseAuthProvider } from '@/context/SimpleSupabaseAuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

// Vérification de sécurité pour l'élément root
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Element #root not found in DOM');
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  // TEMPORARILY DISABLED: React.StrictMode might be causing TypeError: nT() is null
  // <React.StrictMode>
    <Router>
      <SimpleSupabaseAuthProvider>
        <SimpleApp />
      </SimpleSupabaseAuthProvider>
    </Router>
  // </React.StrictMode>
);

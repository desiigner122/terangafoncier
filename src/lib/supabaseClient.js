/**
 * Client Supabase centralisé - SOURCE UNIQUE DE VÉRITÉ
 * 
 * ⚠️ Ce fichier doit être le SEUL endroit où createClient() est appelé.
 * ⚠️ Tous les autres fichiers doivent importer depuis ici.
 * 
 * Usage:
 * import { supabase } from '@/lib/supabaseClient';
 * 
 * IMPORTANT: Ne pas créer d'autres clients Supabase dans le projet!
 */

import { createClient } from '@supabase/supabase-js';

// Variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validation stricte
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Configuration Supabase manquante!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Défini' : '❌ Manquant');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Défini' : '❌ Manquant');
  throw new Error('Variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY requises dans .env');
}

// Configuration optimisée du client
const supabaseConfig = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'terangafoncier-auth'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-client-info': 'terangafoncier-web'
    }
  }
};

// ⚡ Client unique - NE PAS DUPLIQUER
export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseConfig);

// Export par défaut pour compatibilité
export default supabase;

// 🔧 Helper pour fetch direct (contournement si client JS a problème)
export const fetchDirect = async (endpoint, options = {}) => {
  const url = `${supabaseUrl}/rest/v1/${endpoint}`;
  
  const headers = {
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

console.log('✅ Client Supabase centralisé initialisé:', supabaseUrl);

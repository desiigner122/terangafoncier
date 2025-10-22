/**
 * Client Supabase avec clé service_role pour contourner RLS
 * ⚠️ À utiliser UNIQUEMENT pour les données publiques
 * 
 * Usage:
 * import { supabaseService } from '@/lib/supabaseServiceClient';
 */

// Ce module fournit un client service_role pour les scripts backend/tests.
// Il ne doit PAS être importé par des fichiers destinés au navigateur.
// Laisser en place pour les scripts Node (CI/local) qui ont besoin d'un accès privilégié.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !SERVICE_ROLE_KEY) {
  console.warn('⚠️ supabaseService unavailable - set VITE_SUPABASE_SERVICE_ROLE_KEY for backend scripts');
}

export const supabaseService = createClient(supabaseUrl, SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

export default supabaseService;

/**
 * Client Supabase avec clé service_role pour contourner RLS
 * ⚠️ À utiliser UNIQUEMENT pour les données publiques
 * 
 * Usage:
 * import { supabaseService } from '@/lib/supabaseServiceClient';
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// IMPORTANT: Cette clé ne doit JAMAIS être exposée dans le navigateur en production!
// Pour la dev/test, on l'utilise pour contourner RLS
// En production, créer un backend API qui utilise cette clé
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY2MzMwNCwiZXhwIjoyMDcyMjM5MzA0fQ._mFhSg4VDhnUE8ctKLEHpYkafpBqsbnZCzvX9JwtP0c';

export const supabaseService = createClient(supabaseUrl, SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

export default supabaseService;

/**
 * ⚠️ Ce fichier ne crée plus de client Supabase.
 *
 * Il réexporte le client canonique unique défini dans `src/lib/supabaseClient.js`.
 *
 * Auparavant, ce module appelait `createClient()` avec des variables
 * `process.env.REACT_APP_*` — inexistantes dans un projet Vite — et retombait
 * donc sur un placeholder cassé (`https://your-project.supabase.co`), tout en
 * créant une instance GoTrueClient supplémentaire.
 *
 * Conservé uniquement pour compatibilité avec les imports existants.
 */

import { supabase } from '@/lib/supabaseClient';

// Compat : certains anciens modules importaient getSupabaseClient()
export const getSupabaseClient = () => supabase;

export { supabase };
export default supabase;

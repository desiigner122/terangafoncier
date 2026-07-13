/**
 * ⚠️ Ce fichier ne crée plus de client Supabase.
 *
 * Il réexporte le client canonique unique défini dans `src/lib/supabaseClient.js`
 * afin d'éviter la création de plusieurs instances GoTrueClient
 * (avertissement "Multiple GoTrueClient instances detected" et bugs d'auth).
 *
 * Conservé uniquement pour compatibilité avec les imports existants.
 */

import { supabase } from '@/lib/supabaseClient';

export { supabase };
export default supabase;

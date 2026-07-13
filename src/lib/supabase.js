/**
 * ⚠️ Ce fichier ne crée plus de client Supabase.
 *
 * Il réexporte le client canonique unique défini dans `src/lib/supabaseClient.js`
 * afin d'éviter la création de plusieurs instances GoTrueClient
 * (avertissement "Multiple GoTrueClient instances detected" et bugs d'auth).
 *
 * `createClient` reste réexporté depuis @supabase/supabase-js pour compatibilité,
 * mais ne doit PAS être utilisé pour instancier un nouveau client applicatif.
 */

import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

export { supabase, createClient };
export default supabase;

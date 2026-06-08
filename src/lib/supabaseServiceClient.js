/**
 * ⚠️ SÉCURITÉ : la clé `service_role` ne doit JAMAIS être exposée dans le navigateur.
 *
 * Ce module exportait auparavant un client utilisant la clé `service_role` codée
 * en dur (faille critique : contournement total de la RLS depuis le frontend).
 * La clé a été retirée. Ce client réutilise désormais le client public (anon),
 * protégé par la Row Level Security configurée côté Supabase.
 *
 * Pour les opérations nécessitant réellement la clé `service_role`, créer une
 * Edge Function / un backend qui détient la clé côté serveur uniquement.
 *
 * L'export `supabaseService` est conservé pour compatibilité avec le code existant.
 */

import { supabase } from '@/lib/supabaseClient';

export const supabaseService = supabase;

export default supabaseService;

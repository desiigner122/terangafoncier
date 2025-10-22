// ⚠️ Wrapper conservé pour compatibilité historique
// Utilise désormais le client centralisé afin d'éviter les doublons GoTrue

export { supabase as default, supabase, fetchDirect } from '@/lib/supabaseClient';

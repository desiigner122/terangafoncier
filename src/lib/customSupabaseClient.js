import { createClient } from '@supabase/supabase-js';

// Configuration Supabase réactivée - utilise les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL et Anon Key sont requis');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

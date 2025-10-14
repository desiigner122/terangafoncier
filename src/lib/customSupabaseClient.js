import { createClient } from '@supabase/supabase-js';

// Configuration Supabase réactivée - utilise les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement manquantes:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'présent' : 'manquant');
  throw new Error('Supabase URL et Anon Key sont requis');
}

console.log('✅ Création client Supabase:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'terangafoncier-parcelles'
    },
    fetch: (url, options = {}) => {
      // Ajouter un timeout de 30 secondes
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      return fetch(url, {
        ...options,
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));
    }
  }
});

export default supabase;

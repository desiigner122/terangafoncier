import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  logger.error('❌ Variables Supabase manquantes dans .env');
  throw new Error('Supabase URL et ANON_KEY requis');
}

logger.debug('✅ Supabase client initialisé:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'terangafoncier-web'
    }
  }
});

export { createClient };
export default supabase;

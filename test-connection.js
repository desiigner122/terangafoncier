import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('--- Test de connexion Supabase ---');
console.log('URL:', supabaseUrl);
console.log('Key présente:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Variables manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.log('❌ Erreur de connexion:', error.message);
      return false;
    }
    console.log('✅ Connexion réussie!');
    return true;
  } catch (e) {
    console.log('❌ Exception:', e.message);
    return false;
  }
}

testConnection();

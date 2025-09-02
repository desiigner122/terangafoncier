// Script de diagnostic pour Vercel
// À coller dans la console du navigateur sur https://terangafoncier.vercel.app

// Vérifier les variables d'environnement
console.log('=== DIAGNOSTIC VERCEL/SUPABASE ===');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY présente:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// Tester la connexion
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.30.0';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

async function testConnection() {
  console.log('Test de connexion...');

  try {
    // Test 1: Connexion de base
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('❌ Erreur de connexion:', error);
      return;
    }
    console.log('✅ Connexion réussie');

    // Test 2: Vérifier les tables disponibles
    console.log('Vérification des tables...');
    const { data: tables, error: tableError } = await supabase
      .rpc('get_table_names'); // Cette fonction pourrait ne pas exister

    if (tableError) {
      console.log('Note: Impossible de lister les tables via RPC');
    }

  } catch (e) {
    console.error('❌ Exception:', e);
  }
}

testConnection();

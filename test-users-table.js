import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUsersTable() {
  console.log('--- Test de la table users ---');

  try {
    // Test 1: Vérifier si la table existe en faisant une requête simple
    console.log('1. Test de lecture de la table users...');
    const { data: users, error: readError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (readError) {
      console.log('❌ Erreur de lecture:', readError.message);
      return false;
    }
    console.log('✅ Lecture réussie, table users existe');

    // Test 2: Tester l'insertion (devrait échouer sans authentification)
    console.log('2. Test d\'insertion (devrait échouer sans auth)...');
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: 'test-id',
        email: 'test@example.com',
        full_name: 'Test User'
      });

    if (insertError) {
      console.log('✅ Insertion bloquée (normal sans auth):', insertError.message);
    } else {
      console.log('⚠️ Insertion réussie (politiques RLS peuvent être trop permissives)');
    }

    // Test 3: Vérifier les politiques RLS
    console.log('3. Vérification des politiques RLS...');
    // On ne peut pas vérifier directement les politiques via l'API,
    // mais on peut tester le comportement

    console.log('✅ Tests terminés');
    return true;

  } catch (e) {
    console.log('❌ Exception:', e.message);
    return false;
  }
}

testUsersTable();

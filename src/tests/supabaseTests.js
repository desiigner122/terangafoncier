import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

import { supabase } from '../lib/supabaseClient.js';

// Test de connexion simple
async function testConnection() {
  try {
    console.log('--- Test de connexion Supabase ---');
    console.log('URL:', process.env.VITE_SUPABASE_URL);
    console.log('Key présente:', !!process.env.VITE_SUPABASE_ANON_KEY);

    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.log('Erreur de connexion:', error.message);
      return false;
    }
    console.log('Connexion réussie!');
    return true;
  } catch (e) {
    console.log('Exception:', e.message);
    return false;
  }
}

testConnection();

// Crée une parcelle de test avec is_featured=true
export async function createTestParcel() {
  try {
    const { data, error } = await supabase.from('parcels').insert({
      title: 'Parcelle Test',
      description: 'Parcelle de test générée automatiquement',
      location: 'Test City',
      price: 100000,
      status: 'Disponible',
      is_featured: true,
      created_at: new Date().toISOString(),
    }).select();
    if (error) {
      console.error('Erreur création parcelle:', error);
      return false;
    }
    console.log('Parcelle de test créée avec is_featured=true.');
    return true;
  } catch (e) {
    console.error('Exception création parcelle:', e);
    return false;
  }
}

async function runAllTests() {
  console.log('--- Test 1 : Connexion à Supabase ---');
  const conn = await testSupabaseConnection();
  console.log('Connexion à Supabase :', conn ? 'OK' : 'ÉCHEC');

  // Email/mot de passe via variables d'environnement ou arguments
  const email = process.env.TEST_EMAIL || process.argv[2] || '';
  const password = process.env.TEST_PASSWORD || process.argv[3] || '';
  if (!email || !password) {
    console.warn('Aucun email/mot de passe de test fourni. Ajoutez-les via variables d\'environnement ou arguments.');
  } else {
    console.log('\n--- Test 2 : Connexion utilisateur ---');
      await createTestUser(email, password);
    const login = await testUserLogin(email, password);
    console.log('Connexion utilisateur :', login ? 'OK' : 'ÉCHEC');
  }

  console.log('\n--- Test 3 : Création parcelle test ---');
  await createTestParcel();
  console.log('\n--- Test 4 : Récupération is_featured ---');
  const { data, error } = await supabase
    .from('parcels')
    .select('id, is_featured')
    .eq('is_featured', true)
    .limit(1);
  if (error) {
    console.error('Error fetching featured parcels:', error);
    console.log('is_featured (parcels) : ÉCHEC');
  } else if (!data || data.length === 0) {
    console.warn('Aucune parcelle avec is_featured = true trouvée.');
    console.log('is_featured (parcels) : ÉCHEC');
  } else if (typeof data[0].is_featured !== 'boolean') {
    console.warn('Le champ is_featured n\'est pas de type boolean.');
    console.log('is_featured (parcels) : ÉCHEC');
  } else {
    console.log('is_featured (parcels) : OK');
  }
}

runAllTests();

// Test 1: Connexion à Supabase
export async function testSupabaseConnection() {
  const { data, error } = await supabase.from('users').select('id').limit(1);
  if (error) {
    console.error('Supabase connection failed:', error);
    return false;
  }
  return true;
}

// Test 2: Connexion utilisateur (à adapter avec un vrai compte)
export async function testUserLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('Login failed:', error);
    return false;
  }
  return !!data.session;
}

// Test 3: Vérification de la colonne is_featured
export async function testFeaturedParcels() {
  const { data, error } = await supabase
    .from('parcels')
    .select('id, is_featured')
    .eq('is_featured', true)
    .limit(1);
  if (error) {
    console.error('Error fetching featured parcels:', error);
    return false;
  }
  return data.length > 0 && typeof data[0].is_featured === 'boolean';
}

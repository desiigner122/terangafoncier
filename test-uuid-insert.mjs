import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertWithUUID() {
  console.log('🚀 TEST INSERTION AVEC UUID...\n');
  
  try {
    const testProfile = {
      id: randomUUID(),
      email: 'admin@terangafoncier.sn',
      role: 'admin'
    };

    console.log('📝 Tentative insertion:', testProfile);

    const { data, error } = await supabase
      .from('profiles')
      .insert(testProfile)
      .select();

    if (error) {
      console.log('❌ Erreur:', error);
      
      if (error.code === '42501') {
        console.log('\n🔒 PROBLÈME RLS CONFIRMÉ');
        console.log('La politique Row Level Security bloque l\'insertion.');
        console.log('Solutions possibles :');
        console.log('1. Utiliser l\'interface SQL Editor de Supabase');
        console.log('2. Demander à l\'admin de désactiver RLS temporairement');
        console.log('3. Utiliser la service key au lieu de l\'anon key');
      }
    } else {
      console.log('✅ SUCCÈS! Profile inséré:', data);
      
      // Maintenant essayons d'insérer plus de données
      console.log('\n🔄 Insertion de données de test supplémentaires...');
      
      const additionalProfiles = [
        { id: randomUUID(), email: 'vendeur@test.com', role: 'vendeur' },
        { id: randomUUID(), email: 'client@test.com', role: 'particulier' }
      ];

      const { data: moreData, error: moreError } = await supabase
        .from('profiles')
        .insert(additionalProfiles)
        .select();

      if (moreError) {
        console.log('❌ Erreur données supplémentaires:', moreError);
      } else {
        console.log('✅ Données supplémentaires insérées:', moreData?.length);
      }
    }

    // Test de lecture pour voir la structure finale
    console.log('\n🔍 Lecture des données pour découvrir la structure...');
    const { data: allData, error: readError } = await supabase
      .from('profiles')
      .select('*')
      .limit(3);

    if (readError) {
      console.log('❌ Erreur lecture:', readError);
    } else if (allData && allData.length > 0) {
      console.log('✅ Structure profiles découverte:');
      console.log('📋 Colonnes:', Object.keys(allData[0]));
      console.log('📝 Exemples:', allData);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

insertWithUUID()
  .then(() => {
    console.log('\n🎯 TEST TERMINÉ');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ ERREUR:', err);
    process.exit(1);
  });
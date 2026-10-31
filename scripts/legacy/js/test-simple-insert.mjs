import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertSimpleProfile() {
  console.log('🚀 TEST INSERTION PROFILE SIMPLE...\n');
  
  try {
    // Structure minimale découverte : email + role (id auto-généré)
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        email: 'test@terangafoncier.sn',
        role: 'particulier'
      })
      .select();

    if (error) {
      console.log('❌ Erreur:', error);
      
      // Si c'est RLS, essayons de contourner avec service key ou auth
      if (error.message.includes('row-level security')) {
        console.log('🔒 Problème RLS (Row Level Security) détecté');
        console.log('💡 Il faut soit :');
        console.log('   1. Utiliser la service key (pas l\'anon key)');
        console.log('   2. S\'authentifier avec un utilisateur');
        console.log('   3. Désactiver RLS temporairement');
      }
    } else {
      console.log('✅ Succès! Profile inséré:', data);
      
      // Découvrir la structure maintenant qu'on a des données
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('*');
        
      if (allProfiles && allProfiles.length > 0) {
        console.log('📋 Structure profiles découverte:');
        console.log('Colonnes:', Object.keys(allProfiles[0]));
        console.log('Exemple:', allProfiles[0]);
      }
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

insertSimpleProfile()
  .then(() => {
    console.log('\n✅ TEST TERMINÉ');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ ERREUR:', err);
    process.exit(1);
  });
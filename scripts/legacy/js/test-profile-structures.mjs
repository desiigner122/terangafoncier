import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testProfileStructures() {
  console.log('🔍 TEST STRUCTURES PROFILES...\n');
  
  // Récupérer l'ID d'un utilisateur existant
  const { data: authUser } = await supabase.auth.getUser();
  
  if (!authUser?.user) {
    // Se connecter d'abord
    const { data: signInData } = await supabase.auth.signInWithPassword({
      email: 'vendeur@test.com',
      password: 'vendeur123'
    });
    
    if (!signInData.user) {
      console.log('❌ Impossible de se connecter');
      return;
    }
    
    console.log('✅ Connecté en tant que:', signInData.user.email);
  }

  const userId = (await supabase.auth.getUser()).data.user?.id;
  
  if (!userId) {
    console.log('❌ Pas d\'ID utilisateur');
    return;
  }

  console.log('👤 ID utilisateur:', userId);

  // Tester différentes structures
  const testCases = [
    // Test 1: Structure simple
    { id: userId, email: 'vendeur@test.com', role: 'vendeur' },
    
    // Test 2: Avec différents noms possibles
    { id: userId, email: 'vendeur@test.com', role: 'vendeur', display_name: 'Vendeur Test' },
    
    // Test 3: Avec full_name
    { id: userId, email: 'vendeur@test.com', role: 'vendeur', full_name: 'Vendeur Test' },
    
    // Test 4: Avec first_name + last_name
    { id: userId, email: 'vendeur@test.com', role: 'vendeur', first_name: 'Vendeur', last_name: 'Test' },
    
    // Test 5: Avec username
    { id: userId, email: 'vendeur@test.com', role: 'vendeur', username: 'vendeur_test' },

    // Test 6: Structure minimale (peut-être qu'un trigger remplit automatiquement)
    { id: userId }
  ];

  for (let i = 0; i < testCases.length; i++) {
    console.log(`\n🧪 Test ${i + 1}:`, Object.keys(testCases[i]).join(', '));
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert(testCases[i])
      .select();

    if (error) {
      console.log(`❌ Erreur: ${error.message}`);
      
      if (error.message.includes('has no field')) {
        const match = error.message.match(/has no field "(\w+)"/);
        if (match) {
          console.log(`💡 Le champ "${match[1]}" est attendu mais n'existe pas`);
        }
      }
    } else {
      console.log(`✅ SUCCÈS! Structure qui fonctionne:`, testCases[i]);
      console.log(`📝 Données insérées:`, data);
      
      // Lire la structure complète maintenant
      const { data: fullProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (fullProfile) {
        console.log('📋 Structure complète du profile:');
        console.log('   Colonnes:', Object.keys(fullProfile));
        console.log('   Données:', fullProfile);
      }
      
      break; // Arrêter au premier succès
    }
  }
}

testProfileStructures()
  .then(() => {
    console.log('\n🔍 ANALYSE TERMINÉE');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ ERREUR:', err);
    process.exit(1);
  });
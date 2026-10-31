import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function discoverProfilesStructure() {
  console.log('🔍 DÉCOUVERTE STRUCTURE TABLE PROFILES...\n');
  
  try {
    // Essayer d'insérer avec différentes structures possibles
    const possibleStructures = [
      // Structure 1: email + full_name
      { email: 'test1@example.com', full_name: 'Test User 1', role: 'particulier' },
      // Structure 2: email seulement  
      { email: 'test2@example.com', role: 'particulier' },
      // Structure 3: avec user_metadata
      { email: 'test3@example.com', user_metadata: { full_name: 'Test User 3' }, role: 'particulier' },
      // Structure 4: avec raw_user_meta_data
      { email: 'test4@example.com', raw_user_meta_data: { full_name: 'Test User 4' }, role: 'particulier' }
    ];

    for (let i = 0; i < possibleStructures.length; i++) {
      console.log(`🧪 Test structure ${i + 1}:`, Object.keys(possibleStructures[i]).join(', '));
      
      const { data, error } = await supabase
        .from('profiles')
        .insert(possibleStructures[i])
        .select();

      if (error) {
        console.log(`❌ Erreur: ${error.message}`);
        
        // Si c'est une erreur de colonne, on a une info utile
        if (error.message.includes('column')) {
          console.log('💡 Cette erreur révèle quelles colonnes existent/n\'existent pas');
        }
      } else {
        console.log(`✅ Succès! Structure qui fonctionne:`, possibleStructures[i]);
        console.log('📝 Données insérées:', data);
        break;
      }
      console.log('');
    }

    // Essayer de récupérer les données existantes pour voir la structure
    console.log('🔍 Tentative de lecture des données existantes...');
    const { data: existingData, error: readError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    if (readError) {
      console.log('❌ Erreur lecture:', readError.message);
    } else if (existingData && existingData.length > 0) {
      console.log('✅ Données existantes trouvées:');
      console.log('📋 Colonnes disponibles:', Object.keys(existingData[0]));
      console.log('📝 Exemple:', existingData[0]);
    } else {
      console.log('ℹ️ Aucune donnée existante trouvée');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

discoverProfilesStructure()
  .then(() => {
    console.log('\n🔍 ANALYSE TERMINÉE');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ ERREUR:', err);
    process.exit(1);
  });
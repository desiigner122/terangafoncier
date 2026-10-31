import { supabase } from './src/lib/supabaseClient.js';

async function discoverUserProfilesSchema() {
  console.log('🔍 DÉCOUVERTE SCHEMA user_profiles');
  console.log('==================================');

  try {
    // Essayer différents types de colonnes possibles
    const possibleColumns = [
      'id', 'user_id', 'email', 'username', 'name', 'full_name',
      'first_name', 'last_name', 'role', 'roles', 'type', 'user_type',
      'phone', 'address', 'avatar', 'avatar_url', 'profile_picture',
      'created_at', 'updated_at', 'verified', 'verification_status',
      'status', 'is_active', 'bio', 'description'
    ];

    for (const column of possibleColumns) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select(column)
          .limit(1);

        if (!error) {
          console.log(`✅ Colonne trouvée: ${column}`);
        }
      } catch (e) {
        // Ignorer les erreurs
      }
    }

    // Essayer une insertion vide pour voir l'erreur
    console.log('\n🧪 Test d\'insertion vide...');
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({})
      .select();

    if (error) {
      console.log('📋 Message d\'erreur révélateur:', error.message);
      console.log('📋 Code d\'erreur:', error.code);
      console.log('📋 Détails:', error.details);
    }

    // Essayer avec un ID seulement
    console.log('\n🔑 Test avec ID uniquement...');
    const testId = crypto.randomUUID();
    const { data: dataWithId, error: errorWithId } = await supabase
      .from('user_profiles')
      .insert({ id: testId })
      .select();

    if (errorWithId) {
      console.log('📋 Erreur avec ID:', errorWithId.message);
    } else {
      console.log('✅ Insertion avec ID réussie:', dataWithId);
      
      // Supprimer le test
      await supabase
        .from('user_profiles')
        .delete()
        .eq('id', testId);
    }

  } catch (error) {
    console.error('💥 Erreur:', error.message);
  }
}

discoverUserProfilesSchema().catch(console.error);

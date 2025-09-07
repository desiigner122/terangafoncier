import { supabase } from './src/lib/supabaseClient.js';

async function checkUserProfilesStructure() {
  console.log('🔍 VÉRIFICATION STRUCTURE user_profiles');
  console.log('=======================================');

  try {
    // Essayer de récupérer un profil existant pour voir la structure
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Erreur:', error.message);
      return;
    }

    if (profiles && profiles.length > 0) {
      console.log('✅ Structure trouvée:');
      console.log('Colonnes disponibles:', Object.keys(profiles[0]));
      console.log('Exemple de profil:', profiles[0]);
    } else {
      console.log('⚠️ Aucun profil existant trouvé');
      
      // Essayer une insertion simple pour découvrir la structure
      const testProfile = {
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'particulier'
      };

      const { data: insertData, error: insertError } = await supabase
        .from('user_profiles')
        .insert(testProfile)
        .select()
        .single();

      if (insertError) {
        console.log('📋 Erreur insertion (révélatrice):', insertError.message);
      } else {
        console.log('✅ Test profile créé:', insertData);
        
        // Supprimer le profil de test
        await supabase
          .from('user_profiles')
          .delete()
          .eq('email', 'test@example.com');
      }
    }

  } catch (error) {
    console.error('💥 Exception:', error.message);
  }
}

checkUserProfilesStructure().catch(console.error);

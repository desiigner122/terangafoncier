// Vérification de la structure Supabase existante
import { supabase } from './supabase-node-client.js';

async function checkStructure() {
  console.log('🔍 STRUCTURE SUPABASE EXISTANTE');
  console.log('===============================');
  
  try {
    // 1. Vérifier la table users
    console.log('\n1. Structure table users:');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError) {
      console.error('❌ Erreur users:', usersError.message);
    } else if (users.length > 0) {
      console.log('✅ Colonnes trouvées:', Object.keys(users[0]));
      console.log('📝 Exemple:', users[0]);
    }
    
    // 2. Vérifier la table properties
    console.log('\n2. Structure table properties:');
    const { data: properties, error: propsError } = await supabase
      .from('properties')
      .select('*')
      .limit(1);
    
    if (propsError) {
      console.error('❌ Erreur properties:', propsError.message);
    } else if (properties.length > 0) {
      console.log('✅ Colonnes trouvées:', Object.keys(properties[0]));
      console.log('📝 Exemple:', properties[0]);
    }
    
    // 3. Vérifier s'il y a d'autres tables
    console.log('\n3. Test autres tables possibles:');
    const tablesToTest = ['transactions', 'financial_transactions', 'profiles', 'auth.users'];
    
    for (const table of tablesToTest) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: ${data.length} lignes, colonnes:`, data.length > 0 ? Object.keys(data[0]) : 'Table vide');
        }
      } catch (e) {
        console.log(`❌ ${table}: Erreur test`);
      }
    }
    
    // 4. Vérifier l'authentification
    console.log('\n4. Test authentification:');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@teranga.com',
      password: 'admin123'
    });
    
    if (authError) {
      console.error('❌ Erreur auth:', authError.message);
    } else {
      console.log('✅ Connexion réussie:', authData.user.email);
      console.log('📋 Données utilisateur:', authData.user.user_metadata);
      
      // Se déconnecter après le test
      await supabase.auth.signOut();
    }
    
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  }
}

checkStructure().then(() => {
  console.log('\n🎯 VÉRIFICATION TERMINÉE');
  process.exit(0);
}).catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
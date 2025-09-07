import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseTables() {
  console.log('�️ AUDIT COMPLET BASE DE DONNÉES');
  console.log('================================');

  try {
    // Tenter de lister les tables via une requête d'information
    console.log('📋 Tentative de découverte des tables...\n');

    const tablesToCheck = [
      'users',
      'user_profiles', 
      'profiles',
      'parcels',
      'requests',
      'audit_logs',
      'properties',
      'transactions'
    ];

    for (const tableName of tablesToCheck) {
      console.log(`� Vérification: ${tableName}`);
      
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`   ❌ ${error.message}`);
          if (error.code === 'PGRST106') {
            console.log(`   🏗️ Table ${tableName} n'existe pas`);
          }
        } else {
          console.log(`   ✅ Table trouvée! Colonnes:`, data.length > 0 ? Object.keys(data[0]) : 'Table vide');
          if (data.length > 0) {
            console.log(`   📄 Exemple de données:`, data[0]);
          }
        }
      } catch (e) {
        console.log(`   💥 Exception: ${e.message}`);
      }
    }

    // Vérifier les utilisateurs authentifiés
    console.log('\n� UTILISATEURS AUTHENTIFIÉS');
    console.log('============================');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('❌ Erreur auth:', userError.message);
    } else if (user) {
      console.log('✅ Utilisateur connecté:', user.email, user.id);
    } else {
      console.log('⚠️ Aucun utilisateur connecté');
    }

  } catch (error) {
    console.error('💥 Erreur générale:', error.message);
  }
}

checkDatabaseTables();

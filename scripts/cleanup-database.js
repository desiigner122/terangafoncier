/**
 * Script de nettoyage et correction de la base de données
 * Supprime les données de test et corrige les erreurs
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function cleanupDatabase() {
  console.log('🧹 Début du nettoyage de la base de données...');
  
  try {
    // 1. Vérifier les colonnes existantes dans la table users
    console.log('🔍 Vérification de la structure de la table users...');
    const { data: testUsers, error: testError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Erreur accès table users:', testError);
      return;
    }

    console.log('📋 Structure actuelle des utilisateurs:', Object.keys(testUsers[0] || {}));

    // 2. Supprimer les utilisateurs de test/simulation
    console.log('🗑️ Suppression des utilisateurs de test...');
    
    // Supprimer les utilisateurs avec des noms de test évidents
    const testPatterns = [
      '%test%',
      '%demo%',
      '%example%',
      '%fake%',
      '%simulation%',
      'Test User%',
      'Demo %',
      'Utilisateur Test%'
    ];

    for (const pattern of testPatterns) {
      const { data: deletedUsers, error: deleteError } = await supabase
        .from('users')
        .delete()
        .ilike('full_name', pattern)
        .select();
      
      if (!deleteError && deletedUsers) {
        console.log(`   ✅ Supprimé ${deletedUsers.length} utilisateurs correspondant à "${pattern}"`);
      }
    }

    // 3. Nettoyer les emails de test
    const { data: emailDeleted, error: emailError } = await supabase
      .from('users')
      .delete()
      .or('email.ilike.%test%,email.ilike.%demo%,email.ilike.%example%')
      .select();
    
    if (!emailError && emailDeleted) {
      console.log(`   ✅ Supprimé ${emailDeleted.length} utilisateurs avec emails de test`);
    }

    // 4. Corriger les erreurs de schéma - supprimer les colonnes qui n'existent pas
    console.log('🔧 Correction des erreurs de schéma...');
    
    // Tenter de mettre à jour un utilisateur pour identifier les colonnes problématiques
    const { data: existingUsers, error: getUsersError } = await supabase
      .from('users')
      .select('id, email, full_name, role')
      .limit(5);
    
    if (existingUsers && existingUsers.length > 0) {
      console.log(`   📊 ${existingUsers.length} utilisateurs restants dans la base`);
      
      // Essayer une mise à jour sans la colonne 'phone' qui pose problème
      const testUser = existingUsers[0];
      const { error: updateError } = await supabase
        .from('users')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', testUser.id);
      
      if (updateError) {
        console.log('⚠️ Erreur lors du test de mise à jour:', updateError.message);
      } else {
        console.log('   ✅ Test de mise à jour réussi');
      }
    }

    // 5. Nettoyer le journal d'audit
    console.log('📝 Nettoyage du journal d\'audit...');
    
    const { data: auditDeleted, error: auditError } = await supabase
      .from('audit_logs')
      .delete()
      .or('action.eq.test,entity_type.eq.test,details.ilike.%test%')
      .select();
    
    if (!auditError && auditDeleted) {
      console.log(`   ✅ Supprimé ${auditDeleted.length} entrées de test du journal d'audit`);
    }

    // 6. Vérifier les buckets de stockage
    console.log('💾 Vérification du stockage...');
    
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log('⚠️ Erreur accès buckets:', bucketsError.message);
    } else {
      console.log('   📦 Buckets disponibles:', buckets.map(b => b.name).join(', '));
      
      // Créer le bucket avatars s'il n'existe pas
      if (!buckets.find(b => b.name === 'avatars')) {
        const { error: createBucketError } = await supabase.storage.createBucket('avatars', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
        });
        
        if (createBucketError) {
          console.log('⚠️ Erreur création bucket avatars:', createBucketError.message);
        } else {
          console.log('   ✅ Bucket avatars créé avec succès');
        }
      }
    }

    // 7. Statistiques finales
    console.log('\n📊 STATISTIQUES FINALES:');
    
    const { data: finalUsers, error: finalError } = await supabase
      .from('users')
      .select('role', { count: 'exact' });
    
    if (!finalError) {
      console.log(`   👥 Total utilisateurs: ${finalUsers?.length || 0}`);
      
      // Compter par rôle
      const roleCounts = {};
      finalUsers?.forEach(user => {
        roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
      });
      
      Object.entries(roleCounts).forEach(([role, count]) => {
        console.log(`      ${role}: ${count} utilisateur(s)`);
      });
    }

    const { data: auditCount } = await supabase
      .from('audit_logs')
      .select('id', { count: 'exact' });
    
    console.log(`   📝 Entrées audit: ${auditCount?.length || 0}`);

    console.log('\n✅ Nettoyage terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    throw error;
  }
}

// Exécution du script
cleanupDatabase()
  .then(() => {
    console.log('🎉 Script de nettoyage terminé');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });

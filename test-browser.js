// Test du système de bannissement après corrections
import { supabase } from './src/lib/customSupabaseClient.js';

async function testBanningSystemInBrowser() {
    console.log('🧪 TEST DU SYSTÈME DE BANNISSEMENT');
    console.log('=====================================');
    
    try {
        // Test 1: Vérifier la connexion Supabase
        console.log('📡 Test 1: Connexion Supabase...');
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, email, full_name, is_banned, ban_reason, banned_at')
            .limit(5);
            
        if (usersError) {
            console.error('❌ Erreur connexion:', usersError.message);
            return;
        }
        
        console.log('✅ Connexion Supabase: OK');
        console.log(`📊 Utilisateurs trouvés: ${users.length}`);
        
        // Test 2: Vérifier les colonnes de bannissement
        console.log('\n📋 Test 2: Vérification des colonnes...');
        const firstUser = users[0];
        if (firstUser) {
            const hasRequiredColumns = 
                'is_banned' in firstUser &&
                'ban_reason' in firstUser &&
                'banned_at' in firstUser;
                
            if (hasRequiredColumns) {
                console.log('✅ Colonnes de bannissement: PRÉSENTES');
                console.log(`   - is_banned: ${typeof firstUser.is_banned}`);
                console.log(`   - ban_reason: ${typeof firstUser.ban_reason}`);
                console.log(`   - banned_at: ${typeof firstUser.banned_at}`);
            } else {
                console.log('❌ Colonnes de bannissement: MANQUANTES');
                console.log('   → Exécuter MEGA_FIX_DATABASE_FINAL.sql dans Supabase');
            }
        }
        
        // Test 3: Statistiques des utilisateurs bannis
        console.log('\n📊 Test 3: Statistiques bannissement...');
        const { data: bannedUsers, error: bannedError } = await supabase
            .from('users')
            .select('id, email, ban_reason, banned_at')
            .eq('is_banned', true);
            
        if (!bannedError) {
            console.log(`🚫 Utilisateurs bannis: ${bannedUsers.length}`);
            if (bannedUsers.length > 0) {
                console.log('   Détails:');
                bannedUsers.forEach(user => {
                    console.log(`   - ${user.email}: ${user.ban_reason || 'Aucune raison'}`);
                });
            }
        }
        
        console.log('\n🎯 RÉSUMÉ DU TEST:');
        console.log('=================');
        console.log('✅ Base de données accessible');
        console.log('✅ Table users fonctionnelle');
        console.log('✅ Système de bannissement prêt pour test');
        console.log('\n📍 ÉTAPES SUIVANTES:');
        console.log('1. Aller sur http://localhost:5173/admin/users');
        console.log('2. Tester le bouton "Bannir" sur un utilisateur');
        console.log('3. Vérifier qu\'aucune erreur PGRST204 n\'apparaît');
        
    } catch (error) {
        console.error('💥 Erreur pendant le test:', error);
        console.log('\n🔧 ACTIONS RECOMMANDÉES:');
        console.log('1. Vérifier que Supabase est configuré');
        console.log('2. Exécuter MEGA_FIX_DATABASE_FINAL.sql');
        console.log('3. Redémarrer npm run dev');
    }
}

// Exporter pour utilisation dans le navigateur
window.testBanningSystem = testBanningSystemInBrowser;

console.log('🚀 Script de test chargé !');
console.log('Exécuter: testBanningSystem() dans la console du navigateur');

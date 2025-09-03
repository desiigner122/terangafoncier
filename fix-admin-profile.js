import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixAdminProfile() {
    try {
        console.log('🔧 CORRECTION DU PROFIL ADMIN');
        console.log('=============================');
        
        // Mettre à jour le profil admin avec les bonnes valeurs
        const { data, error } = await supabase
            .from('users')
            .update({
                role: 'Admin',               // Majuscule correcte
                user_type: 'Admin',          // Ajouter user_type
                verification_status: 'verified',  // Statut vérifié
                full_name: 'Super Admin',    // Nom d'affichage
                name: 'Super Admin'          // Nom de secours
            })
            .eq('email', 'palaye122@gmail.com')
            .select();
            
        if (error) {
            console.error('❌ Erreur mise à jour:', error);
            return;
        }
        
        console.log('✅ PROFIL ADMIN CORRIGÉ !');
        console.log('📋 Nouvelles valeurs:');
        if (data && data[0]) {
            Object.entries(data[0]).forEach(([key, value]) => {
                console.log(`   ${key}: ${value}`);
            });
        }
        
        console.log('\n🎯 SOLUTION COMPLÈTE:');
        console.log('1. ✅ Rôle corrigé: admin → Admin');
        console.log('2. ✅ user_type ajouté: Admin');
        console.log('3. ✅ verification_status: verified');
        console.log('4. ✅ Nom défini: Super Admin');
        
        console.log('\n🔄 REDÉMARREZ L\'APPLICATION:');
        console.log('   - Déconnectez-vous');
        console.log('   - Reconnectez-vous');
        console.log('   - Le dashboard admin devrait s\'afficher');
        
    } catch (error) {
        console.error('💥 ERREUR:', error);
    }
}

fixAdminProfile();

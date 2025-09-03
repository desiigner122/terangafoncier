import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAdminProfile() {
    try {
        console.log('🔍 DÉBOGAGE PROFIL ADMIN ET ERREURS');
        console.log('=====================================');
        
        // 1. Vérifier tous les utilisateurs et leurs rôles
        console.log('\n1. VÉRIFICATION DES UTILISATEURS:');
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (usersError) {
            console.error('❌ Erreur récupération utilisateurs:', usersError);
            return;
        }
        
        console.log(`📊 Nombre total d'utilisateurs: ${users.length}`);
        users.forEach((user, index) => {
            console.log(`${index + 1}. ID: ${user.id}`);
            console.log(`   📧 Email: ${user.email}`);
            console.log(`   👤 Nom: ${user.full_name || user.name || 'Non défini'}`);
            console.log(`   🏷️ Rôle: ${user.role || 'Non défini'}`);
            console.log(`   🔒 Type: ${user.user_type || 'Non défini'}`);
            console.log(`   ✅ Statut: ${user.verification_status || 'Non défini'}`);
            console.log(`   📅 Créé: ${new Date(user.created_at).toLocaleString('fr-FR')}`);
            console.log('   ---');
        });
        
        // 2. Chercher spécifiquement les admins
        console.log('\n2. RECHERCHE DES ADMINISTRATEURS:');
        const { data: admins, error: adminsError } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'Admin');
            
        if (adminsError) {
            console.error('❌ Erreur recherche admins:', adminsError);
        } else {
            console.log(`👑 Nombre d'administrateurs: ${admins.length}`);
            admins.forEach((admin, index) => {
                console.log(`Admin ${index + 1}:`);
                console.log(`   📧 Email: ${admin.email}`);
                console.log(`   👤 Nom: ${admin.full_name || admin.name}`);
                console.log(`   🆔 ID: ${admin.id}`);
                console.log('   ---');
            });
        }
        
        // 3. Vérifier la structure de la table users
        console.log('\n3. STRUCTURE DE LA TABLE USERS:');
        const { data: tableInfo, error: tableError } = await supabase
            .from('users')
            .select('*')
            .limit(1);
            
        if (tableInfo && tableInfo[0]) {
            console.log('🏗️ Colonnes disponibles:');
            Object.keys(tableInfo[0]).forEach(column => {
                console.log(`   - ${column}: ${typeof tableInfo[0][column]} (${tableInfo[0][column]})`);
            });
        }
        
        // 4. Tester la session actuelle
        console.log('\n4. TEST DE SESSION ACTUELLE:');
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
            console.error('❌ Erreur session:', sessionError);
        } else if (sessionData.session) {
            console.log('✅ Session active trouvée');
            console.log(`   🆔 User ID: ${sessionData.session.user.id}`);
            console.log(`   📧 Email: ${sessionData.session.user.email}`);
            
            // Récupérer le profil de cet utilisateur
            const { data: currentProfile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', sessionData.session.user.id)
                .single();
                
            if (profileError) {
                console.error('❌ Erreur profil actuel:', profileError);
            } else {
                console.log('📋 PROFIL ACTUEL:');
                console.log(`   👤 Nom: ${currentProfile.full_name || currentProfile.name}`);
                console.log(`   🏷️ Rôle: ${currentProfile.role}`);
                console.log(`   🔒 Type: ${currentProfile.user_type}`);
                console.log(`   ✅ Statut: ${currentProfile.verification_status}`);
            }
        } else {
            console.log('❌ Aucune session active');
        }
        
        // 5. Recommandations
        console.log('\n5. RECOMMANDATIONS:');
        console.log('📝 Pour corriger le problème de redirection admin:');
        console.log('   1. Vérifiez que votre compte a role="Admin" exactement');
        console.log('   2. Assurez-vous que user_type="Admin" aussi');
        console.log('   3. Vérifiez que verification_status est défini');
        
        console.log('\n📝 Pour le TypeError persistant:');
        console.log('   1. Le problème semble être dans une autre partie que useToast');
        console.log('   2. Vérifiez les imports dans AdminDashboardPage.jsx');
        console.log('   3. Possiblelement un problème avec Supabase client');
        
    } catch (error) {
        console.error('💥 ERREUR CRITIQUE:', error);
    }
}

debugAdminProfile();

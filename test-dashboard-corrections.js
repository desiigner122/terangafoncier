import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDashboardCorrections() {
    console.log('🔧 TEST DES CORRECTIONS DASHBOARD ADMIN\n');

    // Test 1: Authentification utilisateur standard
    console.log('1️⃣ Test création utilisateur (méthode standard):');
    try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: 'test.dashboard@terangafoncier.com',
            password: 'TestDashboard123!',
            options: {
                data: {
                    full_name: 'Test Dashboard User',
                    role: 'user',
                    verification_status: 'verified'
                }
            }
        });

        if (authError) {
            console.log('❌ Erreur auth:', authError.message);
        } else {
            console.log('✅ Utilisateur créé avec succès');
            
            // Nettoyer immédiatement
            if (authData.user) {
                await supabase.auth.signOut();
            }
        }
    } catch (err) {
        console.log('💥 Erreur auth:', err.message);
    }

    // Test 2: Navigation blog par ID
    console.log('\n2️⃣ Test navigation blog par ID:');
    try {
        const { data: blogData, error: blogError } = await supabase
            .from('blog')
            .select('id, title')
            .limit(1);

        if (blogError) {
            console.log('❌ Erreur blog:', blogError.message);
        } else if (blogData && blogData.length > 0) {
            console.log('✅ Navigation par ID possible');
            console.log('📝 Premier article ID:', blogData[0].id);
            console.log('📝 URL navigation: /admin/blog/edit/' + blogData[0].id);
        } else {
            console.log('⚠️ Aucun article trouvé');
        }
    } catch (err) {
        console.log('💥 Erreur blog:', err.message);
    }

    // Test 3: Statistiques réelles pour rapports
    console.log('\n3️⃣ Test données réelles pour rapports:');
    try {
        const [usersRes, parcelsRes, requestsRes, blogRes] = await Promise.allSettled([
            supabase.from('users').select('*', { count: 'exact' }),
            supabase.from('parcels').select('*', { count: 'exact' }),
            supabase.from('requests').select('*', { count: 'exact' }),
            supabase.from('blog').select('*', { count: 'exact' })
        ]);

        console.log('👥 Utilisateurs:', usersRes.status === 'fulfilled' ? 
            (usersRes.value.count || 0) : 'Erreur');
        console.log('🏗️ Parcelles:', parcelsRes.status === 'fulfilled' ? 
            (parcelsRes.value.count || 0) : 'Erreur');
        console.log('📋 Demandes:', requestsRes.status === 'fulfilled' ? 
            (requestsRes.value.count || 0) : 'Erreur');
        console.log('📝 Articles blog:', blogRes.status === 'fulfilled' ? 
            (blogRes.value.count || 0) : 'Erreur');

        const successCount = [usersRes, parcelsRes, requestsRes, blogRes]
            .filter(res => res.status === 'fulfilled').length;
        
        if (successCount === 4) {
            console.log('✅ Toutes les données réelles accessibles');
        } else {
            console.log(`⚠️ ${successCount}/4 sources de données accessibles`);
        }
        
    } catch (err) {
        console.log('💥 Erreur données:', err.message);
    }

    // Test 4: Structure blog (vérifier si les colonnes existent maintenant)
    console.log('\n4️⃣ Test structure blog actuelle:');
    try {
        const { data: blogStructure, error: structError } = await supabase
            .from('blog')
            .select('*')
            .limit(1);

        if (structError) {
            console.log('❌ Erreur structure:', structError.message);
        } else if (blogStructure && blogStructure.length > 0) {
            const columns = Object.keys(blogStructure[0]);
            console.log('✅ Colonnes disponibles:', columns);
            
            const requiredColumns = ['slug', 'excerpt', 'tags', 'author_name', 'image_url', 'published', 'category'];
            const missingColumns = requiredColumns.filter(col => !columns.includes(col));
            
            if (missingColumns.length === 0) {
                console.log('✅ Toutes les colonnes requises présentes');
            } else {
                console.log('⚠️ Colonnes manquantes:', missingColumns);
            }
        } else {
            console.log('ℹ️ Aucun article pour tester la structure');
        }
    } catch (err) {
        console.log('💥 Erreur structure:', err.message);
    }

    // Test 5: Soft delete utilisateur
    console.log('\n5️⃣ Test soft delete utilisateur:');
    try {
        // Créer un utilisateur test
        const { data: testUser, error: createError } = await supabase.auth.signUp({
            email: 'test.softdelete@terangafoncier.com',
            password: 'TestSoftDelete123!'
        });

        if (createError || !testUser.user) {
            console.log('❌ Impossible de créer utilisateur test:', createError?.message);
        } else {
            // Tester le soft delete
            const { error: deleteError } = await supabase
                .from('users')
                .update({ 
                    active: false, 
                    verification_status: 'deleted',
                    updated_at: new Date().toISOString()
                })
                .eq('id', testUser.user.id);

            if (deleteError) {
                console.log('❌ Erreur soft delete:', deleteError.message);
            } else {
                console.log('✅ Soft delete fonctionnel');
            }
        }
    } catch (err) {
        console.log('💥 Erreur soft delete:', err.message);
    }

    console.log('\n📋 RÉSUMÉ DES TESTS TERMINÉ');
    console.log('🔗 URLs à tester manuellement:');
    console.log('   - /admin/users (création/suppression utilisateurs)');
    console.log('   - /admin/blog (liste des articles)');
    console.log('   - /admin/blog/new (création article)');
    console.log('   - /admin/reports (statistiques réelles)');
}

testDashboardCorrections().catch(console.error);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuthAndBlogFixed() {
    console.log('🔧 Test des corrections d\'authentification et blog...\n');

    // Test 1: Authentification
    console.log('1️⃣ Test création utilisateur:');
    try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: 'test.urgent@terangafoncier.com',
            password: 'TestUrgent123!'
        });

        if (authError) {
            console.log('❌ Erreur auth:', authError.message);
            console.log('💡 Code:', authError.status);
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

    // Test 2: Blog simple (colonnes existantes seulement)
    console.log('\n2️⃣ Test insertion blog simple:');
    try {
        const { data: blogData, error: blogError } = await supabase
            .from('blog')
            .insert([{
                title: 'Article Test Urgent',
                content: 'Contenu de test pour vérifier que l\'insertion fonctionne avec les colonnes de base'
            }]);

        if (blogError) {
            console.log('❌ Erreur blog:', blogError.message);
            console.log('💡 Code:', blogError.code);
            console.log('💡 Détails:', blogError.details);
        } else {
            console.log('✅ Article créé avec succès');
            console.log('📝 Données:', blogData);
        }
    } catch (err) {
        console.log('💥 Erreur blog:', err.message);
    }

    // Test 3: Lecture des articles existants
    console.log('\n3️⃣ Test lecture articles:');
    try {
        const { data: readData, error: readError } = await supabase
            .from('blog')
            .select('*')
            .limit(3);

        if (readError) {
            console.log('❌ Erreur lecture:', readError.message);
        } else {
            console.log('✅ Articles lus avec succès');
            console.log('📊 Nombre d\'articles:', readData.length);
            if (readData.length > 0) {
                console.log('📝 Colonnes disponibles:', Object.keys(readData[0]));
            }
        }
    } catch (err) {
        console.log('💥 Erreur lecture:', err.message);
    }

    // Test 4: Vérifier les permissions avec différents rôles
    console.log('\n4️⃣ Test permissions RLS:');
    try {
        // Test sans authentification (anon)
        const { data: anonData, error: anonError } = await supabase
            .from('blog')
            .select('count(*)', { count: 'exact' });

        console.log('Accès anonyme:', anonError ? `❌ ${anonError.message}` : `✅ ${anonData[0].count} articles visibles`);

    } catch (err) {
        console.log('💥 Erreur permissions:', err.message);
    }

    console.log('\n📋 Résumé des tests terminé.');
}

testAuthAndBlogFixed().catch(console.error);

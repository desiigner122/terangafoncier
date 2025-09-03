import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBlogTableStructure() {
    console.log('🔍 Vérification structure table blog...\n');

    try {
        // Essayer d'abord une requête directe pour voir la structure
        console.log('🔄 Essai requête directe...');
        const { data: directData, error: directError } = await supabase
            .from('blog')
            .select('*')
            .limit(1);

        if (directError) {
            console.log('❌ Erreur requête directe:', directError.message);
        } else {
            console.log('✅ Structure existante:', directData);
            if (directData && directData.length > 0) {
                console.log('📝 Colonnes détectées:', Object.keys(directData[0]));
            }
        }

        // Essayer d'insérer un article minimal pour voir les colonnes requises
        console.log('\n🧪 Test insertion article minimal...');
        const testResult = await supabase.from('blog').insert([{
            title: 'Test Article Structure',
            content: 'Contenu test pour vérifier structure',
            slug: 'test-structure-' + Date.now()
        }]);
        
        if (testResult.error) {
            console.log('❌ Erreur insertion:', testResult.error.message);
            console.log('💡 Détails:', testResult.error.details);
            console.log('💡 Hint:', testResult.error.hint);
            console.log('💡 Code:', testResult.error.code);
        } else {
            console.log('✅ Insertion réussie:', testResult.data);
        }

        // Tester les permissions auth
        console.log('\n🔐 Test permissions auth...');
        const { data: authTest, error: authError } = await supabase.auth.getSession();
        console.log('Session actuelle:', authTest.session ? 'Connecté' : 'Non connecté');
        
        if (authError) {
            console.log('❌ Erreur auth:', authError.message);
        }

    } catch (err) {
        console.log('💥 Erreur générale:', err.message);
    }
}

checkBlogTableStructure().catch(console.error);

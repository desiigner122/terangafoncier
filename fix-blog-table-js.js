import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixBlogTableStructure() {
    console.log('🔧 Tentative de correction de la structure de la table blog...\n');

    // SQL pour ajouter les colonnes manquantes
    const addColumnsSQL = `
        -- Ajouter les colonnes manquantes une par une
        ALTER TABLE blog 
        ADD COLUMN IF NOT EXISTS slug TEXT,
        ADD COLUMN IF NOT EXISTS excerpt TEXT,
        ADD COLUMN IF NOT EXISTS tags TEXT[],
        ADD COLUMN IF NOT EXISTS author_name TEXT DEFAULT 'Admin Teranga',
        ADD COLUMN IF NOT EXISTS image_url TEXT,
        ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true,
        ADD COLUMN IF NOT EXISTS category TEXT;
        
        -- Créer un index unique sur slug
        CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_slug ON blog(slug);
    `;

    try {
        // Essayer d'exécuter le SQL via RPC (si disponible)
        console.log('🔄 Tentative d\'ajout des colonnes...');
        const { data, error } = await supabase.rpc('exec_sql', { sql: addColumnsSQL });
        
        if (error) {
            console.log('❌ RPC exec_sql non disponible:', error.message);
            
            // Plan B: Tester les nouvelles colonnes une par une
            console.log('\n📋 Test des colonnes existantes:');
            
            const testColumns = [
                'slug', 'excerpt', 'tags', 'author_name', 
                'image_url', 'published', 'category'
            ];
            
            for (const column of testColumns) {
                const testObj = { title: 'Test Column', content: 'Test' };
                testObj[column] = column === 'published' ? true : 
                                  column === 'tags' ? ['test'] : 
                                  `test_${column}`;
                
                const result = await supabase.from('blog').insert([testObj]);
                console.log(`${column}: ${result.error ? '❌ Manquante' : '✅ Existe'}`);
                
                // Nettoyer le test s'il a réussi
                if (!result.error && result.data) {
                    await supabase.from('blog').delete().eq('title', 'Test Column');
                }
            }
            
        } else {
            console.log('✅ Colonnes ajoutées avec succès');
        }

        // Tester l'insertion d'un article complet
        console.log('\n🧪 Test insertion article complet...');
        const testArticle = {
            title: 'Article Test Complet',
            content: 'Contenu de test pour vérifier que toutes les colonnes fonctionnent',
            slug: 'article-test-complet-' + Date.now(),
            excerpt: 'Extrait de test',
            tags: ['test', 'structure'],
            author_name: 'Admin Test',
            category: 'Test',
            published: true,
            image_url: 'https://via.placeholder.com/300x200'
        };

        const insertResult = await supabase.from('blog').insert([testArticle]);
        
        if (insertResult.error) {
            console.log('❌ Erreur insertion complète:', insertResult.error.message);
            console.log('💡 Détails:', insertResult.error.details);
            console.log('💡 Code:', insertResult.error.code);
        } else {
            console.log('✅ Insertion complète réussie!');
            
            // Nettoyer l'article de test
            await supabase.from('blog').delete().eq('slug', testArticle.slug);
            console.log('🧹 Article de test supprimé');
        }

    } catch (err) {
        console.log('💥 Erreur générale:', err.message);
    }
}

fixBlogTableStructure().catch(console.error);

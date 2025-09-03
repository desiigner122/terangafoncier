import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testWithAuth() {
    console.log('🔐 Test avec authentification...\n');

    try {
        // S'authentifier d'abord
        console.log('🔑 Connexion avec un compte admin...');
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: 'admin@terangafoncier.com', // Utiliser un compte admin si il existe
            password: 'admin123' // Mot de passe par défaut
        });

        if (authError) {
            console.log('❌ Connexion admin échouée:', authError.message);
            
            // Essayer de créer un admin
            console.log('🆕 Création d\'un compte admin...');
            const { data: signupData, error: signupError } = await supabase.auth.signUp({
                email: 'admin@terangafoncier.com',
                password: 'admin123',
                options: {
                    data: {
                        role: 'admin',
                        name: 'Admin Teranga'
                    }
                }
            });

            if (signupError) {
                console.log('❌ Création admin échouée:', signupError.message);
                return;
            } else {
                console.log('✅ Compte admin créé');
            }
        } else {
            console.log('✅ Connexion admin réussie');
            console.log('👤 Utilisateur:', authData.user.email);
        }

        // Maintenant essayer d'insérer un article
        console.log('\n📝 Test insertion article avec utilisateur authentifié...');
        const { data: blogData, error: blogError } = await supabase
            .from('blog')
            .insert([{
                title: 'Article Test Authentifié',
                content: 'Contenu de test avec utilisateur connecté'
            }]);

        if (blogError) {
            console.log('❌ Erreur insertion (authentifié):', blogError.message);
            console.log('💡 Code:', blogError.code);
            
            // Essayer avec author_id explicite
            console.log('\n🔄 Tentative avec author_id...');
            const { data: session } = await supabase.auth.getSession();
            if (session.session?.user) {
                const resultWithAuthor = await supabase
                    .from('blog')
                    .insert([{
                        title: 'Article Test avec Author ID',
                        content: 'Contenu avec author_id explicite',
                        author_id: session.session.user.id
                    }]);
                
                if (resultWithAuthor.error) {
                    console.log('❌ Erreur avec author_id:', resultWithAuthor.error.message);
                } else {
                    console.log('✅ Insertion réussie avec author_id');
                }
            }
        } else {
            console.log('✅ Article créé avec succès (authentifié)');
        }

        // Test de lecture avec l'utilisateur connecté
        console.log('\n📖 Test lecture articles (authentifié)...');
        const { data: readData, error: readError } = await supabase
            .from('blog')
            .select('*');

        if (readError) {
            console.log('❌ Erreur lecture (authentifié):', readError.message);
        } else {
            console.log('✅ Lecture réussie');
            console.log('📊 Articles trouvés:', readData.length);
        }

    } catch (err) {
        console.log('💥 Erreur générale:', err.message);
    }
}

testWithAuth().catch(console.error);

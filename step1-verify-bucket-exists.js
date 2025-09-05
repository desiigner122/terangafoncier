// Vérification étape 1 : Existence du bucket avatars
import { supabase } from './src/lib/customSupabaseClient.js';

console.log('🔍 ÉTAPE 1: VÉRIFICATION EXISTENCE BUCKET AVATARS');
console.log('================================================');

async function step1_checkBucketExists() {
    try {
        console.log('\n📋 Exécution de la requête SQL recommandée:');
        console.log('SELECT name, public, created_at FROM storage.buckets WHERE name = \'avatars\';');
        
        // Utiliser RPC pour exécuter la requête directement
        const { data, error } = await supabase.rpc('execute_sql', {
            query: "SELECT name, public, created_at FROM storage.buckets WHERE name = 'avatars'"
        });
        
        if (error) {
            console.log('⚠️ Erreur RPC, essai avec listBuckets()...');
            
            // Fallback avec listBuckets
            const { data: buckets, error: listError } = await supabase.storage.listBuckets();
            
            if (listError) {
                console.log('❌ Erreur listBuckets:', listError.message);
                console.log('\n🔍 DIAGNOSTIC: Problème d\'accès aux buckets');
                console.log('Cela confirme que le bucket n\'est pas accessible via JS client');
                return { exists: false, accessible: false };
            }
            
            const avatarsBucket = buckets?.find(b => b.name === 'avatars');
            
            if (avatarsBucket) {
                console.log('✅ BUCKET TROUVÉ via listBuckets():');
                console.log(`   - Nom: ${avatarsBucket.name}`);
                console.log(`   - Public: ${avatarsBucket.public}`);
                console.log(`   - ID: ${avatarsBucket.id}`);
                return { exists: true, accessible: true, data: avatarsBucket };
            } else {
                console.log('❌ BUCKET NON TROUVÉ via listBuckets()');
                console.log(`📊 Buckets disponibles: ${buckets?.length || 0}`);
                buckets?.forEach(bucket => {
                    console.log(`   - ${bucket.name}`);
                });
                return { exists: false, accessible: true };
            }
            
        } else {
            console.log('✅ Requête SQL exécutée avec succès');
            console.log('📊 Résultat:', data);
            
            if (data && data.length > 0) {
                console.log('✅ BUCKET AVATARS EXISTE:');
                console.log(`   - Nom: ${data[0].name}`);
                console.log(`   - Public: ${data[0].public}`);
                console.log(`   - Créé le: ${data[0].created_at}`);
                return { exists: true, accessible: true, data: data[0] };
            } else {
                console.log('❌ BUCKET AVATARS INEXISTANT');
                console.log('Aucune ligne retournée par la requête');
                return { exists: false, accessible: true };
            }
        }
        
    } catch (err) {
        console.log('❌ Erreur générale:', err.message);
        return { exists: false, accessible: false, error: err.message };
    }
}

async function step2_diagnoseIssue(bucketStatus) {
    console.log('\n🔍 DIAGNOSTIC DU PROBLÈME:');
    console.log('===========================');
    
    if (!bucketStatus.accessible) {
        console.log('❌ PROBLÈME: Accès aux buckets bloqué');
        console.log('🔧 CAUSE PROBABLE: Permissions client JS insuffisantes');
        console.log('💡 SOLUTION: Créer bucket via interface Supabase ou SQL direct');
        
    } else if (bucketStatus.exists) {
        console.log('✅ BUCKET EXISTE mais erreur persiste');
        console.log('🔧 CAUSE PROBABLE: Politiques RLS trop restrictives');
        console.log('💡 SOLUTION: Corriger les politiques storage.objects');
        
    } else {
        console.log('❌ BUCKET MANQUANT');
        console.log('🔧 CAUSE: Bucket jamais créé ou supprimé');
        console.log('💡 SOLUTION: Créer le bucket');
    }
}

async function step3_proposeNextActions(bucketStatus) {
    console.log('\n📋 PROCHAINES ACTIONS RECOMMANDÉES:');
    console.log('===================================');
    
    if (!bucketStatus.exists) {
        console.log('🎯 ACTION: CRÉER LE BUCKET');
        console.log('\nMéthode 1 - Via Supabase Dashboard (RECOMMANDÉE):');
        console.log('1. Aller sur https://supabase.com/dashboard');
        console.log('2. Projet "Teranga Foncier" → Storage');
        console.log('3. Créer nouveau bucket "avatars"');
        console.log('4. Configurer: Public = true, Taille max = 5MB');
        
        console.log('\nMéthode 2 - Via SQL Editor:');
        console.log('Exécuter dans Supabase SQL Editor:');
        console.log(`
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars', 
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;
        `);
        
    } else {
        console.log('🎯 ACTION: CORRIGER LES POLITIQUES');
        console.log('\nExécuter dans Supabase SQL Editor:');
        console.log(`
-- Supprimer anciennes politiques
DROP POLICY IF EXISTS "Public Avatar Access" ON storage.objects;
DROP POLICY IF EXISTS "User Avatar Upload" ON storage.objects;

-- Créer nouvelles politiques permissives
CREATE POLICY "Avatar Public Read" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'avatars');

CREATE POLICY "Avatar Upload Authenticated" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

-- Permettre accès aux buckets
CREATE POLICY "Give access to buckets" ON storage.buckets
    FOR SELECT TO public USING (true);
        `);
    }
}

// Exécution du diagnostic complet
async function runFullDiagnostic() {
    const bucketStatus = await step1_checkBucketExists();
    await step2_diagnoseIssue(bucketStatus);
    await step3_proposeNextActions(bucketStatus);
    
    console.log('\n🎯 RÉSUMÉ DIAGNOSTIC:');
    console.log(`- Bucket existe: ${bucketStatus.exists ? '✅' : '❌'}`);
    console.log(`- Accessible via JS: ${bucketStatus.accessible ? '✅' : '❌'}`);
    console.log(`- Action requise: ${bucketStatus.exists ? 'Corriger politiques' : 'Créer bucket'}`);
    
    return bucketStatus;
}

runFullDiagnostic();

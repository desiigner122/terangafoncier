// Vérification complète et correction bucket avatars
import { supabase } from './src/lib/customSupabaseClient.js';

console.log('🔧 DIAGNOSTIC COMPLET BUCKET AVATARS');
console.log('====================================');

// Test avec différentes configurations Supabase
async function testMultipleConnections() {
    console.log('\n🔗 1. TESTS CONNEXIONS SUPABASE:');
    
    // Test 1: Connexion client standard
    try {
        const { data: user, error } = await supabase.auth.getUser();
        if (error) {
            console.log('⚠️ Connexion auth:', error.message);
        } else {
            console.log('✅ Connexion auth OK');
        }
    } catch (err) {
        console.log('❌ Erreur auth:', err.message);
    }
    
    // Test 2: Storage direct
    try {
        const { data, error } = await supabase.storage.listBuckets();
        console.log('📊 Buckets via client standard:', data?.length || 0);
        
        if (error) {
            console.log('❌ Erreur storage client:', error.message);
            
            // Le problème peut être lié aux permissions RLS
            console.log('\n🔍 ANALYSE POSSIBLE:');
            console.log('- Le bucket existe côté serveur (erreur SQL le confirme)');
            console.log('- Mais les politiques RLS bloquent l\'accès via client JS');
            console.log('- Solution: Vérifier les politiques storage dans Supabase');
        }
        
    } catch (err) {
        console.log('❌ Erreur générale storage:', err.message);
    }
}

// Test upload direct pour confirmer fonctionnement
async function testDirectUpload() {
    console.log('\n📤 2. TEST UPLOAD DIRECT:');
    
    try {
        // Créer un fichier test simple
        const testData = `Test upload ${new Date().toISOString()}`;
        const testFile = new Blob([testData], { type: 'text/plain' });
        const fileName = `test-upload-${Date.now()}.txt`;
        
        console.log(`🧪 Tentative upload: ${fileName}`);
        
        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, testFile, {
                cacheControl: '3600',
                upsert: true
            });
            
        if (error) {
            console.log('❌ Upload échoué:', error.message);
            
            // Analyser le type d'erreur
            if (error.message.includes('Bucket not found')) {
                console.log('🔍 DIAGNOSTIC: Bucket réellement manquant côté storage');
                return 'bucket_missing';
            } else if (error.message.includes('policy')) {
                console.log('🔍 DIAGNOSTIC: Bucket existe, problème de politiques');
                return 'policy_issue';
            } else {
                console.log('🔍 DIAGNOSTIC: Autre problème:', error.message);
                return 'other_error';
            }
            
        } else {
            console.log('✅ Upload réussi !', data);
            
            // Nettoyer
            try {
                await supabase.storage.from('avatars').remove([fileName]);
                console.log('🧹 Fichier test nettoyé');
            } catch (cleanError) {
                console.log('⚠️ Erreur nettoyage:', cleanError.message);
            }
            
            return 'working';
        }
        
    } catch (err) {
        console.log('❌ Erreur test upload:', err.message);
        return 'error';
    }
}

// Proposer solutions selon le diagnostic
function provideSolutions(diagnosticResult) {
    console.log('\n💡 3. SOLUTIONS RECOMMANDÉES:');
    console.log('==============================');
    
    switch (diagnosticResult) {
        case 'working':
            console.log('🎉 EXCELLENTE NOUVELLE !');
            console.log('✅ Le bucket avatars fonctionne parfaitement');
            console.log('✅ L\'erreur "Bucket avatars non disponible" est résolue');
            console.log('\n🧪 À TESTER MAINTENANT:');
            console.log('1. Ouvrez http://localhost:5174/admin/users');
            console.log('2. Créez un utilisateur avec photo');
            console.log('3. L\'upload devrait fonctionner');
            break;
            
        case 'policy_issue':
            console.log('🔒 PROBLÈME DE POLITIQUES RLS');
            console.log('Le bucket existe mais les permissions bloquent l\'accès');
            console.log('\n📋 SOLUTION:');
            console.log('Exécuter dans Supabase SQL Editor:');
            console.log(`
-- Corriger les politiques RLS
DROP POLICY IF EXISTS "Public Avatar Access" ON storage.objects;
DROP POLICY IF EXISTS "User Avatar Upload" ON storage.objects;

CREATE POLICY "Public Avatar Access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'avatars');

CREATE POLICY "User Avatar Upload" ON storage.objects  
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "User Avatar Update" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');
            `);
            break;
            
        case 'bucket_missing':
            console.log('❌ BUCKET RÉELLEMENT MANQUANT');
            console.log('Malgré l\'erreur SQL, le bucket n\'existe pas côté storage');
            console.log('\n📋 SOLUTION:');
            console.log('1. Aller dans Supabase Dashboard → Storage');
            console.log('2. Créer manuellement le bucket "avatars"');
            console.log('3. Ou réessayer le script SQL avec les bonnes permissions');
            break;
            
        default:
            console.log('🔍 DIAGNOSTIC NÉCESSAIRE');
            console.log('Problème non identifié, investigation manuelle requise');
            console.log('\n📋 ÉTAPES SUIVANTES:');
            console.log('1. Vérifier Supabase Dashboard → Storage');
            console.log('2. Vérifier les logs Supabase');
            console.log('3. Tester depuis l\'interface Supabase directement');
    }
}

// Exécution du diagnostic complet
async function runFullDiagnostic() {
    await testMultipleConnections();
    const result = await testDirectUpload();
    provideSolutions(result);
    
    console.log('\n📊 RÉSUMÉ DIAGNOSTIC:');
    console.log('- Erreur SQL "duplicate key": Bucket déclaré côté base ✅');
    console.log('- Test upload direct:', result);
    console.log('- Prochaine étape: Appliquer la solution recommandée');
}

runFullDiagnostic();

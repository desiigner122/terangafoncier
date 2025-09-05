// Test post-correction pour vérifier que le bucket fonctionne
import { supabase } from './src/lib/customSupabaseClient.js';

console.log('🎯 TEST POST-CORRECTION BUCKET AVATARS');
console.log('=====================================');

async function finalValidationTest() {
    console.log('\n🧪 1. TEST UPLOAD AVATAR:');
    
    try {
        // Créer une vraie image PNG minimale
        const canvas = document.createElement ? null : undefined;
        
        // Si on ne peut pas créer canvas, utiliser image base64
        const imageDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA0AAAAElFTkSuQmCC';
        const response = await fetch(imageDataUrl);
        const imageFile = await response.blob();
        
        console.log('✅ Image test créée:', imageFile.type, `${imageFile.size} bytes`);
        
        // Test upload avec nom réaliste
        const fileName = `avatar-test-${Date.now()}.png`;
        
        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, imageFile, {
                cacheControl: '3600',
                upsert: true
            });
            
        if (error) {
            console.log('❌ Upload encore en échec:', error.message);
            
            // Analyser le type d'erreur
            if (error.message.includes('policy')) {
                console.log('🔍 DIAGNOSTIC: Problème de politiques RLS persistant');
                console.log('📋 SOLUTION: Vérifier que le script SQL a bien été exécuté');
            } else if (error.message.includes('Bucket')) {
                console.log('🔍 DIAGNOSTIC: Problème bucket persistant');
                console.log('📋 SOLUTION: Recréer le bucket manuellement dans Supabase UI');
            }
            
            return false;
            
        } else {
            console.log('🎉 UPLOAD RÉUSSI !');
            console.log('📁 Fichier uploadé:', data.path);
            console.log('🔗 Clé:', data.Key);
            
            // Test URL publique
            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);
                
            console.log('🌐 URL publique générée:', urlData.publicUrl);
            
            // Nettoyer (optionnel)
            try {
                const { error: deleteError } = await supabase.storage
                    .from('avatars')
                    .remove([fileName]);
                    
                if (deleteError) {
                    console.log('⚠️ Erreur suppression (pas grave):', deleteError.message);
                } else {
                    console.log('🧹 Fichier test nettoyé');
                }
            } catch (cleanErr) {
                console.log('⚠️ Nettoyage échoué (pas grave)');
            }
            
            return true;
        }
        
    } catch (err) {
        console.log('❌ Erreur générale test:', err.message);
        return false;
    }
}

async function testBucketVisibility() {
    console.log('\n🔍 2. TEST VISIBILITÉ BUCKET:');
    
    try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
            console.log('❌ Erreur listage buckets:', error.message);
            return false;
        }
        
        console.log(`📊 Buckets visibles: ${buckets.length}`);
        
        const avatarsBucket = buckets.find(b => b.name === 'avatars');
        
        if (avatarsBucket) {
            console.log('✅ Bucket avatars visible !');
            console.log(`   - Public: ${avatarsBucket.public}`);
            console.log(`   - Taille max: ${avatarsBucket.file_size_limit} bytes`);
            console.log(`   - Types: ${avatarsBucket.allowed_mime_types?.join(', ') || 'Tous'}`);
            return true;
        } else {
            console.log('❌ Bucket avatars encore invisible');
            return false;
        }
        
    } catch (err) {
        console.log('❌ Erreur test visibilité:', err.message);
        return false;
    }
}

async function provideNextSteps(uploadSuccess, visibilitySuccess) {
    console.log('\n📋 3. PROCHAINES ÉTAPES:');
    console.log('========================');
    
    if (uploadSuccess && visibilitySuccess) {
        console.log('🎉 SUCCÈS COMPLET !');
        console.log('✅ Bucket avatars: Opérationnel');
        console.log('✅ Upload: Fonctionnel');
        console.log('✅ Visibilité: OK');
        
        console.log('\n🧪 À TESTER MAINTENANT DANS L\'APP:');
        console.log('1. 📱 http://localhost:5174/admin/users');
        console.log('2. ➕ Créer un nouvel utilisateur');
        console.log('3. 📸 Ajouter une photo de profil');
        console.log('4. ✅ Vérifier que l\'upload fonctionne');
        console.log('5. 👤 Tester aussi depuis page Profil utilisateur');
        
        console.log('\n🎯 RÉSULTAT ATTENDU:');
        console.log('- Aucune erreur "Bucket avatars non disponible"');
        console.log('- Photos uploadées et affichées correctement');
        console.log('- Dashboard admin totalement fonctionnel');
        
    } else if (!uploadSuccess && !visibilitySuccess) {
        console.log('❌ CORRECTION NON APPLIQUÉE');
        console.log('Le script SQL n\'a pas été exécuté ou a échoué');
        
        console.log('\n🔧 ACTIONS IMMÉDIATES:');
        console.log('1. Aller sur Supabase Dashboard');
        console.log('2. SQL Editor → Nouvelle requête');
        console.log('3. Copier le script fix-bucket-politiques-rls.sql');
        console.log('4. Exécuter et vérifier les résultats');
        
    } else {
        console.log('⚠️ CORRECTION PARTIELLE');
        console.log(`- Upload: ${uploadSuccess ? '✅' : '❌'}`);
        console.log(`- Visibilité: ${visibilitySuccess ? '✅' : '❌'}`);
        
        console.log('\n🔧 INVESTIGATION SUPPLÉMENTAIRE NÉCESSAIRE');
        console.log('Vérifier les logs Supabase pour plus de détails');
    }
}

// Exécution test complet
async function runPostCorrectionTest() {
    const uploadWorks = await finalValidationTest();
    const bucketVisible = await testBucketVisibility();
    await provideNextSteps(uploadWorks, bucketVisible);
    
    console.log('\n📊 RÉSUMÉ FINAL:');
    console.log(`- Correction appliquée: ${uploadWorks || bucketVisible ? '✅' : '❌'}`);
    console.log(`- Prêt pour production: ${uploadWorks && bucketVisible ? '✅' : '❌'}`);
    console.log(`- Actions requises: ${uploadWorks && bucketVisible ? 'Aucune' : 'Voir ci-dessus'}`);
}

runPostCorrectionTest();

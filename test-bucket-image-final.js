// Test final avec un fichier image réel
import { supabase } from './src/lib/customSupabaseClient.js';

console.log('🖼️ TEST FINAL BUCKET AVATARS AVEC IMAGE');
console.log('======================================');

async function testWithImageFile() {
    console.log('\n📸 1. CRÉATION FICHIER IMAGE TEST:');
    
    try {
        // Créer un fichier image minimal (1x1 pixel PNG)
        // Data URL d'un PNG transparent 1x1
        const imageDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA0AAAAElFTkSuQmCC';
        
        // Convertir en blob
        const response = await fetch(imageDataUrl);
        const imageBlob = await response.blob();
        
        console.log('✅ Fichier image créé:', imageBlob.type, imageBlob.size, 'bytes');
        
        // Test upload avec image
        const fileName = `test-avatar-${Date.now()}.png`;
        console.log(`🧪 Tentative upload image: ${fileName}`);
        
        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, imageBlob, {
                cacheControl: '3600',
                upsert: true
            });
            
        if (error) {
            console.log('❌ Upload image échoué:', error.message);
            return false;
        } else {
            console.log('🎉 UPLOAD IMAGE RÉUSSI !');
            console.log('📄 Détails:', data);
            
            // Tester l'URL publique
            const { data: publicUrlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);
                
            console.log('🔗 URL publique:', publicUrlData.publicUrl);
            
            // Nettoyer
            try {
                await supabase.storage.from('avatars').remove([fileName]);
                console.log('🧹 Fichier test nettoyé');
            } catch (cleanError) {
                console.log('⚠️ Erreur nettoyage (pas grave):', cleanError.message);
            }
            
            return true;
        }
        
    } catch (err) {
        console.log('❌ Erreur test image:', err.message);
        return false;
    }
}

async function testBucketInfo() {
    console.log('\n📋 2. INFORMATIONS BUCKET:');
    
    try {
        // Récupérer infos bucket
        const { data: bucketInfo, error } = await supabase.storage.getBucket('avatars');
        
        if (error) {
            console.log('⚠️ Erreur récupération info bucket:', error.message);
        } else {
            console.log('✅ Informations bucket avatars:');
            console.log('   - Nom:', bucketInfo.name);
            console.log('   - Public:', bucketInfo.public);
            console.log('   - Taille max:', bucketInfo.file_size_limit, 'bytes');
            console.log('   - Types autorisés:', bucketInfo.allowed_mime_types);
        }
        
    } catch (err) {
        console.log('⚠️ Test info bucket échoué:', err.message);
    }
}

async function finalConclusion(uploadWorked) {
    console.log('\n🎯 CONCLUSION FINALE:');
    console.log('===================');
    
    if (uploadWorked) {
        console.log('🎉 SUCCÈS COMPLET !');
        console.log('✅ Bucket avatars: OPÉRATIONNEL');
        console.log('✅ Upload images: FONCTIONNEL');
        console.log('✅ Politiques: CONFIGURÉES');
        
        console.log('\n🧪 TESTS DANS L\'APPLICATION:');
        console.log('1. 📱 Ouvrez http://localhost:5174/');
        console.log('2. 👤 Allez dans Profil → Changer photo');
        console.log('3. 👥 Ou AdminUsers → Créer utilisateur avec avatar');
        console.log('4. 🖼️ Upload d\'une vraie image (JPG/PNG)');
        console.log('5. ✅ Devrait fonctionner sans erreur !');
        
        console.log('\n✨ PROBLÈME RÉSOLU:');
        console.log('L\'erreur "Bucket avatars non disponible" ne devrait plus apparaître');
        
    } else {
        console.log('❌ PROBLÈME PERSISTANT');
        console.log('Le bucket existe mais l\'upload ne fonctionne pas');
        
        console.log('\n🔧 SOLUTIONS À ESSAYER:');
        console.log('1. Vérifier Supabase Dashboard → Storage → avatars');
        console.log('2. Vérifier les politiques RLS');
        console.log('3. Tester upload depuis interface Supabase directement');
        console.log('4. Vérifier les logs dans Supabase → Logs');
    }
}

// Exécution test complet
async function runImageTest() {
    const success = await testWithImageFile();
    await testBucketInfo();
    await finalConclusion(success);
    
    console.log('\n📊 STATUT FINAL:');
    console.log('- Bucket avatars existe: ✅ (confirmé par erreur SQL)');
    console.log('- Upload images:', success ? '✅ FONCTIONNE' : '❌ PROBLÈME');
    console.log('- Prêt pour production:', success ? '✅ OUI' : '❌ NON');
}

runImageTest();

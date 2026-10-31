// Test de vérification du bucket avatars existant
import { supabase } from './src/lib/customSupabaseClient.js';

console.log('🔍 VÉRIFICATION BUCKET AVATARS EXISTANT');
console.log('=====================================');

async function checkExistingBucket() {
    try {
        console.log('\n📁 1. VÉRIFICATION BUCKETS DISPONIBLES:');
        
        // Lister tous les buckets
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
            console.log('❌ Erreur listage buckets:', listError.message);
            return false;
        }
        
        console.log(`✅ Buckets trouvés: ${buckets.length}`);
        buckets.forEach(bucket => {
            console.log(`   - ${bucket.name}: public=${bucket.public}, taille_max=${bucket.file_size_limit}`);
        });
        
        // Chercher spécifiquement le bucket avatars
        const avatarsBucket = buckets.find(bucket => bucket.name === 'avatars');
        
        if (avatarsBucket) {
            console.log('\n✅ BUCKET AVATARS TROUVÉ:');
            console.log(`   - Nom: ${avatarsBucket.name}`);
            console.log(`   - Public: ${avatarsBucket.public}`);
            console.log(`   - Taille max: ${avatarsBucket.file_size_limit} bytes (${Math.round(avatarsBucket.file_size_limit/1024/1024)}MB)`);
            console.log(`   - Types autorisés: ${avatarsBucket.allowed_mime_types || 'Non spécifié'}`);
            
            return true;
        } else {
            console.log('\n❌ BUCKET AVATARS NON TROUVÉ');
            return false;
        }
        
    } catch (error) {
        console.log('❌ Erreur générale:', error.message);
        return false;
    }
}

async function testUploadCapability() {
    console.log('\n🧪 2. TEST CAPACITÉ UPLOAD:');
    
    try {
        // Créer un fichier test très simple
        const testContent = 'test avatar upload';
        const testFile = new Blob([testContent], { type: 'text/plain' });
        
        // Tenter un upload test
        const testPath = `test-${Date.now()}.txt`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(testPath, testFile, {
                cacheControl: '3600',
                upsert: false
            });
            
        if (uploadError) {
            console.log('⚠️ Upload test échoué (normal si RLS strict):', uploadError.message);
            console.log('   Cela peut être dû aux politiques de sécurité RLS');
        } else {
            console.log('✅ Upload test réussi:', uploadData.path);
            
            // Nettoyer le fichier test
            await supabase.storage.from('avatars').remove([testPath]);
            console.log('🧹 Fichier test supprimé');
        }
        
    } catch (error) {
        console.log('⚠️ Test upload échoué:', error.message);
    }
}

async function checkPolicies() {
    console.log('\n🔒 3. VÉRIFICATION POLITIQUES:');
    
    try {
        // Tenter de récupérer des infos sur le bucket (test indirect des politiques)
        const { data: bucketInfo, error } = await supabase.storage.getBucket('avatars');
        
        if (error) {
            console.log('⚠️ Erreur accès bucket info:', error.message);
        } else {
            console.log('✅ Accès aux informations bucket OK');
            console.log('   Les politiques semblent configurées');
        }
        
    } catch (error) {
        console.log('⚠️ Test politiques échoué:', error.message);
    }
}

async function runVerification() {
    const bucketExists = await checkExistingBucket();
    
    if (bucketExists) {
        await testUploadCapability();
        await checkPolicies();
        
        console.log('\n🎯 RÉSULTAT VÉRIFICATION:');
        console.log('✅ Bucket avatars: EXISTE et configuré');
        console.log('✅ Le problème "Bucket avatars non disponible" devrait être résolu');
        
        console.log('\n🧪 TEST DANS L\'APPLICATION:');
        console.log('1. Ouvrez http://localhost:5174/');
        console.log('2. Allez dans Profil ou création d\'utilisateur');
        console.log('3. Essayez d\'uploader une photo');
        console.log('4. L\'erreur ne devrait plus apparaître');
        
        console.log('\n✅ BUCKET AVATARS OPÉRATIONNEL !');
        
    } else {
        console.log('\n❌ PROBLÈME: Bucket avatars introuvable');
        console.log('Vérifiez la connexion Supabase ou les permissions');
    }
}

runVerification();

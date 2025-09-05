// Étape 2: Création du bucket avatars selon méthode recommandée
import { supabase } from './src/lib/customSupabaseClient.js';

console.log('🔧 ÉTAPE 2: CRÉATION BUCKET AVATARS');
console.log('===================================');

// Fonction recommandée dans le guide
async function ensureAvatarsBucket() {
    console.log('\n📝 Méthode recommandée: supabase.storage.createBucket()');
    
    try {
        console.log('🔨 Création du bucket "avatars"...');
        
        const { data, error } = await supabase.storage.createBucket('avatars', {
            public: true,                    // URLs publiques autorisées
            allowedMimeTypes: ['image/*'],   // Seulement les images
            fileSizeLimit: 5242880          // 5MB max
        });

        if (error) {
            if (error.status === 409) {
                console.log('ℹ️ Bucket existe déjà (erreur 409) - C\'est normal');
                return { success: true, existed: true };
            } else {
                console.log('❌ Erreur création bucket:', error.message);
                console.log('📊 Détails erreur:', error);
                return { success: false, error: error.message };
            }
        } else {
            console.log('✅ Bucket créé avec succès !');
            console.log('📊 Données retournées:', data);
            return { success: true, existed: false, data };
        }
        
    } catch (err) {
        console.log('❌ Erreur générale création:', err.message);
        return { success: false, error: err.message };
    }
}

// Vérification immédiate après création
async function verifyBucketCreation() {
    console.log('\n🔍 VÉRIFICATION POST-CRÉATION:');
    
    try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
            console.log('❌ Erreur vérification:', error.message);
            return false;
        }
        
        const avatarsBucket = buckets?.find(b => b.name === 'avatars');
        
        if (avatarsBucket) {
            console.log('✅ BUCKET AVATARS CONFIRMÉ:');
            console.log(`   - Nom: ${avatarsBucket.name}`);
            console.log(`   - ID: ${avatarsBucket.id}`);
            console.log(`   - Public: ${avatarsBucket.public}`);
            console.log(`   - Taille max: ${avatarsBucket.file_size_limit} bytes`);
            console.log(`   - Types autorisés: ${avatarsBucket.allowed_mime_types?.join(', ') || 'Tous images'}`);
            return true;
        } else {
            console.log('❌ Bucket non trouvé après création');
            return false;
        }
        
    } catch (err) {
        console.log('❌ Erreur vérification:', err.message);
        return false;
    }
}

// Test upload immédiat pour confirmer fonctionnement
async function testUploadAfterCreation() {
    console.log('\n🧪 TEST UPLOAD IMMÉDIAT:');
    
    try {
        // Créer une image test minimale
        const imageDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA0AAAAElFTkSuQmCC';
        const response = await fetch(imageDataUrl);
        const imageFile = await response.blob();
        
        console.log('📷 Image test créée:', imageFile.type, `${imageFile.size} bytes`);
        
        const fileName = `test-creation-${Date.now()}.png`;
        
        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, imageFile, {
                cacheControl: '3600',
                upsert: true
            });
            
        if (error) {
            console.log('❌ Upload test échoué:', error.message);
            console.log('🔍 Cela indique un problème de politiques RLS');
            return false;
        } else {
            console.log('✅ UPLOAD TEST RÉUSSI !');
            console.log('📁 Fichier uploadé:', data.path);
            
            // Récupérer URL publique
            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);
                
            console.log('🔗 URL publique:', urlData.publicUrl);
            
            // Nettoyer
            await supabase.storage.from('avatars').remove([fileName]);
            console.log('🧹 Fichier test nettoyé');
            
            return true;
        }
        
    } catch (err) {
        console.log('❌ Erreur test upload:', err.message);
        return false;
    }
}

// Configuration des politiques si nécessaire
async function setupPoliciesIfNeeded(uploadWorked) {
    if (!uploadWorked) {
        console.log('\n🔒 CONFIGURATION POLITIQUES RLS:');
        console.log('Upload échoué, configuration politiques requise');
        
        console.log('\n📋 SCRIPT À EXÉCUTER dans Supabase SQL Editor:');
        console.log(`
-- Supprimer anciennes politiques
DROP POLICY IF EXISTS "Public Avatar Access" ON storage.objects;
DROP POLICY IF EXISTS "User Avatar Upload" ON storage.objects;

-- Nouvelles politiques permissives
CREATE POLICY "Avatar Public Read" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'avatars');

CREATE POLICY "Avatar Upload Authenticated" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Avatar Update Authenticated" ON storage.objects
    FOR UPDATE TO authenticated 
    USING (bucket_id = 'avatars') WITH CHECK (bucket_id = 'avatars');

-- Accès aux buckets
CREATE POLICY "Give access to buckets" ON storage.buckets
    FOR SELECT TO public USING (true);
        `);
    } else {
        console.log('\n✅ POLITIQUES: Upload fonctionne, politiques OK');
    }
}

// Fonction principale
async function createAndTestBucket() {
    console.log('🚀 Démarrage création bucket avatars...');
    
    // Étape 1: Créer le bucket
    const creationResult = await ensureAvatarsBucket();
    
    if (!creationResult.success) {
        console.log('\n❌ ÉCHEC CRÉATION BUCKET');
        console.log('Essayez la méthode manuelle via Supabase Dashboard');
        return;
    }
    
    // Étape 2: Vérifier la création
    const verificationSuccess = await verifyBucketCreation();
    
    if (!verificationSuccess) {
        console.log('\n❌ ÉCHEC VÉRIFICATION');
        return;
    }
    
    // Étape 3: Tester l'upload
    const uploadSuccess = await testUploadAfterCreation();
    
    // Étape 4: Configurer politiques si nécessaire
    await setupPoliciesIfNeeded(uploadSuccess);
    
    // Résumé final
    console.log('\n🎯 RÉSULTAT FINAL:');
    console.log(`- Bucket créé: ${creationResult.success ? '✅' : '❌'}`);
    console.log(`- Bucket vérifié: ${verificationSuccess ? '✅' : '❌'}`);
    console.log(`- Upload fonctionnel: ${uploadSuccess ? '✅' : '❌'}`);
    
    if (uploadSuccess) {
        console.log('\n🎉 SUCCÈS COMPLET !');
        console.log('Le bucket avatars est opérationnel');
        console.log('L\'erreur "Bucket avatars non disponible" est résolue');
        
        console.log('\n🧪 À TESTER MAINTENANT:');
        console.log('1. http://localhost:5174/admin/users → Créer utilisateur');
        console.log('2. Upload photo de profil');
        console.log('3. Vérifier absence d\'erreur');
        
    } else {
        console.log('\n⚠️ SUCCÈS PARTIEL');
        console.log('Bucket créé mais politiques à configurer manuellement');
        console.log('Exécutez le script SQL fourni ci-dessus');
    }
}

createAndTestBucket();

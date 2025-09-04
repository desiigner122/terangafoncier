// Script d'exécution du SQL bucket avatars via Supabase JavaScript Client
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY2MzMwNCwiZXhwIjoyMDcyMjM5MzA0fQ.Xb8cPzjE8-_tPaeFNHl4XGcZGI2KAfLVCrqJEe7M_yU'; // Clé service pour admin

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAvatarsBucket() {
  console.log('🔧 CRÉATION BUCKET AVATARS - TERANGA FONCIER');
  console.log('================================================');

  try {
    // 1. Vérifier si le bucket existe déjà
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Erreur listage buckets:', listError);
      return;
    }

    const avatarsBucket = buckets?.find(bucket => bucket.name === 'avatars');

    if (avatarsBucket) {
      console.log('✅ Bucket avatars existe déjà:', avatarsBucket);
    } else {
      // 2. Créer le bucket avatars
      console.log('🔨 Création du bucket avatars...');
      
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('avatars', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'],
        fileSizeLimit: 5242880 // 5MB
      });

      if (createError) {
        console.error('❌ Erreur création bucket:', createError);
        return;
      }

      console.log('✅ Bucket avatars créé avec succès:', newBucket);
    }

    // 3. Test d'upload pour vérifier les permissions
    console.log('🧪 Test upload dans bucket avatars...');
    
    // Créer un fichier test simple
    const testFile = new Blob(['test avatar'], { type: 'text/plain' });
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload('test/test-avatar.txt', testFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.warn('⚠️ Erreur test upload (normal si permissions RLS):', uploadError.message);
    } else {
      console.log('✅ Test upload réussi:', uploadData);
      
      // Nettoyer le fichier test
      await supabase.storage.from('avatars').remove(['test/test-avatar.txt']);
    }

    // 4. Vérifier les politiques via RPC si possible
    console.log('🔍 Vérification configuration bucket...');
    
    const { data: bucketInfo } = await supabase.storage.getBucket('avatars');
    console.log('📋 Informations bucket avatars:', bucketInfo);

    console.log('\n🎉 RÉSULTAT:');
    console.log('- Bucket avatars configuré');
    console.log('- Upload photos profil devrait maintenant fonctionner');
    console.log('- Testez en uploadant une image dans l\'application');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécution du script
createAvatarsBucket();

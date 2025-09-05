// ================================================================
// CORRECTION UPLOAD AVATAR - ProfilePage
// Corrige l'erreur "Bucket avatars non disponible"
// ================================================================

import { supabase } from '@/lib/customSupabaseClient';

// Fonction pour créer le bucket avatars s'il n'existe pas
export const ensureAvatarsBucket = async () => {
  try {
    // Vérifier si le bucket existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Erreur listBuckets:', listError);
      return false;
    }
    
    const avatarsBucket = buckets.find(bucket => bucket.id === 'avatars');
    
    if (!avatarsBucket) {
      console.log('🔧 Bucket avatars manquant, tentative de création...');
      
      // Tenter de créer le bucket
      const { data, error: createError } = await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      });
      
      if (createError) {
        console.error('❌ Erreur création bucket:', createError);
        
        // Essayer méthode alternative via SQL
        console.log('🔄 Tentative création via SQL...');
        const { data: sqlData, error: sqlError } = await supabase.rpc('create_avatars_bucket');
        
        if (sqlError) {
          console.error('❌ Erreur SQL bucket:', sqlError);
          return false;
        }
      }
      
      console.log('✅ Bucket avatars créé avec succès');
    } else {
      console.log('✅ Bucket avatars existe déjà');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur ensureAvatarsBucket:', error);
    return false;
  }
};

// Upload avatar sécurisé avec gestion du bucket
export const uploadAvatar = async (file, userId) => {
  try {
    // S'assurer que le bucket existe
    const bucketReady = await ensureAvatarsBucket();
    
    if (!bucketReady) {
      throw new Error('Bucket avatars non disponible. Contactez l\'administrateur.');
    }
    
    // Préparer le fichier
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = fileName; // Pas de sous-dossier pour simplifier
    
    console.log('📤 Upload avatar:', filePath);
    
    // Upload le fichier
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Remplacer si existe
      });
    
    if (error) {
      console.error('❌ Erreur upload:', error);
      throw error;
    }
    
    // Obtenir l'URL publique
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    const publicUrl = urlData.publicUrl;
    
    console.log('✅ Avatar uploadé:', publicUrl);
    
    return {
      success: true,
      publicUrl,
      filePath
    };
    
  } catch (error) {
    console.error('❌ Erreur uploadAvatar:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Supprimer ancien avatar
export const deleteOldAvatar = async (avatarUrl) => {
  try {
    if (!avatarUrl || !avatarUrl.includes('avatars/')) return;
    
    // Extraire le nom du fichier de l'URL
    const fileName = avatarUrl.split('/').pop();
    
    if (fileName) {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([fileName]);
      
      if (error) {
        console.warn('⚠️ Erreur suppression ancien avatar:', error);
      } else {
        console.log('🗑️ Ancien avatar supprimé:', fileName);
      }
    }
  } catch (error) {
    console.warn('⚠️ Erreur deleteOldAvatar:', error);
  }
};

// Test de connectivité bucket
export const testAvatarsBucket = async () => {
  try {
    const { data, error } = await supabase.storage
      .from('avatars')
      .list('', { limit: 1 });
    
    if (error) {
      console.error('❌ Test bucket échoué:', error);
      return false;
    }
    
    console.log('✅ Bucket avatars accessible');
    return true;
  } catch (error) {
    console.error('❌ Test bucket erreur:', error);
    return false;
  }
};

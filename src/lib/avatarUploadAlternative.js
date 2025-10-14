// ================================================================
// SOLUTION ALTERNATIVE - UPLOAD AVATAR SANS BUCKET
// Utilise Cloudinary comme fallback temporaire
// ================================================================

import { supabase } from '@/lib/supabaseClient';

// Configuration Cloudinary (gratuit 25GB)
const CLOUDINARY_CONFIG = {
  cloudName: 'teranga-foncier', // À créer sur cloudinary.com
  uploadPreset: 'avatars_preset', // À configurer
  maxFileSize: 5 * 1024 * 1024 // 5MB
};

// Alternative 1: Upload vers Cloudinary
export const uploadAvatarCloudinary = async (file, userId) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('public_id', `avatars/${userId}_${Date.now()}`);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    if (!response.ok) throw new Error('Upload Cloudinary échoué');
    
    const result = await response.json();
    
    return {
      success: true,
      publicUrl: result.secure_url,
      cloudinaryId: result.public_id
    };
  } catch (error) {
    console.error('❌ Erreur Cloudinary:', error);
    return { success: false, error: error.message };
  }
};

// Alternative 2: Upload Base64 dans database
export const uploadAvatarBase64 = async (file, userId) => {
  try {
    // Convertir en base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    // Sauvegarder dans une table avatars
    const { data, error } = await supabase
      .from('user_avatars')
      .upsert({
        user_id: userId,
        avatar_data: base64,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    
    return {
      success: true,
      publicUrl: `data:${file.type};base64,${base64.split(',')[1]}`,
      avatarId: data[0].id
    };
  } catch (error) {
    console.error('❌ Erreur Base64:', error);
    return { success: false, error: error.message };
  }
};

// Alternative 3: Upload vers service externe gratuit
export const uploadAvatarExternal = async (file, userId) => {
  try {
    // Utiliser imgbb.com (gratuit)
    const apiKey = '2d5b3f7d8a9c1e4f6b8d2c5a7e9f1b3d'; // Clé d'exemple
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', apiKey);
    formData.append('name', `avatar_${userId}_${Date.now()}`);
    
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('Upload externe échoué');
    
    const result = await response.json();
    
    return {
      success: true,
      publicUrl: result.data.url,
      deleteUrl: result.data.delete_url
    };
  } catch (error) {
    console.error('❌ Erreur upload externe:', error);
    return { success: false, error: error.message };
  }
};

// Fonction principale avec fallbacks
export const uploadAvatarRobust = async (file, userId) => {
  console.log('🔄 Tentative upload avatar robuste...');
  
  // Vérifier la taille du fichier
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: 'Fichier trop volumineux (max 5MB)' };
  }
  
  // Vérifier le type
  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'Seules les images sont acceptées' };
  }
  
  try {
    // Méthode 1: Base64 dans database (toujours fonctionne)
    console.log('📊 Tentative Base64...');
    const base64Result = await uploadAvatarBase64(file, userId);
    
    if (base64Result.success) {
      console.log('✅ Upload Base64 réussi');
      return base64Result;
    }
    
    // Méthode 2: Service externe (si disponible)
    console.log('🌐 Tentative service externe...');
    const externalResult = await uploadAvatarExternal(file, userId);
    
    if (externalResult.success) {
      console.log('✅ Upload externe réussi');
      return externalResult;
    }
    
    // Échec total
    throw new Error('Tous les méthodes d\'upload ont échoué');
    
  } catch (error) {
    console.error('❌ Upload avatar échoué:', error);
    return {
      success: false,
      error: 'Impossible d\'uploader l\'avatar. Réessayez plus tard.'
    };
  }
};

// Fonction pour récupérer l'avatar depuis la base
export const getAvatarFromDatabase = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_avatars')
      .select('avatar_data, file_name')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    return data?.avatar_data || null;
  } catch (error) {
    console.error('❌ Erreur récupération avatar:', error);
    return null;
  }
};

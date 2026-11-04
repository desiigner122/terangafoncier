import { supabase } from '@/lib/supabaseClient';
import { logger } from '@/lib/logger';

export class AvatarManager {
  constructor() {
    this.bucketName = 'avatars';
  }

  /**
   * Upload avatar et mise à jour du profil utilisateur
   */
  async uploadAvatar(file, userId) {
    try {
      logger.debug('🔄 Début upload avatar pour utilisateur:', userId);

      if (!file || !userId) {
        throw new Error('Fichier et ID utilisateur requis');
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Fichier trop volumineux (max 5MB)');
      }

      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        throw new Error('Format de fichier non supporté');
      }

      // Créer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload vers le bucket Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        logger.error('❌ Erreur upload storage:', uploadError);
        throw new Error(`Erreur upload: ${uploadError.message}`);
      }

      // 2. Obtenir l'URL publique
      const { data: publicData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      const avatarUrl = publicData.publicUrl;

      // 3. Mettre à jour le profil utilisateur
      const { data: updateData, error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        logger.error('❌ Erreur mise à jour profil:', updateError);
        // Nettoyer le fichier uploadé si la mise à jour échoue
        await this.deleteAvatar(filePath);
        throw new Error(`Erreur profil: ${updateError.message}`);
      }

      logger.debug('✅ Avatar uploadé avec succès:', avatarUrl);
      return {
        success: true,
        avatarUrl,
        user: updateData
      };

    } catch (error) {
      logger.error('❌ Erreur upload avatar:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Supprimer un avatar du storage
   */
  async deleteAvatar(filePath) {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        logger.error('⚠️ Erreur suppression avatar:', error);
      }
    } catch (error) {
      logger.error('⚠️ Erreur suppression avatar:', error);
    }
  }

  /**
   * Obtenir l'URL de l'avatar utilisateur
   */
  async getUserAvatar(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id', userId)
        .single();

      if (error) {
        logger.error('❌ Erreur récupération avatar:', error);
        return null;
      }

      return data?.avatar_url || null;
    } catch (error) {
      logger.error('❌ Erreur récupération avatar:', error);
      return null;
    }
  }

  /**
   * Générer une URL d'avatar par défaut
   */
  getDefaultAvatar(userEmail, userName) {
    const name = userName || userEmail?.split('@')[0] || 'User';
    return `https://avatar.vercel.sh/${encodeURIComponent(name)}.png`;
  }
}

export const avatarManager = new AvatarManager();

/**
 * ========================================
 * CMSService - Gestion CMS (Content Management System)
 * ========================================
 * Date: 10 Octobre 2025
 * Objectif: CRUD pages, sections, media assets
 */

import { supabase } from '@/lib/supabaseClient';

class CMSService {
  
  // ==================== PAGES ====================
  
  /**
   * Récupérer toutes les pages CMS
   * @param {Object} filters - Filtres optionnels (status, search)
   * @returns {Promise<Array>}
   */
  async getPages(filters = {}) {
    try {
      let query = supabase
        .from('cms_pages')
        .select(`
          id,
          slug,
          title,
          description,
          content,
          status,
          seo_meta,
          author_id,
          published_at,
          created_at,
          updated_at
        `)
        .order('updated_at', { ascending: false });

      // Filtrer par status
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      // Recherche par titre
      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, pages: data };
    } catch (error) {
      console.error('Erreur getPages:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer une page par slug
   * @param {string} slug
   * @returns {Promise<Object>}
   */
  async getPageBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('cms_pages')
        .select(`
          id,
          slug,
          title,
          description,
          content,
          status,
          seo_meta,
          author_id,
          published_at,
          created_at,
          updated_at,
          sections:cms_sections(*)
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;

      return { success: true, page: data };
    } catch (error) {
      console.error('Erreur getPageBySlug:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Créer une nouvelle page
   * @param {Object} pageData - { slug, title, description, content, seo_meta }
   * @returns {Promise<Object>}
   */
  async createPage(pageData) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('cms_pages')
        .insert({
          slug: pageData.slug,
          title: pageData.title,
          description: pageData.description || '',
          content: pageData.content || {},
          status: 'draft',
          seo_meta: pageData.seo_meta || {
            title: pageData.title,
            description: pageData.description || '',
            keywords: [],
            og_image: ''
          },
          author_id: userData?.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, page: data };
    } catch (error) {
      console.error('Erreur createPage:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mettre à jour une page
   * @param {string} pageId
   * @param {Object} updates - Champs à mettre à jour
   * @returns {Promise<Object>}
   */
  async updatePage(pageId, updates) {
    try {
      const { data, error } = await supabase
        .from('cms_pages')
        .update(updates)
        .eq('id', pageId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, page: data };
    } catch (error) {
      console.error('Erreur updatePage:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Publier une page (status = published)
   * @param {string} pageId
   * @returns {Promise<Object>}
   */
  async publishPage(pageId) {
    try {
      const { data, error } = await supabase
        .from('cms_pages')
        .update({
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', pageId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, page: data };
    } catch (error) {
      console.error('Erreur publishPage:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Supprimer une page
   * @param {string} pageId
   * @returns {Promise<Object>}
   */
  async deletePage(pageId) {
    try {
      const { error } = await supabase
        .from('cms_pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Erreur deletePage:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== SECTIONS ====================

  /**
   * Récupérer les sections d'une page
   * @param {string} pageId
   * @returns {Promise<Array>}
   */
  async getSections(pageId) {
    try {
      const { data, error } = await supabase
        .from('cms_sections')
        .select('*')
        .eq('page_id', pageId)
        .order('order_index', { ascending: true });

      if (error) throw error;

      return { success: true, sections: data };
    } catch (error) {
      console.error('Erreur getSections:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Créer une section
   * @param {Object} sectionData - { page_id, key, content, order_index }
   * @returns {Promise<Object>}
   */
  async createSection(sectionData) {
    try {
      const { data, error } = await supabase
        .from('cms_sections')
        .insert(sectionData)
        .select()
        .single();

      if (error) throw error;

      return { success: true, section: data };
    } catch (error) {
      console.error('Erreur createSection:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mettre à jour une section
   * @param {string} sectionId
   * @param {Object} updates
   * @returns {Promise<Object>}
   */
  async updateSection(sectionId, updates) {
    try {
      const { data, error } = await supabase
        .from('cms_sections')
        .update(updates)
        .eq('id', sectionId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, section: data };
    } catch (error) {
      console.error('Erreur updateSection:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Supprimer une section
   * @param {string} sectionId
   * @returns {Promise<Object>}
   */
  async deleteSection(sectionId) {
    try {
      const { error } = await supabase
        .from('cms_sections')
        .delete()
        .eq('id', sectionId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Erreur deleteSection:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== MEDIA ASSETS ====================

  /**
   * Récupérer tous les médias
   * @param {Object} filters - { tags, search }
   * @returns {Promise<Array>}
   */
  async getMediaAssets(filters = {}) {
    try {
      let query = supabase
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false });

      // Filtrer par tags
      if (filters.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }

      // Recherche par titre/alt
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,alt.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, assets: data };
    } catch (error) {
      console.error('Erreur getMediaAssets:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Uploader un média
   * @param {File} file - Fichier à uploader
   * @param {Object} metadata - { alt, title, tags }
   * @returns {Promise<Object>}
   */
  async uploadMedia(file, metadata = {}) {
    try {
      // Upload vers Supabase Storage
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Récupérer URL publique
      const { data: publicUrl } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      // Créer entrée dans media_assets
      const { data: userData } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('media_assets')
        .insert({
          url: publicUrl.publicUrl,
          alt: metadata.alt || '',
          title: metadata.title || file.name,
          tags: metadata.tags || [],
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: userData?.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, asset: data };
    } catch (error) {
      console.error('Erreur uploadMedia:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mettre à jour un média
   * @param {string} assetId
   * @param {Object} updates
   * @returns {Promise<Object>}
   */
  async updateMediaAsset(assetId, updates) {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .update(updates)
        .eq('id', assetId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, asset: data };
    } catch (error) {
      console.error('Erreur updateMediaAsset:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Supprimer un média
   * @param {string} assetId
   * @returns {Promise<Object>}
   */
  async deleteMediaAsset(assetId) {
    try {
      // Récupérer l'asset pour obtenir l'URL
      const { data: asset, error: fetchError } = await supabase
        .from('media_assets')
        .select('url')
        .eq('id', assetId)
        .single();

      if (fetchError) throw fetchError;

      // Extraire le nom du fichier de l'URL
      const fileName = asset.url.split('/').pop();

      // Supprimer du storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([fileName]);

      if (storageError) console.warn('Erreur suppression storage:', storageError);

      // Supprimer de la table
      const { error } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', assetId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Erreur deleteMediaAsset:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new CMSService();

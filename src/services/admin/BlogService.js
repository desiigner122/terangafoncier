/**
 * ========================================
 * BlogService - Gestion Blog Posts
 * ========================================
 * Date: 10 Octobre 2025
 * Objectif: CRUD articles blog (remplace array hardcodé)
 */

import { supabase } from '@/lib/supabaseClient';

class BlogService {
  
  /**
   * Récupérer tous les articles (avec filtres)
   * @param {Object} filters - { status, search, category, limit }
   * @returns {Promise<Array>}
   */
  async getPosts(filters = {}) {
    try {
      let query = supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          content,
          cover_image,
          author,
          author_avatar,
          category,
          tags,
          status,
          reading_time,
          published_at,
          created_at,
          updated_at
        `)
        .order('published_at', { ascending: false });

      // Filtrer par status (published par défaut pour frontend)
      if (filters.status) {
        query = query.eq('status', filters.status);
      } else {
        query = query.eq('status', 'published'); // Par défaut: articles publiés
      }

      // Recherche par titre
      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      // Filtrer par catégorie
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      // Limiter résultats
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, posts: data };
    } catch (error) {
      console.error('Erreur getPosts:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer un article par slug
   * @param {string} slug
   * @returns {Promise<Object>}
   */
  async getPostBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;

      return { success: true, post: data };
    } catch (error) {
      console.error('Erreur getPostBySlug:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer un article par ID (admin)
   * @param {string} postId
   * @returns {Promise<Object>}
   */
  async getPostById(postId) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;

      return { success: true, post: data };
    } catch (error) {
      console.error('Erreur getPostById:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Créer un article
   * @param {Object} postData
   * @returns {Promise<Object>}
   */
  async createPost(postData) {
    try {
      const { data: userData } = await supabase.auth.getUser();

      // Générer slug depuis titre si non fourni
      const slug = postData.slug || this.generateSlug(postData.title);

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          title: postData.title,
          slug: slug,
          excerpt: postData.excerpt || '',
          content: postData.content || '',
          cover_image: postData.cover_image || '',
          author: postData.author || userData?.user?.user_metadata?.name || 'Admin',
          author_avatar: postData.author_avatar || userData?.user?.user_metadata?.avatar_url || '',
          category: postData.category || 'Actualités',
          tags: postData.tags || [],
          status: 'draft',
          reading_time: postData.reading_time || this.calculateReadingTime(postData.content || ''),
          published_at: null
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, post: data };
    } catch (error) {
      console.error('Erreur createPost:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mettre à jour un article
   * @param {string} postId
   * @param {Object} updates
   * @returns {Promise<Object>}
   */
  async updatePost(postId, updates) {
    try {
      // Recalculer reading_time si content modifié
      if (updates.content) {
        updates.reading_time = this.calculateReadingTime(updates.content);
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, post: data };
    } catch (error) {
      console.error('Erreur updatePost:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Publier un article
   * @param {string} postId
   * @returns {Promise<Object>}
   */
  async publishPost(postId) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, post: data };
    } catch (error) {
      console.error('Erreur publishPost:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Supprimer un article
   * @param {string} postId
   * @returns {Promise<Object>}
   */
  async deletePost(postId) {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Erreur deletePost:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer articles similaires (même catégorie)
   * @param {string} currentSlug
   * @param {string} category
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getSimilarPosts(currentSlug, category, limit = 3) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, cover_image, published_at')
        .eq('category', category)
        .eq('status', 'published')
        .neq('slug', currentSlug)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { success: true, posts: data };
    } catch (error) {
      console.error('Erreur getSimilarPosts:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer catégories uniques
   * @returns {Promise<Array>}
   */
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('category')
        .eq('status', 'published');

      if (error) throw error;

      // Extraire catégories uniques
      const uniqueCategories = [...new Set(data.map(p => p.category))];

      return { success: true, categories: uniqueCategories };
    } catch (error) {
      console.error('Erreur getCategories:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Statistiques blog
   * @returns {Promise<Object>}
   */
  async getStats() {
    try {
      const { data: allPosts, error } = await supabase
        .from('blog_posts')
        .select('status, category, created_at');

      if (error) throw error;

      const stats = {
        total: allPosts.length,
        published: allPosts.filter(p => p.status === 'published').length,
        drafts: allPosts.filter(p => p.status === 'draft').length,
        by_category: {},
        recent_30_days: allPosts.filter(p => {
          const date = new Date(p.created_at);
          const now = new Date();
          const diffDays = (now - date) / (1000 * 60 * 60 * 24);
          return diffDays <= 30;
        }).length
      };

      // Compter par catégorie
      allPosts.forEach(post => {
        stats.by_category[post.category] = (stats.by_category[post.category] || 0) + 1;
      });

      return { success: true, stats };
    } catch (error) {
      console.error('Erreur getStats:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== UTILS ====================

  /**
   * Générer slug depuis titre
   * @param {string} title
   * @returns {string}
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer accents
      .replace(/[^\w\s-]/g, '') // Supprimer caractères spéciaux
      .replace(/\s+/g, '-') // Espaces → tirets
      .replace(/--+/g, '-') // Double tirets → simple
      .trim();
  }

  /**
   * Calculer temps de lecture (mots par minute: 200)
   * @param {string} content
   * @returns {string}
   */
  calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min`;
  }
}

export default new BlogService();

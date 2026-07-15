/**
 * ========================================
 * PropertyService - Accès centralisé aux propriétés (parcelles/terrains)
 * ========================================
 * Remplace les données mockées (src/data/parcelsData.js) par la table
 * Supabase `properties`. Point d'accès unique pour le catalogue, la page
 * d'accueil et les sections mairie.
 */

import { supabase } from '@/lib/supabaseClient';

// Image de couverture par défaut selon le type de bien (property_photos vide)
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop';

class PropertyService {
  /**
   * Colonnes standard exposées au frontend.
   */
  get columns() {
    return `id, title, name, description, type, price, surface, location, region, city,
            latitude, longitude, status, verification_status, ai_score, estimated_value,
            views_count, owner_id, created_at`;
  }

  /**
   * Récupérer les propriétés publiées et vérifiées (catalogue public).
   * @param {Object} opts - { limit, region, type, verifiedOnly }
   * @returns {Promise<{success:boolean, properties?:Array, error?:string}>}
   */
  async getProperties(opts = {}) {
    try {
      let query = supabase
        .from('properties')
        .select(this.columns)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Par défaut on ne montre que les biens vérifiés (comme le catalogue)
      if (opts.verifiedOnly !== false) {
        query = query.eq('verification_status', 'verified');
      }
      if (opts.region) query = query.eq('region', opts.region);
      if (opts.type) query = query.eq('type', opts.type);
      if (opts.limit) query = query.limit(opts.limit);

      const { data, error } = await query;
      if (error) throw error;

      return { success: true, properties: data || [] };
    } catch (error) {
      console.error('Erreur PropertyService.getProperties:', error);
      return { success: false, error: error.message, properties: [] };
    }
  }

  /**
   * Récupérer une propriété par id.
   */
  async getPropertyById(id) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return { success: true, property: data };
    } catch (error) {
      console.error('Erreur PropertyService.getPropertyById:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Propriétés d'une zone/commune (utilisé côté mairie).
   */
  async getPropertiesByZone(zone, opts = {}) {
    try {
      let query = supabase
        .from('properties')
        .select(this.columns)
        .or(`city.ilike.%${zone}%,region.ilike.%${zone}%,location.ilike.%${zone}%`)
        .order('created_at', { ascending: false });
      if (opts.limit) query = query.limit(opts.limit);

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, properties: data || [] };
    } catch (error) {
      console.error('Erreur PropertyService.getPropertiesByZone:', error);
      return { success: false, error: error.message, properties: [] };
    }
  }

  /**
   * Normaliser une propriété Supabase pour les cartes (SimpleParcelCard).
   */
  normalizeForCard(property) {
    if (!property) return null;
    return {
      id: property.id,
      title: property.title || property.name || 'Parcelle disponible',
      location: property.location || [property.city, property.region].filter(Boolean).join(', '),
      price: property.price ? Number(property.price) : null,
      surface: property.surface ? `${Number(property.surface).toLocaleString('fr-FR')} m²` : null,
      verified: property.verification_status === 'verified',
      image: property.cover_image || FALLBACK_IMAGE,
      type: property.type,
      region: property.region
    };
  }
}

export default new PropertyService();

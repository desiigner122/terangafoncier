/**
 * VENDEUR SUPABASE SERVICE
 * Service dédié pour le Dashboard Vendeur
 * Connexion directe aux tables Supabase
 * 
 * Tables principales:
 * - blockchain_transactions
 * - terrain_photos
 * - terrains (listings)
 * - vendeur_analytics
 * - vendeur_offers
 */

import { supabase } from './supabaseClient';

class VendeurSupabaseService {
  /**
   * ========================================
   * TRANSACTIONS BLOCKCHAIN
   * ========================================
   */

  /**
   * Récupérer les transactions blockchain du vendeur
   * @param {string} userId - ID du vendeur
   * @param {Object} options - Options de filtrage
   * @returns {Promise<Object>}
   */
  async getBlockchainTransactions(userId, options = {}) {
    try {
      const {
        status = null,
        type = null,
        limit = 50,
        offset = 0
      } = options;

      let query = supabase
        .from('blockchain_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Filtres
      if (status) {
        query = query.eq('status', status);
      }
      if (type) {
        query = query.eq('transaction_type', type);
      }

      // Pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data || [],
        message: `${data?.length || 0} transactions chargées`
      };
    } catch (error) {
      console.error('Erreur getBlockchainTransactions:', error);
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  }

  /**
   * ========================================
   * PHOTOS DE TERRAINS
   * ========================================
   */

  /**
   * Récupérer les photos des terrains du vendeur
   * @param {string} userId - ID du vendeur
   * @returns {Promise<Object>}
   */
  async getUserPhotos(userId) {
    try {
      // Récupérer les terrains du vendeur
      const { data: terrains, error: terrainsError } = await supabase
        .from('terrains')
        .select('id')
        .eq('vendeur_id', userId);

      if (terrainsError) throw terrainsError;

      const terrainIds = terrains?.map(t => t.id) || [];

      if (terrainIds.length === 0) {
        return {
          success: true,
          data: [],
          message: 'Aucun terrain trouvé'
        };
      }

      // Récupérer toutes les photos
      const { data: photos, error: photosError } = await supabase
        .from('terrain_photos')
        .select(`
          *,
          terrain:terrains (
            id,
            titre,
            localisation,
            superficie
          )
        `)
        .in('terrain_id', terrainIds)
        .order('created_at', { ascending: false });

      if (photosError) throw photosError;

      return {
        success: true,
        data: photos || [],
        message: `${photos?.length || 0} photos chargées`
      };
    } catch (error) {
      console.error('Erreur getUserPhotos:', error);
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  }

  /**
   * Upload une photo de terrain
   * @param {string} terrainId - ID du terrain
   * @param {File} file - Fichier image
   * @param {Object} metadata - Métadonnées
   * @returns {Promise<Object>}
   */
  async uploadTerrainPhoto(terrainId, file, metadata = {}) {
    try {
      // 1. Upload vers Storage
      const fileName = `${terrainId}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('terrain-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Récupérer l'URL publique
      const { data: urlData } = supabase
        .storage
        .from('terrain-photos')
        .getPublicUrl(fileName);

      const photoUrl = urlData.publicUrl;

      // 3. Enregistrer dans la table
      const { data: photoRecord, error: recordError } = await supabase
        .from('terrain_photos')
        .insert({
          terrain_id: terrainId,
          url: photoUrl,
          type: metadata.type || 'standard',
          description: metadata.description || '',
          is_primary: metadata.is_primary || false
        })
        .select()
        .single();

      if (recordError) throw recordError;

      return {
        success: true,
        data: photoRecord,
        message: 'Photo uploadée avec succès'
      };
    } catch (error) {
      console.error('Erreur uploadTerrainPhoto:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Supprimer une photo
   * @param {string} photoId - ID de la photo
   * @returns {Promise<Object>}
   */
  async deletePhoto(photoId) {
    try {
      // 1. Récupérer l'URL pour supprimer du Storage
      const { data: photo, error: fetchError } = await supabase
        .from('terrain_photos')
        .select('url')
        .eq('id', photoId)
        .single();

      if (fetchError) throw fetchError;

      // 2. Extraire le path du Storage depuis l'URL
      const url = new URL(photo.url);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(pathParts.indexOf('terrain-photos') + 1).join('/');

      // 3. Supprimer du Storage
      const { error: storageError } = await supabase
        .storage
        .from('terrain-photos')
        .remove([filePath]);

      if (storageError) console.warn('Erreur suppression Storage:', storageError);

      // 4. Supprimer de la DB
      const { error: deleteError } = await supabase
        .from('terrain_photos')
        .delete()
        .eq('id', photoId);

      if (deleteError) throw deleteError;

      return {
        success: true,
        message: 'Photo supprimée'
      };
    } catch (error) {
      console.error('Erreur deletePhoto:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * ========================================
   * LISTINGS (ANNONCES)
   * ========================================
   */

  /**
   * Récupérer les annonces du vendeur
   * @param {string} userId - ID du vendeur
   * @param {Object} options - Options
   * @returns {Promise<Object>}
   */
  async getVendeurListings(userId, options = {}) {
    try {
      const {
        status = null,
        limit = 50,
        offset = 0
      } = options;

      let query = supabase
        .from('terrains')
        .select(`
          *,
          photos:terrain_photos (
            id,
            url,
            type,
            is_primary
          ),
          offers:offres (
            id,
            montant,
            statut,
            created_at
          )
        `)
        .eq('vendeur_id', userId)
        .order('created_at', { ascending: false });

      // Filtre par statut
      if (status) {
        query = query.eq('statut', status);
      }

      // Pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data || [],
        message: `${data?.length || 0} annonces chargées`
      };
    } catch (error) {
      console.error('Erreur getVendeurListings:', error);
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  }

  /**
   * Créer une nouvelle annonce
   * @param {Object} listingData - Données de l'annonce
   * @returns {Promise<Object>}
   */
  async createListing(listingData) {
    try {
      const { data, error } = await supabase
        .from('terrains')
        .insert(listingData)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data,
        message: 'Annonce créée avec succès'
      };
    } catch (error) {
      console.error('Erreur createListing:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Mettre à jour une annonce
   * @param {string} listingId - ID de l'annonce
   * @param {Object} updates - Mises à jour
   * @returns {Promise<Object>}
   */
  async updateListing(listingId, updates) {
    try {
      const { data, error } = await supabase
        .from('terrains')
        .update(updates)
        .eq('id', listingId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data,
        message: 'Annonce mise à jour'
      };
    } catch (error) {
      console.error('Erreur updateListing:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Supprimer une annonce
   * @param {string} listingId - ID de l'annonce
   * @returns {Promise<Object>}
   */
  async deleteListing(listingId) {
    try {
      const { error } = await supabase
        .from('terrains')
        .delete()
        .eq('id', listingId);

      if (error) throw error;

      return {
        success: true,
        message: 'Annonce supprimée'
      };
    } catch (error) {
      console.error('Erreur deleteListing:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * ========================================
   * ANALYTICS VENDEUR
   * ========================================
   */

  /**
   * Récupérer les statistiques du vendeur
   * @param {string} userId - ID du vendeur
   * @returns {Promise<Object>}
   */
  async getVendeurAnalytics(userId) {
    try {
      // Statistiques sur les terrains
      const { data: terrains, error: terrainsError } = await supabase
        .from('terrains')
        .select('id, statut, prix, superficie, vues')
        .eq('vendeur_id', userId);

      if (terrainsError) throw terrainsError;

      // Statistiques sur les offres
      const terrainIds = terrains?.map(t => t.id) || [];
      let offers = [];
      
      if (terrainIds.length > 0) {
        const { data: offersData, error: offersError } = await supabase
          .from('offres')
          .select('*')
          .in('terrain_id', terrainIds);

        if (offersError) throw offersError;
        offers = offersData || [];
      }

      // Calculer les KPIs
      const stats = {
        totalListings: terrains?.length || 0,
        activeListings: terrains?.filter(t => t.statut === 'disponible').length || 0,
        soldListings: terrains?.filter(t => t.statut === 'vendu').length || 0,
        pendingListings: terrains?.filter(t => t.statut === 'en_attente').length || 0,
        totalValue: terrains?.reduce((sum, t) => sum + (t.prix || 0), 0) || 0,
        totalSurface: terrains?.reduce((sum, t) => sum + (t.superficie || 0), 0) || 0,
        totalViews: terrains?.reduce((sum, t) => sum + (t.vues || 0), 0) || 0,
        totalOffers: offers.length,
        pendingOffers: offers.filter(o => o.statut === 'en_attente').length,
        acceptedOffers: offers.filter(o => o.statut === 'acceptee').length,
        rejectedOffers: offers.filter(o => o.statut === 'refusee').length
      };

      return {
        success: true,
        data: stats,
        message: 'Analytics chargées'
      };
    } catch (error) {
      console.error('Erreur getVendeurAnalytics:', error);
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  }

  /**
   * ========================================
   * OFFRES
   * ========================================
   */

  /**
   * Récupérer les offres reçues par le vendeur
   * @param {string} userId - ID du vendeur
   * @returns {Promise<Object>}
   */
  async getVendeurOffers(userId) {
    try {
      // 1. Récupérer les terrains du vendeur
      const { data: terrains, error: terrainsError } = await supabase
        .from('terrains')
        .select('id')
        .eq('vendeur_id', userId);

      if (terrainsError) throw terrainsError;

      const terrainIds = terrains?.map(t => t.id) || [];

      if (terrainIds.length === 0) {
        return {
          success: true,
          data: [],
          message: 'Aucune offre'
        };
      }

      // 2. Récupérer les offres
      const { data: offers, error: offersError } = await supabase
        .from('offres')
        .select(`
          *,
          terrain:terrains (
            id,
            titre,
            prix,
            localisation
          ),
          acheteur:profiles (
            id,
            nom,
            prenom,
            email
          )
        `)
        .in('terrain_id', terrainIds)
        .order('created_at', { ascending: false });

      if (offersError) throw offersError;

      return {
        success: true,
        data: offers || [],
        message: `${offers?.length || 0} offres chargées`
      };
    } catch (error) {
      console.error('Erreur getVendeurOffers:', error);
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  }

  /**
   * Accepter une offre
   * @param {string} offerId - ID de l'offre
   * @returns {Promise<Object>}
   */
  async acceptOffer(offerId) {
    try {
      const { data, error } = await supabase
        .from('offres')
        .update({ 
          statut: 'acceptee',
          accepted_at: new Date().toISOString()
        })
        .eq('id', offerId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data,
        message: 'Offre acceptée'
      };
    } catch (error) {
      console.error('Erreur acceptOffer:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Refuser une offre
   * @param {string} offerId - ID de l'offre
   * @param {string} reason - Raison du refus
   * @returns {Promise<Object>}
   */
  async rejectOffer(offerId, reason = '') {
    try {
      const { data, error } = await supabase
        .from('offres')
        .update({ 
          statut: 'refusee',
          rejected_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', offerId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data,
        message: 'Offre refusée'
      };
    } catch (error) {
      console.error('Erreur rejectOffer:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton
export default new VendeurSupabaseService();

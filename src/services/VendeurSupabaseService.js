/**
 * VENDEUR SUPABASE SERVICE
 * Service dédié pour le Dashboard Vendeur.
 *
 * ⚠️ Ce fichier interrogeait auparavant des tables inexistantes
 * ('terrains', 'terrain_photos', 'offres', 'vendeur_analytics') — chaque
 * appel échouait silencieusement. Réécrit pour utiliser le schéma réel :
 * - properties (annonces / terrains du vendeur, via owner_id)
 * - property_photos (photos, GPS, score qualité)
 * - financial_transactions (offres d'achat / demandes de financement reçues)
 * - crm_contacts / crm_deals / crm_activities / crm_tasks (CRM)
 * - documents (documents liés à une propriété)
 * - disputes (anti-fraude / litiges)
 * - blockchain_transactions / blockchain_certificates
 * - conversations / conversation_participants / messages (messagerie)
 * - support_tickets / support_ticket_messages
 */

import { supabase } from './supabaseClient';

class VendeurSupabaseService {
  /**
   * ========================================
   * ANNONCES (properties)
   * ========================================
   */

  async getVendeurListings(userId, options = {}) {
    try {
      const { status = null, limit = 50, offset = 0 } = options;

      let query = supabase
        .from('properties')
        .select(`
          *,
          photos:property_photos ( id, url, is_primary, gps_latitude, gps_longitude, quality_score )
        `)
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (status) query = query.eq('status', status);
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;
      if (error) throw error;

      return { success: true, data: data || [], message: `${data?.length || 0} annonces chargées` };
    } catch (error) {
      console.error('Erreur getVendeurListings:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async createListing(listingData) {
    try {
      const { data, error } = await supabase.from('properties').insert(listingData).select().single();
      if (error) throw error;
      return { success: true, data, message: 'Annonce créée avec succès' };
    } catch (error) {
      console.error('Erreur createListing:', error);
      return { success: false, error: error.message };
    }
  }

  async updateListing(listingId, updates) {
    try {
      const { data, error } = await supabase.from('properties').update(updates).eq('id', listingId).select().single();
      if (error) throw error;
      return { success: true, data, message: 'Annonce mise à jour' };
    } catch (error) {
      console.error('Erreur updateListing:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteListing(listingId) {
    try {
      const { error } = await supabase.from('properties').delete().eq('id', listingId);
      if (error) throw error;
      return { success: true, message: 'Annonce supprimée' };
    } catch (error) {
      console.error('Erreur deleteListing:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * ========================================
   * PHOTOS (property_photos)
   * ========================================
   */

  async getUserPhotos(userId) {
    try {
      const { data: properties, error: propsError } = await supabase
        .from('properties')
        .select('id, title, name, location, surface')
        .eq('owner_id', userId);
      if (propsError) throw propsError;

      const propertyIds = properties?.map(p => p.id) || [];
      if (propertyIds.length === 0) {
        return { success: true, data: [], message: 'Aucun terrain trouvé' };
      }

      const { data: photos, error: photosError } = await supabase
        .from('property_photos')
        .select('*')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false });
      if (photosError) throw photosError;

      const propertyMap = Object.fromEntries((properties || []).map(p => [p.id, p]));
      const enriched = (photos || []).map(photo => ({ ...photo, property: propertyMap[photo.property_id] }));

      return { success: true, data: enriched, message: `${enriched.length} photos chargées` };
    } catch (error) {
      console.error('Erreur getUserPhotos:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async uploadPropertyPhoto(propertyId, file, metadata = {}) {
    try {
      const fileName = `${propertyId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('property-photos').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('property-photos').getPublicUrl(fileName);

      const { data: photoRecord, error: recordError } = await supabase
        .from('property_photos')
        .insert({
          property_id: propertyId,
          url: urlData.publicUrl,
          is_primary: metadata.is_primary || false,
          gps_latitude: metadata.gps_latitude || null,
          gps_longitude: metadata.gps_longitude || null,
          quality_score: metadata.quality_score || null
        })
        .select()
        .single();
      if (recordError) throw recordError;

      return { success: true, data: photoRecord, message: 'Photo uploadée avec succès' };
    } catch (error) {
      console.error('Erreur uploadPropertyPhoto:', error);
      return { success: false, error: error.message };
    }
  }

  async deletePhoto(photoId) {
    try {
      const { data: photo, error: fetchError } = await supabase
        .from('property_photos')
        .select('url')
        .eq('id', photoId)
        .single();
      if (fetchError) throw fetchError;

      if (photo?.url) {
        try {
          const url = new URL(photo.url);
          const pathParts = url.pathname.split('/');
          const idx = pathParts.indexOf('property-photos');
          if (idx >= 0) {
            const filePath = pathParts.slice(idx + 1).join('/');
            await supabase.storage.from('property-photos').remove([filePath]);
          }
        } catch (storageErr) {
          console.warn('Erreur suppression Storage:', storageErr);
        }
      }

      const { error: deleteError } = await supabase.from('property_photos').delete().eq('id', photoId);
      if (deleteError) throw deleteError;

      return { success: true, message: 'Photo supprimée' };
    } catch (error) {
      console.error('Erreur deletePhoto:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * ========================================
   * OFFRES D'ACHAT (financial_transactions)
   * ========================================
   * Une offre d'achat reçue est modélisée comme une financial_transactions
   * liée à une propriété du vendeur, en status 'pending'.
   */

  async getVendeurOffers(userId) {
    try {
      const { data: properties, error: propsError } = await supabase
        .from('properties')
        .select('id, title, name, price, location')
        .eq('owner_id', userId);
      if (propsError) throw propsError;

      const propertyIds = properties?.map(p => p.id) || [];
      if (propertyIds.length === 0) {
        return { success: true, data: [], message: 'Aucune offre' };
      }

      const { data: offers, error: offersError } = await supabase
        .from('financial_transactions')
        .select('*')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false });
      if (offersError) throw offersError;

      const propertyMap = Object.fromEntries((properties || []).map(p => [p.id, p]));
      const enriched = (offers || []).map(offer => ({ ...offer, property: propertyMap[offer.property_id] }));

      return { success: true, data: enriched, message: `${enriched.length} offres chargées` };
    } catch (error) {
      console.error('Erreur getVendeurOffers:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async acceptOffer(offerId) {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .update({ status: 'accepted' })
        .eq('id', offerId)
        .select()
        .single();
      if (error) throw error;
      return { success: true, data, message: 'Offre acceptée' };
    } catch (error) {
      console.error('Erreur acceptOffer:', error);
      return { success: false, error: error.message };
    }
  }

  async rejectOffer(offerId, reason = '') {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .update({ status: 'rejected', description: reason || undefined })
        .eq('id', offerId)
        .select()
        .single();
      if (error) throw error;
      return { success: true, data, message: 'Offre refusée' };
    } catch (error) {
      console.error('Erreur rejectOffer:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * ========================================
   * ANALYTICS VENDEUR
   * ========================================
   */

  async getVendeurAnalytics(userId) {
    try {
      const { data: properties, error: propsError } = await supabase
        .from('properties')
        .select('id, status, price, surface, views_count')
        .eq('owner_id', userId);
      if (propsError) throw propsError;

      const propertyIds = properties?.map(p => p.id) || [];
      let offers = [];
      if (propertyIds.length > 0) {
        const { data: offersData, error: offersError } = await supabase
          .from('financial_transactions')
          .select('id, status, amount')
          .in('property_id', propertyIds);
        if (offersError) throw offersError;
        offers = offersData || [];
      }

      const stats = {
        totalListings: properties?.length || 0,
        activeListings: properties?.filter(p => p.status === 'active').length || 0,
        soldListings: properties?.filter(p => p.status === 'sold').length || 0,
        pendingListings: properties?.filter(p => p.status === 'pending').length || 0,
        totalValue: properties?.reduce((sum, p) => sum + (Number(p.price) || 0), 0) || 0,
        totalSurface: properties?.reduce((sum, p) => sum + (Number(p.surface) || 0), 0) || 0,
        totalViews: properties?.reduce((sum, p) => sum + (Number(p.views_count) || 0), 0) || 0,
        totalOffers: offers.length,
        pendingOffers: offers.filter(o => o.status === 'pending').length,
        acceptedOffers: offers.filter(o => o.status === 'accepted').length,
        rejectedOffers: offers.filter(o => o.status === 'rejected').length
      };

      return { success: true, data: stats, message: 'Analytics chargées' };
    } catch (error) {
      console.error('Erreur getVendeurAnalytics:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  /**
   * ========================================
   * CRM (crm_contacts / crm_deals / crm_activities / crm_tasks)
   * ========================================
   */

  async getCrmContacts(userId) {
    try {
      const { data, error } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getCrmContacts:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async createCrmContact(contactData) {
    try {
      const { data, error } = await supabase.from('crm_contacts').insert(contactData).select().single();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erreur createCrmContact:', error);
      return { success: false, error: error.message };
    }
  }

  async getCrmDeals(userId) {
    try {
      const { data, error } = await supabase
        .from('crm_deals')
        .select('*, contact:crm_contacts(id, name, email)')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getCrmDeals:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async getCrmActivities(userId, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('crm_activities')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getCrmActivities:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async getCrmTasks(userId) {
    try {
      const { data, error } = await supabase
        .from('crm_tasks')
        .select('*')
        .eq('owner_id', userId)
        .order('due_date', { ascending: true });
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getCrmTasks:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * ========================================
   * DOCUMENTS
   * ========================================
   */

  async getDocuments(userId) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getDocuments:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * ========================================
   * ANTI-FRAUDE / LITIGES (disputes)
   * ========================================
   */

  async getDisputes(userId) {
    try {
      const { data: properties, error: propsError } = await supabase
        .from('properties')
        .select('id, title, name')
        .eq('owner_id', userId);
      if (propsError) throw propsError;

      const propertyIds = properties?.map(p => p.id) || [];
      if (propertyIds.length === 0) {
        return { success: true, data: [] };
      }

      const { data, error } = await supabase
        .from('disputes')
        .select('*')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false });
      if (error) throw error;

      const propertyMap = Object.fromEntries((properties || []).map(p => [p.id, p]));
      const enriched = (data || []).map(d => ({ ...d, property: propertyMap[d.property_id] }));

      return { success: true, data: enriched };
    } catch (error) {
      console.error('Erreur getDisputes:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * ========================================
   * BLOCKCHAIN
   * ========================================
   */

  async getBlockchainTransactions(userId, options = {}) {
    try {
      const { limit = 50, offset = 0 } = options;
      const { data, error } = await supabase
        .from('blockchain_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      if (error) throw error;
      return { success: true, data: data || [], message: `${data?.length || 0} transactions chargées` };
    } catch (error) {
      console.error('Erreur getBlockchainTransactions:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async getBlockchainCertificates(userId) {
    try {
      const { data: properties, error: propsError } = await supabase
        .from('properties')
        .select('id')
        .eq('owner_id', userId);
      if (propsError) throw propsError;

      const propertyIds = properties?.map(p => p.id) || [];
      if (propertyIds.length === 0) {
        return { success: true, data: [] };
      }

      const { data, error } = await supabase
        .from('blockchain_certificates')
        .select('*')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getBlockchainCertificates:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  /**
   * ========================================
   * MESSAGERIE (conversations / messages)
   * ========================================
   */

  async getConversations(userId) {
    try {
      const { data: participations, error: partError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId);
      if (partError) throw partError;

      const conversationIds = participations?.map(p => p.conversation_id) || [];
      if (conversationIds.length === 0) {
        return { success: true, data: [] };
      }

      const { data, error } = await supabase
        .from('conversations')
        .select('*, participants:conversation_participants(user_id)')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getConversations:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async getMessages(conversationId) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getMessages:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async sendMessage(conversationId, senderId, content) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({ conversation_id: conversationId, sender_id: senderId, content, read: false })
        .select()
        .single();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erreur sendMessage:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * ========================================
   * SUPPORT
   * ========================================
   */

  async getSupportTickets(userId) {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getSupportTickets:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async createSupportTicket(ticketData) {
    try {
      const { data, error } = await supabase.from('support_tickets').insert(ticketData).select().single();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erreur createSupportTicket:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton
export default new VendeurSupabaseService();

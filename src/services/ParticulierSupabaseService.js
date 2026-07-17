/**
 * PARTICULIER / ACHETEUR SUPABASE SERVICE
 * Service dédié pour le Dashboard Particulier (acheteur).
 *
 * ⚠️ De nombreuses pages de ce dashboard interrogeaient des tables/colonnes
 * INEXISTANTES (demandes_terrains_communaux, offers, transactions, visits,
 * candidatures_promoteurs, user_documents, messages_administratifs, parcels,
 * purchase_case_history, user_profiles...) — chaque requête échouait
 * silencieusement. Ce service centralise l'accès aux VRAIES tables.
 *
 * Table réelle -> usage :
 * - favorites (user_id, property_id) : biens favoris
 * - saved_searches (user_id, query, label) : recherches sauvegardées
 * - financial_transactions (user_id, property_id, amount, status...) : offres faites par l'acheteur
 * - purchase_cases (buyer_id, ...) : dossiers d'achat en cours (suivi)
 * - property_visits (visitor_id, property_id, status, requested_date...) : visites de terrains
 * - demandes_financement (user_id, property_id, amount, status...) : demandes de financement
 * - communal_requests (applicant_id, commune, zone, type, status...) : demandes de terrains communaux
 * - construction_requests (user_id, property_id, title, status, budget) : demandes de construction
 * - promoter_applications (candidat_id, projet, promoteur, statut...) : candidatures aux projets promoteurs
 * - messages / conversations / conversation_participants : messagerie
 * - documents (owner_id, property_id, name, type, url, status) : documents
 * - notifications (user_id, title, message, type, read) : notifications
 * - support_tickets (user_id, title, description, status, priority) : support
 * - profiles (id, full_name, email, phone, avatar_url...) : profil
 */

import { supabase } from './supabaseClient';

class ParticulierSupabaseService {
  // ===== FAVORIS =====
  async getFavorites(userId) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id, created_at, property:properties(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getFavorites:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async addFavorite(userId, propertyId) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({ user_id: userId, property_id: propertyId })
        .select()
        .single();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erreur addFavorite:', error);
      return { success: false, error: error.message };
    }
  }

  async removeFavorite(favoriteId) {
    try {
      const { error } = await supabase.from('favorites').delete().eq('id', favoriteId);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Erreur removeFavorite:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== RECHERCHES SAUVEGARDÉES =====
  async getSavedSearches(userId) {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getSavedSearches:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  // ===== OFFRES FAITES PAR L'ACHETEUR (financial_transactions) =====
  async getMyOffers(userId) {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*, property:properties(id, title, name, price, location, region)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getMyOffers:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  // ===== DOSSIERS D'ACHAT (purchase_cases) =====
  async getMyPurchaseCases(userId) {
    try {
      const { data, error } = await supabase
        .from('purchase_cases')
        .select('*, property:properties(id, title, name, location, price)')
        .eq('buyer_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getMyPurchaseCases:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async getPurchaseCaseByNumber(caseNumber, buyerId) {
    try {
      const { data, error } = await supabase
        .from('purchase_cases')
        .select('*, property:properties(*)')
        .eq('case_number', caseNumber)
        .eq('buyer_id', buyerId)
        .single();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erreur getPurchaseCaseByNumber:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== VISITES (property_visits) =====
  async getMyVisits(userId) {
    try {
      const { data, error } = await supabase
        .from('property_visits')
        .select('*, property:properties(id, title, name, city, region, surface, location), owner:profiles!property_visits_owner_id_fkey(id, full_name, phone, email)')
        .eq('visitor_id', userId)
        .order('requested_date', { ascending: false });
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getMyVisits:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async requestVisit(userId, propertyId, ownerId, requestedDate, notes = '') {
    try {
      const { data, error } = await supabase
        .from('property_visits')
        .insert({ visitor_id: userId, property_id: propertyId, owner_id: ownerId, requested_date: requestedDate, visitor_notes: notes, status: 'pending' })
        .select()
        .single();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erreur requestVisit:', error);
      return { success: false, error: error.message };
    }
  }

  async updateVisitStatus(visitId, status) {
    try {
      const { data, error } = await supabase
        .from('property_visits')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', visitId)
        .select()
        .single();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erreur updateVisitStatus:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== FINANCEMENT (demandes_financement) =====
  async getFinancingRequests(userId) {
    try {
      const { data, error } = await supabase
        .from('demandes_financement')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getFinancingRequests:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  // ===== DEMANDES TERRAINS COMMUNAUX (communal_requests) =====
  async getCommunalRequests(userId) {
    try {
      const { data, error } = await supabase
        .from('communal_requests')
        .select('*')
        .eq('applicant_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getCommunalRequests:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async createCommunalRequest(requestData) {
    try {
      const { data, error } = await supabase.from('communal_requests').insert(requestData).select().single();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erreur createCommunalRequest:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== DEMANDES DE CONSTRUCTION (construction_requests) =====
  async getConstructionRequests(userId) {
    try {
      const { data, error } = await supabase
        .from('construction_requests')
        .select('*, property:properties(id, title, name, location)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getConstructionRequests:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  // ===== CANDIDATURES PROMOTEURS (promoter_applications) =====
  async getPromoterApplications(userId) {
    try {
      const { data, error } = await supabase
        .from('promoter_applications')
        .select('*')
        .eq('candidat_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getPromoterApplications:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  // ===== MESSAGERIE (conversations / messages) =====
  async getConversations(userId) {
    try {
      const { data: participations, error: partError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId);
      if (partError) throw partError;

      const conversationIds = participations?.map(p => p.conversation_id) || [];
      if (conversationIds.length === 0) return { success: true, data: [] };

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

  // ===== DOCUMENTS =====
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

  // ===== NOTIFICATIONS =====
  async getNotifications(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur getNotifications:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async markNotificationRead(id) {
    try {
      const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Erreur markNotificationRead:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== SUPPORT =====
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

  // ===== ANALYTICS / OVERVIEW (compteurs agrégés réels) =====
  async getOverviewStats(userId) {
    try {
      const [favorites, offers, cases, visits, communal, construction, financing, unreadNotifs] = await Promise.all([
        supabase.from('favorites').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('financial_transactions').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('purchase_cases').select('id', { count: 'exact', head: true }).eq('buyer_id', userId),
        supabase.from('property_visits').select('id', { count: 'exact', head: true }).eq('visitor_id', userId),
        supabase.from('communal_requests').select('id', { count: 'exact', head: true }).eq('applicant_id', userId),
        supabase.from('construction_requests').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('demandes_financement').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('read', false)
      ]);

      return {
        success: true,
        data: {
          favorites: favorites.count || 0,
          offers: offers.count || 0,
          purchaseCases: cases.count || 0,
          visits: visits.count || 0,
          communalRequests: communal.count || 0,
          constructionRequests: construction.count || 0,
          financingRequests: financing.count || 0,
          unreadNotifications: unreadNotifs.count || 0
        }
      };
    } catch (error) {
      console.error('Erreur getOverviewStats:', error);
      return { success: false, data: null, error: error.message };
    }
  }
}

export default new ParticulierSupabaseService();

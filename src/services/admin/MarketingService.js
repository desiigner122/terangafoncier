/**
 * ========================================
 * MarketingService - Gestion Marketing & Leads
 * ========================================
 * Date: 10 Octobre 2025
 * Objectif: CRUD leads, team members, tracking events
 */

import { supabase } from '@/lib/supabaseClient';
import { logger } from '@/lib/logger';

class MarketingService {
  
  // ==================== LEADS ====================
  
  /**
   * Créer un nouveau lead (depuis formulaire contact, guide, etc.)
   * @param {Object} leadData - { full_name, email, phone, subject, message, source, category, urgency, etc. }
   * @returns {Promise<Object>}
   */
  async createLead(leadData) {
    try {
      logger.debug('🔍 [MarketingService] createLead appelé avec:', leadData);
      
      const { data, error } = await supabase
        .from('marketing_leads')
        .insert({
          full_name: leadData.full_name || leadData.name || 'Anonymous',
          email: leadData.email,
          phone: leadData.phone,
          company: leadData.company,
          source: leadData.source || 'website',
          page_url: leadData.page_url || (typeof window !== 'undefined' ? window.location.href : ''),
          referrer: leadData.referrer || (typeof document !== 'undefined' ? document.referrer : ''),
          subject: leadData.subject,
          message: leadData.message,
          category: leadData.category || null,
          urgency: leadData.urgency || 'normal',
          property_interest: leadData.property_interest,
          budget_range: leadData.budget_range,
          status: 'new',
          priority: leadData.priority || 'medium',
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          consent_marketing: leadData.consent_marketing || false,
          consent_data_processing: leadData.consent_data_processing || false
        })
        .select()
        .single();

      logger.debug('📊 [MarketingService] Résultat Supabase:', { data, error });

      if (error) throw error;

      logger.debug('✅ [MarketingService] Lead créé avec succès:', data);
      return { success: true, lead: data };
    } catch (error) {
      logger.error('❌ [MarketingService] Erreur createLead:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer tous les leads (avec filtres)
   * @param {Object} filters - { status, assigned_to, source, search, limit }
   * @returns {Promise<Array>}
   */
  async getLeads(filters = {}) {
    try {
      let query = supabase
        .from('marketing_leads')
        .select(`
          id,
          full_name,
          email,
          phone,
          company,
          source,
          page_url,
          referrer,
          subject,
          message,
          category,
          urgency,
          property_interest,
          budget_range,
          status,
          priority,
          assigned_to,
          assigned_at,
          notes,
          tags,
          created_at,
          updated_at,
          last_contacted_at
        `)
        .order('created_at', { ascending: false }).limit(500);

      // Filtrer par status
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      // Filtrer par assigné
      if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }

      // Filtrer par source
      if (filters.source) {
        query = query.eq('source', filters.source);
      }

      // Recherche dans email ou full_name
      if (filters.search) {
        query = query.or(`email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`);
      }

      // Limiter résultats
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, leads: data };
    } catch (error) {
      logger.error('Erreur getLeads:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer un lead par ID
   * @param {string} leadId
   * @returns {Promise<Object>}
   */
  async getLeadById(leadId) {
    try {
      const { data, error } = await supabase
        .from('marketing_leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (error) throw error;

      return { success: true, lead: data };
    } catch (error) {
      logger.error('Erreur getLeadById:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mettre à jour le statut d'un lead
   * @param {string} leadId
   * @param {string} status - 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
   * @returns {Promise<Object>}
   */
  async updateLeadStatus(leadId, status) {
    try {
      const updates = { status };

      // Auto-set timestamp when contacted
      if (status === 'contacted') {
        updates.last_contacted_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('marketing_leads')
        .update(updates)
        .eq('id', leadId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, lead: data };
    } catch (error) {
      logger.error('Erreur updateLeadStatus:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Assigner un lead à un team member
   * @param {string} leadId
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async assignLead(leadId, userId) {
    try {
      const { data, error } = await supabase
        .from('marketing_leads')
        .update({ assigned_to: userId })
        .eq('id', leadId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, lead: data };
    } catch (error) {
      logger.error('Erreur assignLead:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Ajouter des notes à un lead
   * @param {string} leadId
   * @param {string} notes
   * @returns {Promise<Object>}
   */
  async addNotes(leadId, notes) {
    try {
      const { data, error } = await supabase
        .from('marketing_leads')
        .update({ notes })
        .eq('id', leadId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, lead: data };
    } catch (error) {
      logger.error('Erreur addNotes:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Supprimer un lead
   * @param {string} leadId
   * @returns {Promise<Object>}
   */
  async deleteLead(leadId) {
    try {
      const { error } = await supabase
        .from('marketing_leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      logger.error('Erreur deleteLead:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Statistiques leads (par status, source, conversion rate)
   * @returns {Promise<Object>}
   */
  async getLeadsStats() {
    try {
      const { data: allLeads, error } = await supabase
        .from('marketing_leads')
        .select('status, source, created_at').limit(500);

      if (error) throw error;

      // Calculer stats
      const stats = {
        total: allLeads.length,
        by_status: {},
        by_source: {},
        conversion_rate: 0,
        response_time_avg: 0 // À implémenter
      };

      // Compter par status
      allLeads.forEach(lead => {
        stats.by_status[lead.status] = (stats.by_status[lead.status] || 0) + 1;
        stats.by_source[lead.source] = (stats.by_source[lead.source] || 0) + 1;
      });

      // Conversion rate
      const converted = allLeads.filter(l => l.status === 'converted').length;
      stats.conversion_rate = allLeads.length > 0 ? ((converted / allLeads.length) * 100).toFixed(2) : 0;

      return { success: true, stats };
    } catch (error) {
      logger.error('Erreur getLeadsStats:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== TEAM MEMBERS ====================

  /**
   * Récupérer tous les team members
   * @param {Object} filters - { active }
   * @returns {Promise<Array>}
   */
  async getTeamMembers(filters = {}) {
    try {
      let query = supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true }).limit(500);

      // Filtrer par active
      if (filters.active !== undefined) {
        query = query.eq('active', filters.active);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, members: data };
    } catch (error) {
      logger.error('Erreur getTeamMembers:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Créer un team member
   * @param {Object} memberData
   * @returns {Promise<Object>}
   */
  async createTeamMember(memberData) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert(memberData)
        .select()
        .single();

      if (error) throw error;

      return { success: true, member: data };
    } catch (error) {
      logger.error('Erreur createTeamMember:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mettre à jour un team member
   * @param {string} memberId
   * @param {Object} updates
   * @returns {Promise<Object>}
   */
  async updateTeamMember(memberId, updates) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', memberId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, member: data };
    } catch (error) {
      logger.error('Erreur updateTeamMember:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Supprimer un team member
   * @param {string} memberId
   * @returns {Promise<Object>}
   */
  async deleteTeamMember(memberId) {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      logger.error('Erreur deleteTeamMember:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== PAGE EVENTS ====================

  /**
   * Tracker un événement (page view, click, form submit)
   * @param {Object} eventData - { page, event_type, metadata, referrer, utm }
   * @returns {Promise<Object>}
   */
  async trackEvent(eventData) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      // Générer session_id si pas d'user connecté (tracking anonyme)
      const sessionId = userData?.user?.id || this.getSessionId();

      const { data, error } = await supabase
        .from('page_events')
        .insert({
          page: eventData.page,
          event_type: eventData.event_type,
          user_id: userData?.user?.id || null,
          session_id: sessionId,
          metadata: eventData.metadata || {},
          referrer: eventData.referrer || document.referrer,
          utm_source: eventData.utm?.source || null,
          utm_medium: eventData.utm?.medium || null,
          utm_campaign: eventData.utm?.campaign || null
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, event: data };
    } catch (error) {
      logger.error('Erreur trackEvent:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer événements (filtres)
   * @param {Object} filters - { page, event_type, user_id, limit }
   * @returns {Promise<Array>}
   */
  async getEvents(filters = {}) {
    try {
      let query = supabase
        .from('page_events')
        .select('*')
        .order('created_at', { ascending: false }).limit(500);

      if (filters.page) {
        query = query.eq('page', filters.page);
      }

      if (filters.event_type) {
        query = query.eq('event_type', filters.event_type);
      }

      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, events: data };
    } catch (error) {
      logger.error('Erreur getEvents:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== UTILS ====================

  /**
   * Générer ou récupérer session_id pour tracking anonyme
   * @returns {string}
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('teranga_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('teranga_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Récupérer paramètres UTM depuis URL
   * @returns {Object}
   */
  getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('utm_source'),
      medium: params.get('utm_medium'),
      campaign: params.get('utm_campaign'),
      term: params.get('utm_term'),
      content: params.get('utm_content')
    };
  }
}

export default new MarketingService();

/**
 * ========================================
 * AnalyticsService - Analytics & Page Tracking
 * ========================================
 * Date: 10 Octobre 2025
 * Objectif: Page views, analytics, conversion tracking
 */

import { supabase } from '@/lib/supabaseClient';

class AnalyticsService {
  
  // ==================== PAGE VIEWS ====================
  
  /**
   * Tracker une page view
   * @param {Object} viewData - { page, referrer, utm, device_type, browser, geo }
   * @returns {Promise<Object>}
   */
  async trackPageView(viewData) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      // Générer session_id si pas d'user connecté
      const sessionId = userData?.user?.id || this.getSessionId();

      const { data, error } = await supabase
        .from('page_views')
        .insert({
          page: viewData.page,
          user_id: userData?.user?.id || null,
          session_id: sessionId,
          referrer: viewData.referrer || document.referrer,
          utm_source: viewData.utm?.source || null,
          utm_medium: viewData.utm?.medium || null,
          utm_campaign: viewData.utm?.campaign || null,
          device_type: viewData.device_type || this.getDeviceType(),
          browser: viewData.browser || this.getBrowser(),
          country: viewData.country || null,
          region: viewData.region || null,
          city: viewData.city || null,
          duration_seconds: 0 // Sera mis à jour à la sortie
        })
        .select()
        .single();

      if (error) throw error;

      // Stocker view_id pour update ultérieur (durée)
      sessionStorage.setItem('current_page_view_id', data.id);
      sessionStorage.setItem('page_view_start_time', Date.now().toString());

      return { success: true, view: data };
    } catch (error) {
      console.error('Erreur trackPageView:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mettre à jour la durée d'une page view (appelé au unload)
   * @returns {Promise<void>}
   */
  async updatePageViewDuration() {
    try {
      const viewId = sessionStorage.getItem('current_page_view_id');
      const startTime = sessionStorage.getItem('page_view_start_time');

      if (!viewId || !startTime) return;

      const durationSeconds = Math.floor((Date.now() - parseInt(startTime)) / 1000);

      await supabase
        .from('page_views')
        .update({ duration_seconds: durationSeconds })
        .eq('id', viewId);

      // Nettoyer storage
      sessionStorage.removeItem('current_page_view_id');
      sessionStorage.removeItem('page_view_start_time');
    } catch (error) {
      console.error('Erreur updatePageViewDuration:', error);
    }
  }

  /**
   * Récupérer page views (avec filtres)
   * @param {Object} filters - { page, user_id, utm_campaign, date_from, date_to, limit }
   * @returns {Promise<Array>}
   */
  async getPageViews(filters = {}) {
    try {
      let query = supabase
        .from('page_views')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.page) {
        query = query.eq('page', filters.page);
      }

      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }

      if (filters.utm_campaign) {
        query = query.eq('utm_campaign', filters.utm_campaign);
      }

      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }

      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, views: data };
    } catch (error) {
      console.error('Erreur getPageViews:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== ANALYTICS GLOBALES ====================

  /**
   * Récupérer analytics globales (dashboard overview)
   * @param {Object} options - { period: '7d' | '30d' | '90d' | 'all' }
   * @returns {Promise<Object>}
   */
  async getGlobalAnalytics(options = { period: '30d' }) {
    try {
      // Calculer date de début selon période
      const dateFrom = this.getDateFrom(options.period);

      // Total page views
      const { count: totalViews, error: viewsError } = await supabase
        .from('page_views')
  .select('id', { count: 'exact' }).limit(0)
        .gte('created_at', dateFrom);

      if (viewsError) throw viewsError;

      // Unique visitors (sessions)
      const { data: sessions, error: sessionsError } = await supabase
        .from('page_views')
        .select('session_id')
        .gte('created_at', dateFrom);

      if (sessionsError) throw sessionsError;

      const uniqueVisitors = [...new Set(sessions.map(s => s.session_id))].length;

      // Top pages
      const { data: topPages, error: topPagesError } = await supabase
        .from('page_views')
        .select('page')
        .gte('created_at', dateFrom);

      if (topPagesError) throw topPagesError;

      const topPagesCount = this.countByField(topPages, 'page');

      // Trafic par source (referrer)
      const { data: sources, error: sourcesError } = await supabase
        .from('page_views')
        .select('referrer, utm_source, utm_medium')
        .gte('created_at', dateFrom);

      if (sourcesError) throw sourcesError;

      const trafficSources = this.groupTrafficSources(sources);

      // Devices
      const { data: devices, error: devicesError } = await supabase
        .from('page_views')
        .select('device_type')
        .gte('created_at', dateFrom);

      if (devicesError) throw devicesError;

      const deviceBreakdown = this.countByField(devices, 'device_type');

      // Durée moyenne session
      const { data: durations, error: durationsError } = await supabase
        .from('page_views')
        .select('duration_seconds')
        .gte('created_at', dateFrom)
        .gt('duration_seconds', 0);

      if (durationsError) throw durationsError;

      const avgDuration = durations.length > 0
        ? durations.reduce((sum, d) => sum + d.duration_seconds, 0) / durations.length
        : 0;

      return {
        success: true,
        analytics: {
          total_page_views: totalViews || 0,
          unique_visitors: uniqueVisitors,
          top_pages: topPagesCount.slice(0, 10),
          traffic_sources: trafficSources,
          device_breakdown: deviceBreakdown,
          avg_session_duration: Math.round(avgDuration),
          period: options.period
        }
      };
    } catch (error) {
      console.error('Erreur getGlobalAnalytics:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer analytics par page spécifique
   * @param {string} page - Ex: "/solutions/notaires"
   * @param {Object} options - { period }
   * @returns {Promise<Object>}
   */
  async getPageAnalytics(page, options = { period: '30d' }) {
    try {
      const dateFrom = this.getDateFrom(options.period);

      // Total views pour cette page
      const { count: totalViews, error: viewsError } = await supabase
        .from('page_views')
  .select('id', { count: 'exact' }).limit(0)
        .eq('page', page)
        .gte('created_at', dateFrom);

      if (viewsError) throw viewsError;

      // Unique visitors pour cette page
      const { data: sessions, error: sessionsError } = await supabase
        .from('page_views')
        .select('session_id')
        .eq('page', page)
        .gte('created_at', dateFrom);

      if (sessionsError) throw sessionsError;

      const uniqueVisitors = [...new Set(sessions.map(s => s.session_id))].length;

      // Durée moyenne sur cette page
      const { data: durations, error: durationsError } = await supabase
        .from('page_views')
        .select('duration_seconds')
        .eq('page', page)
        .gte('created_at', dateFrom)
        .gt('duration_seconds', 0);

      if (durationsError) throw durationsError;

      const avgDuration = durations.length > 0
        ? durations.reduce((sum, d) => sum + d.duration_seconds, 0) / durations.length
        : 0;

      // Bounce rate (approximation: session avec 1 seule page view)
      // TODO: Implémenter bounce rate propre

      return {
        success: true,
        analytics: {
          page: page,
          total_views: totalViews || 0,
          unique_visitors: uniqueVisitors,
          avg_duration: Math.round(avgDuration),
          period: options.period
        }
      };
    } catch (error) {
      console.error('Erreur getPageAnalytics:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer analytics de conversion (leads générés)
   * @param {Object} options - { period }
   * @returns {Promise<Object>}
   */
  async getConversionAnalytics(options = { period: '30d' }) {
    try {
      const dateFrom = this.getDateFrom(options.period);

      // Total leads générés
      const { count: totalLeads, error: leadsError } = await supabase
        .from('marketing_leads')
  .select('id', { count: 'exact' }).limit(0)
        .gte('created_at', dateFrom);

      if (leadsError) throw leadsError;

      // Leads par source
      const { data: leadsBySource, error: sourcesError } = await supabase
        .from('marketing_leads')
        .select('source')
        .gte('created_at', dateFrom);

      if (sourcesError) throw sourcesError;

      const leadsSourceBreakdown = this.countByField(leadsBySource, 'source');

      // Conversion rate (leads / unique visitors)
      const { data: sessions, error: sessionsError } = await supabase
        .from('page_views')
        .select('session_id')
        .gte('created_at', dateFrom);

      if (sessionsError) throw sessionsError;

      const uniqueVisitors = [...new Set(sessions.map(s => s.session_id))].length;
      const conversionRate = uniqueVisitors > 0
        ? ((totalLeads / uniqueVisitors) * 100).toFixed(2)
        : 0;

      return {
        success: true,
        analytics: {
          total_leads: totalLeads || 0,
          leads_by_source: leadsSourceBreakdown,
          conversion_rate: parseFloat(conversionRate),
          unique_visitors: uniqueVisitors,
          period: options.period
        }
      };
    } catch (error) {
      console.error('Erreur getConversionAnalytics:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== UTILS ====================

  /**
   * Calculer date de début selon période
   * @param {string} period - '7d' | '30d' | '90d' | 'all'
   * @returns {string}
   */
  getDateFrom(period) {
    const now = new Date();
    let daysAgo = 30; // Par défaut 30 jours

    switch (period) {
      case '7d':
        daysAgo = 7;
        break;
      case '30d':
        daysAgo = 30;
        break;
      case '90d':
        daysAgo = 90;
        break;
      case 'all':
        return '1970-01-01'; // Début de l'epoch
    }

    const dateFrom = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return dateFrom.toISOString();
  }

  /**
   * Compter occurrences par champ
   * @param {Array} data
   * @param {string} field
   * @returns {Array}
   */
  countByField(data, field) {
    const counts = {};
    data.forEach(item => {
      const value = item[field] || 'Unknown';
      counts[value] = (counts[value] || 0) + 1;
    });

    // Convertir en array et trier par count
    return Object.entries(counts)
      .map(([key, value]) => ({ name: key, count: value }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Grouper sources de trafic
   * @param {Array} data
   * @returns {Object}
   */
  groupTrafficSources(data) {
    const sources = {
      direct: 0,
      search: 0,
      social: 0,
      referral: 0,
      campaign: 0
    };

    data.forEach(item => {
      if (item.utm_campaign) {
        sources.campaign++;
      } else if (!item.referrer || item.referrer === '') {
        sources.direct++;
      } else if (item.referrer.includes('google') || item.referrer.includes('bing')) {
        sources.search++;
      } else if (item.referrer.includes('facebook') || item.referrer.includes('twitter') || item.referrer.includes('linkedin')) {
        sources.social++;
      } else {
        sources.referral++;
      }
    });

    return sources;
  }

  /**
   * Générer ou récupérer session_id
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
   * Détecter type de device
   * @returns {string}
   */
  getDeviceType() {
    const userAgent = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  /**
   * Détecter navigateur
   * @returns {string}
   */
  getBrowser() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown';
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

export default new AnalyticsService();

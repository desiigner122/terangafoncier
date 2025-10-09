/**
 * SYSTÈME DE MONITORING & ANALYTICS
 * Suivi des performances, erreurs et usage de la plateforme
 * 
 * Features:
 * - Tracking des erreurs
 * - Métriques de performance
 * - Analytics utilisateur
 * - Alertes en temps réel
 */

class MonitoringService {
  constructor() {
    this.metrics = {
      pageViews: new Map(),
      apiCalls: new Map(),
      errors: [],
      performance: []
    };
    
    this.initializeMonitoring();
  }

  /**
   * Initialiser le monitoring
   */
  initializeMonitoring() {
    // 1. Performance Observer pour mesurer les temps de chargement
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        const perfObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.trackPerformance(entry);
          }
        });
        
        perfObserver.observe({ 
          entryTypes: ['navigation', 'resource', 'measure'] 
        });
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    }

    // 2. Error tracking global
    window.addEventListener('error', (event) => {
      this.trackError({
        type: 'JavaScript Error',
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString()
      });
    });

    // 3. Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        type: 'Unhandled Promise Rejection',
        message: event.reason?.message || event.reason,
        stack: event.reason?.stack,
        timestamp: new Date().toISOString()
      });
    });

    // 4. Network errors tracking
    this.interceptFetch();
  }

  /**
   * Intercepter les appels fetch pour monitoring
   */
  interceptFetch() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0];
      
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        
        this.trackAPICall({
          url,
          method: args[1]?.method || 'GET',
          status: response.status,
          duration,
          success: response.ok,
          timestamp: new Date().toISOString()
        });
        
        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        
        this.trackAPICall({
          url,
          method: args[1]?.method || 'GET',
          status: 0,
          duration,
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        
        throw error;
      }
    };
  }

  /**
   * Tracker une page vue
   */
  trackPageView(page, metadata = {}) {
    const count = this.metrics.pageViews.get(page) || 0;
    this.metrics.pageViews.set(page, count + 1);
    
    // Envoyer à Supabase pour analytics
    this.sendToAnalytics('page_view', {
      page,
      ...metadata,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Tracker une erreur
   */
  trackError(errorData) {
    this.metrics.errors.push(errorData);
    
    // Limiter le stockage à 100 erreurs
    if (this.metrics.errors.length > 100) {
      this.metrics.errors.shift();
    }
    
    // Log en console en dev
    if (import.meta.env.DEV) {
      console.error('Monitored Error:', errorData);
    }
    
    // Envoyer à Supabase
    this.sendToAnalytics('error', errorData);
    
    // Alertes pour erreurs critiques
    if (this.isCriticalError(errorData)) {
      this.sendAlert('critical_error', errorData);
    }
  }

  /**
   * Tracker les performances
   */
  trackPerformance(entry) {
    const perfData = {
      name: entry.name,
      type: entry.entryType,
      duration: entry.duration,
      startTime: entry.startTime,
      timestamp: new Date().toISOString()
    };
    
    this.metrics.performance.push(perfData);
    
    // Limiter le stockage
    if (this.metrics.performance.length > 200) {
      this.metrics.performance.shift();
    }
    
    // Alertes si temps trop long
    if (entry.duration > 3000) { // Plus de 3 secondes
      this.sendAlert('slow_performance', perfData);
    }
  }

  /**
   * Tracker un appel API
   */
  trackAPICall(callData) {
    const key = `${callData.method}:${callData.url}`;
    const calls = this.metrics.apiCalls.get(key) || [];
    calls.push(callData);
    this.metrics.apiCalls.set(key, calls);
    
    // Garder seulement les 50 derniers appels par endpoint
    if (calls.length > 50) {
      calls.shift();
    }
    
    // Envoyer à analytics
    this.sendToAnalytics('api_call', callData);
    
    // Alertes si trop lent ou erreur
    if (callData.duration > 5000 || !callData.success) {
      this.sendAlert('api_issue', callData);
    }
  }

  /**
   * Tracker un événement utilisateur
   */
  trackEvent(eventName, eventData = {}) {
    this.sendToAnalytics('user_event', {
      event: eventName,
      ...eventData,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Vérifier si une erreur est critique
   */
  isCriticalError(error) {
    const criticalKeywords = [
      'supabase',
      'authentication',
      'payment',
      'database',
      'unauthorized'
    ];
    
    const errorText = (error.message || '').toLowerCase();
    return criticalKeywords.some(keyword => errorText.includes(keyword));
  }

  /**
   * Envoyer les données à Supabase Analytics
   */
  async sendToAnalytics(eventType, data) {
    try {
      // Import dynamique pour éviter les dépendances circulaires
      const { supabase } = await import('../services/supabaseClient.js');
      
      await supabase.from('analytics_events').insert({
        event_type: eventType,
        event_data: data,
        user_id: this.getCurrentUserId(),
        user_agent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      // Fail silently pour ne pas casser l'app
      console.warn('Analytics insert failed:', error);
    }
  }

  /**
   * Envoyer une alerte
   */
  async sendAlert(alertType, alertData) {
    try {
      const { supabase } = await import('../services/supabaseClient.js');
      
      await supabase.from('system_alerts').insert({
        alert_type: alertType,
        alert_data: alertData,
        severity: this.getAlertSeverity(alertType),
        created_at: new Date().toISOString()
      });
      
      // En dev, log aussi en console
      if (import.meta.env.DEV) {
        console.warn(`🚨 Alert [${alertType}]:`, alertData);
      }
    } catch (error) {
      console.error('Failed to send alert:', error);
    }
  }

  /**
   * Obtenir la sévérité d'une alerte
   */
  getAlertSeverity(alertType) {
    const severityMap = {
      critical_error: 'critical',
      api_issue: 'high',
      slow_performance: 'medium',
      high_error_rate: 'high'
    };
    return severityMap[alertType] || 'low';
  }

  /**
   * Obtenir l'ID utilisateur actuel
   */
  getCurrentUserId() {
    try {
      // Essayer de récupérer depuis le contexte auth
      const authData = localStorage.getItem('supabase.auth.token');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed?.currentSession?.user?.id || null;
      }
    } catch {
      return null;
    }
    return null;
  }

  /**
   * Obtenir les métriques actuelles
   */
  getMetrics() {
    return {
      pageViews: Object.fromEntries(this.metrics.pageViews),
      apiCalls: this.getAPISummary(),
      errors: this.getErrorSummary(),
      performance: this.getPerformanceSummary()
    };
  }

  /**
   * Résumé des appels API
   */
  getAPISummary() {
    const summary = {};
    
    for (const [endpoint, calls] of this.metrics.apiCalls) {
      const successful = calls.filter(c => c.success).length;
      const failed = calls.filter(c => !c.success).length;
      const avgDuration = calls.reduce((sum, c) => sum + c.duration, 0) / calls.length;
      
      summary[endpoint] = {
        total: calls.length,
        successful,
        failed,
        avgDuration: Math.round(avgDuration),
        successRate: Math.round((successful / calls.length) * 100)
      };
    }
    
    return summary;
  }

  /**
   * Résumé des erreurs
   */
  getErrorSummary() {
    const errors = this.metrics.errors;
    const last24h = errors.filter(e => {
      const errorTime = new Date(e.timestamp);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return errorTime > dayAgo;
    });
    
    return {
      total: errors.length,
      last24h: last24h.length,
      byType: this.groupBy(errors, 'type')
    };
  }

  /**
   * Résumé des performances
   */
  getPerformanceSummary() {
    const perf = this.metrics.performance;
    
    if (perf.length === 0) {
      return { avgLoadTime: 0, slowPages: [] };
    }
    
    const avgLoadTime = perf.reduce((sum, p) => sum + p.duration, 0) / perf.length;
    const slowPages = perf
      .filter(p => p.duration > 3000)
      .map(p => ({ name: p.name, duration: p.duration }));
    
    return {
      avgLoadTime: Math.round(avgLoadTime),
      slowPages
    };
  }

  /**
   * Grouper par clé
   */
  groupBy(array, key) {
    return array.reduce((result, item) => {
      const group = item[key];
      result[group] = (result[group] || 0) + 1;
      return result;
    }, {});
  }

  /**
   * Afficher le dashboard de monitoring
   */
  showDashboard() {
    const metrics = this.getMetrics();
    
    console.group('📊 MONITORING DASHBOARD');
    console.log('📄 Page Views:', metrics.pageViews);
    console.log('🌐 API Calls:', metrics.apiCalls);
    console.log('❌ Errors:', metrics.errors);
    console.log('⚡ Performance:', metrics.performance);
    console.groupEnd();
    
    return metrics;
  }

  /**
   * Nettoyer les anciennes données
   */
  cleanup() {
    const cutoffTime = Date.now() - 24 * 60 * 60 * 1000; // 24h
    
    // Nettoyer les erreurs
    this.metrics.errors = this.metrics.errors.filter(e => {
      const errorTime = new Date(e.timestamp).getTime();
      return errorTime > cutoffTime;
    });
    
    // Nettoyer les performances
    this.metrics.performance = this.metrics.performance.filter(p => {
      const perfTime = new Date(p.timestamp).getTime();
      return perfTime > cutoffTime;
    });
  }
}

// Export singleton
const monitoringService = new MonitoringService();

// Nettoyage périodique (toutes les heures)
setInterval(() => monitoringService.cleanup(), 60 * 60 * 1000);

export default monitoringService;

// Exposer en mode dev
if (import.meta.env.DEV) {
  window.__monitoring = monitoringService;
  console.log('💡 Monitoring disponible: window.__monitoring.showDashboard()');
}

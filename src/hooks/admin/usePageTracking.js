/**
 * ========================================
 * usePageTracking - Hook pour tracking automatique
 * ========================================
 * Date: 10 Octobre 2025
 * Utilise: AnalyticsService
 * Auto-track page views + événements
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AnalyticsService from '@/services/admin/AnalyticsService';

export function usePageTracking() {
  const location = useLocation();
  const pageViewTracked = useRef(false);

  /**
   * Tracker page view automatiquement au montage/changement de route
   */
  useEffect(() => {
    // Éviter double tracking (React StrictMode)
    if (pageViewTracked.current) {
      pageViewTracked.current = false;
      return;
    }

    const trackView = async () => {
      const page = location.pathname;
      const utm = AnalyticsService.getUTMParams();

      await AnalyticsService.trackPageView({
        page,
        utm,
        referrer: document.referrer
      });

      pageViewTracked.current = true;
    };

    trackView();

    // Mettre à jour durée au unload
    const handleBeforeUnload = () => {
      AnalyticsService.updatePageViewDuration();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Update duration on unmount aussi
      AnalyticsService.updatePageViewDuration();
    };
  }, [location.pathname]);

  /**
   * Tracker un click sur CTA
   */
  const trackCTAClick = useCallback(async (ctaLabel) => {
    const page = location.pathname;
    
    await AnalyticsService.trackPageView({
      page,
      event_type: 'cta_click',
      metadata: { cta_label: ctaLabel }
    });
  }, [location.pathname]);

  /**
   * Tracker une soumission de formulaire
   */
  const trackFormSubmit = useCallback(async (formName, formData = {}) => {
    const page = location.pathname;
    
    await AnalyticsService.trackPageView({
      page,
      event_type: 'form_submit',
      metadata: {
        form_name: formName,
        ...formData
      }
    });
  }, [location.pathname]);

  /**
   * Tracker un événement custom
   */
  const trackCustomEvent = useCallback(async (eventName, metadata = {}) => {
    const page = location.pathname;
    
    await AnalyticsService.trackPageView({
      page,
      event_type: eventName,
      metadata
    });
  }, [location.pathname]);

  return {
    trackCTAClick,
    trackFormSubmit,
    trackCustomEvent
  };
}

/**
 * Hook pour récupérer analytics (admin)
 */
export function useAnalytics(options = {}) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Charger analytics globales
   */
  const loadGlobalAnalytics = useCallback(async (period = '30d') => {
    setLoading(true);
    setError(null);
    
    const result = await AnalyticsService.getGlobalAnalytics({ period });
    
    if (result.success) {
      setAnalytics(result.analytics);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  /**
   * Charger analytics d'une page spécifique
   */
  const loadPageAnalytics = useCallback(async (page, period = '30d') => {
    setLoading(true);
    setError(null);
    
    const result = await AnalyticsService.getPageAnalytics(page, { period });
    
    if (result.success) {
      setAnalytics(result.analytics);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  /**
   * Charger analytics de conversion
   */
  const loadConversionAnalytics = useCallback(async (period = '30d') => {
    setLoading(true);
    setError(null);
    
    const result = await AnalyticsService.getConversionAnalytics({ period });
    
    if (result.success) {
      setAnalytics(result.analytics);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  /**
   * Charger page views brutes
   */
  const loadPageViews = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    const result = await AnalyticsService.getPageViews(filters);
    
    setLoading(false);
    return result;
  }, []);

  // Auto-charger analytics au montage si option
  useEffect(() => {
    if (options.autoLoad) {
      loadGlobalAnalytics(options.period || '30d');
    }
  }, [options.autoLoad, options.period, loadGlobalAnalytics]);

  return {
    analytics,
    loading,
    error,
    loadGlobalAnalytics,
    loadPageAnalytics,
    loadConversionAnalytics,
    loadPageViews
  };
}

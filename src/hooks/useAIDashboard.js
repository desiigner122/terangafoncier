/**
 * 🎯 HOOK PERSONNALISÉ - IA DASHBOARD UNIVERSAL
 * ==========================================
 * 
 * Hook React pour intégrer facilement l'IA dans tous les dashboards
 */

import { useState, useEffect } from 'react';
import { terangaAI } from '../services/TerangaAIService';
import { dashboardAI } from '../services/DashboardAIIntegrator';

/**
 * Hook personnalisé pour l'intégration IA dans les dashboards
 * @param {string} dashboardType - Type de dashboard (PARTICULIER, AGENT, etc.)
 * @param {object} contextData - Données contextuelles du dashboard
 * @returns {object} État et fonctions IA
 */
export const useAIDashboard = (dashboardType, contextData = {}) => {
  const [aiMetrics, setAiMetrics] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState(null);
  const [quickEstimate, setQuickEstimate] = useState(null);
  const [marketInsights, setMarketInsights] = useState(null);

  // Initialisation et chargement des métriques IA
  useEffect(() => {
    const loadAIData = async () => {
      setAiLoading(true);
      setAiError(null);

      try {
        // Initialisation des services IA
        await terangaAI.initialize();
        await dashboardAI.initialize();

        // Chargement des métriques spécialisées
        const metrics = await dashboardAI.getSpecializedMetrics(dashboardType, contextData);
        setAiMetrics(metrics);

        // Chargement des insights marché
        const insights = await terangaAI.getMarketInsights('Dakar');
        setMarketInsights(insights);

      } catch (error) {
        console.error('Erreur chargement données IA:', error);
        setAiError(error.message);
      } finally {
        setAiLoading(false);
      }
    };

    loadAIData();
  }, [dashboardType, JSON.stringify(contextData)]);

  /**
   * Obtenir une estimation rapide
   */
  const getQuickEstimate = async (location, type, surface) => {
    try {
      const estimate = await terangaAI.getQuickEstimate(location, type, surface);
      setQuickEstimate(estimate);
      return estimate;
    } catch (error) {
      console.error('Erreur estimation rapide:', error);
      setAiError(error.message);
      return null;
    }
  };

  /**
   * Obtenir une évaluation complète
   */
  const getFullEvaluation = async (propertyData) => {
    try {
      return await terangaAI.evaluateProperty(propertyData);
    } catch (error) {
      console.error('Erreur évaluation complète:', error);
      setAiError(error.message);
      return null;
    }
  };

  /**
   * Générer des recommandations personnalisées
   */
  const getPersonalizedRecommendations = () => {
    if (!aiMetrics) return [];

    const recommendations = [];

    // Recommandations selon le type de dashboard
    switch (dashboardType.toUpperCase()) {
      case 'PARTICULIER':
        if (aiMetrics.zones_accessibles?.length > 0) {
          recommendations.push({
            type: 'budget',
            title: 'Zones dans votre budget',
            message: `${aiMetrics.zones_accessibles.length} zones correspondent à votre budget`,
            action: 'Voir les zones',
            priority: 'high'
          });
        }
        break;

      case 'AGENT':
        if (aiMetrics.mandats_valorisation?.commission_potentielle > 0) {
          recommendations.push({
            type: 'commission',
            title: 'Potentiel de commission',
            message: `${Math.round(aiMetrics.mandats_valorisation.commission_potentielle / 1000000)}M FCFA de commissions potentielles`,
            action: 'Optimiser',
            priority: 'high'
          });
        }
        break;

      case 'PROMOTEUR':
        if (aiMetrics.zones_expansion?.length > 0) {
          recommendations.push({
            type: 'expansion',
            title: 'Zones d\'expansion',
            message: `${aiMetrics.zones_expansion.length} zones d'expansion identifiées`,
            action: 'Explorer',
            priority: 'medium'
          });
        }
        break;

      case 'BANQUE':
        if (aiMetrics.risque_portefeuille) {
          recommendations.push({
            type: 'risque',
            title: 'Gestion des risques',
            message: 'Analyse de portefeuille disponible',
            action: 'Analyser',
            priority: 'high'
          });
        }
        break;
    }

    return recommendations;
  };

  /**
   * Obtenir les widgets IA configurés
   */
  const getAIWidgets = () => {
    return dashboardAI.generateAIWidgets(dashboardType);
  };

  /**
   * Calculer le score IA global du dashboard
   */
  const getAIScore = () => {
    if (!aiMetrics) return { score: 0, level: 'Initialisation' };

    let score = 50; // Score de base

    // Ajustements selon les données disponibles
    if (quickEstimate) score += 20;
    if (marketInsights) score += 15;
    if (aiMetrics.score_investissement) score += 15;

    const level = score >= 80 ? 'Excellent' : 
                  score >= 60 ? 'Bon' : 
                  score >= 40 ? 'Moyen' : 'Faible';

    return { score, level };
  };

  /**
   * Obtenir les KPIs IA
   */
  const getAIKPIs = () => {
    if (!aiMetrics || !marketInsights) return [];

    const kpis = [];

    // KPI universels
    kpis.push({
      label: 'Précision IA',
      value: '88%',
      trend: '+2%',
      color: 'green'
    });

    kpis.push({
      label: 'Données marché',
      value: Object.keys(marketInsights.zones).length,
      trend: 'zones',
      color: 'blue'
    });

    kpis.push({
      label: 'Croissance marché',
      value: `${(marketInsights.tendances_generales.croissance_annuelle * 100).toFixed(1)}%`,
      trend: 'annuelle',
      color: 'purple'
    });

    return kpis;
  };

  return {
    // État
    aiMetrics,
    aiLoading,
    aiError,
    quickEstimate,
    marketInsights,
    
    // Fonctions
    getQuickEstimate,
    getFullEvaluation,
    getPersonalizedRecommendations,
    getAIWidgets,
    getAIScore,
    getAIKPIs,
    
    // Status
    isReady: !aiLoading && !aiError,
    hasData: !!aiMetrics && !!marketInsights
  };
};

export default useAIDashboard;

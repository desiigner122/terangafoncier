/**
 * Gestionnaire d'Intelligence Artificielle pour Teranga Foncier
 * Intégration avec OpenAI GPT et services d'analytics avancés
 */

import { supabase } from './customSupabaseClient';

class AIManager {
  constructor() {
    this.apiKey = process.env.VITE_OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    this.model = 'gpt-4';
    this.isEnabled = Boolean(this.apiKey);
  }

  /**
   * Analyse prédictive des tendances utilisateurs
   */
  async predictUserTrends(userData) {
    if (!this.isEnabled) {
      return this.getMockPredictions();
    }

    try {
      const prompt = `
        Analyse ces données utilisateurs immobiliers au Sénégal et fournis des prédictions:
        ${JSON.stringify(userData)}
        
        Réponds en JSON avec:
        - growth_prediction: pourcentage de croissance prévu
        - peak_periods: périodes de pic d'activité
        - market_insights: insights sur le marché
        - recommendations: recommandations stratégiques
      `;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: 'Tu es un expert en analyse de données immobilières au Sénégal.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3
        })
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Erreur IA prédiction:', error);
      return this.getMockPredictions();
    }
  }

  /**
   * Analyse des anomalies dans les données
   */
  async detectAnomalies(metrics) {
    if (!this.isEnabled) {
      return this.getMockAnomalies();
    }

    try {
      const prompt = `
        Détecte les anomalies dans ces métriques immobilières:
        ${JSON.stringify(metrics)}
        
        Identifie:
        - anomalies_detected: liste des anomalies
        - severity: niveau de gravité (low/medium/high)
        - explanation: explication de chaque anomalie
        - suggested_actions: actions correctives
      `;

      const response = await this.callOpenAI(prompt, 'Tu es un expert en détection d\'anomalies pour plateformes immobilières.');
      return response;
    } catch (error) {
      console.error('Erreur détection anomalies:', error);
      return this.getMockAnomalies();
    }
  }

  /**
   * Génération de rapports intelligents
   */
  async generateIntelligentReport(data) {
    if (!this.isEnabled) {
      return this.getMockReport();
    }

    try {
      const prompt = `
        Génère un rapport intelligent pour cette plateforme immobilière sénégalaise:
        ${JSON.stringify(data)}
        
        Structure:
        - executive_summary: résumé exécutif
        - key_findings: découvertes clés
        - regional_analysis: analyse par région
        - recommendations: recommandations
        - action_plan: plan d'action
      `;

      const response = await this.callOpenAI(prompt, 'Tu es un consultant en business intelligence immobilier.');
      return response;
    } catch (error) {
      console.error('Erreur génération rapport:', error);
      return this.getMockReport();
    }
  }

  /**
   * Optimisation des prix basée sur l'IA
   */
  async optimizePricing(propertyData) {
    if (!this.isEnabled) {
      return this.getMockPricingOptimization();
    }

    try {
      const prompt = `
        Optimise les prix pour ces propriétés au Sénégal:
        ${JSON.stringify(propertyData)}
        
        Considère:
        - Localisation (région, proximité services)
        - Type de propriété
        - Marché local
        - Tendances saisonnières
        
        Fournis:
        - suggested_price: prix suggéré
        - price_range: fourchette de prix
        - market_position: positionnement marché
        - confidence_score: score de confiance
      `;

      const response = await this.callOpenAI(prompt, 'Tu es un expert en évaluation immobilière au Sénégal.');
      return response;
    } catch (error) {
      console.error('Erreur optimisation prix:', error);
      return this.getMockPricingOptimization();
    }
  }

  /**
   * Analyse de sentiment des utilisateurs
   */
  async analyzeSentiment(userFeedback) {
    if (!this.isEnabled) {
      return this.getMockSentimentAnalysis();
    }

    try {
      const prompt = `
        Analyse le sentiment de ces retours utilisateurs:
        ${JSON.stringify(userFeedback)}
        
        Fournis:
        - overall_sentiment: sentiment global (positive/neutral/negative)
        - sentiment_score: score de -1 à 1
        - key_themes: thèmes principaux
        - improvement_areas: zones d'amélioration
        - positive_highlights: points positifs
      `;

      const response = await this.callOpenAI(prompt, 'Tu es un expert en analyse de sentiment.');
      return response;
    } catch (error) {
      console.error('Erreur analyse sentiment:', error);
      return this.getMockSentimentAnalysis();
    }
  }

  /**
   * Recommandations personnalisées pour utilisateurs
   */
  async generatePersonalizedRecommendations(userProfile, propertyPreferences) {
    if (!this.isEnabled) {
      return this.getMockRecommendations();
    }

    try {
      const prompt = `
        Génère des recommandations personnalisées pour cet utilisateur:
        Profil: ${JSON.stringify(userProfile)}
        Préférences: ${JSON.stringify(propertyPreferences)}
        
        Recommande:
        - properties: propriétés suggérées
        - search_tips: conseils de recherche
        - market_alerts: alertes marché
        - investment_opportunities: opportunités d'investissement
      `;

      const response = await this.callOpenAI(prompt, 'Tu es un conseiller immobilier IA spécialisé au Sénégal.');
      return response;
    } catch (error) {
      console.error('Erreur recommandations:', error);
      return this.getMockRecommendations();
    }
  }

  /**
   * Appel générique à OpenAI
   */
  async callOpenAI(prompt, systemMessage) {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  /**
   * Enregistrement des interactions IA pour audit
   */
  async logAIInteraction(type, input, output, userId = null) {
    try {
      await supabase.from('ai_interactions').insert({
        interaction_type: type,
        input_data: input,
        output_data: output,
        user_id: userId,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur log IA:', error);
    }
  }

  /**
   * Données mock pour les tests (quand l'API n'est pas disponible)
   */
  getMockPredictions() {
    return {
      growth_prediction: '+23%',
      peak_periods: ['Décembre-Janvier', 'Juillet-Août'],
      market_insights: [
        'Forte demande dans la région de Dakar',
        'Croissance du marché résidentiel',
        'Opportunités dans l\'immobilier commercial'
      ],
      recommendations: [
        'Intensifier le marketing en décembre',
        'Développer l\'offre à Thiès et Saint-Louis',
        'Améliorer l\'expérience mobile'
      ]
    };
  }

  getMockAnomalies() {
    return {
      anomalies_detected: [
        {
          metric: 'conversion_rate',
          current: '2.1%',
          expected: '3.2%',
          severity: 'medium'
        }
      ],
      explanations: [
        'Baisse inhabituelle du taux de conversion en France'
      ],
      suggested_actions: [
        'Vérifier les pages de conversion',
        'Analyser le parcours utilisateur'
      ]
    };
  }

  getMockReport() {
    return {
      executive_summary: 'Croissance solide de 23% avec opportunités d\'expansion.',
      key_findings: [
        'Marché sénégalais en forte croissance',
        'Demande élevée pour le résidentiel',
        'Potentiel inexploité en régions'
      ],
      regional_analysis: {
        dakar: { growth: '+35%', potential: 'high' },
        thies: { growth: '+18%', potential: 'medium' },
        saint_louis: { growth: '+12%', potential: 'high' }
      },
      recommendations: [
        'Expansion géographique',
        'Amélioration UX mobile',
        'Partenariats locaux'
      ]
    };
  }

  getMockPricingOptimization() {
    return {
      suggested_price: 75000000,
      price_range: { min: 65000000, max: 85000000 },
      market_position: 'competitive',
      confidence_score: 0.87
    };
  }

  getMockSentimentAnalysis() {
    return {
      overall_sentiment: 'positive',
      sentiment_score: 0.72,
      key_themes: ['Facilité d\'utilisation', 'Service client', 'Prix'],
      improvement_areas: ['Temps de réponse', 'Photos des biens'],
      positive_highlights: ['Interface intuitive', 'Support réactif']
    };
  }

  getMockRecommendations() {
    return {
      properties: [
        { id: 1, match_score: 0.94, reason: 'Correspond parfaitement à vos critères' },
        { id: 2, match_score: 0.87, reason: 'Bon rapport qualité-prix' }
      ],
      search_tips: [
        'Élargissez votre zone de recherche',
        'Considérez les biens récemment rénovés'
      ],
      market_alerts: [
        'Baisse des prix dans votre zone d\'intérêt',
        'Nouvelles propriétés disponibles'
      ]
    };
  }
}

// Instance singleton
export const aiManager = new AIManager();

// Fonctions d'aide pour l'utilisation
export const analyzeUserBehavior = async (userData) => {
  return await aiManager.predictUserTrends(userData);
};

export const detectDataAnomalies = async (metrics) => {
  return await aiManager.detectAnomalies(metrics);
};

export const generateAIReport = async (data) => {
  return await aiManager.generateIntelligentReport(data);
};

export const optimizePropertyPricing = async (propertyData) => {
  return await aiManager.optimizePricing(propertyData);
};

export const analyzeUserSentiment = async (feedback) => {
  return await aiManager.analyzeSentiment(feedback);
};

export const getPersonalizedRecommendations = async (userProfile, preferences) => {
  return await aiManager.generatePersonalizedRecommendations(userProfile, preferences);
};

export default aiManager;

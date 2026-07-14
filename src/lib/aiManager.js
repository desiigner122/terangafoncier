/**
 * Gestionnaire d'Intelligence Artificielle pour Teranga Foncier
 * Intégration avec OpenAI GPT et services d'analytics avancés
 */

import { supabase } from './supabaseClient';

class AIManager {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    this.model = 'gpt-4o-mini'; // Modèle plus économique et rapide
    this.isEnabled = Boolean(this.apiKey);
    
    // Log du statut d'activation
    if (this.isEnabled) {
      console.log('🤖 IA Teranga Foncier activée avec OpenAI GPT-4o-mini');
    } else {
      console.log('⚠️ IA en mode simulation - Clé OpenAI manquante');
    }
  }

  /**
   * Analyse prédictive des tendances utilisateurs
   */
  async predictUserTrends(userData) {
    if (!this.isEnabled) {
      console.warn('IA désactivée: predictUserTrends retourne une structure vide.');
      return this.getEmptyPredictions();
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
      return this.getEmptyPredictions();
    }
  }

  /**
   * Analyse des anomalies dans les données
   */
  async detectAnomalies(metrics) {
    if (!this.isEnabled) {
      console.warn('IA désactivée: detectAnomalies retourne une structure vide.');
      return this.getEmptyAnomalies();
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
      return this.getEmptyAnomalies();
    }
  }

  /**
   * Génération de rapports intelligents
   */
  async generateIntelligentReport(data) {
    if (!this.isEnabled) {
      console.warn('IA désactivée: generateIntelligentReport retourne une structure vide.');
      return this.getEmptyReport();
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
      return this.getEmptyReport();
    }
  }

  /**
   * Optimisation des prix basée sur l'IA
   */
  async optimizePricing(propertyData) {
    if (!this.isEnabled) {
      console.warn('IA désactivée: optimizePricing retourne une structure vide.');
      return this.getEmptyPricingOptimization();
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
      return this.getEmptyPricingOptimization();
    }
  }

  /**
   * Analyse de sentiment des utilisateurs
   */
  async analyzeSentiment(userFeedback) {
    if (!this.isEnabled) {
      console.warn('IA désactivée: analyzeSentiment retourne une structure vide.');
      return this.getEmptySentimentAnalysis();
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
      return this.getEmptySentimentAnalysis();
    }
  }

  /**
   * Génération de réponse contextuelle pour l'assistant IA
   */
  async generateContextualResponse(userQuery, pageContext) {
    if (!this.isEnabled) {
      return this.getMockContextualResponse(userQuery, pageContext);
    }

    try {
      const prompt = `
        Utilisateur sur Teranga Foncier demande: "${userQuery}"
        
        Contexte de la page: ${pageContext.pathname}
        Questions suggérées: ${JSON.stringify(pageContext.contextualQuestions)}
        
        En tant qu'assistant IA spécialisé dans l'immobilier sénégalais:
        - Fournis une réponse claire et actionnable
        - Utilise des émojis pour rendre la réponse engageante
        - Mentionne des fonctionnalités spécifiques de Teranga Foncier si pertinent
        - Reste concis (max 2-3 phrases)
        
        Réponds directement sans formatage JSON.
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
            { 
              role: 'system', 
              content: 'Tu es l\'assistant IA de Teranga Foncier, plateforme immobilière sénégalaise. Sois helpful, concis et professionnel.' 
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      const data = await response.json();
      
      if (data.error) {
        console.error('Erreur OpenAI:', data.error);
        return this.getMockContextualResponse(userQuery, pageContext);
      }

      const aiResponse = data.choices[0].message.content.trim();
      
      // Log de l'interaction pour audit
      this.logAIInteraction('contextual_help', { userQuery, pageContext }, aiResponse);
      
      return aiResponse;
    } catch (error) {
      console.error('Erreur IA contextuelle:', error);
      return this.getMockContextualResponse(userQuery, pageContext);
    }
  }

  /**
   * Réponse contextuelle simulée
   */
  getMockContextualResponse(userQuery, pageContext) {
    const responses = {
      '/parcelles': '🏠 Utilisez les filtres avancés pour trouver la parcelle idéale selon vos critères de localisation, prix et surface.',
      '/dashboard': '📊 Votre tableau de bord centralise toutes vos activités : demandes en cours, favoris et notifications importantes.',
      '/messaging': '💬 La messagerie sécurisée vous permet de négocier directement avec les vendeurs pour vos projets immobiliers.',
      'default': '🤖 Je suis là pour vous guider dans votre parcours immobilier sur Teranga Foncier. Que puis-je vous expliquer ?'
    };

    return responses[pageContext.pathname] || responses.default;
  }

  /**
   * Recommandations personnalisées pour utilisateurs
   */
  async generatePersonalizedRecommendations(userProfile, propertyPreferences) {
    if (!this.isEnabled) {
      console.warn('IA désactivée: generatePersonalizedRecommendations retourne une structure vide.');
      return this.getEmptyRecommendations();
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
      return this.getEmptyRecommendations();
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
   * Structures vides retournées quand l'IA n'est pas disponible (pas de clé
   * API ou erreur d'appel). Aucune donnée inventée n'est renvoyée : les
   * appelants doivent gérer ces valeurs vides/nulles côté UI.
   */
  getEmptyPredictions() {
    return {
      growth_prediction: null,
      peak_periods: [],
      market_insights: [],
      recommendations: []
    };
  }

  getEmptyAnomalies() {
    return {
      anomalies_detected: [],
      explanations: [],
      suggested_actions: []
    };
  }

  getEmptyReport() {
    return {
      executive_summary: '',
      key_findings: [],
      regional_analysis: {},
      recommendations: []
    };
  }

  getEmptyPricingOptimization() {
    return {
      suggested_price: null,
      price_range: { min: null, max: null },
      market_position: null,
      confidence_score: null
    };
  }

  getEmptySentimentAnalysis() {
    return {
      overall_sentiment: null,
      sentiment_score: null,
      key_themes: [],
      improvement_areas: [],
      positive_highlights: []
    };
  }

  getEmptyRecommendations() {
    return {
      properties: [],
      search_tips: [],
      market_alerts: []
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

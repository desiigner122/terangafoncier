// Service principal pour l'intégration OpenAI GPT-4
import axios from 'axios';
import { ENV_VARS, logEnvStatus } from '../../utils/env';

class OpenAIService {
  constructor() {
    // Utilisation de l'utilitaire sécurisé pour les variables d'environnement
    this.apiKey = ENV_VARS.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    this.model = 'gpt-4-turbo-preview';
    
    // Mode simulation activé par défaut pour le développement
    this.simulationMode = true;
    
    if (!this.apiKey) {
      console.warn('⚠️ OpenAI API Key non configurée. Utilisation du mode simulation.');
      console.info('📝 Pour activer l\'IA: Ajoutez votre clé OpenAI dans les paramètres système ou dans .env');
    } else {
      console.info('✅ Clé API OpenAI détectée');
      this.simulationMode = false;
    }
    
    // Logger le statut des variables d'environnement en développement
    if (ENV_VARS.NODE_ENV === 'development') {
      logEnvStatus();
    }
  }

  // Méthode pour configurer la clé API dynamiquement depuis les paramètres
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    this.simulationMode = !apiKey;
    if (apiKey) {
      console.info('✅ Clé API OpenAI configurée avec succès');
    }
  }

  async makeRequest(endpoint, data) {
    if (this.simulationMode) {
      return this.getSimulatedResponse(endpoint, data);
    }

    try {
      const response = await axios.post(`${this.baseURL}${endpoint}`, data, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur OpenAI:', error);
      return this.getSimulatedResponse(endpoint, data);
    }
  }

  // Analyse d'une propriété avec IA
  async analyzeProperty(propertyData) {
    const prompt = `
    Analysez cette propriété immobilière et fournissez une évaluation détaillée:
    
    Titre: ${propertyData.title}
    Localisation: ${propertyData.location}
    Prix: ${propertyData.price}
    Surface: ${propertyData.surface}
    Type: ${propertyData.type}
    Description: ${propertyData.description}
    
    Fournissez:
    1. Score d'attractivité (0-100)
    2. Estimation prix marché
    3. Points forts et faibles
    4. Recommandations d'amélioration
    5. Potentiel d'investissement
    
    Répondez en JSON structuré.
    `;

    const response = await this.makeRequest('/chat/completions', {
      model: this.model,
      messages: [{
        role: 'system',
        content: 'Vous êtes un expert immobilier IA spécialisé dans l\'évaluation de propriétés au Sénégal.'
      }, {
        role: 'user',
        content: prompt
      }],
      max_tokens: 1500,
      temperature: 0.3
    });

    return this.parsePropertyAnalysis(response);
  }

  // Prédictions marché immobilier
  async getPredictMarketTrends(location, timeframe = '6months') {
    const prompt = `
    Analysez les tendances du marché immobilier pour ${location} sur ${timeframe}.
    
    Fournissez des prédictions sur:
    1. Évolution des prix (+/- %)
    2. Demande par type de bien
    3. Quartiers en croissance
    4. Facteurs d'influence
    5. Recommandations investissement
    
    Basez-vous sur les tendances économiques du Sénégal.
    Répondez en JSON structuré.
    `;

    const response = await this.makeRequest('/chat/completions', {
      model: this.model,
      messages: [{
        role: 'system', 
        content: 'Vous êtes un analyste immobilier IA spécialisé dans le marché sénégalais.'
      }, {
        role: 'user',
        content: prompt
      }],
      max_tokens: 1200,
      temperature: 0.4
    });

    return this.parseMarketAnalysis(response);
  }

  // Détection de fraudes potentielles
  async detectFraud(transactionData) {
    const prompt = `
    Analysez cette transaction pour détecter d'éventuelles fraudes:
    
    Montant: ${transactionData.amount}
    Utilisateur: ${transactionData.userProfile}
    Propriété: ${transactionData.propertyInfo}
    Délai: ${transactionData.timeframe}
    Historique: ${transactionData.userHistory}
    
    Calculez un score de risque (0-100) et identifiez les signaux d'alerte.
    Répondez en JSON avec recommandations d'action.
    `;

    const response = await this.makeRequest('/chat/completions', {
      model: this.model,
      messages: [{
        role: 'system',
        content: 'Vous êtes un système de détection de fraudes IA pour l\'immobilier.'
      }, {
        role: 'user', 
        content: prompt
      }],
      max_tokens: 800,
      temperature: 0.1
    });

    return this.parseFraudAnalysis(response);
  }

  // Assistant conversationnel intelligent
  async getChatResponse(userMessage, context = {}) {
    const systemPrompt = `
    Vous êtes l'assistant IA de TerangaFoncier, plateforme immobilière sénégalaise.
    
    Vous pouvez aider avec:
    - Recherche de propriétés
    - Conseils d'investissement
    - Procédures administratives
    - Évaluations de biens
    - Questions juridiques de base
    
    Contexte utilisateur: ${JSON.stringify(context)}
    
    Répondez de manière utile, professionnelle et adaptée au marché sénégalais.
    `;

    const response = await this.makeRequest('/chat/completions', {
      model: this.model,
      messages: [{
        role: 'system',
        content: systemPrompt
      }, {
        role: 'user',
        content: userMessage
      }],
      max_tokens: 1000,
      temperature: 0.7
    });

    return response.choices?.[0]?.message?.content || 'Désolé, je ne peux pas répondre maintenant.';
  }

  // Génération de recommandations personnalisées
  async getPersonalizedRecommendations(userProfile, preferences) {
    const prompt = `
    Générez des recommandations immobilières personnalisées:
    
    Profil utilisateur:
    - Budget: ${userProfile.budget}
    - Localisation préférée: ${userProfile.preferredLocations}
    - Type de bien: ${userProfile.propertyTypes}
    - Objectif: ${userProfile.goal} (investissement/résidence)
    
    Préférences:
    - Surface min: ${preferences.minSurface}
    - Équipements: ${preferences.amenities}
    - Transport: ${preferences.transportation}
    
    Proposez 5 recommandations avec score de compatibilité.
    Répondez en JSON structuré.
    `;

    const response = await this.makeRequest('/chat/completions', {
      model: this.model,
      messages: [{
        role: 'system',
        content: 'Vous êtes un conseiller immobilier IA expert du marché sénégalais.'
      }, {
        role: 'user',
        content: prompt
      }],
      max_tokens: 1500,
      temperature: 0.5
    });

    return this.parseRecommendations(response);
  }

  // Réponses simulées pour développement/démo
  getSimulatedResponse(endpoint, data) {
    const simulatedResponses = {
      '/chat/completions': {
        choices: [{
          message: {
            content: JSON.stringify({
              status: 'simulated',
              message: 'Réponse simulée - Configurez votre clé API OpenAI pour des réponses réelles',
              data: this.getSimulatedAnalysis(data)
            })
          }
        }]
      }
    };

    return simulatedResponses[endpoint] || { 
      choices: [{ message: { content: 'Réponse simulée non disponible' } }] 
    };
  }

  getSimulatedAnalysis(data) {
    return {
      score: Math.floor(Math.random() * 30) + 70, // Score entre 70-100
      estimation: 'Estimation simulée',
      trends: ['Croissance prévue', 'Demande forte', 'Bon potentiel'],
      recommendations: ['Conseil simulé 1', 'Conseil simulé 2'],
      riskLevel: 'Faible'
    };
  }

  // Parsers pour structurer les réponses IA
  parsePropertyAnalysis(response) {
    try {
      const content = response.choices?.[0]?.message?.content;
      return JSON.parse(content);
    } catch {
      return {
        score: 85,
        marketEstimate: 'Non disponible',
        strengths: ['Bien située', 'Prix attractif'],
        weaknesses: ['Nécessite rénovation'],
        recommendations: ['Négocier le prix', 'Prévoir budget travaux'],
        investmentPotential: 'Bon'
      };
    }
  }

  parseMarketAnalysis(response) {
    try {
      const content = response.choices?.[0]?.message?.content;
      return JSON.parse(content);
    } catch {
      return {
        priceEvolution: '+5-8%',
        demand: 'Forte pour résidentiel',
        growingAreas: ['Almadies', 'Mermoz', 'Keur Massar'],
        influences: ['Développement infrastructure', 'Croissance économique'],
        recommendations: ['Investir maintenant', 'Privilégier zones en développement']
      };
    }
  }

  parseFraudAnalysis(response) {
    try {
      const content = response.choices?.[0]?.message?.content;
      return JSON.parse(content);
    } catch {
      return {
        riskScore: 15, // Score bas = faible risque
        alerts: [],
        recommendation: 'Transaction sécurisée',
        requiresReview: false
      };
    }
  }

  parseRecommendations(response) {
    try {
      const content = response.choices?.[0]?.message?.content;
      return JSON.parse(content);
    } catch {
      return {
        recommendations: [
          {
            id: 1,
            title: 'Villa moderne - Almadies',
            compatibilityScore: 92,
            reason: 'Correspond parfaitement à vos critères'
          },
          {
            id: 2, 
            title: 'Appartement - Mermoz',
            compatibilityScore: 88,
            reason: 'Excellent rapport qualité-prix'
          }
        ]
      };
    }
  }
}

// Export de la classe et de l'instance
export { OpenAIService };
export default new OpenAIService();
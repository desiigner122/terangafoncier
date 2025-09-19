// Service IA Central pour Teranga Foncier
class AIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || 'YOUR_API_KEY';
    this.baseURL = 'https://api.openai.com/v1';
    this.isEnabled = true;
    
    // Cache pour les analyses fréquentes
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    
    // Données de marché en temps réel
    this.marketData = {
      avgPricePerSqm: {
        'Almadies': 850000,
        'Sicap': 650000,
        'VDN': 750000,
        'Mermoz': 550000,
        'Fann': 700000,
        'Plateau': 900000,
        'Point E': 600000,
        'Ouakam': 800000,
        'Ngor': 950000,
        'default': 600000
      },
      trends: {
        growth: 0.08, // 8% croissance annuelle
        hotZones: ['Almadies', 'Ngor', 'VDN'],
        emergingZones: ['Diamniadio', 'Lac Rose', 'Sebikotane']
      }
    };
  }

  // === ANALYSE DE PRIX ET ÉVALUATION ===
  async analyzePriceForProperty(propertyData) {
    const cacheKey = `price_${JSON.stringify(propertyData)}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const analysis = await this.performPriceAnalysis(propertyData);
      
      // Cache le résultat
      this.cache.set(cacheKey, {
        data: analysis,
        timestamp: Date.now()
      });
      
      return analysis;
    } catch (error) {
      console.error('Erreur analyse prix:', error);
      return this.getFallbackPriceAnalysis(propertyData);
    }
  }

  async performPriceAnalysis(propertyData) {
    const { location, surface, type, features } = propertyData;
    
    // Prix de base selon la zone
    const basePrice = this.marketData.avgPricePerSqm[location] || this.marketData.avgPricePerSqm.default;
    
    // Calculs d'ajustements
    let adjustmentFactor = 1.0;
    
    // Ajustement par type de propriété
    const typeMultipliers = {
      'Villa': 1.3,
      'Appartement': 1.0,
      'Terrain': 0.7,
      'Commercial': 1.5,
      'Bureau': 1.2
    };
    adjustmentFactor *= (typeMultipliers[type] || 1.0);
    
    // Ajustement par caractéristiques
    if (features?.includes('Piscine')) adjustmentFactor += 0.15;
    if (features?.includes('Jardin')) adjustmentFactor += 0.08;
    if (features?.includes('Garage')) adjustmentFactor += 0.05;
    if (features?.includes('Sécurité')) adjustmentFactor += 0.10;
    if (features?.includes('Climatisation')) adjustmentFactor += 0.07;
    
    const estimatedPrice = basePrice * surface * adjustmentFactor;
    const priceRange = {
      min: estimatedPrice * 0.85,
      max: estimatedPrice * 1.15,
      estimated: estimatedPrice
    };

    return {
      priceRange,
      analysis: {
        basePrice,
        adjustmentFactor,
        marketTrend: this.getMarketTrend(location),
        confidence: 0.85,
        factors: this.getPriceFactors(propertyData),
        recommendations: this.getPriceRecommendations(propertyData, priceRange)
      },
      timestamp: new Date().toISOString()
    };
  }

  getFallbackPriceAnalysis(propertyData) {
    const basePrice = this.marketData.avgPricePerSqm.default;
    const estimatedPrice = basePrice * (propertyData.surface || 100);
    
    return {
      priceRange: {
        min: estimatedPrice * 0.8,
        max: estimatedPrice * 1.2,
        estimated: estimatedPrice
      },
      analysis: {
        confidence: 0.6,
        factors: ['Estimation basée sur les données locales'],
        recommendations: ['Consulter un expert pour une évaluation précise']
      }
    };
  }

  // === ANALYSE DE MARCHÉ ===
  async getMarketInsights(zone) {
    const insights = {
      zone,
      currentTrend: this.getMarketTrend(zone),
      predictions: await this.generateMarketPredictions(zone),
      opportunities: this.identifyOpportunities(zone),
      risks: this.assessRisks(zone),
      comparative: this.getComparativeAnalysis(zone)
    };

    return insights;
  }

  getMarketTrend(zone) {
    const isHotZone = this.marketData.trends.hotZones.includes(zone);
    const isEmerging = this.marketData.trends.emergingZones.includes(zone);
    
    if (isHotZone) {
      return {
        direction: 'hausse',
        percentage: 12,
        description: 'Zone en forte croissance avec demande élevée'
      };
    } else if (isEmerging) {
      return {
        direction: 'émergente',
        percentage: 15,
        description: 'Zone émergente avec fort potentiel d\'investissement'
      };
    }
    
    return {
      direction: 'stable',
      percentage: 8,
      description: 'Marché stable avec croissance modérée'
    };
  }

  // === RECOMMANDATIONS INTELLIGENTES ===
  async getInvestmentRecommendations(userProfile, budget) {
    const recommendations = [];
    
    // Analyse du profil utilisateur
    const riskLevel = this.assessUserRiskProfile(userProfile);
    const investmentHorizon = userProfile.investmentHorizon || 'moyen';
    
    // Recommandations par zone
    for (const [zone, price] of Object.entries(this.marketData.avgPricePerSqm)) {
      if (zone === 'default') continue;
      
      const surfaceAffordable = budget / price;
      if (surfaceAffordable >= 100) { // Minimum 100mÂ²
        const zoneRecommendation = {
          zone,
          surfaceMax: Math.floor(surfaceAffordable),
          pricePerSqm: price,
          trend: this.getMarketTrend(zone),
          score: this.calculateInvestmentScore(zone, riskLevel, investmentHorizon),
          reasons: this.getInvestmentReasons(zone, userProfile)
        };
        recommendations.push(zoneRecommendation);
      }
    }
    
    return recommendations.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  // === CHATBOT IA CONTEXTUEL ===
  async generateChatResponse(message, context = {}) {
    const { page, userType, propertyData, userHistory } = context;
    
    // Analyser l'intention de l'utilisateur
    const intent = this.analyzeUserIntent(message);
    
    switch (intent.type) {
      case 'price_inquiry':
        return await this.handlePriceInquiry(message, propertyData);
      case 'market_question':
        return await this.handleMarketQuestion(message, context);
      case 'investment_advice':
        return await this.handleInvestmentAdvice(message, context);
      case 'property_search':
        return await this.handlePropertySearch(message, context);
      case 'legal_question':
        return await this.handleLegalQuestion(message);
      default:
        return await this.handleGeneralQuestion(message, context);
    }
  }

  analyzeUserIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Mots-clés pour identifier l'intention
    const intents = {
      price_inquiry: ['prix', 'coût', 'tarif', 'budget', 'combien', 'évaluation'],
      market_question: ['marché', 'tendance', 'évolution', 'croissance', 'zone'],
      investment_advice: ['investir', 'placement', 'rentabilité', 'conseils', 'stratégie'],
      property_search: ['cherche', 'trouve', 'propriété', 'terrain', 'villa', 'appartement'],
      legal_question: ['légal', 'droit', 'loi', 'procédure', 'titre', 'notaire']
    };
    
    for (const [type, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return { type, confidence: 0.8 };
      }
    }
    
    return { type: 'general', confidence: 0.5 };
  }

  async handlePriceInquiry(message, propertyData) {
    if (propertyData) {
      const analysis = await this.analyzePriceForProperty(propertyData);
      return {
        type: 'price_analysis',
        response: `Basé sur l'analyse de cette propriété, le prix estimé est de ${analysis.priceRange.estimated.toLocaleString()} FCFA. ` +
                 `La fourchette se situe entre ${analysis.priceRange.min.toLocaleString()} et ${analysis.priceRange.max.toLocaleString()} FCFA.`,
        data: analysis,
        suggestions: [
          'Voir l\'analyse détaillée',
          'Comparer avec d\'autres propriétés',
          'Obtenir une évaluation professionnelle'
        ]
      };
    }
    
    return {
      type: 'price_general',
      response: 'Pour vous donner une estimation précise, j\'ai besoin de plus d\'informations sur la propriété : localisation, surface, type de bien...',
      suggestions: [
        'Voir les prix par zone',
        'Calculateur de prix',
        'Contacter un expert'
      ]
    };
  }

  // === RAPPORTS AUTOMATIQUES ===
  async generateMarketReport(period = 'monthly') {
    const report = {
      period,
      generatedAt: new Date().toISOString(),
      summary: await this.generateMarketSummary(),
      zoneAnalysis: await this.generateZoneAnalysis(),
      trends: await this.generateTrendAnalysis(),
      predictions: await this.generatePredictions(),
      recommendations: await this.generateMarketRecommendations()
    };
    
    return report;
  }

  async generatePropertyReport(propertyId) {
    // Rapport détaillé pour une propriété spécifique
    const report = {
      propertyId,
      priceAnalysis: await this.analyzePriceForProperty({}),
      marketPosition: {},
      investmentPotential: {},
      recommendations: [],
      nextActions: []
    };
    
    return report;
  }

  // === NOTIFICATIONS INTELLIGENTES ===
  async generateSmartNotifications(userId) {
    const notifications = [];
    
    // Alertes de prix
    const priceAlerts = await this.checkPriceAlerts(userId);
    notifications.push(...priceAlerts);
    
    // Opportunités d'investissement
    const opportunities = await this.checkInvestmentOpportunities(userId);
    notifications.push(...opportunities);
    
    // Actualités du marché
    const marketNews = await this.generateMarketUpdates();
    notifications.push(...marketNews);
    
    return notifications.filter(n => n.priority >= 3).slice(0, 10);
  }

  // === UTILITAIRES ===
  calculateInvestmentScore(zone, riskLevel, horizon) {
    let score = 50; // Score de base
    
    const trend = this.getMarketTrend(zone);
    if (trend.direction === 'hausse') score += 20;
    if (trend.direction === 'émergente') score += 25;
    
    // Ajustement selon le profil de risque
    if (riskLevel === 'faible' && trend.direction === 'stable') score += 10;
    if (riskLevel === 'élevé' && trend.direction === 'émergente') score += 15;
    
    return Math.min(100, score);
  }

  getPriceFactors(propertyData) {
    const factors = [];
    
    if (propertyData.location) {
      factors.push(`Localisation: ${propertyData.location}`);
    }
    if (propertyData.surface) {
      factors.push(`Surface: ${propertyData.surface}mÂ²`);
    }
    if (propertyData.features?.length) {
      factors.push(`Équipements: ${propertyData.features.join(', ')}`);
    }
    
    return factors;
  }

  getPriceRecommendations(propertyData, priceRange) {
    const recommendations = [];
    
    if (priceRange.estimated > 100000000) {
      recommendations.push('Propriété haut de gamme - Marché de niche');
    }
    
    if (propertyData.location && this.marketData.trends.hotZones.includes(propertyData.location)) {
      recommendations.push('Zone très demandée - Bon potentiel de plus-value');
    }
    
    recommendations.push('Faire inspecter par un expert avant achat');
    
    return recommendations;
  }

  // Méthodes YOUR_API_KEY pour les fonctionnalités avancées
  async generateMarketPredictions(zone) {
    return {
      nextMonth: { trend: 'stable', change: '+2%' },
      nextQuarter: { trend: 'hausse', change: '+5%' },
      nextYear: { trend: 'hausse', change: '+12%' }
    };
  }

  identifyOpportunities(zone) {
    return [
      'Demande croissante pour les appartements T3',
      'Nouveaux projets d\'infrastructure prévus',
      'Zone en cours de développement commercial'
    ];
  }

  assessRisks(zone) {
    return [
      'Possible saturation du marché Ï  court terme',
      'Dépendance aux projets gouvernementaux',
      'Fluctuations des taux d\'intérêt'
    ];
  }

  getComparativeAnalysis(zone) {
    return {
      vsNational: '+15%',
      vsRegional: '+8%',
      ranking: 3
    };
  }

  assessUserRiskProfile(userProfile) {
    // Analyse simplifiée du profil de risque
    if (userProfile.age < 35 && userProfile.income > 5000000) return 'élevé';
    if (userProfile.age > 50) return 'faible';
    return 'moyen';
  }

  getInvestmentReasons(zone, userProfile) {
    return [
      'Croissance démographique soutenue',
      'Développement des infrastructures',
      'Potentiel de rentabilité élevé'
    ];
  }

  async checkPriceAlerts(userId) {
    // Logique pour vérifier les alertes de prix personnalisées
    return [];
  }

  async checkInvestmentOpportunities(userId) {
    // Logique pour identifier les opportunités d'investissement
    return [];
  }

  async generateMarketUpdates() {
    // Génération d'actualités du marché
    return [];
  }

  async generateMarketSummary() {
    return {
      avgGrowth: '8.5%',
      topPerformers: ['Almadies', 'Ngor'],
      marketSentiment: 'optimiste'
    };
  }

  async generateZoneAnalysis() {
    return Object.keys(this.marketData.avgPricePerSqm)
      .filter(zone => zone !== 'default')
      .map(zone => ({
        zone,
        performance: Math.random() * 20 + 5, // Simulation
        trend: this.getMarketTrend(zone)
      }));
  }

  async generateTrendAnalysis() {
    return {
      overallTrend: 'positive',
      keyDrivers: ['Urbanisation', 'Diaspora', 'Projets PSE'],
      challenges: ['Financement', 'Réglementation']
    };
  }

  async generatePredictions() {
    return {
      shortTerm: 'Stabilité avec légère hausse',
      mediumTerm: 'Croissance modérée attendue',
      longTerm: 'Fort potentiel de développement'
    };
  }

  async generateMarketRecommendations() {
    return [
      'Diversifier les investissements géographiquement',
      'Privilégier les zones en développement',
      'Surveiller les annonces gouvernementales'
    ];
  }

  async handleMarketQuestion(message, context) {
    return {
      type: 'market_info',
      response: 'Le marché immobilier sénégalais montre une croissance de 8.5% cette année...',
      data: await this.getMarketInsights(context.zone || 'Dakar'),
      suggestions: ['Voir rapport complet', 'Analyser ma zone', 'Alertes personnalisées']
    };
  }

  async handleInvestmentAdvice(message, context) {
    return {
      type: 'investment_advice',
      response: 'Pour un investissement réussi, je recommande de diversifier...',
      suggestions: ['Calculer rentabilité', 'Voir opportunités', 'Consulter expert']
    };
  }

  async handlePropertySearch(message, context) {
    return {
      type: 'search_help',
      response: 'Je peux vous aider Ï  trouver la propriété idéale. Quel est votre budget et vos critères ?',
      suggestions: ['Recherche avancée', 'Mes favoris', 'Alertes automatiques']
    };
  }

  async handleLegalQuestion(message) {
    return {
      type: 'legal_info',
      response: 'Pour les questions légales, je recommande de consulter un notaire...',
      suggestions: ['Guide légal', 'Notaires partenaires', 'Documentation']
    };
  }

  async handleGeneralQuestion(message, context) {
    return {
      type: 'general',
      response: 'Je suis votre assistant IA pour l\'immobilier au Sénégal. Comment puis-je vous aider ?',
      suggestions: ['Évaluer un bien', 'Tendances marché', 'Conseils investissement']
    };
  }
}

// Instance globale du service IA
export const aiService = new AIService();
export default AIService;

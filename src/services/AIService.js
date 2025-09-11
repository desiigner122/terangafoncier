// Service IA Central pour Teranga Foncier
class AIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || 'YOUR_API_KEY';
    this.baseURL = 'https://api.openai.com/v1';
    this.isEnabled = true;
    
    // Cache pour les analyses frÃ©quentes
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    
    // DonnÃ©es de marchÃ© en temps rÃ©el
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

  // === ANALYSE DE PRIX ET Ã‰VALUATION ===
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
      
      // Cache le rÃ©sultat
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
    
    // Ajustement par type de propriÃ©tÃ©
    const typeMultipliers = {
      'Villa': 1.3,
      'Appartement': 1.0,
      'Terrain': 0.7,
      'Commercial': 1.5,
      'Bureau': 1.2
    };
    adjustmentFactor *= (typeMultipliers[type] || 1.0);
    
    // Ajustement par caractÃ©ristiques
    if (features?.includes('Piscine')) adjustmentFactor += 0.15;
    if (features?.includes('Jardin')) adjustmentFactor += 0.08;
    if (features?.includes('Garage')) adjustmentFactor += 0.05;
    if (features?.includes('SÃ©curitÃ©')) adjustmentFactor += 0.10;
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
        factors: ['Estimation basÃ©e sur les donnÃ©es locales'],
        recommendations: ['Consulter un expert pour une Ã©valuation prÃ©cise']
      }
    };
  }

  // === ANALYSE DE MARCHÃ‰ ===
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
        description: 'Zone en forte croissance avec demande Ã©levÃ©e'
      };
    } else if (isEmerging) {
      return {
        direction: 'Ã©mergente',
        percentage: 15,
        description: 'Zone Ã©mergente avec fort potentiel d\'investissement'
      };
    }
    
    return {
      direction: 'stable',
      percentage: 8,
      description: 'MarchÃ© stable avec croissance modÃ©rÃ©e'
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
    
    // Mots-clÃ©s pour identifier l'intention
    const intents = {
      price_inquiry: ['prix', 'coÃ»t', 'tarif', 'budget', 'combien', 'Ã©valuation'],
      market_question: ['marchÃ©', 'tendance', 'Ã©volution', 'croissance', 'zone'],
      investment_advice: ['investir', 'placement', 'rentabilitÃ©', 'conseils', 'stratÃ©gie'],
      property_search: ['cherche', 'trouve', 'propriÃ©tÃ©', 'terrain', 'villa', 'appartement'],
      legal_question: ['lÃ©gal', 'droit', 'loi', 'procÃ©dure', 'titre', 'notaire']
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
        response: `BasÃ© sur l'analyse de cette propriÃ©tÃ©, le prix estimÃ© est de ${analysis.priceRange.estimated.toLocaleString()} FCFA. ` +
                 `La fourchette se situe entre ${analysis.priceRange.min.toLocaleString()} et ${analysis.priceRange.max.toLocaleString()} FCFA.`,
        data: analysis,
        suggestions: [
          'Voir l\'analyse dÃ©taillÃ©e',
          'Comparer avec d\'autres propriÃ©tÃ©s',
          'Obtenir une Ã©valuation professionnelle'
        ]
      };
    }
    
    return {
      type: 'price_general',
      response: 'Pour vous donner une estimation prÃ©cise, j\'ai besoin de plus d\'informations sur la propriÃ©tÃ© : localisation, surface, type de bien...',
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
    // Rapport dÃ©taillÃ© pour une propriÃ©tÃ© spÃ©cifique
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
    
    // OpportunitÃ©s d'investissement
    const opportunities = await this.checkInvestmentOpportunities(userId);
    notifications.push(...opportunities);
    
    // ActualitÃ©s du marchÃ©
    const marketNews = await this.generateMarketUpdates();
    notifications.push(...marketNews);
    
    return notifications.filter(n => n.priority >= 3).slice(0, 10);
  }

  // === UTILITAIRES ===
  calculateInvestmentScore(zone, riskLevel, horizon) {
    let score = 50; // Score de base
    
    const trend = this.getMarketTrend(zone);
    if (trend.direction === 'hausse') score += 20;
    if (trend.direction === 'Ã©mergente') score += 25;
    
    // Ajustement selon le profil de risque
    if (riskLevel === 'faible' && trend.direction === 'stable') score += 10;
    if (riskLevel === 'Ã©levÃ©' && trend.direction === 'Ã©mergente') score += 15;
    
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
      factors.push(`Ã‰quipements: ${propertyData.features.join(', ')}`);
    }
    
    return factors;
  }

  getPriceRecommendations(propertyData, priceRange) {
    const recommendations = [];
    
    if (priceRange.estimated > 100000000) {
      recommendations.push('PropriÃ©tÃ© haut de gamme - MarchÃ© de niche');
    }
    
    if (propertyData.location && this.marketData.trends.hotZones.includes(propertyData.location)) {
      recommendations.push('Zone trÃ¨s demandÃ©e - Bon potentiel de plus-value');
    }
    
    recommendations.push('Faire inspecter par un expert avant achat');
    
    return recommendations;
  }

  // MÃ©thodes YOUR_API_KEY pour les fonctionnalitÃ©s avancÃ©es
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
      'Nouveaux projets d\'infrastructure prÃ©vus',
      'Zone en cours de dÃ©veloppement commercial'
    ];
  }

  assessRisks(zone) {
    return [
      'Possible saturation du marchÃ© Ã  court terme',
      'DÃ©pendance aux projets gouvernementaux',
      'Fluctuations des taux d\'intÃ©rÃªt'
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
    // Analyse simplifiÃ©e du profil de risque
    if (userProfile.age < 35 && userProfile.income > 5000000) return 'Ã©levÃ©';
    if (userProfile.age > 50) return 'faible';
    return 'moyen';
  }

  getInvestmentReasons(zone, userProfile) {
    return [
      'Croissance dÃ©mographique soutenue',
      'DÃ©veloppement des infrastructures',
      'Potentiel de rentabilitÃ© Ã©levÃ©'
    ];
  }

  async checkPriceAlerts(userId) {
    // Logique pour vÃ©rifier les alertes de prix personnalisÃ©es
    return [];
  }

  async checkInvestmentOpportunities(userId) {
    // Logique pour identifier les opportunitÃ©s d'investissement
    return [];
  }

  async generateMarketUpdates() {
    // GÃ©nÃ©ration d'actualitÃ©s du marchÃ©
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
      challenges: ['Financement', 'RÃ©glementation']
    };
  }

  async generatePredictions() {
    return {
      shortTerm: 'StabilitÃ© avec lÃ©gÃ¨re hausse',
      mediumTerm: 'Croissance modÃ©rÃ©e attendue',
      longTerm: 'Fort potentiel de dÃ©veloppement'
    };
  }

  async generateMarketRecommendations() {
    return [
      'Diversifier les investissements gÃ©ographiquement',
      'PrivilÃ©gier les zones en dÃ©veloppement',
      'Surveiller les annonces gouvernementales'
    ];
  }

  async handleMarketQuestion(message, context) {
    return {
      type: 'market_info',
      response: 'Le marchÃ© immobilier sÃ©nÃ©galais montre une croissance de 8.5% cette annÃ©e...',
      data: await this.getMarketInsights(context.zone || 'Dakar'),
      suggestions: ['Voir rapport complet', 'Analyser ma zone', 'Alertes personnalisÃ©es']
    };
  }

  async handleInvestmentAdvice(message, context) {
    return {
      type: 'investment_advice',
      response: 'Pour un investissement rÃ©ussi, je recommande de diversifier...',
      suggestions: ['Calculer rentabilitÃ©', 'Voir opportunitÃ©s', 'Consulter expert']
    };
  }

  async handlePropertySearch(message, context) {
    return {
      type: 'search_help',
      response: 'Je peux vous aider Ã  trouver la propriÃ©tÃ© idÃ©ale. Quel est votre budget et vos critÃ¨res ?',
      suggestions: ['Recherche avancÃ©e', 'Mes favoris', 'Alertes automatiques']
    };
  }

  async handleLegalQuestion(message) {
    return {
      type: 'legal_info',
      response: 'Pour les questions lÃ©gales, je recommande de consulter un notaire...',
      suggestions: ['Guide lÃ©gal', 'Notaires partenaires', 'Documentation']
    };
  }

  async handleGeneralQuestion(message, context) {
    return {
      type: 'general',
      response: 'Je suis votre assistant IA pour l\'immobilier au SÃ©nÃ©gal. Comment puis-je vous aider ?',
      suggestions: ['Ã‰valuer un bien', 'Tendances marchÃ©', 'Conseils investissement']
    };
  }
}

// Instance globale du service IA
export const aiService = new AIService();
export default AIService;

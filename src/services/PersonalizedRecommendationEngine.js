/**
 * 🎯 SYSTÈME DE RECOMMANDATIONS PERSONNALISÉES IA - TERANGA FONCIER
 * ==================================================================
 * 
 * Recommandations ultra-personnalisées basées sur:
 * - Comportement utilisateur
 * - Analyse prédictive ML
 * - Données marché temps réel
 * - Profil financier et préférences
 */

import { supabase } from '../lib/supabaseClient';
import { terangaAI } from './TerangaAIService';

class PersonalizedRecommendationEngine {
  constructor() {
    this.userProfiles = new Map();
    this.behaviorPatterns = new Map();
    this.marketTrends = {};
    this.mlModels = {
      userPreferences: null,
      pricePredictor: null,
      investmentMatcher: null,
      riskAssessment: null
    };

    this.initialize();
  }

  async initialize() {
    console.log('🎯 Initialisation moteur de recommandations...');
    
    try {
      await this.loadUserProfiles();
      await this.loadMarketData();
      await this.loadBehaviorPatterns();
      await this.initializeMLModels();
      
      // Démarrer mise à jour temps réel
      this.startRealtimeUpdates();
      
      console.log('✅ Moteur de recommandations opérationnel');
    } catch (error) {
      console.error('❌ Erreur initialisation recommandations:', error);
    }
  }

  // === GÉNÉRATION RECOMMANDATIONS PRINCIPALES ===
  async generatePersonalizedRecommendations(userId, context = {}) {
    console.log('🎯 Génération recommandations pour utilisateur:', userId);
    
    const startTime = Date.now();

    try {
      // 1. Profil utilisateur enrichi
      const userProfile = await this.buildEnrichedUserProfile(userId);
      
      // 2. Analyse comportementale
      const behaviorAnalysis = await this.analyzeBehaviorPatterns(userId);
      
      // 3. Recommandations par catégorie
      const recommendations = await this.generateMultiCategoryRecommendations(
        userProfile, 
        behaviorAnalysis, 
        context
      );
      
      // 4. Scoring et ranking intelligent
      const rankedRecommendations = await this.rankRecommendations(
        recommendations,
        userProfile
      );
      
      // 5. Personnalisation finale
      const personalizedResults = await this.personalizeRecommendations(
        rankedRecommendations,
        userProfile,
        behaviorAnalysis
      );

      const result = {
        userId,
        recommendations: personalizedResults,
        metadata: {
          totalProperties: personalizedResults.length,
          generationTime: Date.now() - startTime,
          confidence: this.calculateRecommendationConfidence(personalizedResults),
          refreshTime: Date.now() + (1000 * 60 * 15), // 15 minutes
          personalizationLevel: this.getPersonalizationLevel(userProfile)
        },
        insights: {
          userPreferences: this.extractKeyPreferences(userProfile),
          marketOpportunities: await this.getMarketOpportunities(userProfile),
          investmentAdvice: this.generateInvestmentAdvice(userProfile, behaviorAnalysis)
        }
      };

      // Sauvegarder pour apprentissage
      await this.saveRecommendationSession(result);
      
      return result;

    } catch (error) {
      console.error('❌ Erreur génération recommandations:', error);
      return this.getFallbackRecommendations(userId);
    }
  }

  // === CONSTRUCTION PROFIL UTILISATEUR ENRICHI ===
  async buildEnrichedUserProfile(userId) {
    try {
      // Données de base
      const baseProfile = await this.getUserBaseProfile(userId);
      
      // Historique d'activité
      const activityHistory = await this.getUserActivity(userId);
      
      // Préférences implicites (basées sur comportement)
      const implicitPreferences = this.extractImplicitPreferences(activityHistory);
      
      // Capacité financière calculée
      const financialCapacity = await this.calculateFinancialCapacity(baseProfile, activityHistory);
      
      // Profil de risque
      const riskProfile = this.assessUserRiskProfile(baseProfile, activityHistory);
      
      // Tendances comportementales
      const behaviorTrends = this.analyzeBehaviorTrends(activityHistory);

      return {
        // Données de base
        id: userId,
        demographics: baseProfile.demographics,
        location: baseProfile.location,
        profession: baseProfile.profession,
        
        // Préférences
        explicitPreferences: baseProfile.preferences || {},
        implicitPreferences,
        
        // Financier
        financialCapacity,
        riskProfile,
        budgetRange: this.calculateBudgetRange(financialCapacity),
        
        // Comportement
        activityLevel: this.categorizeActivityLevel(activityHistory),
        behaviorTrends,
        searchPatterns: this.extractSearchPatterns(activityHistory),
        
        // Temporel
        lastActivity: activityHistory.lastActivity,
        membershipDuration: this.calculateMembershipDuration(baseProfile.createdAt),
        seasonalPreferences: this.analyzeSeasonalPreferences(activityHistory)
      };

    } catch (error) {
      console.error('❌ Erreur construction profil:', error);
      return this.getMinimalUserProfile(userId);
    }
  }

  // === RECOMMANDATIONS MULTI-CATÉGORIES ===
  async generateMultiCategoryRecommendations(userProfile, behaviorAnalysis, context) {
    const recommendations = {
      // Propriétés selon budget et préférences
      matchingProperties: await this.findMatchingProperties(userProfile),
      
      // Opportunités d'investissement
      investmentOpportunities: await this.findInvestmentOpportunities(userProfile),
      
      // Zones recommandées
      recommendedAreas: await this.recommendAreas(userProfile, behaviorAnalysis),
      
      // Propriétés tendance
      trendingProperties: await this.getTrendingProperties(userProfile.location),
      
      // Alertes prix
      priceAlerts: await this.generatePriceAlerts(userProfile),
      
      // Recommandations urgentes
      urgentOpportunities: await this.findUrgentOpportunities(userProfile),
      
      // Diversification portfolio
      portfolioDiversification: await this.suggestPortfolioDiversification(userProfile),
      
      // Propriétés similaires aux favoris
      similarToFavorites: await this.findSimilarToFavorites(userProfile)
    };

    return recommendations;
  }

  // === PROPRIÉTÉS CORRESPONDANTES ===
  async findMatchingProperties(userProfile) {
    console.log('🏠 Recherche propriétés correspondantes...');

    try {
      // Critères de recherche basés sur le profil
      const searchCriteria = {
        priceRange: userProfile.budgetRange,
        propertyTypes: userProfile.implicitPreferences.preferredTypes || ['terrain', 'villa'],
        locations: userProfile.implicitPreferences.preferredAreas || [userProfile.location],
        features: userProfile.implicitPreferences.mustHaveFeatures || [],
        maxDistance: this.calculateMaxDistance(userProfile)
      };

      // Recherche dans la base de données
      const query = supabase
        .from('properties')
        .select(`
          *,
          images:property_images(*),
          agent:agents(name, rating, contact),
          neighborhood_stats(avg_price, growth_rate)
        `)
        .gte('price', searchCriteria.priceRange.min)
        .lte('price', searchCriteria.priceRange.max)
        .in('type', searchCriteria.propertyTypes)
        .eq('status', 'available');

      const { data: properties, error } = await query.limit(20);

      if (error) throw error;

      // Enrichissement avec données IA
      const enrichedProperties = await Promise.all(
        (properties || []).map(async (property) => {
          // Évaluation IA de la propriété
          const aiEvaluation = await terangaAI.evaluateProperty({
            type: property.type,
            surface: property.surface,
            location: property.location,
            price: property.price
          });

          // Score de correspondance avec le profil
          const matchScore = this.calculateMatchScore(property, userProfile);

          // Prédictions de prix
          const priceForecasts = await this.predictPriceEvolution(property);

          return {
            ...property,
            aiEvaluation,
            matchScore,
            priceForecasts,
            recommendationReasons: this.generateRecommendationReasons(property, userProfile),
            urgencyLevel: this.calculateUrgencyLevel(property, aiEvaluation),
            investmentPotential: this.calculateInvestmentPotential(property, priceForecasts)
          };
        })
      );

      // Tri par score de correspondance
      return enrichedProperties
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10);

    } catch (error) {
      console.error('❌ Erreur recherche propriétés:', error);
      return [];
    }
  }

  // === OPPORTUNITÉS D'INVESTISSEMENT ===
  async findInvestmentOpportunities(userProfile) {
    console.log('📈 Recherche opportunités d\'investissement...');

    try {
      // Analyse du marché pour trouver les sous-évaluations
      const marketAnalysis = await terangaAI.getMarketInsights(userProfile.location);
      
      // Propriétés avec potentiel de plus-value élevé
      const { data: undervaluedProperties } = await supabase
        .from('properties')
        .select('*, neighborhood_stats(*)')
        .eq('status', 'available')
        .lte('price_per_sqm', marketAnalysis.average_price_per_sqm * 0.85); // 15% sous la moyenne

      const opportunities = [];

      for (const property of undervaluedProperties || []) {
        // Évaluation IA détaillée
        const evaluation = await terangaAI.evaluateProperty(property);
        
        // Calcul du potentiel d'investissement
        const investmentAnalysis = await this.analyzeInvestmentPotential(property, evaluation);
        
        if (investmentAnalysis.score > 0.7) { // Seulement les bonnes opportunités
          opportunities.push({
            ...property,
            investmentAnalysis,
            opportunity: {
              type: investmentAnalysis.type,
              expectedReturn: investmentAnalysis.expectedReturn,
              timeframe: investmentAnalysis.timeframe,
              riskLevel: investmentAnalysis.riskLevel,
              reasons: investmentAnalysis.reasons
            }
          });
        }
      }

      return opportunities
        .sort((a, b) => b.investmentAnalysis.score - a.investmentAnalysis.score)
        .slice(0, 5);

    } catch (error) {
      console.error('❌ Erreur opportunités investissement:', error);
      return [];
    }
  }

  // === ZONES RECOMMANDÉES ===
  async recommendAreas(userProfile, behaviorAnalysis) {
    console.log('🗺️ Recommandation de zones...');

    try {
      // Analyse des zones selon le profil utilisateur
      const zoneAnalyses = [];

      const availableZones = [
        'Dakar-Plateau', 'Almadies', 'Mermoz', 'Liberté 6',
        'Thiès-Centre', 'Saint-Louis-Nord', 'Mbour-Saly',
        'Guédiawaye', 'Pikine', 'Rufisque'
      ];

      for (const zone of availableZones) {
        const zoneInsights = await terangaAI.getMarketInsights(zone);
        const affordabilityScore = this.calculateAffordabilityScore(zone, userProfile.budgetRange);
        const growthPotential = this.calculateGrowthPotential(zoneInsights);
        const lifestyleMatch = this.calculateLifestyleMatch(zone, userProfile);

        const overallScore = (affordabilityScore * 0.4) + (growthPotential * 0.35) + (lifestyleMatch * 0.25);

        if (overallScore > 0.6) { // Seuil de recommandation
          zoneAnalyses.push({
            zone,
            score: overallScore,
            insights: zoneInsights,
            reasons: this.generateZoneRecommendationReasons(zone, userProfile, {
              affordabilityScore,
              growthPotential,
              lifestyleMatch
            }),
            properties: {
              available: zoneInsights.available_properties || 0,
              avgPrice: zoneInsights.average_price,
              priceEvolution: zoneInsights.price_evolution_6_months
            }
          });
        }
      }

      return zoneAnalyses
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    } catch (error) {
      console.error('❌ Erreur recommandation zones:', error);
      return [];
    }
  }

  // === UTILITAIRES DE CALCUL ===
  calculateMatchScore(property, userProfile) {
    let score = 0;

    // Score prix (40%)
    const priceScore = this.calculatePriceScore(property.price, userProfile.budgetRange);
    score += priceScore * 0.4;

    // Score localisation (25%)
    const locationScore = this.calculateLocationScore(property.location, userProfile);
    score += locationScore * 0.25;

    // Score type de propriété (20%)
    const typeScore = this.calculateTypeScore(property.type, userProfile.implicitPreferences);
    score += typeScore * 0.2;

    // Score caractéristiques (15%)
    const featureScore = this.calculateFeatureScore(property.features, userProfile.implicitPreferences);
    score += featureScore * 0.15;

    return Math.min(score, 1.0);
  }

  calculatePriceScore(price, budgetRange) {
    if (price < budgetRange.min) return 0.7; // Trop peu cher, suspect
    if (price > budgetRange.max) return 0; // Trop cher
    
    const midPoint = (budgetRange.min + budgetRange.max) / 2;
    const distance = Math.abs(price - midPoint) / (budgetRange.max - budgetRange.min);
    
    return 1 - distance; // Plus proche du milieu = meilleur score
  }

  generateRecommendationReasons(property, userProfile) {
    const reasons = [];

    // Raisons basées sur le budget
    if (property.price <= userProfile.budgetRange.max * 0.8) {
      reasons.push(`Prix avantageux: ${(property.price / 1000000).toFixed(1)}M FCFA`);
    }

    // Raisons basées sur la localisation
    if (userProfile.implicitPreferences.preferredAreas?.includes(property.location)) {
      reasons.push(`Zone privilégiée selon vos recherches`);
    }

    // Raisons basées sur les tendances
    if (property.neighborhood_stats?.growth_rate > 0.1) {
      reasons.push(`Quartier en forte croissance (+${(property.neighborhood_stats.growth_rate * 100).toFixed(1)}%)`);
    }

    // Raisons basées sur l'IA
    if (property.aiEvaluation?.potentiel_investissement === 'Fort') {
      reasons.push(`Potentiel d'investissement élevé selon l'IA`);
    }

    return reasons.slice(0, 3); // Maximum 3 raisons principales
  }

  async analyzeInvestmentPotential(property, evaluation) {
    // Analyse détaillée du potentiel d'investissement
    const marketGrowth = evaluation.donnees_marche_local?.tendance === 'hausse' ? 0.15 : 0.05;
    const undervaluationRate = (evaluation.prix_estime_fcfa - property.price) / property.price;
    
    let score = 0;
    let expectedReturn = 0;
    let reasons = [];

    // Score basé sur sous-évaluation
    if (undervaluationRate > 0.2) {
      score += 0.4;
      expectedReturn += undervaluationRate;
      reasons.push(`Sous-évalué de ${(undervaluationRate * 100).toFixed(1)}%`);
    }

    // Score basé sur la croissance du marché
    score += marketGrowth * 2; // Facteur 2 pour l'importance
    expectedReturn += marketGrowth;
    
    if (marketGrowth > 0.1) {
      reasons.push(`Marché en croissance (+${(marketGrowth * 100).toFixed(1)}%)`);
    }

    // Détermination du type d'opportunité
    let type = 'STANDARD';
    if (undervaluationRate > 0.3 && marketGrowth > 0.1) {
      type = 'EXCEPTIONNELLE';
    } else if (undervaluationRate > 0.2 || marketGrowth > 0.15) {
      type = 'TRES_BONNE';
    } else if (undervaluationRate > 0.1 || marketGrowth > 0.1) {
      type = 'BONNE';
    }

    return {
      score: Math.min(score, 1.0),
      expectedReturn,
      type,
      timeframe: '12-18 mois',
      riskLevel: this.calculateInvestmentRisk(property, evaluation),
      reasons
    };
  }

  // === MÉTHODES UTILITAIRES ===
  extractImplicitPreferences(activityHistory) {
    // Analyse de l'historique pour déduire les préférences
    const preferences = {
      preferredTypes: [],
      preferredAreas: [],
      priceRange: { min: 0, max: 1000000000 },
      mustHaveFeatures: []
    };

    // Analyse des recherches
    if (activityHistory.searches) {
      const typeFrequency = {};
      const areaFrequency = {};

      activityHistory.searches.forEach(search => {
        if (search.type) {
          typeFrequency[search.type] = (typeFrequency[search.type] || 0) + 1;
        }
        if (search.location) {
          areaFrequency[search.location] = (areaFrequency[search.location] || 0) + 1;
        }
      });

      // Types préférés (par fréquence)
      preferences.preferredTypes = Object.entries(typeFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([type]) => type);

      // Zones préférées
      preferences.preferredAreas = Object.entries(areaFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([area]) => area);
    }

    return preferences;
  }

  calculateFinancialCapacity(baseProfile, activityHistory) {
    // Calcul de la capacité financière basée sur le profil
    let capacity = {
      estimatedIncome: 0,
      creditCapacity: 0,
      downPaymentCapacity: 0,
      monthlyBudget: 0
    };

    // Estimation basée sur la profession
    const professionIncomes = {
      'cadre': 2000000,
      'entrepreneur': 3000000,
      'fonctionnaire': 800000,
      'liberal': 2500000,
      'employe': 600000,
      'diaspora': 4000000
    };

    capacity.estimatedIncome = professionIncomes[baseProfile.profession?.toLowerCase()] || 1000000;
    capacity.creditCapacity = capacity.estimatedIncome * 12 * 5; // 5 ans de crédit
    capacity.downPaymentCapacity = capacity.estimatedIncome * 2; // 2 mois d'épargne
    capacity.monthlyBudget = capacity.estimatedIncome * 0.3; // 30% du revenu

    return capacity;
  }

  calculateBudgetRange(financialCapacity) {
    const total = financialCapacity.downPaymentCapacity + financialCapacity.creditCapacity;
    
    return {
      min: total * 0.3, // Budget minimum
      max: total * 1.2, // Budget maximum avec marge
      comfortable: total * 0.8 // Budget confortable
    };
  }

  // === FALLBACK ET MONITORING ===
  getFallbackRecommendations(userId) {
    return {
      userId,
      recommendations: {
        matchingProperties: [],
        investmentOpportunities: [],
        recommendedAreas: [],
        trendingProperties: [],
        priceAlerts: [],
        urgentOpportunities: [],
        portfolioDiversification: [],
        similarToFavorites: []
      },
      metadata: {
        totalProperties: 0,
        generationTime: 0,
        confidence: 0.3,
        refreshTime: Date.now() + (1000 * 60 * 30),
        personalizationLevel: 'BASIC'
      },
      insights: {
        userPreferences: {},
        marketOpportunities: [],
        investmentAdvice: ['Complétez votre profil pour des recommandations personnalisées']
      },
      fallback: true
    };
  }

  async saveRecommendationSession(result) {
    try {
      await supabase.from('recommendation_sessions').insert({
        user_id: result.userId,
        recommendations_data: result,
        confidence_score: result.metadata.confidence,
        personalization_level: result.metadata.personalizationLevel,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Erreur sauvegarde session recommandations:', error);
    }
  }

  startRealtimeUpdates() {
    // Mise à jour des données marché toutes les 5 minutes (timer unique)
    if (this._marketTimer) return;
    this._marketTimer = setInterval(async () => {
      await this.updateMarketData();
    }, 300000);

    console.log('🔄 Mises à jour temps réel activées');
  }

  // Méthodes utilitaires supplémentaires...
  async loadUserProfiles() { /* Implementation */ }
  async loadMarketData() { /* Implementation */ }
  async loadBehaviorPatterns() { /* Implementation */ }
  async initializeMLModels() { /* Implementation */ }
  async getUserBaseProfile(userId) { return {}; }
  async getUserActivity(userId) { return { searches: [], lastActivity: new Date() }; }
  getMinimalUserProfile(userId) { return { id: userId }; }
  calculateMaxDistance(userProfile) { return 50; } // km
  calculateAffordabilityScore(zone, budgetRange) { return 0.8; }
  calculateGrowthPotential(zoneInsights) { return 0.7; }
  calculateLifestyleMatch(zone, userProfile) { return 0.6; }
  generateZoneRecommendationReasons(zone, userProfile, scores) { return []; }
  calculateLocationScore(location, userProfile) { return 0.8; }
  calculateTypeScore(type, preferences) { return 0.7; }
  calculateFeatureScore(features, preferences) { return 0.6; }
  calculateUrgencyLevel(property, evaluation) { return 'MEDIUM'; }
  calculateInvestmentPotential(property, forecasts) { return 0.75; }
  calculateInvestmentRisk(property, evaluation) { return 'MODERE'; }
  calculateRecommendationConfidence(recommendations) { return 0.85; }
  getPersonalizationLevel(userProfile) { return 'ADVANCED'; }
  extractKeyPreferences(userProfile) { return {}; }
  async getMarketOpportunities(userProfile) { return []; }
  generateInvestmentAdvice(userProfile, behaviorAnalysis) { return []; }
  categorizeActivityLevel(activityHistory) { return 'ACTIVE'; }
  analyzeBehaviorTrends(activityHistory) { return {}; }
  extractSearchPatterns(activityHistory) { return {}; }
  calculateMembershipDuration(createdAt) { return 90; } // jours
  analyzeSeasonalPreferences(activityHistory) { return {}; }
  async analyzeBehaviorPatterns(userId) { return {}; }
  async rankRecommendations(recommendations, userProfile) { return recommendations; }
  async personalizeRecommendations(recommendations, userProfile, behaviorAnalysis) { return recommendations; }
  async getTrendingProperties(location) { return []; }
  async generatePriceAlerts(userProfile) { return []; }
  async findUrgentOpportunities(userProfile) { return []; }
  async suggestPortfolioDiversification(userProfile) { return []; }
  async findSimilarToFavorites(userProfile) { return []; }
  async predictPriceEvolution(property) { return {}; }
  assessUserRiskProfile(baseProfile, activityHistory) { return 'MODERE'; }
  async updateMarketData() { /* Implementation */ }
}

// Instance globale
export const recommendationEngine = new PersonalizedRecommendationEngine();
export default PersonalizedRecommendationEngine;

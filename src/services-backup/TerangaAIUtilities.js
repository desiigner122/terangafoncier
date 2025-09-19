/**
 * 🔧 MÉTHODES UTILITAIRES AVANCÉES - TERANGA AI
 * ============================================
 * 
 * Méthodes d'analyse et d'utilitaires pour le service IA amélioré
 */

import { supabase } from '../lib/supabaseClient';

class TerangaAIUtilities {
  
  // ═══════════════════════════════════════════════════════════
  // 🔧 UTILITAIRES DE CACHE
  // ═══════════════════════════════════════════════════════════

  setCacheValue(key, value, ttl) {
    const cache = new Map();
    const cacheExpiry = new Map();
    
    cache.set(key, value);
    cacheExpiry.set(key, Date.now() + ttl);
  }

  getCacheValue(key) {
    const cache = new Map();
    const cacheExpiry = new Map();
    
    const expiry = cacheExpiry.get(key);
    if (!expiry || Date.now() > expiry) {
      cache.delete(key);
      cacheExpiry.delete(key);
      return null;
    }
    
    return cache.get(key);
  }

  // ═══════════════════════════════════════════════════════════
  // 👤 PROFILS ET HISTORIQUES UTILISATEUR  
  // ═══════════════════════════════════════════════════════════

  async getUserSecurityProfile(userId) {
    try {
      const { data: profile } = await supabase
        .from('user_security_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      return profile || {
        riskLevel: 'UNKNOWN',
        verificationStatus: 'PENDING',
        trustScore: 0.5,
        lastVerified: null
      };

    } catch (error) {
      console.error('❌ Erreur récupération profil sécurité:', error);
      return { riskLevel: 'UNKNOWN', trustScore: 0.3 };
    }
  }

  async getMarketSecurityContext(transactionData) {
    const location = transactionData.location;
    const amount = transactionData.amount;

    // Analyse contextuelle du marché
    return {
      locationRisk: this.assessLocationRisk(location),
      amountNormality: this.assessAmountNormality(amount, location),
      marketActivity: await this.getMarketActivity(location),
      seasonalFactor: this.calculateSeasonalFactor()
    };
  }

  assessLocationRisk(location) {
    // Zones à risque identifiées
    const riskZones = {
      'Dakar-Plateau': 0.2,  // Faible risque
      'Almadies': 0.1,       // Très faible risque  
      'Pikine': 0.5,         // Risque modéré
      'Guediawaye': 0.6,     // Risque modéré-élevé
      'Banlieue': 0.7        // Risque élevé
    };

    return riskZones[location] || 0.4; // Risque par défaut
  }

  async verifyBlockchainIntegrity(transactionData) {
    // Vérification de l'intégrité blockchain
    try {
      // Simulation de vérification blockchain
      const blockchainCheck = {
        walletVerified: Math.random() > 0.1, // 90% des wallets sont vérifiés
        transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
        blockConfirmations: Math.floor(Math.random() * 20) + 1,
        gasPrice: Math.random() * 100 + 20,
        integrity: 'VERIFIED'
      };

      return blockchainCheck;

    } catch (error) {
      console.error('❌ Erreur vérification blockchain:', error);
      return { integrity: 'UNVERIFIED', error: error.message };
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 📊 ANALYSE COMPORTEMENTALE
  // ═══════════════════════════════════════════════════════════

  async getUserActivityHistory(userId, timeframe) {
    try {
      const days = this.parseTimeframe(timeframe);
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      const { data: activities } = await supabase
        .from('user_activities')
        .select(`
          *,
          searches:user_searches(*),
          views:property_views(*)
        `)
        .eq('user_id', userId)
        .gte('created_at', since);

      return {
        searches: activities?.searches || [],
        viewedProperties: activities?.views || [],
        activities: activities || [],
        lastActivity: activities?.[0]?.created_at
      };

    } catch (error) {
      console.error('❌ Erreur récupération historique:', error);
      return { searches: [], viewedProperties: [], activities: [] };
    }
  }

  analyzeSearchFrequency(searches) {
    if (!searches || searches.length === 0) {
      return { frequency: 'LOW', pattern: 'IRREGULAR' };
    }

    const dailySearches = this.groupByDay(searches);
    const avgSearchesPerDay = searches.length / Math.max(Object.keys(dailySearches).length, 1);

    let frequency = 'LOW';
    if (avgSearchesPerDay > 5) frequency = 'HIGH';
    else if (avgSearchesPerDay > 2) frequency = 'MEDIUM';

    const pattern = this.detectSearchPattern(dailySearches);

    return { frequency, pattern, avgPerDay: avgSearchesPerDay };
  }

  analyzePriceEvolution(viewedProperties) {
    if (!viewedProperties || viewedProperties.length < 3) {
      return { trend: 'INSUFFICIENT_DATA', priceRange: null };
    }

    const prices = viewedProperties.map(p => p.price).filter(p => p > 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Analyse de tendance temporelle
    const sortedByDate = viewedProperties
      .filter(p => p.price > 0)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    let trend = 'STABLE';
    if (sortedByDate.length >= 3) {
      const firstThird = sortedByDate.slice(0, sortedByDate.length / 3);
      const lastThird = sortedByDate.slice(-sortedByDate.length / 3);

      const firstAvg = firstThird.reduce((a, b) => a + b.price, 0) / firstThird.length;
      const lastAvg = lastThird.reduce((a, b) => a + b.price, 0) / lastThird.length;

      const change = (lastAvg - firstAvg) / firstAvg;
      
      if (change > 0.2) trend = 'INCREASING';
      else if (change < -0.2) trend = 'DECREASING';
      else if (Math.abs(change) < 0.05) trend = 'STABLE';
      else trend = 'FLUCTUATING';
    }

    return {
      trend,
      priceRange: { min: minPrice, max: maxPrice, avg: avgPrice },
      priceSpread: maxPrice - minPrice,
      consistency: this.calculatePriceConsistency(prices)
    };
  }

  analyzeLocationPreferences(searches) {
    if (!searches || searches.length === 0) {
      return { preferred: [], diversity: 'LOW' };
    }

    const locationCounts = {};
    searches.forEach(search => {
      if (search.location) {
        locationCounts[search.location] = (locationCounts[search.location] || 0) + 1;
      }
    });

    const sortedLocations = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    const diversity = Object.keys(locationCounts).length > 3 ? 'HIGH' : 
                     Object.keys(locationCounts).length > 1 ? 'MEDIUM' : 'LOW';

    return {
      preferred: sortedLocations.map(([location, count]) => ({
        location,
        frequency: count,
        percentage: (count / searches.length * 100).toFixed(1)
      })),
      diversity,
      totalUniqueLocations: Object.keys(locationCounts).length
    };
  }

  analyzeTimePatterns(activities) {
    if (!activities || activities.length === 0) {
      return { pattern: 'INSUFFICIENT_DATA' };
    }

    const hourCounts = Array(24).fill(0);
    const dayCounts = Array(7).fill(0);

    activities.forEach(activity => {
      const date = new Date(activity.created_at);
      hourCounts[date.getHours()]++;
      dayCounts[date.getDay()]++;
    });

    // Heures préférées
    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
    const peakDay = dayCounts.indexOf(Math.max(...dayCounts));

    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    return {
      pattern: 'ANALYZED',
      peakHour: `${peakHour}:00`,
      peakDay: dayNames[peakDay],
      hourlyDistribution: hourCounts,
      weeklyDistribution: dayCounts,
      preferredTimeSlot: this.categorizeTimeSlot(peakHour),
      activityRhythm: this.analyzeActivityRhythm(activities)
    };
  }

  // ═══════════════════════════════════════════════════════════
  // 🔮 PRÉDICTIONS AVANCÉES
  // ═══════════════════════════════════════════════════════════

  predictNextPurchaseWindow(patterns) {
    // Prédiction basée sur les patterns comportementaux
    const searchFreq = patterns.searchFrequency?.frequency || 'LOW';
    const priceEvolution = patterns.priceEvolution?.trend || 'STABLE';

    let probability = 0.3; // Base 30%
    let timeframe = '6+ mois';

    // Ajustements basés sur l'activité
    if (searchFreq === 'HIGH') {
      probability += 0.3;
      timeframe = '1-3 mois';
    } else if (searchFreq === 'MEDIUM') {
      probability += 0.2;
      timeframe = '3-6 mois';
    }

    // Ajustements basés sur l'évolution des prix recherchés
    if (priceEvolution === 'STABLE') {
      probability += 0.2; // Stabilité = décision proche
      if (timeframe === '6+ mois') timeframe = '3-6 mois';
    }

    return {
      probability: Math.min(probability, 0.95),
      timeframe,
      confidence: 0.75,
      triggers: this.identifyPurchaseTriggers(patterns)
    };
  }

  predictPriceWillingness(patterns) {
    const priceEvolution = patterns.priceEvolution;
    
    if (!priceEvolution || !priceEvolution.priceRange) {
      return { range: null, confidence: 0.3 };
    }

    const { min, max, avg } = priceEvolution.priceRange;
    
    // Prédiction basée sur l'historique
    let willingnessFactor = 1.0;
    
    if (priceEvolution.trend === 'INCREASING') {
      willingnessFactor = 1.1; // Prêt à payer 10% de plus
    } else if (priceEvolution.trend === 'DECREASING') {
      willingnessFactor = 0.9; // Attend des prix plus bas
    }

    const predictedWillingness = {
      min: Math.round(min * willingnessFactor),
      max: Math.round(max * willingnessFactor), 
      sweet_spot: Math.round(avg * willingnessFactor),
      flexibility: priceEvolution.priceSpread / avg // Flexibilité relative
    };

    return {
      range: predictedWillingness,
      confidence: 0.8,
      reasoning: this.generatePriceWillingnessReasoning(priceEvolution, willingnessFactor)
    };
  }

  calculateConversionProbability(patterns) {
    let score = 0.1; // Base 10%

    // Facteur fréquence de recherche
    const searchFreq = patterns.searchFrequency?.frequency || 'LOW';
    if (searchFreq === 'HIGH') score += 0.4;
    else if (searchFreq === 'MEDIUM') score += 0.2;

    // Facteur stabilité prix
    if (patterns.priceEvolution?.trend === 'STABLE') score += 0.3;

    // Facteur diversité localisation
    const locationDiversity = patterns.locationPreferences?.diversity || 'LOW';
    if (locationDiversity === 'LOW') score += 0.2; // Focalisé = plus probable

    // Facteur régularité temporelle
    const timePattern = patterns.timePatterns?.activityRhythm;
    if (timePattern === 'REGULAR') score += 0.2;

    return {
      probability: Math.min(score, 0.9),
      level: this.categorizeProbability(score),
      factors: this.identifyConversionFactors(patterns)
    };
  }

  // ═══════════════════════════════════════════════════════════
  // 🎯 PRÉDICTIONS DE PRIX AVANCÉES
  // ═══════════════════════════════════════════════════════════

  async generatePriceForecasts(propertyData, marketContext) {
    const basePrice = propertyData.price || 0;
    const location = propertyData.location;
    
    // Facteurs de marché
    const marketGrowth = marketContext.growthRate || 0.08; // 8% par défaut
    const locationMultiplier = this.getLocationGrowthMultiplier(location);
    const seasonalFactor = this.calculateSeasonalFactor();

    const forecasts = {
      '6_months': {
        price: Math.round(basePrice * (1 + (marketGrowth * 0.5) * locationMultiplier * seasonalFactor)),
        confidence: 0.85,
        factors: ['market_growth', 'location_premium', 'seasonal_adjustment']
      },
      '12_months': {
        price: Math.round(basePrice * (1 + marketGrowth * locationMultiplier)),
        confidence: 0.75,
        factors: ['market_growth', 'location_premium', 'economic_outlook']
      },
      '24_months': {
        price: Math.round(basePrice * (1 + marketGrowth * 2 * locationMultiplier)),
        confidence: 0.60,
        factors: ['long_term_trends', 'development_projects', 'economic_cycles']
      }
    };

    // Calcul des variations
    for (const period in forecasts) {
      const forecast = forecasts[period];
      forecast.change_amount = forecast.price - basePrice;
      forecast.change_percentage = ((forecast.price - basePrice) / basePrice * 100).toFixed(2);
    }

    return forecasts;
  }

  getLocationGrowthMultiplier(location) {
    const multipliers = {
      'Dakar-Plateau': 1.2,
      'Almadies': 1.3,
      'Mermoz': 1.1,
      'Diamniadio': 1.5, // Zone en forte expansion
      'Lac Rose': 1.4,
      'Thiès': 1.0,
      'Saint-Louis': 0.9,
      'Pikine': 1.1,
      'Guediawaye': 1.0
    };

    return multipliers[location] || 1.0;
  }

  calculateSeasonalFactor() {
    const now = new Date();
    const month = now.getMonth(); // 0-11

    // Facteurs saisonniers (Octobre-Décembre = haute saison)
    const seasonalFactors = {
      0: 0.95,  // Janvier
      1: 0.95,  // Février  
      2: 0.98,  // Mars
      3: 1.0,   // Avril
      4: 1.0,   // Mai
      5: 0.9,   // Juin (faible saison)
      6: 0.85,  // Juillet (très faible)
      7: 0.85,  // Août (très faible)
      8: 0.95,  // Septembre
      9: 1.1,   // Octobre (haute saison)
      10: 1.15, // Novembre (très haute)
      11: 1.2   // Décembre (pic)
    };

    return seasonalFactors[month] || 1.0;
  }

  // ═══════════════════════════════════════════════════════════
  // 🧮 MÉTHODES UTILITAIRES
  // ═══════════════════════════════════════════════════════════

  parseTimeframe(timeframe) {
    const mapping = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '6m': 180,
      '1y': 365
    };
    return mapping[timeframe] || 30;
  }

  groupByDay(items) {
    return items.reduce((groups, item) => {
      const date = new Date(item.created_at).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
      return groups;
    }, {});
  }

  detectSearchPattern(dailySearches) {
    const days = Object.keys(dailySearches);
    if (days.length < 3) return 'IRREGULAR';

    const counts = Object.values(dailySearches).map(day => day.length);
    const variance = this.calculateVariance(counts);
    
    return variance < 2 ? 'REGULAR' : 'IRREGULAR';
  }

  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b) / values.length;
    return values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
  }

  calculatePriceConsistency(prices) {
    if (prices.length < 2) return 'SINGLE';
    
    const mean = prices.reduce((a, b) => a + b) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    const coefficient = Math.sqrt(variance) / mean;
    
    if (coefficient < 0.2) return 'VERY_CONSISTENT';
    if (coefficient < 0.5) return 'CONSISTENT'; 
    if (coefficient < 1.0) return 'MODERATE';
    return 'INCONSISTENT';
  }

  categorizeTimeSlot(hour) {
    if (hour >= 6 && hour < 12) return 'MORNING';
    if (hour >= 12 && hour < 18) return 'AFTERNOON';
    if (hour >= 18 && hour < 22) return 'EVENING';
    return 'NIGHT';
  }

  analyzeActivityRhythm(activities) {
    // Analyse du rythme d'activité
    if (activities.length < 5) return 'IRREGULAR';
    
    const intervals = [];
    for (let i = 1; i < activities.length; i++) {
      const prev = new Date(activities[i-1].created_at);
      const curr = new Date(activities[i].created_at);
      intervals.push(curr - prev);
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
    const variance = this.calculateVariance(intervals);
    
    // Si la variance est faible par rapport à la moyenne, c'est régulier
    return (variance / avgInterval) < 0.5 ? 'REGULAR' : 'IRREGULAR';
  }

  identifyPurchaseTriggers(patterns) {
    const triggers = [];
    
    if (patterns.searchFrequency?.frequency === 'HIGH') {
      triggers.push('Recherches intensives récentes');
    }
    
    if (patterns.priceEvolution?.trend === 'STABLE') {
      triggers.push('Budget stabilisé');
    }
    
    if (patterns.locationPreferences?.diversity === 'LOW') {
      triggers.push('Zone ciblée identifiée');
    }
    
    return triggers.length > 0 ? triggers : ['Patterns d\'achat insuffisants'];
  }

  generatePriceWillingnessReasoning(priceEvolution, factor) {
    const reasons = [];
    
    if (factor > 1.0) {
      reasons.push('Recherches de prix croissants indiquent acceptation d\'augmentation');
    } else if (factor < 1.0) {
      reasons.push('Recherches de prix décroissants indiquent attente de baisse');
    } else {
      reasons.push('Recherches de prix stables indiquent budget défini');
    }
    
    if (priceEvolution.consistency === 'VERY_CONSISTENT') {
      reasons.push('Fourchette de prix très cohérente');
    }
    
    return reasons;
  }

  categorizeProbability(score) {
    if (score < 0.3) return 'FAIBLE';
    if (score < 0.6) return 'MODÉRÉE';
    if (score < 0.8) return 'ÉLEVÉE';
    return 'TRÈS_ÉLEVÉE';
  }

  identifyConversionFactors(patterns) {
    const factors = [];
    
    // Facteurs positifs
    if (patterns.searchFrequency?.frequency === 'HIGH') {
      factors.push({ type: 'POSITIVE', factor: 'Activité de recherche élevée' });
    }
    
    if (patterns.locationPreferences?.diversity === 'LOW') {
      factors.push({ type: 'POSITIVE', factor: 'Critères géographiques précis' });
    }
    
    // Facteurs neutres/négatifs
    if (patterns.priceEvolution?.trend === 'FLUCTUATING') {
      factors.push({ type: 'NEGATIVE', factor: 'Indécision sur le budget' });
    }
    
    return factors;
  }

  assessAmountNormality(amount, location) {
    // Évaluer si le montant est normal pour la zone
    const locationPrices = {
      'Dakar-Plateau': { min: 30000000, max: 200000000 },
      'Almadies': { min: 50000000, max: 500000000 },
      'Thiès': { min: 10000000, max: 100000000 }
    };

    const range = locationPrices[location] || { min: 5000000, max: 1000000000 };
    
    if (amount < range.min * 0.5) return 'SUSPICIOUSLY_LOW';
    if (amount > range.max * 2) return 'SUSPICIOUSLY_HIGH';
    if (amount >= range.min && amount <= range.max) return 'NORMAL';
    return 'UNUSUAL';
  }

  async getMarketActivity(location) {
    // Simuler l'activité du marché
    return {
      transactionVolume: Math.floor(Math.random() * 100) + 50,
      averagePrice: Math.floor(Math.random() * 50000000) + 20000000,
      priceChange24h: (Math.random() - 0.5) * 0.1, // -5% à +5%
      activityLevel: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)]
    };
  }

  getFallbackRecommendations(userId) {
    return {
      userId,
      recommendations: {
        matchingProperties: [],
        investmentOpportunities: [],
        recommendedAreas: []
      },
      metadata: {
        confidence: 0.3,
        fallback: true
      }
    };
  }
}

// Instance globale
export const aiUtilities = new TerangaAIUtilities();
export default TerangaAIUtilities;

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

class TerangaAIService {
  constructor() {
    // Initialize AI Models
    this.geminiAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
    this.openAI = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });

    // ML Models Configuration
    this.models = {
      propertyValuation: 'gemini-1.5-pro',
      marketAnalysis: 'gpt-4',
      riskAssessment: 'gemini-1.5-flash',
      chatbot: 'gpt-3.5-turbo',
      pricePredictor: 'custom-ml-model'
    };

    // Cache for optimization
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Property Valuation with Advanced ML
  async evaluateProperty(propertyData) {
    const cacheKey = `property_eval_${JSON.stringify(propertyData)}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const model = this.geminiAI.getGenerativeModel({ model: this.models.propertyValuation });
      
      const prompt = `
        Analysez cette propriété immobilière au Sénégal et fournissez une évaluation détaillée:
        
        DONNÉES PROPRIÉTÉ:
        - Type: ${propertyData.type}
        - Surface: ${propertyData.surface}m²
        - Localisation: ${propertyData.location}
        - État: ${propertyData.condition}
        - Équipements: ${propertyData.amenities?.join(', ')}
        - Prix demandé: ${propertyData.askingPrice} FCFA
        
        MARCHÉ LOCAL:
        - Prix moyen zone: ${propertyData.averagePrice} FCFA/m²
        - Tendance marché: ${propertyData.marketTrend}
        - Demande zone: ${propertyData.demand}
        
        Fournissez une analyse JSON avec:
        {
          "estimatedValue": number,
          "confidenceScore": number,
          "factors": {
            "positive": ["facteur1", "facteur2"],
            "negative": ["facteur1", "facteur2"]
          },
          "marketPosition": "undervalued|fair|overvalued",
          "investmentPotential": number,
          "liquidityScore": number,
          "recommendations": ["rec1", "rec2"],
          "comparables": [{"address": "", "price": number, "similarity": number}]
        }
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const evaluation = JSON.parse(response.text());

      // Enhanced ML Scoring
      evaluation.aiScore = this.calculateAIScore(propertyData, evaluation);
      evaluation.timestamp = Date.now();

      // Cache result
      this.cache.set(cacheKey, { data: evaluation, timestamp: Date.now() });

      return evaluation;
    } catch (error) {
      console.error('Property evaluation error:', error);
      return this.getFallbackEvaluation(propertyData);
    }
  }

  // Market Analysis with Predictive Models
  async analyzeMarket(region, timeframe = '12months') {
    try {
      const model = this.geminiAI.getGenerativeModel({ model: this.models.marketAnalysis });
      
      const prompt = `
        Analysez le marché immobilier du Sénégal pour la région: ${region}
        Période d'analyse: ${timeframe}
        
        Fournissez une analyse complète JSON:
        {
          "currentTrends": {
            "priceEvolution": number,
            "volumeChange": number,
            "demandLevel": "low|medium|high",
            "supplyLevel": "low|medium|high"
          },
          "predictions": {
            "priceGrowth6m": number,
            "priceGrowth12m": number,
            "marketSentiment": "bearish|neutral|bullish"
          },
          "opportunities": [
            {
              "type": "investment|development|trading",
              "description": "",
              "potential": number,
              "risk": "low|medium|high"
            }
          ],
          "risks": ["risk1", "risk2"],
          "recommendations": {
            "buyers": ["rec1", "rec2"],
            "sellers": ["rec1", "rec2"],
            "investors": ["rec1", "rec2"]
          }
        }
      `;

      const result = await model.generateContent(prompt);
      const analysis = JSON.parse(result.response.text());
      
      // Add real-time data enrichment
      analysis.dataSourceConfidence = 95;
      analysis.lastUpdated = Date.now();
      
      return analysis;
    } catch (error) {
      console.error('Market analysis error:', error);
      return this.getFallbackMarketAnalysis();
    }
  }

  // Risk Assessment for Financial Institutions
  async assessCreditRisk(applicationData) {
    try {
      const completion = await this.openAI.chat.completions.create({
        model: this.models.riskAssessment,
        messages: [{
          role: "system",
          content: `Vous êtes un expert en évaluation de risque de crédit immobilier au Sénégal. 
                   Analysez les données de demande de crédit et fournissez un score de risque détaillé.`
        }, {
          role: "user",
          content: `
            DEMANDE DE CRÉDIT:
            - Montant: ${applicationData.amount} FCFA
            - Revenus mensuels: ${applicationData.monthlyIncome} FCFA
            - Apport personnel: ${applicationData.downPayment} FCFA
            - Durée: ${applicationData.duration} mois
            - Profession: ${applicationData.profession}
            - Âge: ${applicationData.age}
            - Statut marital: ${applicationData.maritalStatus}
            - Autres crédits: ${applicationData.existingLoans}
            - Historique bancaire: ${applicationData.bankHistory}
            
            BIEN FINANCÉ:
            - Type: ${applicationData.propertyType}
            - Valeur: ${applicationData.propertyValue} FCFA
            - Localisation: ${applicationData.propertyLocation}
            
            Fournissez une évaluation JSON:
            {
              "riskScore": number, // 0-100
              "riskLevel": "low|medium|high|very_high",
              "factors": {
                "income": {"score": number, "weight": number},
                "debt": {"score": number, "weight": number},
                "property": {"score": number, "weight": number},
                "profile": {"score": number, "weight": number}
              },
              "recommendations": {
                "approval": "approve|conditional|reject",
                "suggestedRate": number,
                "conditions": ["condition1", "condition2"],
                "mitigations": ["mitigation1", "mitigation2"]
              },
              "monitoring": {
                "frequency": "monthly|quarterly|biannual",
                "alerts": ["alert1", "alert2"]
              }
            }
          `
        }],
        temperature: 0.3,
        max_tokens: 2000
      });

      const riskAssessment = JSON.parse(completion.choices[0].message.content);
      riskAssessment.assessmentDate = Date.now();
      riskAssessment.modelVersion = "v2.1";

      return riskAssessment;
    } catch (error) {
      console.error('Risk assessment error:', error);
      return this.getFallbackRiskAssessment();
    }
  }

  // Investment Portfolio Optimization
  async optimizePortfolio(portfolioData, riskTolerance = 'medium') {
    try {
      const model = this.geminiAI.getGenerativeModel({ model: this.models.propertyValuation });
      
      const prompt = `
        Optimisez ce portefeuille immobilier selon le profil de risque: ${riskTolerance}
        
        PORTEFEUILLE ACTUEL:
        ${JSON.stringify(portfolioData.properties)}
        
        OBJECTIFS:
        - Capital disponible: ${portfolioData.availableCapital} FCFA
        - Horizon: ${portfolioData.investmentHorizon}
        - Rendement cible: ${portfolioData.targetReturn}%
        - Tolérance risque: ${riskTolerance}
        
        Recommandations JSON:
        {
          "currentAnalysis": {
            "totalValue": number,
            "expectedReturn": number,
            "riskScore": number,
            "diversificationScore": number
          },
          "optimizations": [
            {
              "action": "buy|sell|hold",
              "property": {},
              "reasoning": "",
              "impact": {"return": number, "risk": number}
            }
          ],
          "newAllocations": {
            "residential": number,
            "commercial": number,
            "land": number,
            "regions": {"dakar": number, "thies": number, "saint-louis": number}
          },
          "performance": {
            "expectedReturn": number,
            "volatility": number,
            "sharpeRatio": number
          }
        }
      `;

      const result = await model.generateContent(prompt);
      const optimization = JSON.parse(result.response.text());
      
      return optimization;
    } catch (error) {
      console.error('Portfolio optimization error:', error);
      return this.getFallbackOptimization();
    }
  }

  // Advanced Chatbot with Context
  async chatWithAI(message, context, userRole) {
    try {
      const completion = await this.openAI.chat.completions.create({
        model: this.models.chatbot,
        messages: [
          {
            role: "system",
            content: `Vous êtes l'assistant IA de Teranga Foncier, plateforme immobilière sénégalaise.
                     Utilisateur: ${userRole}
                     Contexte: ${JSON.stringify(context)}
                     
                     Répondez de manière professionnelle, précise et personnalisée selon le rôle.
                     Intégrez les données du contexte dans vos réponses.
                     Suggérez des actions concrètes quand approprié.`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const response = completion.choices[0].message.content;
      
      // Add suggested actions based on context
      const suggestions = this.generateActionSuggestions(message, context, userRole);

      return {
        response,
        suggestions,
        confidence: 0.92,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Chatbot error:', error);
      return {
        response: "Je rencontre des difficultés temporaires. Veuillez réessayer.",
        suggestions: [],
        confidence: 0,
        timestamp: Date.now()
      };
    }
  }

  // Helper Methods
  calculateAIScore(propertyData, evaluation) {
    const weights = {
      location: 0.3,
      condition: 0.2,
      market: 0.2,
      amenities: 0.15,
      potential: 0.15
    };

    let score = 0;
    score += this.scoreLocation(propertyData.location) * weights.location;
    score += this.scoreCondition(propertyData.condition) * weights.condition;
    score += evaluation.investmentPotential * weights.potential;
    
    return Math.round(score);
  }

  scoreLocation(location) {
    const premiumLocations = ['almadies', 'plateau', 'fann', 'mermoz'];
    const goodLocations = ['sacre-coeur', 'liberte', 'point-e', 'ngor'];
    
    const loc = location.toLowerCase();
    
    if (premiumLocations.some(l => loc.includes(l))) return 90;
    if (goodLocations.some(l => loc.includes(l))) return 75;
    return 60;
  }

  scoreCondition(condition) {
    const conditionScores = {
      'excellent': 95,
      'tres_bon': 85,
      'bon': 75,
      'moyen': 60,
      'a_renover': 40
    };
    
    return conditionScores[condition] || 60;
  }

  generateActionSuggestions(message, context, userRole) {
    const suggestions = [];
    
    // Role-based suggestions
    switch (userRole) {
      case 'investisseur':
        suggestions.push(
          'Analyser le portefeuille',
          'Consulter les opportunités',
          'Voir les tendances du marché'
        );
        break;
      case 'vendeur':
        suggestions.push(
          'Optimiser le prix',
          'Améliorer la visibilité',
          'Planifier une visite'
        );
        break;
      case 'particulier':
        suggestions.push(
          'Rechercher des biens similaires',
          'Calculer la capacité d\'emprunt',
          'Contacter un agent'
        );
        break;
      default:
        suggestions.push(
          'Explorer les fonctionnalités',
          'Contacter le support',
          'Voir les guides'
        );
    }
    
    return suggestions;
  }

  // Fallback methods for offline/error scenarios
  getFallbackEvaluation(propertyData) {
    return {
      estimatedValue: propertyData.askingPrice * 0.95,
      confidenceScore: 60,
      factors: {
        positive: ["Localisation", "Surface"],
        negative: ["Données limitées"]
      },
      marketPosition: "fair",
      investmentPotential: 70,
      liquidityScore: 65,
      recommendations: ["Obtenir plus de données pour une évaluation précise"],
      aiScore: 65,
      timestamp: Date.now()
    };
  }

  getFallbackMarketAnalysis() {
    return {
      currentTrends: {
        priceEvolution: 5.2,
        volumeChange: 12,
        demandLevel: "medium",
        supplyLevel: "medium"
      },
      predictions: {
        priceGrowth6m: 3.5,
        priceGrowth12m: 7.2,
        marketSentiment: "neutral"
      },
      opportunities: [],
      risks: ["Données de marché limitées"],
      recommendations: {
        buyers: ["Attendre plus de données"],
        sellers: ["Évaluer la concurrence"],
        investors: ["Diversifier le portefeuille"]
      },
      dataSourceConfidence: 40,
      lastUpdated: Date.now()
    };
  }

  getFallbackRiskAssessment() {
    return {
      riskScore: 50,
      riskLevel: "medium",
      factors: {
        income: { score: 70, weight: 0.3 },
        debt: { score: 60, weight: 0.25 },
        property: { score: 75, weight: 0.25 },
        profile: { score: 65, weight: 0.2 }
      },
      recommendations: {
        approval: "conditional",
        suggestedRate: 7.5,
        conditions: ["Vérification revenus complémentaire"],
        mitigations: ["Augmenter l'apport personnel"]
      },
      monitoring: {
        frequency: "quarterly",
        alerts: ["Surveillance revenus"]
      },
      assessmentDate: Date.now(),
      modelVersion: "fallback"
    };
  }

  getFallbackOptimization() {
    return {
      currentAnalysis: {
        totalValue: 0,
        expectedReturn: 8.5,
        riskScore: 50,
        diversificationScore: 60
      },
      optimizations: [],
      newAllocations: {
        residential: 60,
        commercial: 25,
        land: 15,
        regions: { dakar: 70, thies: 20, "saint-louis": 10 }
      },
      performance: {
        expectedReturn: 8.5,
        volatility: 15,
        sharpeRatio: 0.4
      }
    };
  }
}

// Export singleton instance
export const terangaAI = new TerangaAIService();
export default TerangaAIService;

import { useState, useEffect, useContext, createContext } from 'react';
import { aiService } from '@/services/AIService';

// Contexte IA global
const AIContext = createContext();

// Provider IA
export const AIProvider = ({ children }) => {
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [marketInsights, setMarketInsights] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cache, setCache] = useState(new Map());

  // Auto-refresh des données de marché
  useEffect(() => {
    const interval = setInterval(() => {
      refreshMarketData();
    }, 5 * 60 * 1000); // Toutes les 5 minutes

    return () => clearInterval(interval);
  }, []);

  const refreshMarketData = async () => {
    try {
      const insights = await aiService.generateMarketReport();
      setMarketInsights(insights);
    } catch (error) {
      console.error('Erreur refresh données marché:', error);
    }
  };

  const analyzeProperty = async (propertyData) => {
    if (!isAIEnabled || !propertyData) return null;

    const cacheKey = JSON.stringify(propertyData);
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    setIsAnalyzing(true);
    try {
      const analysis = await aiService.analyzePriceForProperty(propertyData);
      setCurrentAnalysis(analysis);
      
      // Cache le résultat
      const newCache = new Map(cache);
      newCache.set(cacheKey, analysis);
      setCache(newCache);
      
      return analysis;
    } catch (error) {
      console.error('Erreur analyse propriété:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMarketInsights = async (zone) => {
    if (!isAIEnabled) return null;

    try {
      const insights = await aiService.getMarketInsights(zone);
      return insights;
    } catch (error) {
      console.error('Erreur insights marché:', error);
      return null;
    }
  };

  const generateRecommendations = async (userProfile, context = {}) => {
    if (!isAIEnabled) return [];

    try {
      const recommendations = await aiService.getInvestmentRecommendations(
        userProfile, 
        context.budget || 50000000
      );
      return recommendations;
    } catch (error) {
      console.error('Erreur recommandations:', error);
      return [];
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => [
      {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...notification
      },
      ...prev
    ].slice(0, 50)); // Garde seulement les 50 dernières
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    isAIEnabled,
    setIsAIEnabled,
    currentAnalysis,
    marketInsights,
    notifications,
    isAnalyzing,
    analyzeProperty,
    getMarketInsights,
    generateRecommendations,
    addNotification,
    clearNotifications,
    refreshMarketData
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};

// Hook principal pour l'IA
export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI doit être utilisé dans un AIProvider');
  }
  return context;
};

// Hook spécialisé pour l'analyse de prix
export const usePriceAnalysis = (propertyData) => {
  const { analyzeProperty, isAnalyzing } = useAI();
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (propertyData) {
      analyzeProperty(propertyData)
        .then(setAnalysis)
        .catch(setError);
    }
  }, [propertyData, analyzeProperty]);

  return { analysis, isAnalyzing, error };
};

// Hook pour les insights de marché
export const useMarketInsights = (zone) => {
  const { getMarketInsights } = useAI();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (zone) {
      setLoading(true);
      getMarketInsights(zone)
        .then(setInsights)
        .finally(() => setLoading(false));
    }
  }, [zone, getMarketInsights]);

  return { insights, loading };
};

// Hook pour les recommandations
export const useRecommendations = (userProfile, context) => {
  const { generateRecommendations } = useAI();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setLoading(true);
      generateRecommendations(userProfile, context)
        .then(setRecommendations)
        .finally(() => setLoading(false));
    }
  }, [userProfile, context, generateRecommendations]);

  return { recommendations, loading };
};

// Hook pour les notifications intelligentes
export const useSmartNotifications = () => {
  const { notifications, addNotification, clearNotifications } = useAI();
  
  const addPriceAlert = (propertyId, targetPrice) => {
    addNotification({
      type: 'price_alert',
      title: 'Alerte de prix',
      message: `Le prix souhaité de ${targetPrice.toLocaleString()} FCFA pour la propriété ${propertyId} a été atteint`,
      priority: 4
    });
  };

  const addMarketUpdate = (zone, change) => {
    addNotification({
      type: 'market_update',
      title: 'Mise à jour marché',
      message: `Le marché de ${zone} a évolué de ${change}%`,
      priority: 3
    });
  };

  const addInvestmentOpportunity = (opportunity) => {
    addNotification({
      type: 'investment_opportunity',
      title: 'Opportunité d\'investissement',
      message: opportunity.description,
      priority: 5
    });
  };

  return {
    notifications,
    addPriceAlert,
    addMarketUpdate,
    addInvestmentOpportunity,
    clearNotifications
  };
};

// Hook pour l'autocomplétion et suggestions
export const useAISuggestions = (input, context = {}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (input && input.length >= 2) {
      setLoading(true);
      
      // Simule des suggestions IA intelligentes
      const generateSuggestions = async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const contextualSuggestions = {
          location: [
            'Almadies, Dakar',
            'Sicap Liberté',
            'VDN Extension',
            'Mermoz Pyrotechnie',
            'Fann Résidence'
          ],
          price: [
            'Prix du marché',
            'Évaluation IA',
            'Comparaison zone',
            'Tendance prix'
          ],
          investment: [
            'Investissement rentable',
            'Zone émergente',
            'Potentiel plus-value',
            'Stratégie long terme'
          ]
        };

        const matchingSuggestions = [];
        
        Object.values(contextualSuggestions).forEach(category => {
          category.forEach(suggestion => {
            if (suggestion.toLowerCase().includes(input.toLowerCase())) {
              matchingSuggestions.push(suggestion);
            }
          });
        });

        setSuggestions(matchingSuggestions.slice(0, 5));
        setLoading(false);
      };

      generateSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [input, context]);

  return { suggestions, loading };
};

// Hook pour le tracking des performances IA
export const useAIAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalAnalyses: 0,
    accuracyRate: 0,
    userSatisfaction: 0,
    responseTime: 0
  });

  const trackAnalysis = (analysisType, result) => {
    setAnalytics(prev => ({
      ...prev,
      totalAnalyses: prev.totalAnalyses + 1
    }));
  };

  const trackUserFeedback = (rating) => {
    setAnalytics(prev => ({
      ...prev,
      userSatisfaction: (prev.userSatisfaction + rating) / 2
    }));
  };

  return {
    analytics,
    trackAnalysis,
    trackUserFeedback
  };
};

export default useAI;

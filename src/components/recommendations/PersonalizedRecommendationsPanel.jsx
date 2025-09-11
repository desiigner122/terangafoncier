/**
 * 🎯 PANNEAU RECOMMANDATIONS PERSONNALISÉES - TERANGA FONCIER
 * ===========================================================
 * 
 * Interface utilisateur pour les recommandations IA personnalisées
 */

import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, MapPin, Clock, Filter, RefreshCw, Heart, Eye } from 'lucide-react';
import { recommendationEngine } from '../../services/PersonalizedRecommendationEngine';
import { useAuth } from '../../contexts/SupabaseAuthContextFixed';

const PersonalizedRecommendationsPanel = ({ className = "" }) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('matching');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  const loadRecommendations = async (forceRefresh = false) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const result = await recommendationEngine.generatePersonalizedRecommendations(
        user.id,
        { forceRefresh }
      );
      
      setRecommendations(result);
    } catch (error) {
      console.error('❌ Erreur chargement recommandations:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRecommendations(true);
  };

  const formatPrice = (price) => {
    return (price / 1000000).toFixed(1) + 'M FCFA';
  };

  const getUrgencyColor = (level) => {
    const colors = {
      'LOW': 'text-green-600 bg-green-100',
      'MEDIUM': 'text-yellow-600 bg-yellow-100', 
      'HIGH': 'text-orange-600 bg-orange-100',
      'URGENT': 'text-red-600 bg-red-100'
    };
    return colors[level] || 'text-gray-600 bg-gray-100';
  };

  const getConfidenceColor = (score) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const tabs = [
    { id: 'matching', label: 'Correspondances', icon: Heart },
    { id: 'investment', label: 'Investissements', icon: TrendingUp },
    { id: 'areas', label: 'Zones', icon: MapPin },
    { id: 'urgent', label: 'Urgent', icon: Clock }
  ];

  const renderPropertyCard = (property, showBadges = true) => (
    <div key={property.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
        {property.images?.[0] ? (
          <img 
            src={property.images[0].url} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600">
            <MapPin className="w-12 h-12 text-white opacity-50" />
          </div>
        )}
        
        {showBadges && (
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {property.matchScore && (
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(property.matchScore)}`}>
                {(property.matchScore * 100).toFixed(0)}% match
              </div>
            )}
            
            {property.urgencyLevel && (
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(property.urgencyLevel)}`}>
                {property.urgencyLevel}
              </div>
            )}
          </div>
        )}

        <div className="absolute top-3 right-3">
          <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {property.title || `${property.type} ${property.location}`}
          </h3>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600">
              {formatPrice(property.price)}
            </p>
            {property.priceForecasts?.['6_months'] && (
              <p className="text-sm text-green-600">
                +{property.priceForecasts['6_months'].change_percentage}% (6m)
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{property.location}</span>
          <span>•</span>
          <span>{property.surface} m²</span>
          <span>•</span>
          <span className="capitalize">{property.type}</span>
        </div>

        {/* Raisons de recommandation */}
        {property.recommendationReasons && property.recommendationReasons.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-500 mb-1">Pourquoi cette propriété:</p>
            <div className="flex flex-wrap gap-1">
              {property.recommendationReasons.slice(0, 2).map((reason, index) => (
                <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                  {reason}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">
              Voir détails
            </button>
            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors">
              Contacter agent
            </button>
          </div>
          
          {property.investmentPotential && (
            <div className="flex items-center space-x-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-medium">
                {(property.investmentPotential * 100).toFixed(0)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderZoneCard = (zone) => (
    <div key={zone.zone} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{zone.zone}</h3>
          <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(zone.score)}`}>
            Score: {(zone.score * 100).toFixed(0)}%
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Prix moyen</p>
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(zone.properties.avgPrice)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <div>
          <p className="text-gray-500">Biens disponibles</p>
          <p className="font-semibold">{zone.properties.available}</p>
        </div>
        <div>
          <p className="text-gray-500">Évolution prix</p>
          <p className={`font-semibold ${zone.properties.priceEvolution > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {zone.properties.priceEvolution > 0 ? '+' : ''}{zone.properties.priceEvolution}%
          </p>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs font-medium text-gray-500 mb-1">Avantages:</p>
        <div className="flex flex-wrap gap-1">
          {zone.reasons.slice(0, 3).map((reason, index) => (
            <span key={index} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
              {reason}
            </span>
          ))}
        </div>
      </div>

      <button className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">
        Explorer {zone.zone}
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-3">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 text-center ${className}`}>
        <p className="text-gray-500">Aucune recommandation disponible</p>
        <button 
          onClick={() => loadRecommendations(true)}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Générer recommandations
        </button>
      </div>
    );
  }

  const activeData = recommendations.recommendations[activeTab === 'matching' ? 'matchingProperties' : 
                     activeTab === 'investment' ? 'investmentOpportunities' :
                     activeTab === 'areas' ? 'recommendedAreas' : 
                     'urgentOpportunities'];

  return (
    <div className={`bg-white rounded-xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Recommandations IA
              </h3>
              <p className="text-sm text-gray-500">
                Personnalisées pour vous • {recommendations.metadata.confidence > 0.8 ? 'Haute confiance' : 'Confiance moyenne'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              {recommendations.metadata.totalProperties} suggestions
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {activeData?.length > 0 && (
                <span className="px-1.5 py-0.5 bg-blue-200 text-blue-700 text-xs rounded-full">
                  {activeData.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        {activeTab === 'areas' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeData?.map(renderZoneCard)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeData?.map(property => renderPropertyCard(property))}
          </div>
        )}

        {(!activeData || activeData.length === 0) && (
          <div className="text-center py-12">
            <div className="p-3 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
              <Eye className="w-10 h-10 text-gray-400 mx-auto mt-3" />
            </div>
            <p className="text-gray-500 mb-2">Aucune recommandation pour cette catégorie</p>
            <p className="text-sm text-gray-400">Complétez votre profil pour des suggestions personnalisées</p>
          </div>
        )}
      </div>

      {/* Footer avec insights */}
      {recommendations.insights && (
        <div className="p-6 pt-0">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">💡 Insights personnalisés</h4>
            {recommendations.insights.investmentAdvice?.slice(0, 2).map((advice, index) => (
              <p key={index} className="text-sm text-gray-700 mb-1">• {advice}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizedRecommendationsPanel;

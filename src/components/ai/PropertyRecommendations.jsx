/**
 * @file PropertyRecommendations.jsx
 * @description Recommandations personnalisées par IA
 * @created 2025-11-03
 * @week 3 - Day 1-5
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, TrendingUp, MapPin, DollarSign, Home, Heart, 
  ArrowRight, Loader2, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const PropertyRecommendations = ({ userId, maxRecommendations = 6 }) => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger recommandations
  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/ai/recommendations/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
        }
      );

      setRecommendations(response.data.recommendations?.slice(0, maxRecommendations) || []);
    } catch (err) {
      console.error('Erreur chargement recommandations:', err);
      setError('Impossible de charger les recommandations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId && session) {
      fetchRecommendations();
    }
  }, [userId, session]);

  // Couleur selon score de match
  const getMatchColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-300';
    if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-300';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-300';
    return 'text-gray-600 bg-gray-50 border-gray-300';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <CardTitle>Recommandations IA</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-600">Analyse de vos préférences...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <CardTitle>Recommandations IA</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchRecommendations} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <CardTitle>Recommandations IA</CardTitle>
          </div>
          <CardDescription>
            Aucune recommandation pour le moment. Explorez des propriétés pour obtenir des suggestions personnalisées.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Recommandations pour vous</h3>
          <Badge className="bg-purple-100 text-purple-800">IA Teranga</Badge>
        </div>
        <Button onClick={fetchRecommendations} variant="ghost" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec, index) => {
          const matchColor = getMatchColor(rec.matchScore);
          
          return (
            <motion.div
              key={rec.propertyId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative">
                  {/* Image */}
                  <div className="aspect-video w-full bg-gray-200 rounded-t-lg overflow-hidden">
                    {rec.property?.images?.[0] ? (
                      <img 
                        src={rec.property.images[0]} 
                        alt={rec.property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Badge IA */}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-purple-600 text-white border-0">
                      <Sparkles className="w-3 h-3 mr-1" />
                      IA recommande
                    </Badge>
                  </div>

                  {/* Score match */}
                  <div className="absolute top-2 right-2">
                    <div className={`${matchColor} border-2 rounded-full px-3 py-1 font-bold text-sm`}>
                      {Math.round(rec.matchScore)}% match
                    </div>
                  </div>
                </div>

                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {/* Titre */}
                    <h4 className="font-semibold text-gray-900 line-clamp-1">
                      {rec.property?.title}
                    </h4>

                    {/* Localisation */}
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{rec.property?.location}</span>
                    </div>

                    {/* Prix */}
                    <div className="flex items-center gap-1 text-lg font-bold text-emerald-600">
                      <DollarSign className="w-5 h-5" />
                      <span>{rec.property?.price?.toLocaleString('fr-FR')} FCFA</span>
                    </div>

                    {/* Raisons */}
                    {rec.reasons && rec.reasons.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700">Pourquoi cette recommandation:</p>
                        <ul className="space-y-1">
                          {rec.reasons.slice(0, 2).map((reason, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                              <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0 text-purple-600" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Barre de match */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Correspondance</span>
                        <span className="font-medium">{Math.round(rec.matchScore)}%</span>
                      </div>
                      <Progress value={rec.matchScore} className="h-2" />
                    </div>

                    {/* Bouton */}
                    <Button
                      onClick={() => navigate(`/properties/${rec.propertyId}`)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      size="sm"
                    >
                      Voir détails
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Composant compact pour sidebar
export const PropertyRecommendationsCompact = ({ userId, maxItems = 3 }) => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/ai/recommendations/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`
            }
          }
        );

        setRecommendations(response.data.recommendations?.slice(0, maxItems) || []);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && session) {
      fetchRecommendations();
    }
  }, [userId, session, maxItems]);

  if (isLoading || recommendations.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <CardTitle className="text-sm">Recommandé pour vous</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {recommendations.map((rec) => (
          <div
            key={rec.propertyId}
            onClick={() => navigate(`/properties/${rec.propertyId}`)}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
              {rec.property?.images?.[0] ? (
                <img 
                  src={rec.property.images[0]} 
                  alt={rec.property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                {rec.property?.title}
              </p>
              <p className="text-xs text-gray-600 line-clamp-1">
                {rec.property?.location}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-purple-100 text-purple-800 text-xs">
                  {Math.round(rec.matchScore)}% match
                </Badge>
                <p className="text-xs font-bold text-emerald-600">
                  {(rec.property?.price / 1000000).toFixed(1)}M FCFA
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PropertyRecommendations;

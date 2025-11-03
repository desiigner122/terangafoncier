/**
 * @file AIPropertyEvaluation.jsx
 * @description Évaluation prix IA pour propriétés
 * @created 2025-11-03
 * @week 3 - Day 1-5
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Minus, Sparkles, Calculator, 
  AlertCircle, CheckCircle2, Loader2, Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const AIPropertyEvaluation = ({ propertyId, listedPrice, onEvaluationComplete }) => {
  const { session } = useAuth();
  const [evaluation, setEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Charger évaluation existante
  useEffect(() => {
    const fetchExistingEvaluation = async () => {
      try {
        const { data: property } = await axios.get(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/properties?id=eq.${propertyId}&select=ai_estimated_price,ai_price_confidence,ai_price_range_min,ai_price_range_max,ai_evaluated_at`,
          {
            headers: {
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${session?.access_token}`
            }
          }
        );

        if (property?.[0]?.ai_estimated_price) {
          setEvaluation({
            estimatedPrice: property[0].ai_estimated_price,
            confidence: property[0].ai_price_confidence,
            priceRange: {
              min: property[0].ai_price_range_min,
              max: property[0].ai_price_range_max
            }
          });
        }
      } catch (error) {
        console.error('Erreur chargement évaluation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId && session) {
      fetchExistingEvaluation();
    }
  }, [propertyId, session]);

  // Lancer évaluation IA
  const handleEvaluate = async () => {
    setIsEvaluating(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/ai/evaluate-property`,
        { propertyId },
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
        }
      );

      const { evaluation: evalData } = response.data;
      setEvaluation(evalData);
      
      toast.success('✅ Évaluation IA terminée');

      if (onEvaluationComplete) {
        onEvaluationComplete(evalData);
      }
    } catch (error) {
      console.error('Erreur évaluation:', error);
      toast.error('Échec de l\'évaluation IA');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Calculer différence avec prix affiché
  const getPriceDifference = () => {
    if (!evaluation || !listedPrice) return null;

    const diff = listedPrice - evaluation.estimatedPrice;
    const percentDiff = (diff / evaluation.estimatedPrice) * 100;

    return {
      amount: Math.abs(diff),
      percent: Math.abs(percentDiff),
      isOverpriced: diff > 0,
      isUnderpriced: diff < 0,
      isFair: Math.abs(percentDiff) < 5
    };
  };

  const priceDiff = getPriceDifference();

  // Configuration confiance
  const getConfidenceConfig = (confidence) => {
    if (confidence >= 90) return { label: 'Très élevée', color: 'text-green-600', bg: 'bg-green-50' };
    if (confidence >= 75) return { label: 'Élevée', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (confidence >= 60) return { label: 'Moyenne', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: 'Faible', color: 'text-orange-600', bg: 'bg-orange-50' };
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Calculator className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Évaluation Prix IA</CardTitle>
            <CardDescription>
              Estimation intelligente basée sur le marché
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!evaluation ? (
          <>
            <Alert className="bg-blue-50 border-blue-200">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                <strong>L'IA Teranga analyse:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Prix du marché dans la zone</li>
                  <li>Caractéristiques de la propriété</li>
                  <li>Tendances de prix historiques</li>
                  <li>Comparaison avec propriétés similaires</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Évaluation en cours...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5 mr-2" />
                  Évaluer avec l'IA
                </>
              )}
            </Button>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Prix estimé IA */}
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-4 border-2 border-purple-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-800">Prix estimé IA</span>
                <Badge className="bg-purple-600 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  IA Teranga
                </Badge>
              </div>
              <p className="text-3xl font-bold text-purple-900">
                {evaluation.estimatedPrice.toLocaleString('fr-FR')} FCFA
              </p>
            </div>

            {/* Fourchette de prix */}
            {evaluation.priceRange && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">Fourchette de prix</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Minimum</p>
                    <p className="text-lg font-bold text-gray-900">
                      {evaluation.priceRange.min.toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <Minus className="w-4 h-4 text-gray-400" />
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Maximum</p>
                    <p className="text-lg font-bold text-gray-900">
                      {evaluation.priceRange.max.toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Confiance */}
            {evaluation.confidence && (
              <div className="space-y-2">
                {(() => {
                  const confidenceConfig = getConfidenceConfig(evaluation.confidence);
                  return (
                    <div className={`${confidenceConfig.bg} rounded-lg p-3 border border-gray-200`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Niveau de confiance</span>
                        <Badge className={confidenceConfig.color}>
                          {confidenceConfig.label}
                        </Badge>
                      </div>
                      <Progress value={evaluation.confidence} className="h-2" />
                      <p className={`text-xs ${confidenceConfig.color} mt-1 text-right font-medium`}>
                        {Math.round(evaluation.confidence)}%
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Comparaison avec prix affiché */}
            {priceDiff && listedPrice && (
              <Alert className={
                priceDiff.isFair ? 'bg-green-50 border-green-200' :
                priceDiff.isOverpriced ? 'bg-orange-50 border-orange-200' :
                'bg-blue-50 border-blue-200'
              }>
                {priceDiff.isFair ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Prix équitable ✓</strong>
                      <p className="text-sm mt-1">
                        Le prix affiché ({listedPrice.toLocaleString('fr-FR')} FCFA) correspond à l'estimation IA
                        (différence: {priceDiff.percent.toFixed(1)}%)
                      </p>
                    </AlertDescription>
                  </>
                ) : priceDiff.isOverpriced ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      <strong>Prix supérieur au marché</strong>
                      <p className="text-sm mt-1">
                        Le prix affiché est <strong>{priceDiff.percent.toFixed(1)}%</strong> supérieur à l'estimation IA
                        <br />
                        Surcoût: <strong>{priceDiff.amount.toLocaleString('fr-FR')} FCFA</strong>
                      </p>
                    </AlertDescription>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Prix inférieur au marché</strong>
                      <p className="text-sm mt-1">
                        Le prix affiché est <strong>{priceDiff.percent.toFixed(1)}%</strong> inférieur à l'estimation IA
                        <br />
                        Économie potentielle: <strong>{priceDiff.amount.toLocaleString('fr-FR')} FCFA</strong>
                      </p>
                    </AlertDescription>
                  </>
                )}
              </Alert>
            )}

            {/* Note explicative */}
            <Alert className="bg-purple-50 border-purple-200">
              <Info className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-800 text-xs">
                Cette évaluation est générée par l'IA Teranga en analysant des milliers de transactions
                immobilières similaires. Elle constitue une estimation indicative et ne remplace pas
                une expertise professionnelle.
              </AlertDescription>
            </Alert>

            {/* Bouton réévaluer */}
            <Button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Réévaluation...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Réévaluer
                </>
              )}
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

// Badge compact pour cartes
export const AIEvaluationBadge = ({ estimatedPrice, confidence, listedPrice }) => {
  if (!estimatedPrice) return null;

  const diff = listedPrice ? ((listedPrice - estimatedPrice) / estimatedPrice) * 100 : 0;
  const isFair = Math.abs(diff) < 5;
  const isOverpriced = diff > 5;

  return (
    <div className="flex items-center gap-2">
      <Badge className="bg-purple-100 text-purple-800 border-purple-300">
        <Sparkles className="w-3 h-3 mr-1" />
        Prix IA: {(estimatedPrice / 1000000).toFixed(1)}M
      </Badge>
      
      {listedPrice && !isFair && (
        <Badge className={
          isOverpriced 
            ? 'bg-orange-100 text-orange-800 border-orange-300' 
            : 'bg-blue-100 text-blue-800 border-blue-300'
        }>
          {isOverpriced ? (
            <>
              <TrendingUp className="w-3 h-3 mr-1" />
              +{Math.abs(diff).toFixed(0)}%
            </>
          ) : (
            <>
              <TrendingDown className="w-3 h-3 mr-1" />
              -{Math.abs(diff).toFixed(0)}%
            </>
          )}
        </Badge>
      )}
    </div>
  );
};

export default AIPropertyEvaluation;

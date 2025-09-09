import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Target,
  Zap,
  Brain,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Eye,
  Calculator,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { aiService } from '@/services/AIService';

const PriceAnalysisWidget = ({ propertyData, onAnalysisComplete, className = '' }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (propertyData && (propertyData.location || propertyData.surface)) {
      performAnalysis();
    }
  }, [propertyData]);

  const performAnalysis = async () => {
    if (!propertyData) return;
    
    setIsAnalyzing(true);
    
    try {
      const result = await aiService.analyzePriceForProperty(propertyData);
      setAnalysis(result);
      setConfidence(result.analysis.confidence * 100);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (error) {
      console.error('Erreur analyse prix:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (confidence) => {
    if (confidence >= 80) return 'Très fiable';
    if (confidence >= 60) return 'Modérément fiable';
    return 'Estimation approximative';
  };

  const formatPrice = (price) => {
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)}B FCFA`;
    }
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M FCFA`;
    }
    return `${price.toLocaleString()} FCFA`;
  };

  if (!propertyData) {
    return (
      <Card className={`border-2 border-dashed border-gray-300 ${className}`}>
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Sélectionnez une propriété pour voir l'analyse IA</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-l-4 border-l-blue-500 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span className="text-lg">Analyse IA</span>
            <Badge variant="outline" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Alimenté par IA
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={performAnalysis}
            disabled={isAnalyzing}
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-sm">Analyse en cours...</span>
            </div>
            <Progress value={66} className="h-2" />
            <p className="text-xs text-gray-600">
              Analyse du marché, comparaison des prix, évaluation des caractéristiques...
            </p>
          </div>
        ) : analysis ? (
          <div className="space-y-4">
            {/* Prix estimé */}
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {formatPrice(analysis.priceRange.estimated)}
              </div>
              <div className="text-sm text-gray-600">Prix estimé</div>
              <div className="text-xs text-gray-500 mt-1">
                Fourchette: {formatPrice(analysis.priceRange.min)} - {formatPrice(analysis.priceRange.max)}
              </div>
            </div>

            {/* Niveau de confiance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Niveau de confiance</span>
                <span className={`text-sm font-bold ${getConfidenceColor(confidence)}`}>
                  {confidence.toFixed(0)}%
                </span>
              </div>
              <Progress value={confidence} className="h-2" />
              <div className="flex items-center gap-1">
                {confidence >= 80 ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : confidence >= 60 ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                ) : (
                  <Info className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-xs ${getConfidenceColor(confidence)}`}>
                  {getConfidenceText(confidence)}
                </span>
              </div>
            </div>

            {/* Facteurs d'évaluation */}
            {analysis.analysis.factors && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Facteurs pris en compte</h4>
                <div className="space-y-1">
                  {analysis.analysis.factors.map((factor, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tendance du marché */}
            {analysis.analysis.marketTrend && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Tendance marché</span>
                  <div className="flex items-center gap-1">
                    {analysis.analysis.marketTrend.direction === 'hausse' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm font-bold text-green-600">
                      +{analysis.analysis.marketTrend.percentage}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  {analysis.analysis.marketTrend.description}
                </p>
              </div>
            )}

            {/* Recommandations */}
            {analysis.analysis.recommendations && showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <h4 className="text-sm font-medium">Recommandations IA</h4>
                <div className="space-y-1">
                  {analysis.analysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs">
                      <Target className="w-3 h-3 text-blue-500 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showDetails ? 'Masquer' : 'Voir'} détails
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Logique pour ouvrir calculateur avancé
                }}
              >
                <Calculator className="w-4 h-4" />
              </Button>
            </div>

            {/* Timestamp */}
            <div className="text-xs text-gray-500 text-center pt-2 border-t">
              Analysé le {new Date(analysis.timestamp).toLocaleString('fr-FR')}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-3">
              Cliquez pour analyser cette propriété avec l'IA
            </p>
            <Button onClick={performAnalysis} size="sm">
              <Zap className="w-4 h-4 mr-2" />
              Lancer l'analyse
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceAnalysisWidget;

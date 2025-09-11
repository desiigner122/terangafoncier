/**
 * 🚀 COMPOSANT IA UNIVERSEL - INTÉGRATION 1-CLIC
 * ===========================================
 * 
 * Composant tout-en-un pour intégrer l'IA dans n'importe quel dashboard
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain,
  TrendingUp,
  Target,
  Sparkles,
  BarChart3,
  MapPin,
  Calculator,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { AIEstimationWidget, AIMarketInsights } from './AIComponents';
import useAIDashboard from '../hooks/useAIDashboard';

/**
 * Composant IA universel pour tous les dashboards
 * Usage : <UniversalAIDashboard dashboardType="PARTICULIER" contextData={data} />
 */
export const UniversalAIDashboard = ({ 
  dashboardType, 
  contextData = {},
  layout = 'full', // 'full', 'compact', 'minimal'
  className = ''
}) => {
  const {
    aiMetrics,
    aiLoading,
    aiError,
    quickEstimate,
    marketInsights,
    getPersonalizedRecommendations,
    getAIKPIs,
    getAIScore,
    isReady,
    hasData
  } = useAIDashboard(dashboardType, contextData);

  const aiScore = getAIScore();
  const recommendations = getPersonalizedRecommendations();
  const kpis = getAIKPIs();

  if (aiLoading) {
    return (
      <div className={`${className}`}>
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="animate-pulse">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (aiError) {
    return (
      <div className={`${className}`}>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Erreur IA</p>
                <p className="text-sm text-red-600">{aiError}</p>
                <Button size="sm" variant="outline" className="mt-2">
                  Réessayer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Layout minimal - juste le score IA
  if (layout === 'minimal') {
    return (
      <div className={`${className}`}>
        <Card className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium">IA Teranga</p>
                  <p className="text-sm text-gray-600">{aiScore.level}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {aiScore.score}/100
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Layout compact - score + quelques métriques
  if (layout === 'compact') {
    return (
      <div className={`${className} space-y-4`}>
        {/* Score IA principal */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Brain className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold">IA Teranga</h3>
                  <p className="text-sm text-gray-600">Dashboard {dashboardType}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{aiScore.score}</div>
                <div className="text-xs text-gray-500">{aiScore.level}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs rapides */}
        {kpis.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {kpis.slice(0, 3).map((kpi, index) => (
              <Card key={index} className="p-3">
                <div className="text-center">
                  <div className="text-lg font-bold">{kpi.value}</div>
                  <div className="text-xs text-gray-600">{kpi.label}</div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Layout full - interface complète
  return (
    <div className={`${className} space-y-6`}>
      {/* En-tête IA */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Brain className="h-12 w-12" />
                <div className="absolute -bottom-1 -right-1">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">IA Teranga</h2>
                <p className="text-blue-100">
                  Intelligence artificielle pour {dashboardType.toLowerCase()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{aiScore.score}</div>
              <div className="text-sm text-blue-100">Score IA</div>
              <Badge className="mt-1 bg-white/20 text-white">
                {aiScore.level}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs IA */}
      {kpis.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kpis.map((kpi, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className={`border-l-4 border-l-${kpi.color}-500`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{kpi.label}</p>
                      <p className="text-2xl font-bold">{kpi.value}</p>
                      {kpi.trend && (
                        <p className="text-xs text-gray-500 mt-1">{kpi.trend}</p>
                      )}
                    </div>
                    <TrendingUp className={`h-8 w-8 text-${kpi.color}-500`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recommandations IA */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Recommandations IA
            </CardTitle>
            <CardDescription>
              Suggestions personnalisées basées sur l'analyse IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      rec.priority === 'high' ? 'bg-red-500' :
                      rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">{rec.title}</p>
                      <p className="text-sm text-gray-600">{rec.message}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    {rec.action}
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Widgets IA principaux */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AIEstimationWidget className="w-full" />
        <AIMarketInsights region="Dakar" className="w-full" />
      </div>

      {/* Métriques avancées selon le type de dashboard */}
      {hasData && aiMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Métriques Avancées {dashboardType}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(aiMetrics).slice(0, 4).map(([key, value], index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">
                    {typeof value === 'object' && value?.valeur_totale ? 
                      `${Math.round(value.valeur_totale / 1000000)}M` :
                      typeof value === 'number' ? value.toLocaleString() :
                      value?.score || value?.niveau || 'N/A'
                    }
                  </div>
                  <div className="text-xs text-gray-600 capitalize">
                    {key.replace(/_/g, ' ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer IA */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>IA opérationnelle</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Mise à jour temps réel</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-4 w-4" />
                <span>Phase 1 - Données Sénégal</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UniversalAIDashboard;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building,
  MapPin,
  Calendar,
  Eye,
  Download,
  RefreshCw,
  Brain,
  Target,
  Activity,
  Zap,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { OpenAIService } from '../../../services/ai/OpenAIService';
import BlockchainWidget from '../../../components/dashboard/blockchain/BlockchainWidget';

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [iaInsights, setIaInsights] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Données analytiques mockup complètes
  const mockAnalyticsData = {
    kpis: [
      {
        id: 1,
        title: 'Chiffre d\'affaires',
        value: '45,250,000',
        unit: 'XOF',
        change: 18.5,
        period: 'vs mois dernier',
        icon: DollarSign,
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        id: 2,
        title: 'Nouvelles inscriptions',
        value: '2,847',
        unit: 'utilisateurs',
        change: 12.3,
        period: 'vs mois dernier',
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        id: 3,
        title: 'Propriétés listées',
        value: '1,234',
        unit: 'annonces',
        change: -2.4,
        period: 'vs mois dernier',
        icon: Building,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      },
      {
        id: 4,
        title: 'Taux de conversion',
        value: '8.7',
        unit: '%',
        change: 5.2,
        period: 'vs mois dernier',
        icon: Target,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      }
    ],
    regionPerformance: [
      { region: 'Dakar', transactions: 456, revenue: 18500000, growth: 15.2 },
      { region: 'Thiès', transactions: 234, revenue: 9800000, growth: 22.1 },
      { region: 'Saint-Louis', transactions: 187, revenue: 7200000, growth: -3.5 },
      { region: 'Kaolack', transactions: 145, revenue: 5900000, growth: 8.7 },
      { region: 'Ziguinchor', transactions: 98, revenue: 3850000, growth: 12.4 }
    ],
    propertyTypes: [
      { type: 'Maisons', count: 543, percentage: 42.1, avgPrice: 35000000 },
      { type: 'Appartements', count: 387, percentage: 30.0, avgPrice: 18500000 },
      { type: 'Terrains', count: 289, percentage: 22.4, avgPrice: 12000000 },
      { type: 'Commerces', count: 71, percentage: 5.5, avgPrice: 55000000 }
    ],
    userActivity: [
      { hour: '00h', visits: 45, conversions: 2 },
      { hour: '04h', visits: 23, conversions: 1 },
      { hour: '08h', visits: 189, conversions: 12 },
      { hour: '12h', visits: 267, conversions: 18 },
      { hour: '16h', visits: 234, conversions: 15 },
      { hour: '20h', visits: 198, conversions: 13 }
    ]
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    // Simulation de chargement des données
    setTimeout(() => {
      setAnalyticsData(mockAnalyticsData);
      generateIAInsights();
      setLoading(false);
    }, 1500);
  };

  const generateIAInsights = async () => {
    try {
      const insights = await OpenAIService.generateAnalyticsInsights({
        revenue: 45250000,
        users: 2847,
        properties: 1234,
        conversionRate: 8.7,
        topRegion: 'Dakar',
        growthRate: 15.2
      });
      setIaInsights(insights);
    } catch (error) {
      console.error('Erreur génération insights IA:', error);
      // Fallback avec insights mockup
      setIaInsights([
        {
          type: 'opportunity',
          title: 'Croissance forte à Thiès',
          description: 'La région de Thiès montre une croissance de 22.1%, représentant une opportunité d\'expansion.',
          priority: 'high',
          action: 'Augmenter le marketing local à Thiès'
        },
        {
          type: 'warning',
          title: 'Déclin à Saint-Louis',
          description: 'Saint-Louis affiche une croissance négative de -3.5%, nécessitant une attention particulière.',
          priority: 'medium',
          action: 'Analyser les causes et ajuster la stratégie'
        },
        {
          type: 'success',
          title: 'Excellent taux de conversion',
          description: 'Le taux de conversion de 8.7% dépasse la moyenne du secteur de 6.2%.',
          priority: 'low',
          action: 'Maintenir les stratégies actuelles'
        }
      ]);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="h-4 w-4" />;
      case 'warning': return <TrendingDown className="h-4 w-4" />;
      case 'success': return <Star className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chargement des analytics...
              </h3>
              <p className="text-gray-600">
                Analyse des données en cours
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                Analytics & Insights
              </h1>
              <p className="text-gray-600">
                Analyses complètes et insights IA de la plateforme
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
              </select>
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
        </motion.div>

        {/* KPIs Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {analyticsData.kpis?.map((kpi, index) => (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                      <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      kpi.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.change > 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {Math.abs(kpi.change)}%
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {kpi.value} {kpi.unit}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {kpi.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {kpi.period}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* IA Insights */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Insights IA
                </CardTitle>
                <CardDescription>
                  Analyses automatiques et recommandations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatePresence>
                  {iaInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          insight.type === 'opportunity' ? 'bg-green-100 text-green-600' :
                          insight.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {insight.title}
                            </h4>
                            <Badge className={`text-xs ${getPriorityColor(insight.priority)}`}>
                              {insight.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {insight.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Zap className="h-3 w-3 text-blue-500" />
                            <span className="text-xs text-blue-600 font-medium">
                              {insight.action}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance par région */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  Performance par région
                </CardTitle>
                <CardDescription>
                  Analyse des transactions et revenus par région
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.regionPerformance?.map((region, index) => (
                    <motion.div
                      key={region.region}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {region.region}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {region.transactions} transactions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(region.revenue)}
                        </p>
                        <div className={`flex items-center gap-1 text-sm ${
                          region.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {region.growth > 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          {Math.abs(region.growth)}%
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Types de propriétés */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-green-600" />
                  Répartition par type
                </CardTitle>
                <CardDescription>
                  Distribution des propriétés par catégorie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.propertyTypes?.map((type, index) => (
                    <motion.div
                      key={type.type}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {type.type}
                        </span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            {type.count}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({type.percentage}%)
                          </span>
                        </div>
                      </div>
                      <Progress value={type.percentage} className="h-2" />
                      <p className="text-xs text-gray-500">
                        Prix moyen: {formatCurrency(type.avgPrice)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activité utilisateurs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-600" />
                  Activité par heure
                </CardTitle>
                <CardDescription>
                  Trafic et conversions selon les heures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.userActivity?.map((activity, index) => (
                    <motion.div
                      key={activity.hour}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <span className="font-medium text-gray-900">
                          {activity.hour}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">
                            {activity.visits}
                          </p>
                          <p className="text-xs text-gray-500">
                            Visites
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-green-600">
                            {activity.conversions}
                          </p>
                          <p className="text-xs text-gray-500">
                            Conversions
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-blue-600">
                            {((activity.conversions / activity.visits) * 100).toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-500">
                            Taux
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Widget Blockchain */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <BlockchainWidget type="overview" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
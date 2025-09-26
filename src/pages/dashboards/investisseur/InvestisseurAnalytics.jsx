import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  BarChart3,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Building2,
  MapPin,
  Clock,
  Users,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const InvestisseurAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [loading, setLoading] = useState(true);

  const [analyticsData, setAnalyticsData] = useState({
    performance: {
      totalReturn: 145000000,
      returnRate: 18.5,
      bestInvestment: 'Centre Commercial Teranga',
      bestROI: 23.3,
      riskScore: 6.8
    },
    sectors: [
      { name: 'Résidentiel', percentage: 45, value: 382500000, color: 'bg-blue-500' },
      { name: 'Commercial', percentage: 35, value: 297500000, color: 'bg-green-500' },
      { name: 'Foncier', percentage: 20, value: 170000000, color: 'bg-purple-500' }
    ],
    trends: [
      { month: 'Jan', portfolio: 750, roi: 15.2 },
      { month: 'Fév', portfolio: 780, roi: 16.1 },
      { month: 'Mar', portfolio: 820, roi: 17.8 },
      { month: 'Avr', portfolio: 850, roi: 18.5 },
      { month: 'Mai', portfolio: 870, roi: 19.2 },
      { month: 'Jun', portfolio: 850, roi: 18.5 }
    ],
    regions: [
      { name: 'Dakar', investments: 8, value: 510000000, roi: 19.2 },
      { name: 'Thiès', investments: 2, value: 175000000, roi: 18.8 },
      { name: 'Saly', investments: 2, value: 165000000, roi: 16.5 }
    ],
    predictions: {
      nextMonth: { roi: 19.8, confidence: 85 },
      nextQuarter: { roi: 21.2, confidence: 78 },
      nextYear: { roi: 24.5, confidence: 65 }
    }
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyse des performances en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Portfolio</h1>
            <p className="text-gray-600">Analyse détaillée de vos performances d'investissement</p>
          </div>
          <div className="flex items-center space-x-3">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="3months">3 mois</option>
              <option value="6months">6 mois</option>
              <option value="1year">1 an</option>
              <option value="2years">2 ans</option>
            </select>
          </div>
        </div>

        {/* KPIs Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Rendement Total</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(analyticsData.performance.totalReturn)}
                  </p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">+{analyticsData.performance.returnRate}%</span>
                  </div>
                </div>
                <TrendingUp className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Meilleur ROI</p>
                  <p className="text-2xl font-bold text-green-900">
                    {analyticsData.performance.bestROI}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {analyticsData.performance.bestInvestment}
                  </p>
                </div>
                <Target className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Score de Risque</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {analyticsData.performance.riskScore}/10
                  </p>
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs mt-1">
                    Modéré
                  </Badge>
                </div>
                <Activity className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Prédiction 1 mois</p>
                  <p className="text-2xl font-bold text-orange-900">
                    +{analyticsData.predictions.nextMonth.roi}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Confiance: {analyticsData.predictions.nextMonth.confidence}%
                  </p>
                </div>
                <BarChart3 className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Analytics */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="sectors">Secteurs</TabsTrigger>
            <TabsTrigger value="regions">Régions</TabsTrigger>
            <TabsTrigger value="predictions">Prédictions</TabsTrigger>
          </TabsList>

          {/* Onglet Performance */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                    Évolution du Portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.trends.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{trend.month}</p>
                          <p className="text-sm text-gray-600">
                            {trend.portfolio}M XOF
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            +{trend.roi}%
                          </p>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${(trend.roi / 25) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Percent className="h-5 w-5 mr-2 text-purple-600" />
                    Métriques Clés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Taux de Rendement Moyen</span>
                        <span className="font-semibold">{analyticsData.performance.returnRate}%</span>
                      </div>
                      <Progress value={analyticsData.performance.returnRate} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Diversification</span>
                        <span className="font-semibold">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Liquidité</span>
                        <span className="font-semibold">72%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Stabilité</span>
                        <span className="font-semibold">91%</span>
                      </div>
                      <Progress value={91} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Secteurs */}
          <TabsContent value="sectors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-green-600" />
                  Répartition par Secteurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.sectors.map((sector, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded ${sector.color}`} />
                          <span className="font-medium">{sector.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{sector.percentage}%</p>
                          <p className="text-sm text-gray-600">{formatCurrency(sector.value)}</p>
                        </div>
                      </div>
                      <Progress value={sector.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Régions */}
          <TabsContent value="regions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                  Performance par Région
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.regions.map((region, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{region.name}</h3>
                          <p className="text-sm text-gray-600">
                            {region.investments} investissement{region.investments > 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">+{region.roi}%</p>
                          <p className="text-sm text-gray-600">ROI</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Valeur totale</span>
                        <span className="font-semibold">{formatCurrency(region.value)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Prédictions */}
          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border border-blue-200">
                <CardHeader>
                  <CardTitle className="text-center text-blue-700">1 Mois</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold text-blue-900 mb-2">
                    +{analyticsData.predictions.nextMonth.roi}%
                  </p>
                  <p className="text-sm text-gray-600 mb-3">ROI Prévu</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs">Confiance</span>
                      <span className="text-xs font-semibold">{analyticsData.predictions.nextMonth.confidence}%</span>
                    </div>
                    <Progress value={analyticsData.predictions.nextMonth.confidence} className="h-1" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-green-200">
                <CardHeader>
                  <CardTitle className="text-center text-green-700">3 Mois</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold text-green-900 mb-2">
                    +{analyticsData.predictions.nextQuarter.roi}%
                  </p>
                  <p className="text-sm text-gray-600 mb-3">ROI Prévu</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs">Confiance</span>
                      <span className="text-xs font-semibold">{analyticsData.predictions.nextQuarter.confidence}%</span>
                    </div>
                    <Progress value={analyticsData.predictions.nextQuarter.confidence} className="h-1" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-purple-200">
                <CardHeader>
                  <CardTitle className="text-center text-purple-700">1 An</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold text-purple-900 mb-2">
                    +{analyticsData.predictions.nextYear.roi}%
                  </p>
                  <p className="text-sm text-gray-600 mb-3">ROI Prévu</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs">Confiance</span>
                      <span className="text-xs font-semibold">{analyticsData.predictions.nextYear.confidence}%</span>
                    </div>
                    <Progress value={analyticsData.predictions.nextYear.confidence} className="h-1" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default InvestisseurAnalytics;
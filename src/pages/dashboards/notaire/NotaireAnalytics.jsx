import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  PieChart, 
  Activity, 
  Users, 
  DollarSign,
  FileText,
  Calendar,
  Award,
  Target,
  Star,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MapPin,
  MoreVertical,
  Bot,
  MousePointer,
  Maximize2,
  Settings2,
  Zap,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const NotaireAnalytics = () => {
  const [timeFilter, setTimeFilter] = useState('12m');
  const [isLoading, setIsLoading] = useState(false);

  // Données analytiques simulées
  const analyticsData = {
    revenue: {
      current: 24500000,
      previous: 22100000,
      growth: 10.9,
      data: [
        { month: 'Jan', revenue: 1800000, transactions: 12 },
        { month: 'Fév', revenue: 2100000, transactions: 14 },
        { month: 'Mar', revenue: 2400000, transactions: 16 },
        { month: 'Avr', revenue: 1900000, transactions: 11 },
        { month: 'Mai', revenue: 2300000, transactions: 15 },
        { month: 'Jun', revenue: 2500000, transactions: 17 },
        { month: 'Jul', revenue: 2200000, transactions: 13 },
        { month: 'Aoû', revenue: 2600000, transactions: 18 },
        { month: 'Sep', revenue: 2100000, transactions: 14 },
        { month: 'Oct', revenue: 2400000, transactions: 16 },
        { month: 'Nov', revenue: 2700000, transactions: 19 },
        { month: 'Déc', revenue: 2400000, transactions: 16 }
      ]
    },
    clientsSatisfaction: {
      average: 4.7,
      total: 892,
      distribution: [
        { rating: 5, count: 678, percentage: 76 },
        { rating: 4, count: 134, percentage: 15 },
        { rating: 3, count: 53, percentage: 6 },
        { rating: 2, count: 18, percentage: 2 },
        { rating: 1, count: 9, percentage: 1 }
      ]
    },
    transactionTypes: [
      { name: 'Ventes immobilières', value: 45, color: '#F59E0B', revenue: 11200000 },
      { name: 'Successions', value: 25, color: '#10B981', revenue: 6100000 },
      { name: 'Donations', value: 18, color: '#3B82F6', revenue: 4400000 },
      { name: 'Constitutions société', value: 8, color: '#8B5CF6', revenue: 1950000 },
      { name: 'Autres', value: 4, color: '#EF4444', revenue: 850000 }
    ],
    geographicDistribution: [
      { region: 'Dakar', transactions: 156, revenue: 15200000 },
      { region: 'Thiès', transactions: 89, revenue: 4600000 },
      { region: 'Saint-Louis', transactions: 67, revenue: 2800000 },
      { region: 'Ziguinchor', transactions: 45, revenue: 1400000 },
      { region: 'Kaolack', transactions: 38, revenue: 500000 }
    ],
    performanceMetrics: [
      { 
        metric: 'Temps moyen traitement',
        value: '12.5 jours',
        change: -8.3,
        target: '15 jours',
        status: 'excellent'
      },
      {
        metric: 'Taux de satisfaction client',
        value: '94.2%',
        change: 2.1,
        target: '90%',
        status: 'excellent'
      },
      {
        metric: 'Documents authentifiés',
        value: '98.9%',
        change: 1.2,
        target: '95%',
        status: 'excellent'
      },
      {
        metric: 'Revenus par transaction',
        value: '156K FCFA',
        change: 5.7,
        target: '150K FCFA',
        status: 'bon'
      }
    ]
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Données actualisées",
        description: "Analytics mises à jour avec succès",
        variant: "success"
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleExportReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Rapport exporté",
        description: "Rapport d'analytics généré avec succès",
        variant: "success"
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleViewMetricDetail = (metricName) => {
    window.safeGlobalToast({
      title: "Détail métrique",
      description: `Affichage des détails pour ${metricName}`,
      variant: "success"
    });
  };

  const handleAnalyzeMetric = (metricName) => {
    window.safeGlobalToast({
      title: "Analyse IA lancée",
      description: `Analyse approfondie de ${metricName} en cours`,
      variant: "success"
    });
  };

  const handleExportMetric = (metricName) => {
    window.safeGlobalToast({
      title: "Export métrique",
      description: `Données de ${metricName} exportées`,
      variant: "success"
    });
  };

  const handleExportChart = (chartName) => {
    window.safeGlobalToast({
      title: "Graphique exporté",
      description: `${chartName} exporté en PNG`,
      variant: "success"
    });
  };

  const handleFullscreenChart = (chartName) => {
    window.safeGlobalToast({
      title: "Mode plein écran",
      description: `${chartName} affiché en plein écran`,
      variant: "success"
    });
  };

  const handleConfigureChart = (chartName) => {
    window.safeGlobalToast({
      title: "Configuration graphique",
      description: `Options de ${chartName} ouvertes`,
      variant: "success"
    });
  };

  const handleViewInsightDetail = (insightType) => {
    window.safeGlobalToast({
      title: "Détail insight",
      description: `Analyse détaillée de ${insightType}`,
      variant: "success"
    });
  };

  const handleCreateAction = (insightType) => {
    window.safeGlobalToast({
      title: "Action créée",
      description: `Plan d'action basé sur ${insightType}`,
      variant: "success"
    });
  };

  const getChangeColor = (change) => {
    return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    return change > 0 ? <ArrowUp className="h-4 w-4" /> : change < 0 ? <ArrowDown className="h-4 w-4" /> : null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'bon': return 'bg-blue-100 text-blue-800';
      case 'moyen': return 'bg-yellow-100 text-yellow-800';
      case 'faible': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics Notariales</h2>
          <p className="text-gray-600 mt-1">
            Analyses et métriques de performance notariale
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 mois</SelectItem>
              <SelectItem value="6m">6 mois</SelectItem>
              <SelectItem value="12m">12 mois</SelectItem>
              <SelectItem value="24m">24 mois</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline"
            onClick={handleRefreshData}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleExportReport}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Métriques de performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsData.performanceMetrics.map((metric, index) => (
          <motion.div
            key={metric.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">{metric.metric}</p>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status}
                      </Badge>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMetricDetail(metric.metric);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAnalyzeMetric(metric.metric);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Bot className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportMetric(metric.metric);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center space-x-1 ${getChangeColor(metric.change)}`}>
                      {getChangeIcon(metric.change)}
                      <span className="text-sm font-medium">
                        {Math.abs(metric.change)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Objectif: {metric.target}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des revenus */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Évolution des Revenus
                </CardTitle>
                <CardDescription>
                  Revenus et nombre de transactions par mois
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleExportChart("Évolution des Revenus")}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleFullscreenChart("Évolution des Revenus")}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleConfigureChart("Évolution des Revenus")}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.revenue.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'transactions' ? value : `${(value / 1000000).toFixed(1)}M FCFA`,
                    name === 'transactions' ? 'Transactions' : 'Revenus'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.1}
                />
                <Line 
                  type="monotone" 
                  dataKey="transactions" 
                  stroke="#059669" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Types de transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-purple-600" />
                  Répartition par Type
                </CardTitle>
                <CardDescription>
                  Distribution des types de transactions
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleExportChart("Répartition par Type")}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleFullscreenChart("Répartition par Type")}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleConfigureChart("Répartition par Type")}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={analyticsData.transactionTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analyticsData.transactionTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {analyticsData.transactionTypes.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Satisfaction clients */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-600" />
                Satisfaction Clients
              </CardTitle>
              <CardDescription>
                Analyse des évaluations clients (Note moyenne: {analyticsData.clientsSatisfaction.average}/5)
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleExportChart("Satisfaction Clients")}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleFullscreenChart("Satisfaction Clients")}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleConfigureChart("Satisfaction Clients")}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.clientsSatisfaction.distribution.map((rating) => (
              <div key={rating.rating} className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm font-medium">{rating.rating}</span>
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${rating.percentage}%` }}
                  />
                </div>
                <div className="flex items-center space-x-2 w-24">
                  <span className="text-sm text-gray-600">{rating.count}</span>
                  <span className="text-sm text-gray-500">({rating.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distribution géographique */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-red-600" />
                Distribution Géographique
              </CardTitle>
              <CardDescription>
                Répartition des transactions par région
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleExportChart("Distribution Géographique")}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleFullscreenChart("Distribution Géographique")}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleConfigureChart("Distribution Géographique")}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.geographicDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'transactions' ? value : `${(value / 1000000).toFixed(1)}M FCFA`,
                  name === 'transactions' ? 'Transactions' : 'Revenus'
                ]}
              />
              <Bar dataKey="transactions" fill="#3B82F6" />
              <Bar dataKey="revenue" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tendances et insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-orange-600" />
                Insights & Recommandations
              </CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleExportChart("Insights & Recommandations")}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleAnalyzeMetric("Insights IA")}
              >
                <Bot className="h-4 w-4 mr-1" />
                IA
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleConfigureChart("Insights & Recommandations")}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">Tendance positive</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewInsightDetail("Tendance positive");
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateAction("Tendance positive");
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Zap className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-green-700">
                  Les ventes immobilières ont augmenté de 15% ce trimestre
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Satisfaction élevée</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewInsightDetail("Satisfaction élevée");
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateAction("Satisfaction élevée");
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Zap className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-blue-700">
                  94% de satisfaction client, dépassant l'objectif de 90%
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-900">Opportunité</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewInsightDetail("Opportunité");
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateAction("Opportunité");
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Zap className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-yellow-700">
                  Potentiel de croissance dans les régions de Saint-Louis et Ziguinchor
                </p>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-900">Performance</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewInsightDetail("Performance");
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateAction("Performance");
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Zap className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-purple-700">
                  Temps de traitement 17% plus rapide que la moyenne nationale
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-indigo-600" />
            Actions Rapides
          </CardTitle>
          <CardDescription>
            Outils et actions rapides pour l'analyse des données
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              className="h-20 flex-col space-y-2"
              variant="outline"
              onClick={() => handleExportReport()}
            >
              <Download className="h-6 w-6" />
              <span className="text-sm">Export Global</span>
            </Button>
            
            <Button 
              className="h-20 flex-col space-y-2"
              variant="outline"
              onClick={() => handleAnalyzeMetric("Analyse Complète")}
            >
              <Bot className="h-6 w-6" />
              <span className="text-sm">Analyse IA</span>
            </Button>
            
            <Button 
              className="h-20 flex-col space-y-2"
              variant="outline"
              onClick={() => handleRefreshData()}
            >
              <RefreshCw className="h-6 w-6" />
              <span className="text-sm">Actualiser</span>
            </Button>
            
            <Button 
              className="h-20 flex-col space-y-2"
              variant="outline"
              onClick={() => handleViewInsightDetail("Rapport Détaillé")}
            >
              <Eye className="h-6 w-6" />
              <span className="text-sm">Vue Détaillée</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotaireAnalytics;
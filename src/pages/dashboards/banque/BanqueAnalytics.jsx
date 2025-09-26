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
  Plus,
  Building2,
  CreditCard,
  Percent,
  TrendingUp as TrendIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BanqueAnalytics = () => {
  const [timeFilter, setTimeFilter] = useState('12m');
  const [isLoading, setIsLoading] = useState(false);

  // Données analytiques spécifiques aux crédits terrains
  const analyticsData = {
    creditPortfolio: {
      total: 45000000000, // 45 milliards FCFA
      growth: 18.3,
      landCredits: 32000000000, // 32 milliards pour terrains
      traditionalCredits: 13000000000 // 13 milliards autres
    },
    performanceMetrics: [
      {
        metric: 'Taux Approbation Terrains',
        value: '87%',
        change: 5.2,
        status: 'excellent',
        target: '85%'
      },
      {
        metric: 'Délai Moyen Traitement',
        value: '12 jours',
        change: -15.3,
        status: 'bon',
        target: '15 jours'
      },
      {
        metric: 'LTV Moyen Terrains',
        value: '76%',
        change: 2.1,
        status: 'stable',
        target: '80%'
      },
      {
        metric: 'Taux Défaut',
        value: '2.3%',
        change: -8.7,
        status: 'excellent',
        target: '3%'
      }
    ],
    creditEvolution: [
      { month: 'Jan', totalCredits: 2400000000, landCredits: 1680000000, approvalRate: 82 },
      { month: 'Fév', totalCredits: 2850000000, landCredits: 1995000000, approvalRate: 85 },
      { month: 'Mar', totalCredits: 3200000000, landCredits: 2240000000, approvalRate: 88 },
      { month: 'Avr', totalCredits: 2900000000, landCredits: 2030000000, approvalRate: 84 },
      { month: 'Mai', totalCredits: 3800000000, landCredits: 2660000000, approvalRate: 89 },
      { month: 'Jun', totalCredits: 4200000000, landCredits: 2940000000, approvalRate: 87 }
    ],
    riskAnalysis: [
      { category: 'Terrain Titré', value: 78, risk: 'Faible', color: '#10B981' },
      { category: 'Terrain Immatriculé', value: 15, risk: 'Moyen', color: '#F59E0B' },
      { category: 'Terrain Non-Titré', value: 7, risk: 'Élevé', color: '#EF4444' }
    ],
    geographicDistribution: [
      { region: 'Dakar', credits: 145, amount: 18500000000, avgLTV: 78 },
      { region: 'Thiès', credits: 89, amount: 8900000000, avgLTV: 75 },
      { region: 'Saint-Louis', credits: 67, amount: 6200000000, avgLTV: 73 },
      { region: 'Kaolack', credits: 45, amount: 4100000000, avgLTV: 76 },
      { region: 'Ziguinchor', credits: 34, amount: 3800000000, avgLTV: 74 }
    ]
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Données actualisées",
        description: "Analytics bancaires mises à jour",
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
        description: "Rapport d'analytics bancaires généré",
        variant: "success"
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleViewMetricDetail = (metricName) => {
    window.safeGlobalToast({
      title: "Détail métrique",
      description: `Analyse détaillée de ${metricName}`,
      variant: "success"
    });
  };

  const handleAnalyzeMetric = (metricName) => {
    window.safeGlobalToast({
      title: "Analyse IA lancée",
      description: `Analyse approfondie de ${metricName}`,
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
      case 'stable': return 'bg-yellow-100 text-yellow-800';
      case 'attention': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics Bancaires</h2>
          <p className="text-gray-600 mt-1">
            Analyses et métriques de performance des crédits terrains
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

      {/* Métriques de performance crédits terrains */}
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
        {/* Évolution des crédits */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Évolution Crédits Terrains
                </CardTitle>
                <CardDescription>
                  Volume et taux d'approbation par mois
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleExportChart("Évolution Crédits")}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleFullscreenChart("Évolution Crédits")}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleConfigureChart("Évolution Crédits")}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.creditEvolution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'approvalRate' ? `${value}%` : `${(value / 1000000000).toFixed(1)}Md FCFA`,
                    name === 'approvalRate' ? 'Taux Approbation' : name === 'landCredits' ? 'Crédits Terrains' : 'Total Crédits'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalCredits" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.1}
                />
                <Area 
                  type="monotone" 
                  dataKey="landCredits" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Analyse des risques */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-purple-600" />
                  Analyse des Risques
                </CardTitle>
                <CardDescription>
                  Répartition par type de garantie foncière
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleExportChart("Analyse Risques")}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleFullscreenChart("Analyse Risques")}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleConfigureChart("Analyse Risques")}
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
                  data={analyticsData.riskAnalysis}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analyticsData.riskAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {analyticsData.riskAnalysis.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700">{item.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{item.value}%</span>
                    <Badge variant="outline" className="text-xs">
                      {item.risk}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
                Répartition des crédits terrains par région
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
                  name === 'credits' ? value : name === 'avgLTV' ? `${value}%` : `${(value / 1000000000).toFixed(1)}Md FCFA`,
                  name === 'credits' ? 'Nombre Crédits' : name === 'avgLTV' ? 'LTV Moyen' : 'Montant'
                ]}
              />
              <Bar dataKey="credits" fill="#3B82F6" />
              <Bar dataKey="amount" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-indigo-600" />
            Actions Rapides Analytics
          </CardTitle>
          <CardDescription>
            Outils et actions rapides pour l'analyse des données bancaires
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
              onClick={() => handleAnalyzeMetric("Portfolio Complet")}
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
              onClick={() => handleViewMetricDetail("Dashboard Complet")}
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

export default BanqueAnalytics;
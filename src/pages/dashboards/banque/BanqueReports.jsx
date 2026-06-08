import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  CreditCard, 
  PieChart, 
  Calendar,
  Download,
  Filter,
  Eye,
  RefreshCw,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Building2,
  Smartphone,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  Area,
  AreaChart
} from 'recharts';

const BanqueReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [reportData, setReportData] = useState({});

  // Données simulées pour les rapports
  useEffect(() => {
    const mockData = {}; // démo retirée
    setReportData(mockData);
  }, []);

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const formatCurrency = (value) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}Md XOF`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M XOF`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K XOF`;
    }
    return `${value} XOF`;
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Faible': return 'text-green-600 bg-green-100';
      case 'Modéré': return 'text-yellow-600 bg-yellow-100';
      case 'Élevé': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const exportReport = () => {
    window.safeGlobalToast({
      title: "Export en cours",
      description: "Rapport exporté avec succès au format PDF",
      variant: "success"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
            Rapports & Analyses
          </h2>
          <p className="text-gray-600 mt-1">
            Analyses détaillées et rapports de performance bancaire
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus Totaux</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(reportData.performanceMetrics?.totalRevenue || 0)}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">
                    +{reportData.performanceMetrics?.revenueGrowth || 0}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clients Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.performanceMetrics?.totalClients || 0}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600 font-medium">
                    +{reportData.performanceMetrics?.clientGrowth || 0}%
                  </span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.performanceMetrics?.totalTransactions || 0}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-600 font-medium">
                    +{reportData.performanceMetrics?.transactionGrowth || 0}%
                  </span>
                </div>
              </div>
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score Conformité</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.performanceMetrics?.complianceScore || 0}%
                </p>
                <div className="flex items-center mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">Excellent</span>
                </div>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets des rapports */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="risk">Analyse Risques</TabsTrigger>
          <TabsTrigger value="channels">Canaux</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Évolution des revenus */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Revenus</CardTitle>
                <CardDescription>Revenus mensuels et croissance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={reportData.monthlyRevenue || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Répartition par type de transaction */}
            <Card>
              <CardHeader>
                <CardTitle>Types de Transactions</CardTitle>
                <CardDescription>Répartition des volumes par type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={reportData.clientSegments || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(reportData.clientSegments || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Métriques de performance détaillées */}
          <Card>
            <CardHeader>
              <CardTitle>Indicateurs de Performance</CardTitle>
              <CardDescription>Métriques clés et évolution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Portefeuille</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Valeur totale</span>
                      <span className="font-semibold">{formatCurrency(reportData.performanceMetrics?.portfolioValue || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Croissance</span>
                      <Badge className="bg-green-100 text-green-800">
                        +{reportData.performanceMetrics?.portfolioGrowth || 0}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Crédits</span>
                      <span className="font-semibold">{formatCurrency(reportData.performanceMetrics?.creditPortfolio || 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Transactions</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Valeur moyenne</span>
                      <span className="font-semibold">{formatCurrency(reportData.performanceMetrics?.averageTransactionValue || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Volume mensuel</span>
                      <span className="font-semibold">{reportData.performanceMetrics?.totalTransactions || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Croissance</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        +{reportData.performanceMetrics?.transactionGrowth || 0}%
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Risques</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ratio de risque</span>
                      <Badge className="bg-green-100 text-green-800">
                        {reportData.performanceMetrics?.riskRatio || 0}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Conformité</span>
                      <Badge className="bg-green-100 text-green-800">
                        {reportData.performanceMetrics?.complianceScore || 0}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Crédit croissance</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        +{reportData.performanceMetrics?.creditGrowth || 0}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution Clients</CardTitle>
                <CardDescription>Nombre de clients par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.monthlyRevenue || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="clients" stroke="#10B981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segmentation Clients</CardTitle>
                <CardDescription>Répartition par type de compte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(reportData.clientSegments || []).map((segment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }}></div>
                        <span className="font-medium">{segment.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold">{segment.value}%</span>
                        <p className="text-xs text-gray-500">du portefeuille</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des Transactions</CardTitle>
              <CardDescription>Volume et fréquence par type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(reportData.transactionTypes || []).map((type, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{type.type}</h4>
                        <p className="text-sm text-gray-600">{type.count} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatCurrency(type.amount)}</p>
                      <Badge className="bg-gray-100 text-gray-800">{type.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des Risques</CardTitle>
              <CardDescription>Exposition par catégorie de crédit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(reportData.riskAnalysis || []).map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Target className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{category.category}</h4>
                        <p className="text-sm text-gray-600">Score: {category.score}/100</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-lg font-bold">{formatCurrency(category.exposure)}</p>
                      <Badge className={getRiskColor(category.risk)}>{category.risk}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance des Canaux</CardTitle>
              <CardDescription>Utilisation et revenus par canal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(reportData.channelPerformance || []).map((channel, index) => {
                  const getChannelIcon = (channelName) => {
                    if (channelName.includes('Online')) return Globe;
                    if (channelName.includes('Mobile')) return Smartphone;
                    if (channelName.includes('ATM')) return CreditCard;
                    return Building2;
                  };
                  const IconComponent = getChannelIcon(channel.channel);
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{channel.channel}</h4>
                          <p className="text-sm text-gray-600">{channel.users} utilisateurs actifs</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-lg font-bold">{formatCurrency(channel.revenue)}</p>
                        <p className="text-sm text-gray-600">{channel.transactions} transactions</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BanqueReports;
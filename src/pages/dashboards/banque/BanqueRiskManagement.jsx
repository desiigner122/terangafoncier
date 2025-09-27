import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Target,
  Eye,
  Filter,
  Download,
  RefreshCw,
  Users,
  CreditCard,
  DollarSign,
  Building2,
  Globe,
  Clock,
  Zap,
  FileText,
  Search,
  MoreHorizontal,
  Calculator,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
  Pie
} from 'recharts';

const BanqueRiskManagement = ({ dashboardStats = {} }) => {
  const [riskData, setRiskData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  // Simulation des données de risque
  useEffect(() => {
    const mockRiskData = {
      globalRisk: {
        level: 'Modéré',
        score: 2.3,
        trend: 'stable',
        lastUpdate: new Date()
      },
      portfolioRisk: {
        totalExposure: 1200000000,
        riskWeightedAssets: 950000000,
        capitalRatio: 12.8,
        loanLossReserves: 24000000,
        nplRatio: 2.1
      },
      creditCategories: [
        {
          category: 'Crédit Immobilier',
          exposure: 450000000,
          riskWeight: 50,
          riskLevel: 'Faible',
          score: 85,
          nplRatio: 1.2,
          growth: -2.1,
          clients: 280
        },
        {
          category: 'Crédit Commercial',
          exposure: 320000000,
          riskWeight: 100,
          riskLevel: 'Modéré',
          score: 72,
          nplRatio: 2.8,
          growth: 5.4,
          clients: 95
        },
        {
          category: 'Crédit Personnel',
          exposure: 180000000,
          riskWeight: 75,
          riskLevel: 'Modéré',
          score: 68,
          nplRatio: 4.2,
          growth: 8.7,
          clients: 450
        },
        {
          category: 'Découvert Autorisé',
          exposure: 45000000,
          riskWeight: 100,
          riskLevel: 'Élevé',
          score: 45,
          nplRatio: 8.5,
          growth: -1.2,
          clients: 320
        },
        {
          category: 'Crédit Auto',
          exposure: 205000000,
          riskWeight: 75,
          riskLevel: 'Faible',
          score: 78,
          nplRatio: 1.8,
          growth: 12.3,
          clients: 190
        }
      ],
      riskEvolution: [
        { month: 'Jan', riskScore: 2.1, exposure: 1050000000, npl: 1.8 },
        { month: 'Fév', riskScore: 2.2, exposure: 1080000000, npl: 1.9 },
        { month: 'Mar', riskScore: 2.0, exposure: 1100000000, npl: 1.7 },
        { month: 'Avr', riskScore: 2.3, exposure: 1140000000, npl: 2.1 },
        { month: 'Mai', riskScore: 2.1, exposure: 1160000000, npl: 1.9 },
        { month: 'Jun', riskScore: 2.4, exposure: 1180000000, npl: 2.2 },
        { month: 'Jul', riskScore: 2.2, exposure: 1200000000, npl: 2.0 },
        { month: 'Aoû', riskScore: 2.3, exposure: 1200000000, npl: 2.1 },
        { month: 'Sep', riskScore: 2.3, exposure: 1200000000, npl: 2.1 }
      ],
      stressTests: [
        {
          scenario: 'Récession Économique',
          impact: 'Élevé',
          probabilité: 15,
          perte: 180000000,
          capitalImpact: -3.2,
          status: 'Critique'
        },
        {
          scenario: 'Hausse Taux d\'Intérêt',
          impact: 'Modéré',
          probabilité: 35,
          perte: 95000000,
          capitalImpact: -1.8,
          status: 'Attention'
        },
        {
          scenario: 'Crise Sectorielle',
          impact: 'Modéré',
          probabilité: 25,
          perte: 125000000,
          capitalImpact: -2.3,
          status: 'Surveillé'
        },
        {
          scenario: 'Défaillance Majeure',
          impact: 'Très Élevé',
          probabilité: 5,
          perte: 320000000,
          capitalImpact: -5.8,
          status: 'Critique'
        }
      ],
      alerts: [
        {
          id: 1,
          type: 'limit_breach',
          severity: 'high',
          title: 'Dépassement limite secteur BTP',
          description: 'L\'exposition au secteur BTP dépasse 15% du portefeuille',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          action: 'Réduire exposition'
        },
        {
          id: 2,
          type: 'rating_downgrade',
          severity: 'medium',
          title: 'Dégradation notation client',
          description: 'Industries Ba & Fils: AAA → AA-',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          action: 'Réévaluer garanties'
        },
        {
          id: 3,
          type: 'market_risk',
          severity: 'low',
          title: 'Volatilité taux de change',
          description: 'EUR/XOF: variation >2% sur 24h',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          action: 'Surveiller positions'
        }
      ]
    };
    setRiskData(mockRiskData);
  }, []);

  const formatCurrency = (value) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}Md XOF`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M XOF`;
    }
    return `${value.toLocaleString()} XOF`;
  };

  const getRiskLevelColor = (level) => {
    const colors = {
      'Faible': 'bg-green-100 text-green-800 border-green-200',
      'Modéré': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Élevé': 'bg-red-100 text-red-800 border-red-200',
      'Très Élevé': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[level] || colors['Modéré'];
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[severity] || colors.medium;
  };

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-purple-600" />
            Gestion des Risques
          </h2>
          <p className="text-gray-600 mt-1">
            Analyse et surveillance des risques de crédit et opérationnels
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Rapport Risques
          </Button>
          <Button variant="outline">
            <Calculator className="h-4 w-4 mr-2" />
            Stress Test
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Alertes de risque */}
      {riskData.alerts && riskData.alerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Alertes de Risque ({riskData.alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskData.alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity === 'high' ? 'Élevé' : 
                       alert.severity === 'medium' ? 'Moyen' : 'Faible'}
                    </Badge>
                    <div>
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {alert.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score de Risque</p>
                <p className="text-2xl font-bold text-gray-900">
                  {riskData.globalRisk?.score || 0}%
                </p>
                <div className="flex items-center mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">
                    {riskData.globalRisk?.level || 'Modéré'}
                  </span>
                </div>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Exposition Totale</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(riskData.portfolioRisk?.totalExposure || 0)}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600 font-medium">Contrôlée</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ratio Capital</p>
                <p className="text-2xl font-bold text-gray-900">
                  {riskData.portfolioRisk?.capitalRatio || 0}%
                </p>
                <div className="flex items-center mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">Conforme</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">NPL Ratio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {riskData.portfolioRisk?.nplRatio || 0}%
                </p>
                <div className="flex items-center mt-1">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-yellow-600 font-medium">Acceptable</span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets principaux */}
      <Tabs defaultValue="portfolio" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="portfolio">Portefeuille</TabsTrigger>
          <TabsTrigger value="evolution">Évolution</TabsTrigger>
          <TabsTrigger value="stress">Stress Tests</TabsTrigger>
          <TabsTrigger value="monitoring">Surveillance</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-6">
          {/* Répartition du risque par catégorie */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Risques</CardTitle>
                <CardDescription>Par catégorie de crédit</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={riskData.creditCategories?.map(cat => ({
                        name: cat.category.split(' ')[1],
                        value: cat.exposure,
                        risk: cat.riskLevel
                      })) || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(riskData.creditCategories || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution des Scores</CardTitle>
                <CardDescription>Scores de risque par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskData.creditCategories || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Détail par catégorie */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse Détaillée par Catégorie</CardTitle>
              <CardDescription>Métriques de risque par type de crédit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(riskData.creditCategories || []).map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{category.category}</h4>
                        <p className="text-sm text-gray-600">{category.clients} clients</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-gray-600">Exposition</p>
                        <p className="font-semibold">{formatCurrency(category.exposure)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Score</p>
                        <p className={`font-semibold ${getScoreColor(category.score)}`}>
                          {category.score}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">NPL</p>
                        <p className="font-semibold">{category.nplRatio}%</p>
                      </div>
                      <div className="text-center">
                        <Badge className={getRiskLevelColor(category.riskLevel)}>
                          {category.riskLevel}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution du Risque</CardTitle>
              <CardDescription>Tendances mensuelles des indicateurs de risque</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={riskData.riskEvolution || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="riskScore" stroke="#8B5CF6" strokeWidth={3} name="Score de Risque (%)" />
                  <Line yAxisId="right" type="monotone" dataKey="npl" stroke="#EF4444" strokeWidth={2} name="NPL Ratio (%)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tests de Résistance</CardTitle>
              <CardDescription>Analyse d'impact des scénarios de stress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(riskData.stressTests || []).map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        test.status === 'Critique' ? 'bg-red-100' :
                        test.status === 'Attention' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        <AlertTriangle className={`h-6 w-6 ${
                          test.status === 'Critique' ? 'text-red-600' :
                          test.status === 'Attention' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{test.scenario}</h4>
                        <p className="text-sm text-gray-600">Probabilité: {test.probabilité}%</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm text-right">
                      <div>
                        <p className="text-gray-600">Perte Estimée</p>
                        <p className="font-semibold text-red-600">{formatCurrency(test.perte)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Impact Capital</p>
                        <p className="font-semibold">{test.capitalImpact}%</p>
                      </div>
                      <div>
                        <Badge className={
                          test.status === 'Critique' ? 'bg-red-100 text-red-800' :
                          test.status === 'Attention' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                        }>
                          {test.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Surveillance Continue</CardTitle>
              <CardDescription>Alertes et signaux d'attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(riskData.alerts || []).map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          alert.severity === 'high' ? 'bg-red-100' :
                          alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                          <AlertTriangle className={`h-6 w-6 ${
                            alert.severity === 'high' ? 'text-red-600' :
                            alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold">{alert.title}</h4>
                          <p className="text-sm text-gray-600">{alert.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {alert.timestamp.toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity === 'high' ? 'Élevé' : 
                           alert.severity === 'medium' ? 'Moyen' : 'Faible'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          {alert.action}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BanqueRiskManagement;
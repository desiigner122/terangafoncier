import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Building, 
  MapPin, 
  Star, 
  Filter, 
  Search, 
  Eye, 
  Download, 
  Share2, 
  RefreshCw,
  Users,
  Home,
  Percent,
  Calculator,
  CreditCard,
  Banknote,
  Award,
  Shield,
  Activity,
  Calendar,
  FileText,
  Zap
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const BanquePortfolioManagement = ({ dashboardStats }) => {
  const [activeView, setActiveView] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [filterType, setFilterType] = useState('all');

  // Données du portfolio de crédits fonciers
  const [portfolioData, setPortfolioData] = useState({
    totalCreditVolume: 2847000000, // 2.847 milliards CFA
    activeCreditFiles: 156,
    pendingApplications: 28,
    averageCreditAmount: 18250000,
    totalGuaranteeValue: 3654000000,
    portfolioGrowth: 15.3,
    riskExposure: 8.7,
    profitability: 23.4
  });

  // Répartition par type de crédit foncier
  const [creditDistribution, setCreditDistribution] = useState([
    {
      type: 'Crédit Terrain Résidentiel',
      amount: 1456000000,
      count: 78,
      percentage: 51.2,
      avgAmount: 18666667,
      riskLevel: 'Faible',
      color: 'bg-blue-500'
    },
    {
      type: 'Crédit Terrain Commercial',
      amount: 876000000,
      count: 32,
      percentage: 30.8,
      avgAmount: 27375000,
      riskLevel: 'Moyen',
      color: 'bg-green-500'
    },
    {
      type: 'Crédit Construction',
      amount: 345000000,
      count: 23,
      percentage: 12.1,
      avgAmount: 15000000,
      riskLevel: 'Faible',
      color: 'bg-purple-500'
    },
    {
      type: 'Crédit Rénovation',
      amount: 170000000,
      count: 23,
      percentage: 5.9,
      avgAmount: 7391304,
      riskLevel: 'Très Faible',
      color: 'bg-yellow-500'
    }
  ]);

  // Crédits issus de demandes plateforme
  const [platformCredits, setPlatformCredits] = useState([
    {
      id: 'PLC-2024-001',
      clientName: 'Mamadou FALL',
      platformRef: 'TER-2024-001',
      propertyLocation: 'Ouakam - Zone Résidentielle',
      creditAmount: 20000000,
      propertyValue: 25000000,
      ltvRatio: 80,
      status: 'Actif',
      startDate: '2024-01-20',
      monthlyPayment: 185000,
      remainingBalance: 19650000,
      nextPaymentDate: '2024-02-20',
      performanceStatus: 'Excellent',
      riskRating: 'A+'
    },
    {
      id: 'PLC-2024-002',
      clientName: 'Société SENEGAL INVEST',
      platformRef: 'TER-2024-002',
      propertyLocation: 'Avenue Lamine Guèye, Plateau',
      creditAmount: 96000000,
      propertyValue: 120000000,
      ltvRatio: 80,
      status: 'Actif',
      startDate: '2024-01-22',
      monthlyPayment: 890000,
      remainingBalance: 95200000,
      nextPaymentDate: '2024-02-22',
      performanceStatus: 'Bon',
      riskRating: 'A'
    },
    {
      id: 'PLC-2024-003',
      clientName: 'Fatou MBAYE',
      platformRef: 'TER-2024-003',
      propertyLocation: 'Parcelles Assainies U15',
      creditAmount: 15000000,
      propertyValue: 18750000,
      ltvRatio: 80,
      status: 'En Cours',
      startDate: '2024-01-25',
      monthlyPayment: 139000,
      remainingBalance: 14860000,
      nextPaymentDate: '2024-02-25',
      performanceStatus: 'Excellent',
      riskRating: 'A+'
    }
  ]);

  // Métriques de performance
  const [performanceMetrics, setPerformanceMetrics] = useState({
    repaymentRate: 96.7,
    defaultRate: 1.8,
    averageProcessingTime: 12, // jours
    clientSatisfaction: 4.6,
    portfolioROI: 18.4,
    netInterestMargin: 12.3
  });

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Très Faible': return 'text-green-700';
      case 'Faible': return 'text-green-600';
      case 'Moyen': return 'text-yellow-600';
      case 'Élevé': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'En Cours': return 'bg-blue-100 text-blue-800';
      case 'Suspendu': return 'bg-yellow-100 text-yellow-800';
      case 'Clôturé': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (status) => {
    switch (status) {
      case 'Excellent': return 'text-green-600';
      case 'Bon': return 'text-blue-600';
      case 'Moyen': return 'text-yellow-600';
      case 'Mauvais': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const CreditCard = ({ credit }) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="cursor-pointer"
      >
        <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {credit.id}
                </CardTitle>
                <CardDescription className="flex items-center space-x-2 mt-1">
                  <Badge className={getStatusColor(credit.status)}>
                    {credit.status}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    {credit.riskRating}
                  </Badge>
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-green-600">
                  {(credit.creditAmount / 1000000).toFixed(0)}M CFA
                </div>
                <div className="text-xs text-gray-600">
                  LTV: {credit.ltvRatio}%
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{credit.clientName}</p>
                <p className="text-gray-600">{credit.propertyLocation}</p>
                <p className="text-blue-600 text-xs">Réf. Plateforme: {credit.platformRef}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Solde restant:</span>
                  <div className="font-semibold text-red-600">
                    {(credit.remainingBalance / 1000000).toFixed(1)}M CFA
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Mensualité:</span>
                  <div className="font-semibold text-blue-600">
                    {(credit.monthlyPayment / 1000).toFixed(0)}k CFA
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Performance:</span>
                  <span className={`font-semibold ${getPerformanceColor(credit.performanceStatus)}`}>
                    {credit.performanceStatus}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Prochain paiement:</span>
                  <span>{new Date(credit.nextPaymentDate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Détails
                </Button>
                <Button size="sm" variant="outline">
                  <FileText className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header avec statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Volume Total Crédits</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {(portfolioData.totalCreditVolume / 1000000000).toFixed(1)}Md CFA
                  </p>
                </div>
                <Banknote className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Dossiers Actifs</p>
                  <p className="text-2xl font-bold text-green-900">{portfolioData.activeCreditFiles}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Croissance Portfolio</p>
                  <p className="text-2xl font-bold text-purple-900">+{portfolioData.portfolioGrowth}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">ROI Portfolio</p>
                  <p className="text-2xl font-bold text-yellow-900">{performanceMetrics.portfolioROI}%</p>
                </div>
                <Target className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Interface principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-blue-600" />
            <span>Gestion Portfolio Crédits Fonciers</span>
          </CardTitle>
          <CardDescription>
            Suivi et gestion du portfolio de crédits immobiliers issus des demandes plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="credits">Crédits Actifs</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Répartition par type */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Répartition par Type de Crédit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {creditDistribution.map((type, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded ${type.color}`}></div>
                              <span className="text-sm font-medium">{type.type}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold">
                                {(type.amount / 1000000).toFixed(0)}M CFA
                              </div>
                              <div className="text-xs text-gray-500">
                                {type.count} dossiers
                              </div>
                            </div>
                          </div>
                          <Progress value={type.percentage} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Risque: <span className={getRiskColor(type.riskLevel)}>{type.riskLevel}</span></span>
                            <span>{type.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Métriques clés */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Métriques de Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Taux de remboursement</span>
                        <span className="font-semibold text-green-600">{performanceMetrics.repaymentRate}%</span>
                      </div>
                      <Progress value={performanceMetrics.repaymentRate} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Taux de défaut</span>
                        <span className="font-semibold text-red-600">{performanceMetrics.defaultRate}%</span>
                      </div>
                      <Progress value={performanceMetrics.defaultRate} className="h-2 bg-red-100" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Marge nette d'intérêt</span>
                        <span className="font-semibold text-blue-600">{performanceMetrics.netInterestMargin}%</span>
                      </div>
                      <Progress value={performanceMetrics.netInterestMargin * 5} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Satisfaction client</span>
                        <span className="font-semibold text-yellow-600">{performanceMetrics.clientSatisfaction}/5</span>
                      </div>
                      <Progress value={performanceMetrics.clientSatisfaction * 20} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Crédits Actifs */}
            <TabsContent value="credits" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Crédits issus de la Plateforme</h3>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser
                  </Button>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                layout
              >
                {platformCredits.map((credit) => (
                  <CreditCard key={credit.id} credit={credit} />
                ))}
              </motion.div>
            </TabsContent>

            {/* Performance */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-green-700">Excellente Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-900 mb-2">
                      {platformCredits.filter(c => c.performanceStatus === 'Excellent').length}
                    </div>
                    <p className="text-green-600">Dossiers excellents</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-blue-700">Bonne Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-900 mb-2">
                      {platformCredits.filter(c => c.performanceStatus === 'Bon').length}
                    </div>
                    <p className="text-blue-600">Dossiers satisfaisants</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <CardTitle className="text-yellow-700">Surveillance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-900 mb-2">
                      {platformCredits.filter(c => c.performanceStatus === 'Moyen').length}
                    </div>
                    <p className="text-yellow-600">Dossiers à surveiller</p>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Performance Globale</AlertTitle>
                <AlertDescription>
                  Le portfolio de crédits fonciers issus de la plateforme affiche une excellente performance 
                  avec un taux de remboursement de {performanceMetrics.repaymentRate}% et un ROI de {performanceMetrics.portfolioROI}%.
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span>Évolution Mensuelle</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-gray-500">Graphique d'évolution du portfolio</p>
                      <p className="text-sm text-gray-400 mt-2">Croissance : +{portfolioData.portfolioGrowth}% ce mois</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="h-5 w-5 text-green-600" />
                      <span>Répartition Géographique</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Dakar Centre</span>
                        <span className="font-semibold">45%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Banlieue Dakar</span>
                        <span className="font-semibold">35%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Régions</span>
                        <span className="font-semibold">20%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BanquePortfolioManagement;
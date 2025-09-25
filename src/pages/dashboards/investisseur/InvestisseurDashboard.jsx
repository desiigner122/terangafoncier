import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  BarChart3,
  Building2, 
  Globe,
  Target,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Download,
  Filter,
  Calculator,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  MapPin,
  Star,
  Bell,
  Settings,
  FileText,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';

const InvestisseurDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Fonctions de gestion des actions investisseur
  const handleNewInvestment = () => {
    console.log('Nouveau investissement');
    // TODO: Ouvrir modal de nouvel investissement
  };

  const handleCalculateROI = () => {
    console.log('Calculer ROI');
    setActiveTab('calculator');
  };

  const handleViewOpportunities = () => {
    console.log('Voir opportunités');
    setActiveTab('opportunities');
  };

  const handleAnalyzeMarket = () => {
    console.log('Analyser marché');
    setActiveTab('market-analysis');
  };

  const handleViewInvestment = (investment) => {
    console.log('Voir investissement:', investment.project);
    // TODO: Ouvrir modal de détails
  };

  const handleManageInvestment = (investment) => {
    console.log('Gérer investissement:', investment.project);
    // TODO: Ouvrir modal de gestion
  };

  const handleWithdrawInvestment = (investment) => {
    if (confirm(`Êtes-vous sûr de vouloir retirer votre investissement de "${investment.project}" ?`)) {
      setDashboardData(prev => ({
        ...prev,
        investments: prev.investments.filter(i => i.id !== investment.id)
      }));
      console.log('Investissement retiré:', investment.project);
    }
  };

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalInvestments: 15,
      activeProjects: 8,
      portfolioValue: 850000000,
      monthlyReturn: 12.8,
      totalROI: 34.5,
      diversificationScore: 85
    },
    portfolio: [
      {
        id: 1,
        name: 'Résidence Les Almadies',
        type: 'Résidentiel',
        location: 'Almadies, Dakar',
        investment: 50000000,
        currentValue: 65000000,
        roi: 30.0,
        status: 'Actif',
        acquisitionDate: '2023-06-15',
        expectedReturn: 15.5,
        risk: 'Faible'
      },
      {
        id: 2,
        name: 'Centre Commercial Plateau',
        type: 'Commercial',
        location: 'Plateau, Dakar',
        investment: 120000000,
        currentValue: 158000000,
        roi: 31.7,
        status: 'Actif',
        acquisitionDate: '2023-03-10',
        expectedReturn: 18.2,
        risk: 'Moyen'
      },
      {
        id: 3,
        name: 'Lotissement Diamniadio',
        type: 'Terrain',
        location: 'Diamniadio',
        investment: 75000000,
        currentValue: 95000000,
        roi: 26.7,
        status: 'En développement',
        acquisitionDate: '2023-09-20',
        expectedReturn: 22.0,
        risk: 'Élevé'
      }
    ],
    opportunities: [
      {
        id: 1,
        title: 'Projet Villa Moderne Saly',
        type: 'Résidentiel',
        location: 'Saly, Mbour',
        minimumInvestment: 25000000,
        expectedROI: 28.5,
        duration: '18 mois',
        risk: 'Faible',
        promoter: 'Teranga Development',
        funding: 65,
        investors: 12
      },
      {
        id: 2,
        title: 'Complexe Bureaux Nouvelle Ville',
        type: 'Commercial',
        location: 'Diamniadio',
        minimumInvestment: 50000000,
        expectedROI: 35.2,
        duration: '24 mois',
        risk: 'Moyen',
        promoter: 'ABC Promotion',
        funding: 40,
        investors: 8
      }
    ],
    analytics: {
      monthlyReturns: [8.5, 12.3, 15.1, 11.8, 14.2, 12.8],
      sectorDistribution: {
        'Résidentiel': 45,
        'Commercial': 35,
        'Terrain': 20
      },
      riskDistribution: {
        'Faible': 40,
        'Moyen': 45,
        'Élevé': 15
      }
    }
  });

  useEffect(() => {
    // Simulation chargement des données
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const stats = [
    { value: dashboardData.stats.totalInvestments, label: 'Investissements' },
    { value: dashboardData.stats.activeProjects, label: 'Projets Actifs' },
    { value: `${dashboardData.stats.monthlyReturn}%`, label: 'Rendement Mois' },
    { value: `${dashboardData.stats.totalROI}%`, label: 'ROI Total' }
  ];

  const getRiskColor = (risk) => {
    const colors = {
      'Faible': 'bg-green-500',
      'Moyen': 'bg-yellow-500',
      'Élevé': 'bg-red-500'
    };
    return colors[risk] || 'bg-gray-500';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Actif': 'bg-green-500',
      'En développement': 'bg-blue-500',
      'Terminé': 'bg-purple-500',
      'Suspendu': 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre portefeuille...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Espace Investisseur"
      subtitle="Gestion de portefeuille immobilier"
      userRole="Investisseur"
      stats={stats}
    >
      <div className="space-y-6">
        {/* Widgets IA & Blockchain */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AIAssistantWidget userRole="Investisseur" dashboardData={dashboardData} />
          <BlockchainWidget userRole="Investisseur" />
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Valeur Portefeuille</p>
                  <p className="text-lg font-bold text-purple-600">
                    {formatCurrency(dashboardData.stats.portfolioValue)}
                  </p>
                </div>
                <Wallet className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+{dashboardData.stats.totalROI}% total</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rendement Mensuel</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatPercentage(dashboardData.stats.monthlyReturn)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+2.3% vs mois dernier</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Score Diversification</p>
                  <p className="text-lg font-bold text-blue-600">
                    {dashboardData.stats.diversificationScore}/100
                  </p>
                </div>
                <PieChart className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <Progress value={dashboardData.stats.diversificationScore} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nouvelles Opportunités</p>
                  <p className="text-lg font-bold text-orange-600">
                    {dashboardData.opportunities.length}
                  </p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <Plus className="h-4 w-4 text-orange-600 mr-1" />
                <span className="text-orange-600">2 nouvelles cette semaine</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="portfolio">Portefeuille</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="tools">Outils</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Portfolio Performance */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                    Performance du Portefeuille
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Graphique de performance</p>
                      <p className="text-sm text-gray-400">Tendance: +{dashboardData.stats.totalROI}% sur 12 mois</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2 text-green-600" />
                    Actions Rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" onClick={handleViewOpportunities}>
                    <Eye className="h-4 w-4 mr-2" />
                    Explorer Opportunités
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={handleCalculateROI}>
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculateur ROI
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={handleAnalyzeMarket}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analyse Risques
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => console.log('Télécharger rapport mensuel')}>
                    <Download className="h-4 w-4 mr-2" />
                    Rapport Mensuel
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sector Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                    Répartition par Secteur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(dashboardData.analytics.sectorDistribution).map(([sector, percentage]) => (
                      <div key={sector}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{sector}</span>
                          <span className="text-sm">{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                    Répartition par Risque
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(dashboardData.analytics.riskDistribution).map(([risk, percentage]) => (
                      <div key={risk}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{risk}</span>
                          <span className="text-sm">{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mon Portefeuille</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {dashboardData.portfolio.map((investment) => (
                <Card key={investment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{investment.name}</h3>
                          <Badge className={`${getStatusColor(investment.status)} text-white`}>
                            {investment.status}
                          </Badge>
                          <Badge className={`${getRiskColor(investment.risk)} text-white`}>
                            Risque {investment.risk}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Type</p>
                            <p className="font-medium">{investment.type}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Localisation</p>
                            <p className="font-medium">{investment.location}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Investissement</p>
                            <p className="font-medium">{formatCurrency(investment.investment)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Valeur Actuelle</p>
                            <p className="font-medium text-green-600">{formatCurrency(investment.currentValue)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">ROI Actuel</p>
                            <div className="flex items-center">
                              <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                              <span className="font-bold text-green-600">{formatPercentage(investment.roi)}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Rendement Espéré</p>
                            <p className="font-medium">{formatPercentage(investment.expectedReturn)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Date Acquisition</p>
                            <p className="font-medium">{new Date(investment.acquisitionDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Analytics
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Documents
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Nouvelles Opportunités</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
                <Button variant="outline" size="sm">
                  <Target className="h-4 w-4 mr-2" />
                  Mes Critères
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {dashboardData.opportunities.map((opportunity) => (
                <Card key={opportunity.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{opportunity.title}</h3>
                          <Badge className={`${getRiskColor(opportunity.risk)} text-white`}>
                            Risque {opportunity.risk}
                          </Badge>
                          <Badge variant="outline">
                            {opportunity.type}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Investissement Min.</p>
                            <p className="font-medium">{formatCurrency(opportunity.minimumInvestment)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">ROI Espéré</p>
                            <p className="font-medium text-green-600">{formatPercentage(opportunity.expectedROI)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Durée</p>
                            <p className="font-medium">{opportunity.duration}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Promoteur</p>
                            <p className="font-medium">{opportunity.promoter}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {opportunity.location}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {opportunity.investors} investisseurs
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Financement collecté</span>
                            <span>{opportunity.funding}%</span>
                          </div>
                          <Progress value={opportunity.funding} className="h-2" />
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm">
                          <CreditCard className="h-4 w-4 mr-1" />
                          Investir
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calculator className="h-4 w-4 mr-1" />
                          Simuler
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Analytics Avancées</h2>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Rapport Complet
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Rendement Moyen</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatPercentage(dashboardData.analytics.monthlyReturns.reduce((a, b) => a + b, 0) / dashboardData.analytics.monthlyReturns.length)}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Volatilité</p>
                      <p className="text-2xl font-bold text-blue-600">8.2%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ratio Sharpe</p>
                      <p className="text-2xl font-bold text-purple-600">1.45</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Alpha</p>
                      <p className="text-2xl font-bold text-orange-600">+3.2%</p>
                    </div>
                    <Star className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Rendements (6 derniers mois)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Graphique des rendements mensuels</p>
                    <div className="flex space-x-4 mt-2 text-sm text-gray-400">
                      {dashboardData.analytics.monthlyReturns.map((return_, index) => (
                        <span key={index}>{formatPercentage(return_)}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <h2 className="text-2xl font-bold">Outils d'Investissement</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-blue-600" />
                    Calculateur ROI
                  </CardTitle>
                  <CardDescription>
                    Estimez le retour sur investissement de vos projets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Utiliser l'outil
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                    Analyse de Risque
                  </CardTitle>
                  <CardDescription>
                    Évaluez le profil de risque de vos investissements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Analyser
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-purple-600" />
                    Optimiseur Portfolio
                  </CardTitle>
                  <CardDescription>
                    Optimisez la répartition de votre portefeuille
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Optimiser
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-green-600" />
                    Simulateur Scénarios
                  </CardTitle>
                  <CardDescription>
                    Testez différents scénarios d'investissement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Simuler
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-orange-600" />
                    Comparateur Projets
                  </CardTitle>
                  <CardDescription>
                    Comparez plusieurs opportunités d'investissement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Comparer
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-gray-600" />
                    Générateur Rapports
                  </CardTitle>
                  <CardDescription>
                    Générez des rapports personnalisés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Générer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default InvestisseurDashboard;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, BarChart3, Users, Target, Plus, Eye, 
  Calendar, FileText, MapPin, Clock, CheckCircle, 
  AlertCircle, Star, Filter, ChevronRight, DollarSign,
  Briefcase, Calculator, Package, Download, Phone, 
  Mail, Globe, Award, Settings, PieChart, Activity,
  Building, Shield, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ModernSidebar from '@/components/layout/ModernSidebar';
import { useUser } from '@/hooks/useUser';

const ModernInvestisseurDashboard = () => {
  const { user, profile } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalInvestments: 15,
      portfolioValue: 2850000000,
      totalReturns: 485000000,
      averageReturn: 17.8,
      monthlyIncome: 28500000,
      activeOpportunities: 12,
      riskScore: 6.5,
      diversificationIndex: 85
    },
    investments: [
      {
        id: 1,
        property: 'Résidence Les Palmiers',
        location: 'Almadies, Dakar',
        type: 'Résidentiel locatif',
        investmentAmount: 180000000,
        currentValue: 225000000,
        monthlyReturn: 3200000,
        totalReturn: 45000000,
        returnRate: 25.0,
        status: 'Actif',
        acquisitionDate: '2023-06-15',
        riskLevel: 'Faible',
        occupancyRate: 95
      },
      {
        id: 2,
        property: 'Complex Commercial Plateau',
        location: 'Plateau, Dakar',
        type: 'Commercial',
        investmentAmount: 350000000,
        currentValue: 420000000,
        monthlyReturn: 6800000,
        totalReturn: 70000000,
        returnRate: 20.0,
        status: 'Actif',
        acquisitionDate: '2023-03-20',
        riskLevel: 'Modéré',
        occupancyRate: 88
      },
      {
        id: 3,
        property: 'Villa Saly Portudal',
        location: 'Saly, Mbour',
        type: 'Touristique',
        investmentAmount: 120000000,
        currentValue: 138000000,
        monthlyReturn: 1800000,
        totalReturn: 18000000,
        returnRate: 15.0,
        status: 'Actif',
        acquisitionDate: '2023-08-10',
        riskLevel: 'Modéré',
        occupancyRate: 78
      },
      {
        id: 4,
        property: 'Terrain Diamniadio',
        location: 'Diamniadio',
        type: 'Développement',
        investmentAmount: 85000000,
        currentValue: 125000000,
        monthlyReturn: 0,
        totalReturn: 40000000,
        returnRate: 47.1,
        status: 'En développement',
        acquisitionDate: '2022-12-05',
        riskLevel: 'Élevé',
        occupancyRate: 0
      }
    ],
    opportunities: [
      {
        id: 1,
        title: 'Projet Résidentiel VDN',
        location: 'VDN, Dakar',
        type: 'Résidentiel',
        minInvestment: 50000000,
        expectedReturn: 22.5,
        duration: '18 mois',
        riskLevel: 'Modéré',
        description: 'Développement de 24 appartements haut standing',
        promoter: 'SARL BTP Excellence',
        fundingGoal: 800000000,
        currentFunding: 480000000,
        deadline: '2024-04-30'
      },
      {
        id: 2,
        title: 'Centre Commercial Thies',
        location: 'Thiès',
        type: 'Commercial',
        minInvestment: 100000000,
        expectedReturn: 19.8,
        duration: '24 mois',
        riskLevel: 'Faible',
        description: 'Construction d\'un centre commercial moderne',
        promoter: 'Groupe Immobilier Sahel',
        fundingGoal: 1200000000,
        currentFunding: 720000000,
        deadline: '2024-05-15'
      },
      {
        id: 3,
        title: 'Resort Touristique Saly',
        location: 'Saly, Mbour',
        type: 'Touristique',
        minInvestment: 75000000,
        expectedReturn: 25.2,
        duration: '30 mois',
        riskLevel: 'Élevé',
        description: 'Resort 4 étoiles avec 60 chambres',
        promoter: 'Teranga Tourism SA',
        fundingGoal: 2500000000,
        currentFunding: 1250000000,
        deadline: '2024-06-01'
      }
    ],
    marketAnalysis: [
      {
        segment: 'Résidentiel Dakar',
        currentTrend: '+8.5%',
        performance: 'Excellent',
        avgReturn: 18.2,
        riskLevel: 'Faible',
        recommendation: 'Acheter'
      },
      {
        segment: 'Commercial',
        currentTrend: '+12.3%',
        performance: 'Très bon',
        avgReturn: 21.5,
        riskLevel: 'Modéré',
        recommendation: 'Acheter'
      },
      {
        segment: 'Touristique',
        currentTrend: '+15.8%',
        performance: 'Excellent',
        avgReturn: 24.7,
        riskLevel: 'Élevé',
        recommendation: 'Considérer'
      },
      {
        segment: 'Développement',
        currentTrend: '+25.2%',
        performance: 'Exceptionnel',
        avgReturn: 35.8,
        riskLevel: 'Très élevé',
        recommendation: 'Opportunité'
      }
    ],
    recentActivities: [
      {
        id: 1,
        type: 'dividend_received',
        title: 'Dividendes reçus',
        description: 'Revenus mensuels Résidence Les Palmiers',
        amount: 3200000,
        timestamp: '2024-03-15T09:00:00Z',
        icon: DollarSign
      },
      {
        id: 2,
        type: 'opportunity_added',
        title: 'Nouvelle opportunité',
        description: 'Projet Résidentiel VDN disponible',
        amount: null,
        timestamp: '2024-03-14T16:30:00Z',
        icon: Target
      },
      {
        id: 3,
        type: 'valuation_update',
        title: 'Réévaluation portfolio',
        description: 'Augmentation de valeur Complex Commercial',
        amount: 15000000,
        timestamp: '2024-03-13T11:20:00Z',
        icon: TrendingUp
      }
    ]
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'actif':
        return 'bg-green-100 text-green-800';
      case 'en développement':
        return 'bg-yellow-100 text-yellow-800';
      case 'vendu':
        return 'bg-blue-100 text-blue-800';
      case 'en vente':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'très faible':
        return 'text-green-600';
      case 'faible':
        return 'text-blue-600';
      case 'modéré':
        return 'text-yellow-600';
      case 'élevé':
        return 'text-orange-600';
      case 'très élevé':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation.toLowerCase()) {
      case 'acheter':
        return 'text-green-600 bg-green-100';
      case 'conserver':
        return 'text-blue-600 bg-blue-100';
      case 'considérer':
        return 'text-yellow-600 bg-yellow-100';
      case 'opportunité':
        return 'text-purple-600 bg-purple-100';
      case 'vendre':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const sidebarItems = [
    {
      id: 'portfolio',
      label: 'Mon Portfolio',
      icon: Briefcase,
      href: '/mon-portfolio',
      badge: dashboardData.stats.totalInvestments
    },
    {
      id: 'opportunities',
      label: 'Opportunités',
      icon: Target,
      href: '/opportunites-investissement',
      badge: dashboardData.stats.activeOpportunities
    },
    {
      id: 'market',
      label: 'Analyse marché',
      icon: BarChart3,
      href: '/analyse-marche',
      badge: null
    },
    {
      id: 'reports',
      label: 'Rapports',
      icon: FileText,
      href: '/rapports-investissement',
      badge: null
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      <ModernSidebar 
        sidebarItems={sidebarItems} 
        currentPage="dashboard"
      />
      
      <div className="flex-1 ml-80 p-6 bg-gray-50 min-h-screen">
        <Helmet>
          <title>Dashboard Investisseur - Teranga Foncier</title>
          <meta name="description" content="Tableau de bord investisseur sur Teranga Foncier" />
        </Helmet>

        {/* En-tête avec photo de profil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20 border-4 border-white/20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-white/20 text-white text-2xl">
                    {profile?.name ? 
                      profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                      (user?.email ? user.email.slice(0, 2).toUpperCase() : 'I')
                    }
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Bonjour, {profile?.name || user?.email?.split('@')[0] || 'Investisseur'} ! 📈
                  </h1>
                  <p className="text-purple-100 text-lg">Investisseur Immobilier</p>
                  {profile?.company && (
                    <p className="text-purple-200 flex items-center mt-1">
                      <Building className="w-4 h-4 mr-1" />
                      {profile.company}
                    </p>
                  )}
                  <p className="text-purple-200 flex items-center mt-1">
                    <Phone className="w-4 h-4 mr-1" />
                    +221 77 593 42 41
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">
                  {formatCurrency(dashboardData.stats.portfolioValue)}
                </div>
                <div className="text-purple-200">Valeur du portfolio</div>
                <div className="text-sm text-purple-300 mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{dashboardData.stats.averageReturn}% rendement moyen
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistiques principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Investissements</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.totalInvestments}
                  </p>
                  <p className="text-xs text-purple-600">
                    Properties actives
                  </p>
                </div>
                <Briefcase className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Revenus mensuels</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(dashboardData.stats.monthlyIncome / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-green-600">
                    +12% ce mois
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rendement moyen</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.averageReturn}%
                  </p>
                  <p className="text-xs text-blue-600">
                    Performance excellente
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Opportunités</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.activeOpportunities}
                  </p>
                  <p className="text-xs text-orange-600">
                    Disponibles maintenant
                  </p>
                </div>
                <Target className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col space-y-2">
                  <Plus className="w-6 h-6" />
                  <span className="text-sm">Nouvel investissement</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Calculator className="w-6 h-6" />
                  <span className="text-sm">Calculateur ROI</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <BarChart3 className="w-6 h-6" />
                  <span className="text-sm">Analyse marché</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Download className="w-6 h-6" />
                  <span className="text-sm">Exporter rapport</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contenu principal avec onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
            <TabsTrigger value="market">Marché</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance du portfolio */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Performance du portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Valeur totale</span>
                      <span className="font-semibold">{formatCurrency(dashboardData.stats.portfolioValue)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Plus-values totales</span>
                      <span className="font-semibold text-green-600">{formatCurrency(dashboardData.stats.totalReturns)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rendement moyen</span>
                      <span className="font-semibold text-blue-600">{dashboardData.stats.averageReturn}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Score de diversification</span>
                      <span className="font-semibold">{dashboardData.stats.diversificationIndex}/100</span>
                    </div>
                    <Progress value={dashboardData.stats.diversificationIndex} className="mt-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Activités récentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Activités récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentActivities.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <div key={activity.id} className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {activity.description}
                            </p>
                            {activity.amount && (
                              <p className="text-sm font-semibold text-green-600">
                                {formatCurrency(activity.amount)}
                              </p>
                            )}
                            <p className="text-xs text-gray-400">
                              {new Date(activity.timestamp).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Répartition par type */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition du portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">40%</div>
                    <div className="text-sm text-gray-600">Résidentiel</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">35%</div>
                    <div className="text-sm text-gray-600">Commercial</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">15%</div>
                    <div className="text-sm text-gray-600">Touristique</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">10%</div>
                    <div className="text-sm text-gray-600">Développement</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mon Portfolio</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter investissement
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {dashboardData.investments.map((investment) => (
                <Card key={investment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {investment.property.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{investment.property}</h3>
                            <p className="text-sm text-gray-600">{investment.location}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(investment.status)}>
                                {investment.status}
                              </Badge>
                              <Badge variant="outline">{investment.type}</Badge>
                              <Badge className={`${getRiskColor(investment.riskLevel)} bg-transparent`}>
                                Risque {investment.riskLevel.toLowerCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-500">Investissement:</span>
                            <p className="font-semibold text-blue-600">{formatCurrency(investment.investmentAmount)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Valeur actuelle:</span>
                            <p className="font-medium">{formatCurrency(investment.currentValue)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Revenus mensuels:</span>
                            <p className="font-medium text-green-600">{formatCurrency(investment.monthlyReturn)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Rendement:</span>
                            <p className="font-medium text-purple-600">{investment.returnRate}%</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Plus-value totale:</span>
                            <p className="font-medium text-green-600">{formatCurrency(investment.totalReturn)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Taux d'occupation:</span>
                            <p className="font-medium">{investment.occupancyRate}%</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Date d'acquisition:</span>
                            <p className="font-medium">{new Date(investment.acquisitionDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Performance
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calculator className="w-4 h-4 mr-2" />
                          Analyse
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Opportunités */}
          <TabsContent value="opportunities" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Opportunités d'Investissement</h2>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer par risque
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.opportunities.map((opportunity) => (
                <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg mb-2">{opportunity.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{opportunity.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{opportunity.type}</Badge>
                        <Badge className={`${getRiskColor(opportunity.riskLevel)} bg-transparent`}>
                          {opportunity.riskLevel}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Localisation:</span>
                        <span className="text-sm font-medium">{opportunity.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Investissement min:</span>
                        <span className="text-sm font-semibold text-blue-600">
                          {formatCurrency(opportunity.minInvestment)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Rendement estimé:</span>
                        <span className="text-sm font-semibold text-green-600">
                          {opportunity.expectedReturn}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Durée:</span>
                        <span className="text-sm font-medium">{opportunity.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Promoteur:</span>
                        <span className="text-sm font-medium">{opportunity.promoter}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Financement</span>
                        <span>{((opportunity.currentFunding / opportunity.fundingGoal) * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={(opportunity.currentFunding / opportunity.fundingGoal) * 100} />
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <span>{formatCurrency(opportunity.currentFunding)}</span>
                        <span>{formatCurrency(opportunity.fundingGoal)}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Investir
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Détails
                      </Button>
                    </div>

                    <div className="text-xs text-gray-500 mt-2">
                      Clôture le {new Date(opportunity.deadline).toLocaleDateString('fr-FR')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Marché */}
          <TabsContent value="market" className="space-y-6">
            <h2 className="text-2xl font-bold">Analyse du Marché</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardData.marketAnalysis.map((segment, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg">{segment.segment}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-sm">
                          {segment.performance}
                        </Badge>
                        <Badge className={getRecommendationColor(segment.recommendation)}>
                          {segment.recommendation}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Tendance</span>
                          <span className={`text-lg font-semibold ${
                            segment.currentTrend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {segment.currentTrend}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Rendement moyen</span>
                          <span className="text-lg font-semibold text-blue-600">
                            {segment.avgReturn}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Niveau de risque</span>
                          <span className={`text-sm font-medium ${getRiskColor(segment.riskLevel)}`}>
                            {segment.riskLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations d'investissement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">
                      🚀 Secteur en forte croissance
                    </h4>
                    <p className="text-green-800">
                      Le secteur du développement montre une croissance exceptionnelle de +25.2% avec des rendements moyens de 35.8%. 
                      Cependant, le risque est très élevé - diversifiez vos investissements.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      💼 Opportunité commerciale
                    </h4>
                    <p className="text-blue-800">
                      Le secteur commercial offre un excellent équilibre risque/rendement avec +12.3% de croissance 
                      et 21.5% de rendement moyen. Idéal pour la diversification.
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">
                      🏖️ Potentiel touristique
                    </h4>
                    <p className="text-yellow-800">
                      Le tourisme reprend avec +15.8% de croissance. Les investissements dans ce secteur 
                      montrent un potentiel intéressant mais nécessitent une analyse approfondie.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ModernInvestisseurDashboard;

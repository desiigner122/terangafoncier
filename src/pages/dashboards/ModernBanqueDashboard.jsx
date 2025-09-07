import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, CreditCard, Users, TrendingUp, Plus, Eye, 
  Calendar, FileText, BarChart3, Target, MapPin, Clock,
  CheckCircle, AlertCircle, Star, Filter, ChevronRight,
  DollarSign, Shield, Calculator, Package, Download,
  Phone, Mail, Globe, Award, Settings, Briefcase,
  ShieldCheck, Lock, Coins
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Helmet } from 'react-helmet-async';
import ModernSidebar from '@/components/layout/ModernSidebar';
import { useUser } from '@/hooks/useUser';

const ModernBanqueDashboard = () => {
  const { user, profile } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [dashboardData, setDashboardData] = useState({
    stats: {
      activeLoanApplications: 45,
      approvedLoans: 128,
      totalLoanAmount: 8900000000,
      averageLoanAmount: 69531250,
      defaultRate: 2.3,
      riskScore: 87.5,
      portfolioValue: 12450000000,
      clientSatisfaction: 92.8
    },
    loanApplications: [
      {
        id: 1,
        applicantName: 'Amadou Diop',
        applicantType: 'Particulier',
        propertyType: 'Villa résidentielle',
        propertyLocation: 'Almadies, Dakar',
        loanAmount: 45000000,
        propertyValue: 60000000,
        ltvRatio: 75,
        creditScore: 758,
        status: 'En évaluation',
        submissionDate: '2024-03-15',
        income: 1800000,
        riskLevel: 'Faible'
      },
      {
        id: 2,
        applicantName: 'SARL Construction Plus',
        applicantType: 'Entreprise',
        propertyType: 'Projet commercial',
        propertyLocation: 'Plateau, Dakar',
        loanAmount: 250000000,
        propertyValue: 350000000,
        ltvRatio: 71,
        creditScore: 682,
        status: 'Approuvé',
        submissionDate: '2024-03-10',
        income: 8500000,
        riskLevel: 'Modéré'
      },
      {
        id: 3,
        applicantName: 'Fatou Sall',
        applicantType: 'Diaspora',
        propertyType: 'Appartement',
        propertyLocation: 'VDN, Dakar',
        loanAmount: 35000000,
        propertyValue: 50000000,
        ltvRatio: 70,
        creditScore: 812,
        status: 'Documents manquants',
        submissionDate: '2024-03-12',
        income: 2200000,
        riskLevel: 'Très faible'
      }
    ],
    portfolioAnalysis: [
      {
        segment: 'Résidentiel particuliers',
        totalLoans: 45,
        totalAmount: 2800000000,
        averageAmount: 62222222,
        defaultRate: 1.8,
        performance: 'Excellent'
      },
      {
        segment: 'Commercial entreprises',
        totalLoans: 18,
        totalAmount: 3200000000,
        averageAmount: 177777778,
        defaultRate: 2.1,
        performance: 'Très bon'
      },
      {
        segment: 'Diaspora',
        totalLoans: 65,
        totalAmount: 2900000000,
        averageAmount: 44615385,
        defaultRate: 1.2,
        performance: 'Excellent'
      }
    ],
    recentActivities: [
      {
        id: 1,
        type: 'loan_approved',
        title: 'Prêt approuvé',
        description: 'Prêt de 250M XOF pour SARL Construction Plus',
        timestamp: '2024-03-15T14:30:00Z',
        icon: CheckCircle,
        amount: 250000000
      },
      {
        id: 2,
        type: 'application_received',
        title: 'Nouvelle demande',
        description: 'Demande de prêt immobilier de Amadou Diop',
        timestamp: '2024-03-15T10:15:00Z',
        icon: FileText,
        amount: 45000000
      },
      {
        id: 3,
        type: 'risk_assessment',
        title: 'Évaluation des risques',
        description: 'Rapport d\'évaluation pour projet Almadies',
        timestamp: '2024-03-14T16:45:00Z',
        icon: Shield,
        amount: null
      }
    ],
    marketTrends: [
      {
        location: 'Dakar Centre',
        averagePropertyValue: 45000000,
        loanDemand: 'Très forte',
        trend: '+8.5%',
        riskLevel: 'Faible'
      },
      {
        location: 'Almadies',
        averagePropertyValue: 65000000,
        loanDemand: 'Forte',
        trend: '+12.3%',
        riskLevel: 'Modéré'
      },
      {
        location: 'Saly',
        averagePropertyValue: 35000000,
        loanDemand: 'Modérée',
        trend: '+5.7%',
        riskLevel: 'Faible'
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
      case 'approuvé':
        return 'bg-green-100 text-green-800';
      case 'en évaluation':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejeté':
        return 'bg-red-100 text-red-800';
      case 'documents manquants':
        return 'bg-orange-100 text-orange-800';
      case 'en attente':
        return 'bg-blue-100 text-blue-800';
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

  const getPerformanceColor = (performance) => {
    switch (performance.toLowerCase()) {
      case 'excellent':
        return 'text-green-600';
      case 'très bon':
        return 'text-blue-600';
      case 'bon':
        return 'text-yellow-600';
      case 'moyen':
        return 'text-orange-600';
      case 'faible':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const sidebarItems = [
    {
      id: 'loans',
      label: 'Demandes de Financement',
      icon: CreditCard,
      href: '/dashboard/funding-requests',
      badge: dashboardData.stats.activeLoanApplications
    },
    {
      id: 'payment-plans',
      label: 'Plans de Paiement',
      icon: Calendar,
      href: '/dashboard/payment-plans',
      badge: null
    },
    {
      id: 'land-valuation',
      label: 'Évaluation Foncière',
      icon: Calculator,
      href: '/dashboard/land-valuation',
      badge: null
    },
    {
      id: 'guarantees',
      label: 'Garanties',
      icon: Shield,
      href: '/dashboard/guarantees',
      badge: null
    },
    {
      id: 'compliance',
      label: 'Compliance',
      icon: CheckCircle,
      href: '/dashboard/compliance',
      badge: null
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: Briefcase,
      href: '/portfolio',
      badge: null
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: Users,
      href: '/mes-clients-banque',
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
          <title>Dashboard Banque - Teranga Foncier</title>
          <meta name="description" content="Tableau de bord bancaire sur Teranga Foncier" />
        </Helmet>

        {/* En-tête avec photo de profil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20 border-4 border-white/20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-white/20 text-white text-2xl">
                    {profile?.name ? 
                      profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                      (user?.email ? user.email.slice(0, 2).toUpperCase() : 'B')
                    }
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Bonjour, {profile?.name || user?.email?.split('@')[0] || 'Banquier'} ! 🏦
                  </h1>
                  <p className="text-blue-100 text-lg">Institution Bancaire</p>
                  {profile?.company && (
                    <p className="text-blue-200 flex items-center mt-1">
                      <Building className="w-4 h-4 mr-1" />
                      {profile.company}
                    </p>
                  )}
                  <p className="text-blue-200 flex items-center mt-1">
                    <Phone className="w-4 h-4 mr-1" />
                    +221 77 593 42 41
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">
                  {formatCurrency(dashboardData.stats.portfolioValue)}
                </div>
                <div className="text-blue-200">Valeur du portfolio</div>
                <div className="text-sm text-blue-300 mt-1">
                  Score de risque: {dashboardData.stats.riskScore}/100
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
                  <p className="text-sm text-gray-600 mb-1">Demandes actives</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.activeLoanApplications}
                  </p>
                  <p className="text-xs text-blue-600">
                    En cours de traitement
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Prêts approuvés</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.approvedLoans}
                  </p>
                  <p className="text-xs text-green-600">
                    +8 ce mois
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Montant total prêts</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(dashboardData.stats.totalLoanAmount / 1000000000).toFixed(1)}Md
                  </p>
                  <p className="text-xs text-purple-600">
                    XOF en portefeuille
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Taux d'impayés</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.defaultRate}%
                  </p>
                  <p className="text-xs text-green-600">
                    Très faible risque
                  </p>
                </div>
                <Shield className="w-8 h-8 text-orange-500" />
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
                  <span className="text-sm">Nouveau prêt</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Calculator className="w-6 h-6" />
                  <span className="text-sm">Simulateur</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Shield className="w-6 h-6" />
                  <span className="text-sm">Analyse risque</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <BarChart3 className="w-6 h-6" />
                  <span className="text-sm">Rapports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contenu principal avec onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="applications">Demandes</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="blockchain">🆕 Blockchain</TabsTrigger>
            <TabsTrigger value="market">Marché</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activités récentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
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

              {/* Analyse du portfolio */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Analyse du portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.portfolioAnalysis.map((segment, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{segment.segment}</h4>
                          <Badge className={`${getPerformanceColor(segment.performance)} bg-transparent`}>
                            {segment.performance}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Nombre de prêts:</span>
                            <p className="font-medium">{segment.totalLoans}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Montant total:</span>
                            <p className="font-medium">{formatCurrency(segment.totalAmount)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Montant moyen:</span>
                            <p className="font-medium">{formatCurrency(segment.averageAmount)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Taux d'impayés:</span>
                            <p className="font-medium text-green-600">{segment.defaultRate}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Demandes */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Demandes de prêt</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle demande
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {dashboardData.loanApplications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback>
                              {application.applicantName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">{application.applicantName}</h3>
                            <p className="text-sm text-gray-600">{application.applicantType}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(application.status)}>
                                {application.status}
                              </Badge>
                              <Badge className={`${getRiskColor(application.riskLevel)} bg-transparent`}>
                                Risque {application.riskLevel.toLowerCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-500">Montant demandé:</span>
                            <p className="font-semibold text-blue-600">{formatCurrency(application.loanAmount)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Valeur du bien:</span>
                            <p className="font-medium">{formatCurrency(application.propertyValue)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Ratio LTV:</span>
                            <p className="font-medium">{application.ltvRatio}%</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Score crédit:</span>
                            <p className="font-medium text-green-600">{application.creditScore}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Type de bien:</span>
                            <p className="font-medium">{application.propertyType}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Localisation:</span>
                            <p className="font-medium">{application.propertyLocation}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Revenus mensuels:</span>
                            <p className="font-medium">{formatCurrency(application.income)}</p>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-gray-500">
                          Soumise le {new Date(application.submissionDate).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Évaluer
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Documents
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calculator className="w-4 h-4 mr-2" />
                          Calculer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Portfolio */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Analyse du Portfolio</h2>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter rapport
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dashboardData.portfolioAnalysis.map((segment, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg">{segment.segment}</h3>
                      <Badge className={`${getPerformanceColor(segment.performance)} bg-transparent`}>
                        Performance {segment.performance.toLowerCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Nombre de prêts</p>
                        <p className="text-2xl font-bold">{segment.totalLoans}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Montant total</p>
                        <p className="text-xl font-semibold text-blue-600">
                          {formatCurrency(segment.totalAmount)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Montant moyen</p>
                        <p className="text-lg font-medium">
                          {formatCurrency(segment.averageAmount)}
                        </p>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Taux d'impayés</span>
                          <span className="text-lg font-semibold text-green-600">
                            {segment.defaultRate}%
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
                <CardTitle>Recommandations portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">
                      📈 Performance excellente
                    </h4>
                    <p className="text-green-800">
                      Votre taux d'impayés de {dashboardData.stats.defaultRate}% est bien en dessous de la moyenne du marché (5%). 
                      Votre stratégie de sélection des risques est efficace.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      💡 Opportunité de croissance
                    </h4>
                    <p className="text-blue-800">
                      Le segment diaspora montre la meilleure performance avec seulement 1.2% d'impayés. 
                      Considérez l'expansion de votre offre pour ce segment.
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">
                      ⚠️ Surveillance recommandée
                    </h4>
                    <p className="text-yellow-800">
                      Le segment commercial montre un taux d'impayés légèrement plus élevé (2.1%). 
                      Renforcez l'analyse des garanties pour ces dossiers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blockchain Banking */}
          <TabsContent value="blockchain" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-purple-600" />
                Banque Blockchain 🆕
              </h2>
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                Nouvelle Technologie
              </Badge>
            </div>

            {/* Section d'introduction blockchain */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Link className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Financement Blockchain Sécurisé</h3>
                  <p className="text-purple-100">Révolutionnez vos services bancaires avec la technologie blockchain</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🔒 Smart Contracts</h4>
                  <p className="text-sm text-purple-100">Automatisation complète des prêts et garanties</p>
                  <div className="mt-2 text-xs text-yellow-300">
                    ⚡ 23 contrats de prêt actifs
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">🏆 Tokenisation</h4>
                  <p className="text-sm text-purple-100">Propriétés transformées en tokens négociables</p>
                  <div className="mt-2 text-xs text-yellow-300">
                    ⚡ 45 propriétés tokenisées
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">💎 Escrow Automatisé</h4>
                  <p className="text-sm text-purple-100">Séquestre intelligent sans intervention manuelle</p>
                  <div className="mt-2 text-xs text-yellow-300">
                    ⚡ 8.9Md FCFA en escrow blockchain
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques blockchain */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 mb-1">Smart Contracts Actifs</p>
                      <p className="text-3xl font-bold text-blue-900">23</p>
                      <p className="text-xs text-blue-700">+5 ce mois</p>
                    </div>
                    <ShieldCheck className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 mb-1">Volume Tokenisé</p>
                      <p className="text-3xl font-bold text-purple-900">12.4Md</p>
                      <p className="text-xs text-purple-700">FCFA en tokens</p>
                    </div>
                    <Coins className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 mb-1">Transactions Sécurisées</p>
                      <p className="text-3xl font-bold text-green-900">156</p>
                      <p className="text-xs text-green-700">100% réussies</p>
                    </div>
                    <Lock className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600 mb-1">Économies Réalisées</p>
                      <p className="text-3xl font-bold text-yellow-900">18.2%</p>
                      <p className="text-xs text-yellow-700">Sur frais de traitement</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Services blockchain bancaires */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                    Prêts Smart Contract
                  </CardTitle>
                  <CardDescription>
                    Automatisation complète du processus de prêt avec garanties blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Prêt automatisé - Villa Almadies</p>
                        <p className="text-sm text-gray-600">Amadou Diop • 45M FCFA</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Smart Escrow - Projet Commercial</p>
                        <p className="text-sm text-gray-600">SARL Construction Plus • 250M FCFA</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Diaspora Token Loan</p>
                        <p className="text-sm text-gray-600">Fatou Sall • 35M FCFA</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">Nouveau</Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer Smart Contract
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-purple-600" />
                    Tokenisation Immobilière
                  </CardTitle>
                  <CardDescription>
                    Transformation des propriétés en tokens négociables sur blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Portfolio Tokenisé</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Résidentiel</span>
                          <span className="font-medium">5.2Md FCFA</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Commercial</span>
                          <span className="font-medium">4.8Md FCFA</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Industriel</span>
                          <span className="font-medium">2.4Md FCFA</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Voir Tokens
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calculator className="w-4 h-4 mr-2" />
                        Évaluer Token
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Avantages blockchain pour la banque */}
            <Card>
              <CardHeader>
                <CardTitle>Avantages Blockchain pour Votre Banque</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">
                      💰 Réduction des Coûts
                    </h4>
                    <p className="text-green-800 text-sm">
                      Économies de 18.2% sur les frais de traitement grâce à l'automatisation blockchain
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      🔒 Sécurité Renforcée
                    </h4>
                    <p className="text-blue-800 text-sm">
                      100% des transactions blockchain sécurisées avec audit automatisé des contrats
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">
                      ⚡ Traitement Instantané
                    </h4>
                    <p className="text-purple-800 text-sm">
                      Prêts approuvés et déboursés en moins de 24h avec validation blockchain
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marché */}
          <TabsContent value="market" className="space-y-6">
            <h2 className="text-2xl font-bold">Analyse du Marché Immobilier</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dashboardData.marketTrends.map((market, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg">{market.location}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{market.loanDemand} demande</Badge>
                        <Badge className={`${getRiskColor(market.riskLevel)} bg-transparent`}>
                          {market.riskLevel} risque
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Valeur moyenne des biens</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(market.averagePropertyValue)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Évolution des prix</p>
                        <p className="text-lg font-semibold text-green-600">{market.trend}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Insights du marché</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      📊 Tendances du marché
                    </h4>
                    <p className="text-blue-800">
                      Almadies montre la plus forte croissance (+12.3%) mais avec un risque modéré. 
                      Ajustez vos critères de financement en conséquence.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">
                      🎯 Zones recommandées
                    </h4>
                    <p className="text-green-800">
                      Dakar Centre et Saly présentent un excellent équilibre entre demande forte et risque faible. 
                      Ces zones sont idéales pour l'expansion du portfolio.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">
                      💰 Recommandations de financement
                    </h4>
                    <p className="text-orange-800">
                      Votre montant moyen de prêt ({formatCurrency(dashboardData.stats.averageLoanAmount)}) 
                      est aligné avec les valeurs du marché. Maintenez cette stratégie.
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

export default ModernBanqueDashboard;

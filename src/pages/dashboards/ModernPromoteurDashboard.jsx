import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Users, DollarSign, TrendingUp, Plus, Eye, 
  Calendar, FileText, BarChart3, Target, MapPin, Clock,
  CheckCircle, AlertCircle, Star, Filter, ChevronRight,
  Hammer, Truck, Package, CreditCard, Download, Upload,
  Phone, Mail, Globe, Award, Shield, Settings,
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

const ModernPromoteurDashboard = () => {
  const { user, profile } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [dashboardData, setDashboardData] = useState({
    stats: {
      activeProjects: 8,
      completedProjects: 15,
      totalUnits: 245,
      soldUnits: 189,
      totalRevenue: 2450000000,
      constructionBudget: 1800000000,
      profitMargin: 26.5,
      clientSatisfaction: 94.2,
      remoteClients: 23,
      monitoringActive: 6
    },
    projects: [
      {
        id: 1,
        name: 'Résidence Les Palmiers',
        location: 'Almadies, Dakar',
        type: 'Résidentiel haut standing',
        status: 'En construction',
        progress: 75,
        totalUnits: 45,
        soldUnits: 38,
        budget: 850000000,
        spent: 637500000,
        startDate: '2023-06-15',
        expectedCompletion: '2024-12-30',
        image: '/images/residence1.jpg'
      },
      {
        id: 2,
        name: 'Centre Commercial Saly Plaza',
        location: 'Saly, Mbour',
        type: 'Commercial',
        status: 'Planification',
        progress: 15,
        totalUnits: 28,
        soldUnits: 12,
        budget: 1200000000,
        spent: 180000000,
        startDate: '2024-02-01',
        expectedCompletion: '2025-08-15',
        image: '/images/commercial1.jpg'
      },
      {
        id: 3,
        name: 'Villa Collection VDN',
        location: 'VDN, Dakar',
        type: 'Villas de luxe',
        status: 'Livré',
        progress: 100,
        totalUnits: 12,
        soldUnits: 12,
        budget: 450000000,
        spent: 430000000,
        startDate: '2022-09-01',
        expectedCompletion: '2024-01-15',
        image: '/images/villas1.jpg'
      }
    ],
    recentSales: [
      {
        id: 1,
        projectName: 'Résidence Les Palmiers',
        unitType: 'Appartement 3 pièces',
        price: 45000000,
        buyerName: 'Amadou Diop',
        buyerType: 'Particulier Diaspora',
        saleDate: '2024-03-15',
        commission: 2250000
      },
      {
        id: 2,
        projectName: 'Centre Commercial Saly Plaza',
        unitType: 'Local commercial 50m²',
        price: 85000000,
        buyerName: 'SARL TechnoServices',
        buyerType: 'Entreprise',
        saleDate: '2024-03-12',
        commission: 4250000
      },
      {
        id: 3,
        projectName: 'Villa Collection VDN',
        unitType: 'Villa 5 pièces',
        price: 125000000,
        buyerName: 'Fatou Sall',
        buyerType: 'Investisseur',
        saleDate: '2024-03-08',
        commission: 6250000
      }
    ],
    constructionUpdates: [
      {
        id: 1,
        project: 'Résidence Les Palmiers',
        milestone: 'Finition des appartements bloc A',
        status: 'Terminé',
        date: '2024-03-15',
        contractor: 'BTP Sénégal SA'
      },
      {
        id: 2,
        project: 'Résidence Les Palmiers',
        milestone: 'Installation électricité bloc B',
        status: 'En cours',
        date: '2024-03-18',
        contractor: 'ElectroPlus'
      },
      {
        id: 3,
        project: 'Centre Commercial Saly Plaza',
        milestone: 'Étude de sol terminée',
        status: 'Terminé',
        date: '2024-03-10',
        contractor: 'GeoTech Consulting'
      }
    ],
    marketAnalysis: [
      {
        segment: 'Résidentiel haut standing',
        averagePrice: 38000000,
        demand: 'Très forte',
        trend: '+12.8%',
        yourPosition: 'Leader'
      },
      {
        segment: 'Commercial',
        averagePrice: 75000000,
        demand: 'Forte',
        trend: '+8.4%',
        yourPosition: 'Concurrentiel'
      },
      {
        segment: 'Villas de luxe',
        averagePrice: 110000000,
        demand: 'Modérée',
        trend: '+5.2%',
        yourPosition: 'Premium'
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
      case 'en construction':
        return 'bg-orange-100 text-orange-800';
      case 'planification':
        return 'bg-blue-100 text-blue-800';
      case 'livré':
        return 'bg-green-100 text-green-800';
      case 'terminé':
        return 'bg-green-100 text-green-800';
      case 'en cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'retard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDemandColor = (demand) => {
    switch (demand.toLowerCase()) {
      case 'très forte':
        return 'text-green-600';
      case 'forte':
        return 'text-blue-600';
      case 'modérée':
        return 'text-yellow-600';
      case 'faible':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: BarChart3,
      href: '/dashboard',
      badge: null
    },
    {
      id: 'projects',
      label: 'Mes Projets',
      icon: Building2,
      href: '/dashboard/projects',
      badge: dashboardData.stats.activeProjects
    },
    {
      id: 'construction-distance',
      label: 'Construction à Distance',
      icon: Globe,
      href: '/solutions/construction-distance',
      badge: dashboardData.stats.remoteClients
    },
    {
      id: 'project-monitoring',
      label: 'Monitoring Projets',
      icon: Eye,
      href: '/solutions/project-monitoring',
      badge: dashboardData.stats.monitoringActive
    },
    {
      id: 'construction-tracking',
      label: 'Suivi Chantiers',
      icon: Hammer,
      href: '/dashboard/construction-tracking',
      badge: null
    },
    {
      id: 'sales',
      label: 'Ventes',
      icon: DollarSign,
      href: '/dashboard/sales',
      badge: null
    },
    {
      id: 'construction',
      label: 'Chantiers',
      icon: Hammer,
      href: '/dashboard/construction',
      badge: null
    },
    {
      id: 'clients',
      label: 'Tous les Clients',
      icon: Users,
      href: '/dashboard/clients',
      badge: null
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
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
          <title>Dashboard Promoteur - Teranga Foncier</title>
          <meta name="description" content="Tableau de bord promoteur sur Teranga Foncier" />
        </Helmet>

        {/* En-tête avec photo de profil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20 border-4 border-white/20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-white/20 text-white text-2xl">
                    {profile?.name ? 
                      profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                      (user?.email ? user.email.slice(0, 2).toUpperCase() : 'P')
                    }
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Bonjour, {profile?.name || user?.email?.split('@')[0] || 'Promoteur'} ! 🏗️
                  </h1>
                  <p className="text-orange-100 text-lg">Promoteur Immobilier</p>
                  {profile?.company && (
                    <p className="text-orange-200 flex items-center mt-1">
                      <Building2 className="w-4 h-4 mr-1" />
                      {profile.company}
                    </p>
                  )}
                  {profile?.location && (
                    <p className="text-orange-200 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profile.location}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">
                  {formatCurrency(dashboardData.stats.totalRevenue)}
                </div>
                <div className="text-orange-200">Chiffre d'affaires total</div>
                <div className="text-sm text-orange-300 mt-1">
                  {dashboardData.stats.profitMargin}% marge bénéficiaire
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
                  <p className="text-sm text-gray-600 mb-1">Projets actifs</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.activeProjects}
                  </p>
                  <p className="text-xs text-orange-600">
                    En cours de développement
                  </p>
                </div>
                <Building2 className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Unités vendues</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.soldUnits}
                  </p>
                  <p className="text-xs text-green-600">
                    /{dashboardData.stats.totalUnits} unités
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
                  <p className="text-sm text-gray-600 mb-1">Taux de vente</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round((dashboardData.stats.soldUnits / dashboardData.stats.totalUnits) * 100)}%
                  </p>
                  <p className="text-xs text-blue-600">
                    Excellent performance
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Satisfaction client</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.clientSatisfaction}%
                  </p>
                  <p className="text-xs text-purple-600">
                    Très satisfaisant
                  </p>
                </div>
                <Star className="w-8 h-8 text-purple-500" />
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
                  <span className="text-sm">Nouveau projet</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Hammer className="w-6 h-6" />
                  <span className="text-sm">Suivi chantier</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <BarChart3 className="w-6 h-6" />
                  <span className="text-sm">Analyses</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Clients</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contenu principal avec onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="projects">Mes Projets</TabsTrigger>
            <TabsTrigger value="sales">Ventes</TabsTrigger>
            <TabsTrigger value="market">Marché</TabsTrigger>
            <TabsTrigger value="blockchain">🆕 Blockchain</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Projets en cours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hammer className="w-5 h-5" />
                    Projets en cours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.projects.filter(p => p.status !== 'Livré').map((project) => (
                      <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{project.name}</h4>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{project.location}</p>
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Progression</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Vendues:</span>
                            <p className="font-medium">{project.soldUnits}/{project.totalUnits}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Budget:</span>
                            <p className="font-medium">{formatCurrency(project.budget)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Mises à jour construction */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Mises à jour construction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.constructionUpdates.map((update) => (
                      <div key={update.id} className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Hammer className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {update.milestone}
                          </p>
                          <p className="text-sm text-gray-500">
                            {update.project} • {update.contractor}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(update.status)} size="sm">
                              {update.status}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {new Date(update.date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mes Projets */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mes Projets</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau projet
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {dashboardData.projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="flex">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-48 h-32 object-cover"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/300/200';
                      }}
                    />
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{project.name}</h3>
                          <p className="text-gray-600 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {project.location}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">{project.type}</p>
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-500">Progression</span>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={project.progress} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{project.progress}%</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Unités vendues</span>
                          <p className="text-lg font-semibold">{project.soldUnits}/{project.totalUnits}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Budget</span>
                          <p className="text-lg font-semibold">{formatCurrency(project.budget)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Livraison prévue</span>
                          <p className="text-lg font-semibold">
                            {new Date(project.expectedCompletion).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Analyses
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4 mr-2" />
                          Gérer
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Ventes */}
          <TabsContent value="sales" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Ventes récentes</h2>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>

            <div className="space-y-4">
              {dashboardData.recentSales.map((sale) => (
                <Card key={sale.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>
                              {sale.buyerName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{sale.buyerName}</h3>
                            <p className="text-sm text-gray-600">{sale.buyerType}</p>
                          </div>
                          <Badge variant="secondary">
                            {new Date(sale.saleDate).toLocaleDateString('fr-FR')}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Projet:</span>
                            <p className="font-medium">{sale.projectName}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Bien:</span>
                            <p className="font-medium">{sale.unitType}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Prix:</span>
                            <p className="font-medium text-green-600">{formatCurrency(sale.price)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Commission:</span>
                            <p className="font-medium text-blue-600">{formatCurrency(sale.commission)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Contrat
                        </Button>
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Détails
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Marché */}
          <TabsContent value="market" className="space-y-6">
            <h2 className="text-2xl font-bold">Analyse du Marché</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dashboardData.marketAnalysis.map((segment, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg">{segment.segment}</h3>
                      <Badge className={`${getDemandColor(segment.demand)} bg-transparent`}>
                        Demande {segment.demand.toLowerCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Prix moyen</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(segment.averagePrice)}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Évolution</p>
                          <p className="text-lg font-semibold text-green-600">{segment.trend}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Votre position</p>
                          <p className="text-lg font-semibold text-blue-600">{segment.yourPosition}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations strategiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">
                      📈 Opportunité forte
                    </h4>
                    <p className="text-green-800">
                      Le segment résidentiel haut standing montre une croissance de 12.8%. 
                      Votre position de leader vous permet de capturer cette croissance.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      💡 Expansion suggérée
                    </h4>
                    <p className="text-blue-800">
                      Le marché commercial présente une demande forte avec +8.4% de croissance. 
                      C'est un bon moment pour diversifier votre portfolio.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">
                      ⚡ Performance excellente
                    </h4>
                    <p className="text-orange-800">
                      Votre taux de vente de {Math.round((dashboardData.stats.soldUnits / dashboardData.stats.totalUnits) * 100)}% 
                      est supérieur à la moyenne du marché (65%). Continuez cette dynamique !
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blockchain Promoteur */}
          <TabsContent value="blockchain" className="space-y-6">
            {/* Introduction Blockchain */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-blue-900">Promotion Immobilière Blockchain</CardTitle>
                    <CardDescription className="text-blue-700">
                      Révolutionnez vos projets immobiliers avec la tokenisation des biens, 
                      le financement collaboratif et les smart contracts de construction.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Statistiques Blockchain */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Propriétés Tokenisées</p>
                      <p className="text-2xl font-bold text-blue-900">127</p>
                      <p className="text-xs text-green-600">↗ +35% ce mois</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Coins className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Smart Contracts</p>
                      <p className="text-2xl font-bold text-purple-900">45</p>
                      <p className="text-xs text-green-600">↗ +28% ce mois</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Link className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Financement Blockchain</p>
                      <p className="text-2xl font-bold text-green-900">1.8Md</p>
                      <p className="text-xs text-green-600">FCFA levés</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Transparence</p>
                      <p className="text-2xl font-bold text-orange-900">100%</p>
                      <p className="text-xs text-green-600">Suivi temps réel</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <ShieldCheck className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Projets Tokenisés */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-blue-600" />
                    Projets Tokenisés Actifs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Résidence Les Palmiers</p>
                        <p className="text-sm text-gray-600">Token PALM • 38/45 vendus</p>
                        <Badge variant="outline" className="text-xs mt-1">Financement 85%</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-900">850M FCFA</p>
                        <p className="text-xs text-green-600">En construction</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium">Saly Plaza Commercial</p>
                        <p className="text-sm text-gray-600">Token SPLY • 12/28 vendus</p>
                        <Badge variant="outline" className="text-xs mt-1">Financement 43%</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-purple-900">1.2Md FCFA</p>
                        <p className="text-xs text-blue-600">Planification</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Villa Collection VDN</p>
                        <p className="text-sm text-gray-600">Token VCDN • 12/12 vendus</p>
                        <Badge variant="outline" className="text-xs mt-1">Financement 100%</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-900">450M FCFA</p>
                        <p className="text-xs text-green-600">Livré</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Tokeniser nouveau projet
                  </Button>
                </CardContent>
              </Card>

              {/* Smart Contracts Construction */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="w-5 h-5 text-purple-600" />
                    Smart Contracts Actifs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Hammer className="w-5 h-5 text-blue-600" />
                        <h4 className="font-medium">Construction Automatisée</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Paiements automatiques basés sur l'avancement des travaux
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge className="bg-blue-100 text-blue-800">6 contrats actifs</Badge>
                        <p className="text-sm font-medium">75% avancement</p>
                      </div>
                    </div>

                    <div className="p-4 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        <h4 className="font-medium">Investissement Collaboratif</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Financement participatif avec redistribution automatique
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge className="bg-purple-100 text-purple-800">156 investisseurs</Badge>
                        <p className="text-sm font-medium">1.8Md FCFA</p>
                      </div>
                    </div>

                    <div className="p-4 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <h4 className="font-medium">Garanties Décentralisées</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Protection automatique des investissements et remboursements
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge className="bg-green-100 text-green-800">100% sécurisé</Badge>
                        <p className="text-sm font-medium">0 litige</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financement Blockchain */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-900">Financement Blockchain Disponible</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-green-900 mb-3">Sources de Financement</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <p className="font-medium">Investisseurs Diaspora</p>
                          <p className="text-sm text-gray-600">Financement international</p>
                        </div>
                        <p className="font-medium text-green-900">40%</p>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <p className="font-medium">Particuliers Locaux</p>
                          <p className="text-sm text-gray-600">Investissement participatif</p>
                        </div>
                        <p className="font-medium text-blue-900">35%</p>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <p className="font-medium">Institutions</p>
                          <p className="text-sm text-gray-600">Banques et fonds</p>
                        </div>
                        <p className="font-medium text-purple-900">25%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-blue-900 mb-3">Avantages Blockchain</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                        <div className="p-2 bg-green-100 rounded-full">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Liquidité Améliorée</p>
                          <p className="text-sm text-gray-600">Revente facilitée des parts</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Financement Rapide</p>
                          <p className="text-sm text-gray-600">Levée de fonds en 48h</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                        <div className="p-2 bg-purple-100 rounded-full">
                          <DollarSign className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Coûts Réduits</p>
                          <p className="text-sm text-gray-600">-60% frais intermédiaires</p>
                        </div>
                      </div>
                    </div>
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

export default ModernPromoteurDashboard;

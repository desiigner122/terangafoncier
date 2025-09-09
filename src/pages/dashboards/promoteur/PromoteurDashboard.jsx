import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Calendar,
  MapPin, 
  Briefcase, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Share2,
  Download,
  Filter,
  Calculator,
  FileText,
  Camera,
  Settings,
  Target,
  BarChart3,
  PieChart,
  Globe,
  Star,
  MessageSquare,
  CreditCard,
  Hammer,
  Home,
  Users2,
  Wallet
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';

const PromoteurDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalProjects: 24,
      activeProjects: 8,
      completedProjects: 16,
      totalInvestors: 156,
      totalFunding: 2850000000,
      monthlyRevenue: 185000000
    },
    projects: [
      {
        id: 1,
        name: 'Résidence Les Palmiers',
        type: 'Résidentiel',
        location: 'Liberté 6, Dakar',
        totalBudget: 450000000,
        fundingCollected: 315000000,
        fundingPercentage: 70,
        investors: 28,
        completion: 45,
        status: 'En construction',
        startDate: '2024-01-15',
        estimatedCompletion: '2025-06-30',
        units: 24,
        availableUnits: 12,
        avgPrice: 18750000
      },
      {
        id: 2,
        name: 'Centre Commercial Diamniadio',
        type: 'Commercial',
        location: 'Diamniadio',
        totalBudget: 850000000,
        fundingCollected: 340000000,
        fundingPercentage: 40,
        investors: 15,
        completion: 15,
        status: 'Financement',
        startDate: '2024-03-01',
        estimatedCompletion: '2026-12-31',
        units: 45,
        availableUnits: 35,
        avgPrice: 18888888
      },
      {
        id: 3,
        name: 'Lotissement Moderne Saly',
        type: 'Terrain',
        location: 'Saly, Mbour',
        totalBudget: 285000000,
        fundingCollected: 285000000,
        fundingPercentage: 100,
        investors: 22,
        completion: 85,
        status: 'Livraison',
        startDate: '2023-08-10',
        estimatedCompletion: '2024-05-15',
        units: 35,
        availableUnits: 3,
        avgPrice: 8142857
      }
    ],
    investors: [
      {
        id: 1,
        name: 'M. Amadou Diallo',
        totalInvestment: 45000000,
        projects: ['Résidence Les Palmiers', 'Lotissement Moderne Saly'],
        joinDate: '2023-09-15',
        status: 'VIP',
        returns: 12.5
      },
      {
        id: 2,
        name: 'Mme Fatou Fall',
        totalInvestment: 32000000,
        projects: ['Centre Commercial Diamniadio'],
        joinDate: '2024-01-20',
        status: 'Premium',
        returns: 8.2
      }
    ],
    analytics: {
      monthlyFunding: [125, 180, 205, 165, 220, 185],
      projectTypes: {
        'Résidentiel': 45,
        'Commercial': 30,
        'Terrain': 25
      },
      investorDistribution: {
        'VIP': 15,
        'Premium': 35,
        'Standard': 50
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
    { value: dashboardData.stats.totalProjects, label: 'Total Projets' },
    { value: dashboardData.stats.activeProjects, label: 'Projets Actifs' },
    { value: dashboardData.stats.totalInvestors, label: 'Investisseurs' },
    { value: `${Math.round(dashboardData.stats.totalFunding / 1000000)}M`, label: 'Fonds Levés (FCFA)' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Planification': 'bg-blue-500',
      'Financement': 'bg-yellow-500',
      'En construction': 'bg-orange-500',
      'Livraison': 'bg-green-500',
      'Terminé': 'bg-purple-500',
      'Suspendu': 'bg-gray-500',
      'VIP': 'bg-purple-500',
      'Premium': 'bg-blue-500',
      'Standard': 'bg-gray-500'
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre espace promoteur...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Espace Promoteur"
      subtitle="Gestion de projets immobiliers"
      userRole="Promoteur"
      stats={stats}
    >
      <div className="space-y-6">
        {/* Widgets IA & Blockchain */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AIAssistantWidget userRole="Promoteur" dashboardData={dashboardData} />
          <BlockchainWidget userRole="Promoteur" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Revenus Mensuels</p>
                  <p className="text-lg font-bold text-orange-600">
                    {formatCurrency(dashboardData.stats.monthlyRevenue)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+18% vs mois dernier</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Taux Occupation</p>
                  <p className="text-lg font-bold text-green-600">
                    {Math.round(((dashboardData.projects.reduce((sum, p) => sum + (p.units - p.availableUnits), 0)) / 
                    dashboardData.projects.reduce((sum, p) => sum + p.units, 0)) * 100)}%
                  </p>
                </div>
                <Home className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <Progress value={75} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Projets en Cours</p>
                  <p className="text-lg font-bold text-blue-600">
                    {dashboardData.stats.activeProjects}
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <Clock className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-blue-600">2 en financement</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">ROI Moyen</p>
                  <p className="text-lg font-bold text-purple-600">24.8%</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <Star className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-purple-600">Excellent</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="projects">Mes Projets</TabsTrigger>
            <TabsTrigger value="investors">Investisseurs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="tools">Outils</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2 text-orange-600" />
                    Actions Rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Projet
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Gérer Investisseurs
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Rapports Projets
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculateur Budget
                  </Button>
                </CardContent>
              </Card>

              {/* Active Projects Summary */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                    Projets Actifs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.projects.filter(p => p.status !== 'Terminé').slice(0, 3).map((project) => (
                      <div key={project.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{project.name}</h4>
                            <p className="text-sm text-gray-600">{project.location}</p>
                          </div>
                          <Badge className={`${getStatusColor(project.status)} text-white`}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Financement</p>
                            <p className="font-medium">{project.fundingPercentage}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Avancement</p>
                            <p className="font-medium">{project.completion}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Investisseurs</p>
                            <p className="font-medium">{project.investors}</p>
                          </div>
                        </div>
                        <div className="mt-3 space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Financement</span>
                              <span>{project.fundingPercentage}%</span>
                            </div>
                            <Progress value={project.fundingPercentage} className="h-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Avancement</span>
                              <span>{project.completion}%</span>
                            </div>
                            <Progress value={project.completion} className="h-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-green-600" />
                    Activité Récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Nouvel investisseur rejoint</p>
                        <p className="text-xs text-gray-500">Centre Commercial Diamniadio - Il y a 2h</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Étape construction validée</p>
                        <p className="text-xs text-gray-500">Résidence Les Palmiers - Il y a 5h</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Nouveau projet créé</p>
                        <p className="text-xs text-gray-500">Villa Standing Saly - Hier</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                    Performance KPIs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Temps moyen financement</span>
                        <span className="text-sm font-medium">4.2 mois</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Satisfaction investisseurs</span>
                        <span className="text-sm font-medium">96%</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Respect délais</span>
                        <span className="text-sm font-medium">88%</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mes Projets Immobiliers</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Projet
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {dashboardData.projects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{project.name}</h3>
                          <Badge className={`${getStatusColor(project.status)} text-white`}>
                            {project.status}
                          </Badge>
                          <Badge variant="outline">
                            {project.type}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Localisation</p>
                            <p className="font-medium">{project.location}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Budget Total</p>
                            <p className="font-medium">{formatCurrency(project.totalBudget)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Unités</p>
                            <p className="font-medium">{project.units} ({project.availableUnits} dispo.)</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Prix Moyen</p>
                            <p className="font-medium">{formatCurrency(project.avgPrice)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Financement collecté</span>
                              <span>{project.fundingPercentage}%</span>
                            </div>
                            <Progress value={project.fundingPercentage} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">
                              {formatCurrency(project.fundingCollected)} / {formatCurrency(project.totalBudget)}
                            </p>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Avancement construction</span>
                              <span>{project.completion}%</span>
                            </div>
                            <Progress value={project.completion} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">
                              Fin prévue: {new Date(project.estimatedCompletion).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Investisseurs</span>
                              <span>{project.investors}</span>
                            </div>
                            <Progress value={(project.investors / 50) * 100} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">
                              Depuis: {new Date(project.startDate).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline">
                          <Users className="h-4 w-4 mr-1" />
                          Investisseurs
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Investors Tab */}
          <TabsContent value="investors" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mes Investisseurs</h2>
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

            {/* Investor Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Investisseurs</p>
                      <p className="text-2xl font-bold text-blue-600">{dashboardData.stats.totalInvestors}</p>
                    </div>
                    <Users2 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Investissement Moyen</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(dashboardData.stats.totalFunding / dashboardData.stats.totalInvestors)}
                      </p>
                    </div>
                    <Wallet className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Rétention</p>
                      <p className="text-2xl font-bold text-purple-600">94%</p>
                    </div>
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Investor List */}
            <div className="grid gap-4">
              {dashboardData.investors.map((investor) => (
                <Card key={investor.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{investor.name}</h3>
                          <Badge className={`${getStatusColor(investor.status)} text-white`}>
                            {investor.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Investissement Total</p>
                            <p className="font-medium text-green-600">{formatCurrency(investor.totalInvestment)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Projets</p>
                            <p className="font-medium">{investor.projects.length} projets</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Depuis</p>
                            <p className="font-medium">{new Date(investor.joinDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Rendement</p>
                            <p className="font-medium text-blue-600">{formatPercentage(investor.returns)}</p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-1">Projets:</p>
                          <div className="flex flex-wrap gap-1">
                            {investor.projects.map((project, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {project}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contacter
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Profil
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
              <h2 className="text-2xl font-bold">Analytics & Performance</h2>
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
                      <p className="text-sm text-gray-600">Financement/Mois</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {formatCurrency(dashboardData.analytics.monthlyFunding[dashboardData.analytics.monthlyFunding.length - 1] * 1000000)}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Taux Succès</p>
                      <p className="text-2xl font-bold text-green-600">92%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Temps Moyen</p>
                      <p className="text-2xl font-bold text-blue-600">18 mois</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">ROI Moyen</p>
                      <p className="text-2xl font-bold text-purple-600">24.8%</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par Type de Projet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(dashboardData.analytics.projectTypes).map(([type, percentage]) => (
                      <div key={type}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{type}</span>
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
                  <CardTitle>Distribution Investisseurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(dashboardData.analytics.investorDistribution).map(([level, percentage]) => (
                      <div key={level}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{level}</span>
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

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <h2 className="text-2xl font-bold">Outils de Gestion</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-blue-600" />
                    Calculateur Budget
                  </CardTitle>
                  <CardDescription>
                    Estimez les coûts de vos projets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Calculer
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-green-600" />
                    Générateur Rapports
                  </CardTitle>
                  <CardDescription>
                    Créez des rapports pour investisseurs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Générer
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                    Planificateur Projet
                  </CardTitle>
                  <CardDescription>
                    Gérez les étapes et délais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Planifier
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-orange-600" />
                    CRM Investisseurs
                  </CardTitle>
                  <CardDescription>
                    Gérez vos relations investisseurs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Gérer
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-red-600" />
                    Analyse Risques
                  </CardTitle>
                  <CardDescription>
                    Évaluez les risques projets
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
                    <Share2 className="h-5 w-5 mr-2 text-teal-600" />
                    Marketing Digital
                  </CardTitle>
                  <CardDescription>
                    Promouvoir vos projets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Promouvoir
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

export default PromoteurDashboard;

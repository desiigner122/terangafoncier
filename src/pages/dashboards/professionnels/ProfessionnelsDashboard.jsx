import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  FileText, 
  MapPin,
  Clock, 
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Building2,
  Scale,
  Compass,
  Home,
  CreditCard,
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  Star,
  Award,
  Plus,
  Eye,
  Edit,
  Download,
  Filter,
  Search,
  Bell,
  Settings,
  MessageSquare,
  Camera,
  Upload,
  Globe,
  Shield,
  Zap,
  Archive,
  BookOpen,
  GraduationCap,
  Certificate,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';

const ProfessionnelsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userType, setUserType] = useState('agent'); // agent, notaire, geometre, architecte, banque
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalClients: 156,
      activeProjects: 23,
      completedProjects: 78,
      monthlyRevenue: 18500000,
      rating: 4.8,
      certifications: 5
    },
    projects: [
      {
        id: 1,
        title: 'Vente Villa Almadies',
        client: 'M. Amadou Diallo',
        type: 'Vente',
        status: 'En cours',
        value: 85000000,
        commission: 4250000,
        startDate: '2024-03-10',
        deadline: '2024-04-15',
        progress: 65,
        location: 'Almadies, Dakar'
      },
      {
        id: 2,
        title: 'Acte de propriété - Terrain Thiès',
        client: 'Mme Fatou Fall',
        type: 'Documentation',
        status: 'Finalisé',
        value: 25000000,
        commission: 750000,
        startDate: '2024-02-15',
        deadline: '2024-03-20',
        progress: 100,
        location: 'Thiès Centre'
      },
      {
        id: 3,
        title: 'Relevé topographique - Lotissement Saly',
        client: 'ABC Promotion',
        type: 'Étude technique',
        status: 'En attente',
        value: 15000000,
        commission: 1200000,
        startDate: '2024-03-18',
        deadline: '2024-04-30',
        progress: 25,
        location: 'Saly, Mbour'
      }
    ],
    clients: [
      {
        id: 1,
        name: 'M. Amadou Diallo',
        email: 'amadou.diallo@email.com',
        phone: '+221 77 123 45 67',
        type: 'Particulier',
        since: '2023-08-15',
        projects: 3,
        totalValue: 125000000,
        status: 'Actif'
      },
      {
        id: 2,
        name: 'ABC Promotion',
        email: 'contact@abc-promotion.sn',
        phone: '+221 33 825 12 34',
        type: 'Promoteur',
        since: '2023-05-10',
        projects: 8,
        totalValue: 450000000,
        status: 'VIP'
      }
    ],
    services: [
      {
        id: 1,
        name: 'Évaluation immobilière',
        description: 'Estimation professionnelle de biens',
        price: 75000,
        duration: '2-3 jours',
        popularity: 95,
        category: 'Expertise'
      },
      {
        id: 2,
        name: 'Accompagnement vente',
        description: 'Service complet de vente immobilière',
        price: '3-5%',
        duration: '1-3 mois',
        popularity: 88,
        category: 'Transaction'
      },
      {
        id: 3,
        name: 'Conseil juridique',
        description: 'Consultation en droit immobilier',
        price: 50000,
        duration: '1 heure',
        popularity: 72,
        category: 'Juridique'
      }
    ],
    analytics: {
      monthlyClients: [12, 15, 18, 22, 19, 23],
      serviceDistribution: {
        'Ventes': 45,
        'Locations': 25,
        'Évaluations': 20,
        'Conseil': 10
      },
      clientTypes: {
        'Particuliers': 60,
        'Promoteurs': 25,
        'Investisseurs': 15
      },
      performance: {
        satisfaction: 96,
        retention: 89,
        referrals: 34
      }
    },
    certifications: [
      {
        id: 1,
        name: 'Agent Immobilier Certifié',
        issuer: 'Chambre de Commerce Dakar',
        date: '2023-06-15',
        valid: true,
        expiry: '2026-06-15'
      },
      {
        id: 2,
        name: 'Formation Blockchain Immobilier',
        issuer: 'TechnoSénégal',
        date: '2024-01-20',
        valid: true,
        expiry: '2025-01-20'
      }
    ]
  });

  useEffect(() => {
    // Simulation chargement des données
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const stats = [
    { value: dashboardData.stats.totalClients, label: 'Total Clients' },
    { value: dashboardData.stats.activeProjects, label: 'Projets Actifs' },
    { value: dashboardData.stats.completedProjects, label: 'Projets Terminés' },
    { value: `${dashboardData.stats.rating}/5`, label: 'Note Moyenne' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'En cours': 'bg-blue-500',
      'Finalisé': 'bg-green-500',
      'En attente': 'bg-yellow-500',
      'Suspendu': 'bg-red-500',
      'Actif': 'bg-green-500',
      'VIP': 'bg-purple-500',
      'Inactif': 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'agent': Briefcase,
      'notaire': Scale,
      'geometre': Compass,
      'architecte': Building2,
      'banque': CreditCard
    };
    return icons[type] || Briefcase;
  };

  const formatCurrency = (amount) => {
    if (typeof amount === 'string') return amount;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre espace professionnel...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Espace Professionnels"
      subtitle="Agents • Notaires • Géomètres • Architectes • Banques"
      userRole="Professionnel"
      stats={stats}
    >
      <div className="space-y-6">
        {/* Professional Type Selector */}
        <div className="flex space-x-2 p-2 bg-gray-100 rounded-lg">
          {[
            { key: 'agent', label: 'Agent Immobilier', icon: Briefcase },
            { key: 'notaire', label: 'Notaire', icon: Scale },
            { key: 'geometre', label: 'Géomètre', icon: Compass },
            { key: 'architecte', label: 'Architecte', icon: Building2 },
            { key: 'banque', label: 'Banque', icon: CreditCard }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={userType === key ? "default" : "ghost"}
              size="sm"
              onClick={() => setUserType(key)}
              className="flex items-center space-x-2"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Button>
          ))}
        </div>

        {/* Widgets IA & Blockchain */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AIAssistantWidget userRole="Professionnel" dashboardData={dashboardData} />
          <BlockchainWidget userRole="Professionnel" />
        </div>

        {/* Professional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Revenus Mensuels</p>
                  <p className="text-lg font-bold text-indigo-600">
                    {formatCurrency(dashboardData.stats.monthlyRevenue)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+15% vs mois dernier</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Satisfaction Client</p>
                  <p className="text-lg font-bold text-green-600">
                    {dashboardData.analytics.performance.satisfaction}%
                  </p>
                </div>
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <Progress value={dashboardData.analytics.performance.satisfaction} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Taux Rétention</p>
                  <p className="text-lg font-bold text-blue-600">
                    {dashboardData.analytics.performance.retention}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <Progress value={dashboardData.analytics.performance.retention} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Certifications</p>
                  <p className="text-lg font-bold text-purple-600">
                    {dashboardData.stats.certifications}
                  </p>
                </div>
                <Certificate className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <Award className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-purple-600">Toutes à jour</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-indigo-600" />
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
                    Ajouter Client
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Planning
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Générer Rapport
                  </Button>
                </CardContent>
              </Card>

              {/* Active Projects Summary */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                      Projets en Cours
                    </span>
                    <Button size="sm" variant="outline">Voir tout</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.projects.filter(p => p.status === 'En cours').slice(0, 3).map((project) => (
                      <div key={project.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{project.title}</h4>
                            <p className="text-sm text-gray-600">Client: {project.client}</p>
                          </div>
                          <Badge className={`${getStatusColor(project.status)} text-white`}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Valeur: {formatCurrency(project.value)}</span>
                          <span>Commission: {formatCurrency(project.commission)}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progression</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Professional Expertise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-purple-600" />
                    Expertise & Spécialisations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Immobilier Résidentiel</span>
                        <span className="text-sm font-medium">Expert</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Immobilier Commercial</span>
                        <span className="text-sm font-medium">Avancé</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Blockchain & FinTech</span>
                        <span className="text-sm font-medium">Intermédiaire</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                    Performance ce Mois
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Nouveaux clients</span>
                      <span className="font-bold text-green-600">+8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Projets finalisés</span>
                      <span className="font-bold text-blue-600">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Revenus générés</span>
                      <span className="font-bold text-purple-600">{formatCurrency(dashboardData.stats.monthlyRevenue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Recommandations</span>
                      <span className="font-bold text-orange-600">+{dashboardData.analytics.performance.referrals}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Projets</h2>
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

            {/* Project Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {dashboardData.projects.filter(p => p.status === 'En cours').length}
                    </p>
                    <p className="text-sm text-gray-600">En Cours</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {dashboardData.projects.filter(p => p.status === 'En attente').length}
                    </p>
                    <p className="text-sm text-gray-600">En Attente</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {dashboardData.projects.filter(p => p.status === 'Finalisé').length}
                    </p>
                    <p className="text-sm text-gray-600">Finalisés</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(dashboardData.projects.reduce((sum, p) => sum + p.commission, 0))}
                    </p>
                    <p className="text-sm text-gray-600">Commissions Total</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects List */}
            <div className="grid gap-6">
              {dashboardData.projects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{project.title}</h3>
                          <Badge className={`${getStatusColor(project.status)} text-white`}>
                            {project.status}
                          </Badge>
                          <Badge variant="outline">
                            {project.type}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Client</p>
                            <p className="font-medium">{project.client}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Valeur</p>
                            <p className="font-medium text-green-600">{formatCurrency(project.value)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Commission</p>
                            <p className="font-medium text-blue-600">{formatCurrency(project.commission)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Échéance</p>
                            <p className="font-medium">{new Date(project.deadline).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progression</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-3" />
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {project.location}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Début: {new Date(project.startDate).toLocaleDateString('fr-FR')}
                          </span>
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
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contact Client
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Clients</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Client
                </Button>
              </div>
            </div>

            {/* Client Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Clients VIP</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {dashboardData.clients.filter(c => c.status === 'VIP').length}
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Valeur Moyenne/Client</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(dashboardData.clients.reduce((sum, c) => sum + c.totalValue, 0) / dashboardData.clients.length)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Projets Moyens/Client</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.round(dashboardData.clients.reduce((sum, c) => sum + c.projects, 0) / dashboardData.clients.length)}
                      </p>
                    </div>
                    <Briefcase className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Clients List */}
            <div className="grid gap-4">
              {dashboardData.clients.map((client) => (
                <Card key={client.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{client.name}</h3>
                          <Badge className={`${getStatusColor(client.status)} text-white`}>
                            {client.status}
                          </Badge>
                          <Badge variant="outline">
                            {client.type}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">{client.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Téléphone</p>
                            <p className="font-medium">{client.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Projets</p>
                            <p className="font-medium">{client.projects}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Valeur Totale</p>
                            <p className="font-medium text-green-600">{formatCurrency(client.totalValue)}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Client depuis: {new Date(client.since).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Appeler
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
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

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mes Services</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Service
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Prix</span>
                          <span className="font-medium">{formatCurrency(service.price)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Durée</span>
                          <span className="font-medium">{service.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Popularité</span>
                          <span className="font-medium">{service.popularity}%</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Progress value={service.popularity} className="h-2" />
                      </div>

                      <Badge variant="outline" className="mt-3">
                        {service.category}
                      </Badge>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Certifications & Formations</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Certification
              </Button>
            </div>

            <div className="grid gap-4">
              {dashboardData.certifications.map((cert) => (
                <Card key={cert.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{cert.name}</h3>
                          <Badge className={cert.valid ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                            {cert.valid ? 'Valide' : 'Expirée'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Organisme</p>
                            <p className="font-medium">{cert.issuer}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Date d'obtention</p>
                            <p className="font-medium">{new Date(cert.date).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Expire le</p>
                            <p className="font-medium">{new Date(cert.expiry).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Professional Development */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                  Développement Professionnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium">Formation Continue</p>
                    <p className="text-sm text-gray-600">32h cette année</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <UserCheck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium">Certifications</p>
                    <p className="text-sm text-gray-600">{dashboardData.certifications.length} obtenues</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Trophy className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="font-medium">Niveau Expertise</p>
                    <p className="text-sm text-gray-600">Expert Certifié</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Analytics Professionnelles</h2>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter Rapport
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Croissance Client</p>
                      <p className="text-2xl font-bold text-blue-600">+18%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Taux Conversion</p>
                      <p className="text-2xl font-bold text-green-600">24%</p>
                    </div>
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Temps Moyen/Projet</p>
                      <p className="text-2xl font-bold text-purple-600">45j</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Revenus/Heure</p>
                      <p className="text-2xl font-bold text-orange-600">12,500</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(dashboardData.analytics.serviceDistribution).map(([service, percentage]) => (
                      <div key={service}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{service}</span>
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
                  <CardTitle>Types de Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(dashboardData.analytics.clientTypes).map(([type, percentage]) => (
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProfessionnelsDashboard;

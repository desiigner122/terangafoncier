import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  // Navigation Icons
  Home,
  Building2,
  Hammer,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  User,
  
  // Content Icons
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Share2,
  Download,
  Filter,
  Search,
  MessageSquare,
  Activity,
  Target,
  
  // Promoteur Icons
  Construction,
  
  // New Icons for enhanced functionality
  Plus,
  Edit,
  Eye,
  TrendingUp,
  TrendingDown,
  Calendar,
  Phone,
  MessageCircle,
  Mail,
  FileText,
  UserCheck,
  Calculator,
  Wallet,
  Brain,
  Trophy,
  Zap,
  Building,
  PieChart,
  
  // UI Icons
  Menu,
  X,
  ChevronDown,
  Trash2,
  Award,
  Shield
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';

// Lazy loading des composants (pour plus tard)
const PromoteurOverview = React.lazy(() => import('./PromoteurOverview'));
const PromoteurChantiers = React.lazy(() => import('./PromoteurChantiers'));
const PromoteurVentes = React.lazy(() => import('./PromoteurVentes'));
const PromoteurClients = React.lazy(() => import('./PromoteurClients'));
const PromoteurFinances = React.lazy(() => import('./PromoteurFinances'));
const PromoteurAI = React.lazy(() => import('./PromoteurAI'));
const PromoteurBlockchain = React.lazy(() => import('./PromoteurBlockchain'));

const PromoteurDashboard = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  // Stats du dashboard promoteur
  const [dashboardStats, setDashboardStats] = useState({
    totalProjects: 12,
    activeProjects: 8,
    monthlyRevenue: 25600000, // 25.6M FCFA
    unitsBuilt: 324,
    clientSatisfaction: 94,
    averageMargin: 18.5,
    completionRate: 89,
    onTimeDelivery: 92
  });

  // Demandes de construction des particuliers
  const [constructionRequests, setConstructionRequests] = useState([
    {
      id: 1,
      clientName: 'Aminata FALL',
      location: 'Liberté 6, Dakar',
      projectType: 'Villa R+1',
      budget: 45000000,
      status: 'Nouveau',
      submittedDate: '2024-01-20',
      terrainSize: '400m²',
      priority: 'Haute'
    },
    {
      id: 2,
      clientName: 'Moussa DIENG',
      location: 'Grand Yoff',
      projectType: 'Maison familiale',
      budget: 28000000,
      status: 'En étude',
      submittedDate: '2024-01-18',
      terrainSize: '300m²',
      priority: 'Moyenne'
    },
    {
      id: 3,
      clientName: 'Fatou SARR',
      location: 'Pikine',
      projectType: 'Duplex',
      budget: 35000000,
      status: 'Devis envoyé',
      submittedDate: '2024-01-15',
      terrainSize: '250m²',
      priority: 'Haute'
    }
  ]);

  // Chargement du profil utilisateur
  useEffect(() => {
    if (user) {
      setProfile({
        id: user.id,
        email: user.email,
        role: 'promoteur',
        first_name: 'Ibrahima',
        last_name: 'FALL',
        company: 'TERANGA Développement SARL'
      });
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      window.safeGlobalToast?.({
        description: 'Déconnexion réussie',
        variant: 'success'
      });
    } catch (error) {
      window.safeGlobalToast?.({
        description: 'Erreur lors de la déconnexion',
        variant: 'destructive'
      });
    }
  };

  // Configuration des onglets du sidebar
  const sidebarTabs = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: Home,
      description: 'Tableau de bord principal'
    },
    {
      id: 'projects',
      label: 'Mes Projets',
      icon: Building2,
      description: 'Gestion des projets immobiliers'
    },
    {
      id: 'construction',
      label: 'Chantiers',
      icon: Hammer,
      description: 'Suivi des constructions'
    },
    {
      id: 'requests',
      label: 'Demandes Clients',
      icon: MessageSquare,
      description: 'Demandes de construction'
    },
    {
      id: 'sales',
      label: 'Ventes',
      icon: TrendingUp,
      description: 'Suivi des ventes'
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: Users,
      description: 'Gestion clientèle'
    },
    {
      id: 'finances',
      label: 'Finances',
      icon: DollarSign,
      description: 'Gestion financière'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Analyses et rapports'
    },
    {
      id: 'ai',
      label: 'Assistant IA',
      icon: Activity,
      description: 'Intelligence artificielle'
    },
    {
      id: 'blockchain',
      label: 'Blockchain',
      icon: Shield,
      description: 'Contrats intelligents'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration'
    }
  ];

  // Fonction pour formater les montants
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'Nouveau': return 'bg-blue-100 text-blue-800';
      case 'En étude': return 'bg-yellow-100 text-yellow-800';
      case 'Devis envoyé': return 'bg-orange-100 text-orange-800';
      case 'Accepté': return 'bg-green-100 text-green-800';
      case 'Refusé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Rendu du contenu principal selon l'onglet actif
  const renderMainContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Projets Actifs</p>
                      <p className="text-2xl font-bold text-blue-600">{dashboardStats.activeProjects}</p>
                    </div>
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">
                      {dashboardStats.totalProjects} projets au total
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">CA Mensuel</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(dashboardStats.monthlyRevenue)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-green-600">
                      +15.3% vs mois dernier
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Unités Construites</p>
                      <p className="text-2xl font-bold text-purple-600">{dashboardStats.unitsBuilt}</p>
                    </div>
                    <Hammer className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">
                      {dashboardStats.completionRate}% taux d'achèvement
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                      <p className="text-2xl font-bold text-orange-600">{dashboardStats.clientSatisfaction}%</p>
                    </div>
                    <Star className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">
                      {dashboardStats.onTimeDelivery}% livraisons à temps
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projets en cours et demandes clients */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Projets en cours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Projets en Cours</span>
                    <Badge variant="secondary">{dashboardStats.activeProjects} actifs</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: 'Résidence Teranga Gardens',
                        location: 'Almadies',
                        progress: 75,
                        units: 24,
                        status: 'Construction'
                      },
                      {
                        name: 'Complexe Diamniadio',
                        location: 'Diamniadio',
                        progress: 45,
                        units: 18,
                        status: 'Gros œuvre'
                      },
                      {
                        name: 'Villas Saly',
                        location: 'Saly Portudal',
                        progress: 90,
                        units: 8,
                        status: 'Finitions'
                      }
                    ].map((project, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{project.name}</h4>
                          <Badge variant="outline">{project.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{project.location} • {project.units} unités</p>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Progression</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Demandes de construction récentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Demandes de Construction</span>
                    <Badge variant="secondary">{constructionRequests.length} nouvelles</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {constructionRequests.slice(0, 3).map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{request.clientName}</h4>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {request.projectType} • {request.location}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          Budget: {formatCurrency(request.budget)} • {request.terrainSize}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {new Date(request.submittedDate).toLocaleDateString('fr-FR')}
                          </span>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              Voir
                            </Button>
                            <Button size="sm">
                              Répondre
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gestion des Projets</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Projet
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: 1,
                  name: 'Résidence Teranga Gardens',
                  location: 'Almadies, Dakar',
                  type: 'Résidentiel',
                  units: 24,
                  soldUnits: 18,
                  progress: 75,
                  budget: 480000000,
                  revenue: 720000000,
                  status: 'Construction',
                  startDate: '2024-01-15',
                  endDate: '2025-06-30'
                },
                {
                  id: 2,
                  name: 'Complexe Commercial Diamniadio',
                  location: 'Diamniadio',
                  type: 'Commercial',
                  units: 18,
                  soldUnits: 12,
                  progress: 45,
                  budget: 650000000,
                  revenue: 950000000,
                  status: 'Gros œuvre',
                  startDate: '2024-03-01',
                  endDate: '2025-12-31'
                },
                {
                  id: 3,
                  name: 'Villas Premium Saly',
                  location: 'Saly Portudal',
                  type: 'Villa',
                  units: 8,
                  soldUnits: 6,
                  progress: 90,
                  budget: 320000000,
                  revenue: 480000000,
                  status: 'Finitions',
                  startDate: '2023-10-01',
                  endDate: '2024-04-30'
                }
              ].map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge className={
                        project.status === 'Construction' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'Gros œuvre' ? 'bg-yellow-100 text-yellow-800' :
                        project.status === 'Finitions' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {project.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {project.type} • {project.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Unités vendues</p>
                          <p className="font-semibold">{project.soldUnits}/{project.units}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Budget</p>
                          <p className="font-semibold">{formatCurrency(project.budget)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progression</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'construction':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Suivi des Chantiers</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Planning
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Rapport
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Chantiers Actifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        project: 'Résidence Teranga Gardens',
                        phase: 'Finitions intérieures',
                        workers: 24,
                        progress: 75,
                        issues: 0,
                        nextDeadline: '2024-02-15'
                      },
                      {
                        project: 'Complexe Diamniadio',
                        phase: 'Gros œuvre étage 2',
                        workers: 18,
                        progress: 45,
                        issues: 2,
                        nextDeadline: '2024-02-28'
                      }
                    ].map((site, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{site.project}</h4>
                          <Badge variant={site.issues > 0 ? 'destructive' : 'secondary'}>
                            {site.issues} alertes
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{site.phase}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                          <div>
                            <p className="text-gray-600">Ouvriers</p>
                            <p className="font-medium">{site.workers}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Prochaine échéance</p>
                            <p className="font-medium">
                              {new Date(site.nextDeadline).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <Progress value={site.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Équipements et Matériaux</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { item: 'Ciment', stock: 85, unit: 'tonnes', status: 'OK' },
                      { item: 'Fer à béton', stock: 12, unit: 'tonnes', status: 'Faible' },
                      { item: 'Parpaings', stock: 5420, unit: 'unités', status: 'OK' },
                      { item: 'Carrelage', stock: 234, unit: 'm²', status: 'Critique' }
                    ].map((material, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{material.item}</p>
                          <p className="text-sm text-gray-600">{material.stock} {material.unit}</p>
                        </div>
                        <Badge className={
                          material.status === 'OK' ? 'bg-green-100 text-green-800' :
                          material.status === 'Faible' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {material.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'requests':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Demandes de Construction</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {constructionRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{request.clientName}</h3>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                          <Badge variant="outline" className={
                            request.priority === 'Haute' ? 'border-red-200 text-red-700' : 
                            request.priority === 'Moyenne' ? 'border-yellow-200 text-yellow-700' : 
                            'border-gray-200 text-gray-700'
                          }>
                            {request.priority}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Type de projet</p>
                            <p className="font-medium">{request.projectType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Localisation</p>
                            <p className="font-medium">{request.location}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Budget</p>
                            <p className="font-medium text-green-600">{formatCurrency(request.budget)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Terrain</p>
                            <p className="font-medium">{request.terrainSize}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Soumis le {new Date(request.submittedDate).toLocaleDateString('fr-FR')}
                          </span>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Contacter
                            </Button>
                            <Button size="sm" variant="outline">
                              <Calculator className="w-4 h-4 mr-1" />
                              Devis
                            </Button>
                            <Button size="sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accepter
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case 'sales':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Ventes et Marketing</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analyses
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Vente
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Ventes ce mois", value: "12", icon: TrendingUp, color: "green", change: "+25%" },
                { title: "CA ce mois", value: "425M", icon: DollarSign, color: "blue", change: "+18%" },
                { title: "Prospects actifs", value: "34", icon: Users, color: "purple", change: "15 RDV" },
                { title: "Taux conversion", value: "68%", icon: Target, color: "orange", change: "+5%" }
              ].map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
                    </div>
                    <div className="mt-2">
                      <span className={`text-sm text-${stat.color}-600`}>{stat.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ventes Récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { client: 'Amadou Diop', property: 'Villa Teranga Gardens #12', amount: 45000000, date: '2024-01-20', status: 'Finalisée' },
                      { client: 'Fatou Seck', property: 'Appartement Diamniadio T3', amount: 28000000, date: '2024-01-18', status: 'En signature' },
                      { client: 'Moussa Kane', property: 'Duplex Saly Premium', amount: 65000000, date: '2024-01-15', status: 'Acompte versé' }
                    ].map((sale, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{sale.client}</h4>
                          <Badge className={
                            sale.status === 'Finalisée' ? 'bg-green-100 text-green-800' :
                            sale.status === 'En signature' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {sale.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{sale.property}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-green-600">{formatCurrency(sale.amount)}</span>
                          <span className="text-sm text-gray-500">{new Date(sale.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pipeline de Ventes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { stage: 'Prospects', count: 34, value: 950000000 },
                      { stage: 'Négociation', count: 12, value: 420000000 },
                      { stage: 'Compromis', count: 8, value: 280000000 },
                      { stage: 'Finalisation', count: 5, value: 185000000 }
                    ].map((stage, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">{stage.stage}</h4>
                          <Badge variant="secondary">{stage.count}</Badge>
                        </div>
                        <p className="text-lg font-bold text-blue-600">{formatCurrency(stage.value)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'clients':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gestion des Clients</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  IA CRM
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Client
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Total Clients", value: "127", icon: Users, color: "blue", desc: "+12 ce mois" },
                { title: "Clients Actifs", value: "89", icon: UserCheck, color: "green", desc: "70% du portefeuille" },
                { title: "Prospects", value: "38", icon: Target, color: "orange", desc: "Taux conversion 65%" },
                { title: "Satisfaction", value: "4.8/5", icon: Star, color: "purple", desc: "+0.3 ce mois" }
              ].map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
                    </div>
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">{stat.desc}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Clients Récents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Amadou Diallo', email: 'amadou.diallo@email.com', project: 'Villa Teranga Gardens', status: 'Actif', value: 45000000, lastContact: '2024-01-20' },
                      { name: 'Fatou Mbaye', email: 'fatou.mbaye@email.com', project: 'Appartement Diamniadio', status: 'Prospect', value: 28000000, lastContact: '2024-01-18' },
                      { name: 'Omar Ndiaye', email: 'omar.ndiaye@email.com', project: 'Duplex Saly', status: 'Négociation', value: 65000000, lastContact: '2024-01-15' }
                    ].map((client, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{client.name}</h4>
                              <p className="text-sm text-gray-600">{client.email}</p>
                            </div>
                          </div>
                          <Badge className={
                            client.status === 'Actif' ? 'bg-green-100 text-green-800' :
                            client.status === 'Prospect' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {client.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-gray-600">Projet</p>
                            <p className="font-medium">{client.project}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Valeur</p>
                            <p className="font-medium text-green-600">{formatCurrency(client.value)}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            Dernier contact: {new Date(client.lastContact).toLocaleDateString('fr-FR')}
                          </span>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Phone className="w-4 h-4 mr-1" />
                              Appeler
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions CRM</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { icon: MessageCircle, label: "Assistant IA CRM", variant: "default" },
                      { icon: Calendar, label: "Planifier RDV", variant: "outline" },
                      { icon: Mail, label: "Campagne Email", variant: "outline" },
                      { icon: FileText, label: "Générer Rapport", variant: "outline" },
                      { icon: Download, label: "Exporter Données", variant: "outline" }
                    ].map((action, index) => (
                      <Button key={index} variant={action.variant} className="w-full justify-start">
                        <action.icon className="w-4 h-4 mr-2" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'finances':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Finances et Comptabilité</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculatrice
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Revenus Totaux", value: "1.2Md", icon: TrendingUp, color: "green", change: "+15% ce trimestre" },
                { title: "Coûts Projet", value: "780M", icon: TrendingDown, color: "red", change: "Budget respecté" },
                { title: "Marge Brute", value: "35%", icon: DollarSign, color: "blue", change: "+2% vs objectif" },
                { title: "Trésorerie", value: "450M", icon: Wallet, color: "purple", change: "Position saine" }
              ].map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
                    </div>
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">{stat.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analyse des Coûts par Projet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { project: 'Résidence Teranga Gardens', budget: 480000000, spent: 360000000, remaining: 120000000, progress: 75 },
                      { project: 'Complexe Diamniadio', budget: 650000000, spent: 292500000, remaining: 357500000, progress: 45 },
                      { project: 'Villas Saly Premium', budget: 320000000, spent: 288000000, remaining: 32000000, progress: 90 }
                    ].map((project, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{project.project}</h4>
                          <Badge variant="outline">{project.progress}%</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                          <div>
                            <p className="text-gray-600">Budget</p>
                            <p className="font-medium">{formatCurrency(project.budget)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Dépensé</p>
                            <p className="font-medium text-red-600">{formatCurrency(project.spent)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Restant</p>
                            <p className="font-medium text-green-600">{formatCurrency(project.remaining)}</p>
                          </div>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Flux de Trésorerie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'Entrée', description: 'Vente Villa #12', amount: 45000000, date: '2024-01-20' },
                      { type: 'Sortie', description: 'Salaires équipe', amount: -12000000, date: '2024-01-19' },
                      { type: 'Entrée', description: 'Acompte Duplex Saly', amount: 32500000, date: '2024-01-18' },
                      { type: 'Sortie', description: 'Matériaux chantier', amount: -8500000, date: '2024-01-17' }
                    ].map((flow, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${flow.type === 'Entrée' ? 'bg-green-500' : 'bg-red-500'}`} />
                          <div>
                            <p className="font-medium">{flow.description}</p>
                            <p className="text-sm text-gray-600">{new Date(flow.date).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                        <span className={`font-semibold ${flow.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {flow.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(flow.amount))}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Analytics & IA</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Brain className="w-4 h-4 mr-2" />
                  Assistant IA
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Rapport IA
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Score Performance", value: "92/100", icon: Trophy, color: "green", desc: "Excellent niveau" },
                { title: "Prédictions IA", value: "94%", icon: Brain, color: "blue", desc: "Précision modèle" },
                { title: "Optimisations", value: "7", icon: Zap, color: "orange", desc: "Recommandations" }
              ].map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
                    </div>
                    <div className="mt-2">
                      <span className={`text-sm text-${stat.color}-600`}>{stat.desc}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Recommandations IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'Optimisation', title: 'Réduire délais construction', description: 'Réorganiser planning chantier Diamniadio pour gagner 3 semaines', impact: 'Économie: 15M FCFA', confidence: 89 },
                      { type: 'Marketing', title: 'Cibler prospects VIP', description: 'Lancer campagne pour clientèle haut de gamme basée sur historique', impact: 'Revenue: +25M FCFA', confidence: 76 },
                      { type: 'Risque', title: 'Surveillance matériaux', description: 'Stock critique détecté sur projet Teranga Gardens', impact: 'Éviter retard: 2 semaines', confidence: 95 }
                    ].map((rec, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={
                            rec.type === 'Optimisation' ? 'bg-blue-100 text-blue-800' :
                            rec.type === 'Marketing' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {rec.type}
                          </Badge>
                          <span className="text-sm text-gray-600">{rec.confidence}% confiance</span>
                        </div>
                        <h4 className="font-semibold mb-1">{rec.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                        <p className="text-sm font-medium text-green-600">{rec.impact}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Prédictions Marché & Blockchain
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Demande Immobilière</h4>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Q2 2024</span>
                        <Badge className="bg-green-100 text-green-800">+18% ↗</Badge>
                      </div>
                      <Progress value={75} className="h-2 mb-2" />
                      <p className="text-sm text-gray-600">Forte demande prévue dans le segment résidentiel haut de gamme</p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Smart Contracts</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">Contrats Actifs</span>
                        <Badge className="bg-blue-100 text-blue-800">3</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Économie temps: 45% • Réduction erreurs: 78%</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Plus className="w-4 h-4 mr-1" />
                          Nouveau
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          Voir tous
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Blockchain Analytics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Transactions sécurisées</span>
                          <span className="font-medium">156</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Économies frais</span>
                          <span className="font-medium text-green-600">2.4M FCFA</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Temps traitement</span>
                          <span className="font-medium">-67%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Contenu de {sidebarTabs.find(tab => tab.id === activeTab)?.label} à venir...</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        className="bg-white border-r border-gray-200 flex flex-col shadow-sm"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-gray-900">Promoteur</h1>
                  <p className="text-xs text-gray-500">{profile?.company || 'Dashboard'}</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-2 px-3">
            {sidebarTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors
                    ${isActive 
                      ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'} ${isActive ? 'text-orange-600' : 'text-gray-500'}`} />
                  {!sidebarCollapsed && (
                    <span className="font-medium">{tab.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-orange-600 text-white">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {profile?.email}
                </p>
              </div>
            )}
            {!sidebarCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {sidebarTabs.find(tab => tab.id === activeTab)?.label}
              </h1>
              <p className="text-gray-600">
                {sidebarTabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Projet
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
            }
          >
            {renderMainContent()}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default PromoteurDashboard;

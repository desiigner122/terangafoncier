import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
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
  MessageSquare,
  CreditCard,
  Award,
  Monitor,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Share2,
  Download,
  Filter,
  Search,
  Activity,
  Target,
  Construction,
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
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Trash2,
  Shield,
  Save,
  RefreshCw,
  Upload,
  Crown,
  Gem,
  Check,
  Key,
  Lock,
  Database
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';

// Lazy loading des composants existants
const PromoteurOverview = React.lazy(() => import('./PromoteurOverview'));
const ProjectsPage = React.lazy(() => import('./ProjectsPage'));
const PromoteurChantiers = React.lazy(() => import('./PromoteurChantiers'));
const ConstructionPage = React.lazy(() => import('./ConstructionPage'));
const PromoteurVentes = React.lazy(() => import('./PromoteurVentes'));
const PromoteurClients = React.lazy(() => import('./PromoteurClients'));
const PromoteurFinances = React.lazy(() => import('./PromoteurFinances'));
const PromoteurAI = React.lazy(() => import('./PromoteurAI'));
const PromoteurBlockchain = React.lazy(() => import('./PromoteurBlockchain'));

const PromoteurDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
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

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  // Configuration des onglets du sidebar modernisés
  const sidebarTabs = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: Home,
      description: 'Dashboard principal & KPIs',
      component: 'PromoteurOverview',
      badge: null
    },
    {
      id: 'projects',
      label: 'Projets Actifs',
      icon: Building2,
      description: 'Portfolio immobilier',
      component: 'ProjectsPage',
      badge: dashboardStats.activeProjects
    },
    {
      id: 'construction',
      label: 'Chantiers Live',
      icon: Hammer,
      description: 'Suivi temps réel',
      component: 'PromoteurChantiers',
      badge: '6'
    },
    {
      id: 'requests',
      label: 'Demandes Clients',
      icon: MessageCircle,
      description: 'Nouvelles opportunités',
      component: 'ConstructionPage',
      badge: '23'
    },
    {
      id: 'sales',
      label: 'Ventes & Revenus',
      icon: TrendingUp,
      description: 'Performance commerciale',
      component: 'PromoteurVentes',
      badge: null
    },
    {
      id: 'clients',
      label: 'CRM Clients',
      icon: Users,
      description: 'Relation client avancée',
      component: 'PromoteurClients',
      badge: '156'
    },
    {
      id: 'finances',
      label: 'Finance Pro',
      icon: Wallet,
      description: 'Gestion financière intégrée',
      component: 'PromoteurFinances',
      badge: null
    },
    {
      id: 'analytics',
      label: 'Analytics & BI',
      icon: BarChart3,
      description: 'Business Intelligence',
      badge: null
    },
    {
      id: 'ai',
      label: 'IA Promoteur',
      icon: Brain,
      description: 'Assistant intelligent',
      component: 'PromoteurAI',
      badge: 'NEW'
    },
    {
      id: 'blockchain',
      label: 'Blockchain Pro',
      icon: Database,
      description: 'Contrats intelligents',
      component: 'PromoteurBlockchain',
      badge: null
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      description: 'Communication centralisée',
      badge: '7'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Alertes importantes',
      badge: '12'
    },
    {
      id: 'settings',
      label: 'Paramètres Pro',
      icon: Settings,
      description: 'Configuration avancée',
      badge: null
    }
  ];

  // Fonction utilitaire pour formater la monnaie
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('XOF', 'FCFA');
  };

  // Rendu du contenu principal selon l'onglet actif
  const renderMainContent = () => {
    const currentTab = sidebarTabs.find(tab => tab.id === activeTab);
    
    // Si l'onglet a un composant spécialisé, on l'utilise
    if (currentTab?.component) {
      switch (currentTab.component) {
        case 'PromoteurOverview':
          return (
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>}>
              <PromoteurOverview />
            </Suspense>
          );
        case 'ProjectsPage':
          return (
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>}>
              <ProjectsPage />
            </Suspense>
          );
        case 'PromoteurChantiers':
          return (
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>}>
              <PromoteurChantiers />
            </Suspense>
          );
        case 'ConstructionPage':
          return (
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>}>
              <ConstructionPage />
            </Suspense>
          );
        case 'PromoteurVentes':
          return (
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>}>
              <PromoteurVentes />
            </Suspense>
          );
        case 'PromoteurClients':
          return (
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>}>
              <PromoteurClients />
            </Suspense>
          );
        case 'PromoteurFinances':
          return (
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>}>
              <PromoteurFinances />
            </Suspense>
          );
        case 'PromoteurAI':
          return (
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>}>
              <PromoteurAI />
            </Suspense>
          );
        case 'PromoteurBlockchain':
          return (
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>}>
              <PromoteurBlockchain />
            </Suspense>
          );
      }
    }

    // Sinon on utilise le contenu intégré
    switch (activeTab) {
      case 'messages':
        return (
          <div className="w-full h-full bg-white">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                  <p className="text-lg text-gray-600">Centre de communication avec vos clients et partenaires</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrer
                  </Button>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Nouveau message
                  </Button>
                </div>
              </div>

              {/* Stats rapides */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Non lus</p>
                        <p className="text-2xl font-bold text-red-600">7</p>
                      </div>
                      <MessageSquare className="w-8 h-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-bold text-blue-600">34</p>
                      </div>
                      <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Urgent</p>
                        <p className="text-2xl font-bold text-orange-600">3</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Répondu</p>
                        <p className="text-2xl font-bold text-green-600">28</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Interface complète de messages */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Liste des conversations */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Conversations</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-0">
                        {[
                          {
                            id: 1,
                            name: 'Aminata FALL',
                            lastMessage: 'Merci pour les informations sur la villa...',
                            time: '10:30',
                            unread: 2,
                            urgent: true,
                            avatar: 'AF'
                          },
                          {
                            id: 2,
                            name: 'Moussa DIENG',
                            lastMessage: 'Quand pouvons-nous visiter le chantier ?',
                            time: '09:15',
                            unread: 1,
                            urgent: false,
                            avatar: 'MD'
                          },
                          {
                            id: 3,
                            name: 'Fatou SARR',
                            lastMessage: 'Le devis est parfait, procédons...',
                            time: 'Hier',
                            unread: 0,
                            urgent: false,
                            avatar: 'FS'
                          },
                          {
                            id: 4,
                            name: 'Banque CBAO',
                            lastMessage: 'Validation du dossier de financement',
                            time: 'Hier',
                            unread: 3,
                            urgent: true,
                            avatar: 'CB'
                          }
                        ].map((conversation) => (
                          <div key={conversation.id} className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${conversation.unread > 0 ? 'bg-blue-50' : ''}`}>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback className="bg-orange-600 text-white">
                                  {conversation.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-sm truncate">{conversation.name}</h4>
                                  <div className="flex items-center space-x-1">
                                    {conversation.urgent && (
                                      <AlertTriangle className="w-3 h-3 text-red-500" />
                                    )}
                                    <span className="text-xs text-gray-500">{conversation.time}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                                {conversation.unread > 0 && (
                                  <Badge className="bg-red-500 text-white text-xs mt-1">
                                    {conversation.unread}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Vue de la conversation */}
                <div className="lg:col-span-2">
                  <Card className="h-full">
                    <CardHeader className="border-b">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-orange-600 text-white">AF</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">Aminata FALL</CardTitle>
                          <p className="text-sm text-gray-600">En ligne il y a 5 min</p>
                        </div>
                        <div className="ml-auto flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-4">
                      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                        {/* Messages */}
                        <div className="flex justify-start">
                          <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                            <p className="text-sm">Bonjour, j'aimerais avoir plus d'informations sur la villa R+1 à Liberté 6.</p>
                            <span className="text-xs text-gray-500">09:30</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <div className="bg-orange-600 text-white rounded-lg p-3 max-w-xs">
                            <p className="text-sm">Bonjour Mme Fall ! Je serais ravi de vous présenter ce projet. Quand êtes-vous disponible pour une visite ?</p>
                            <span className="text-xs opacity-75">09:45</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-start">
                          <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                            <p className="text-sm">Parfait ! Je suis libre demain après-midi ou samedi matin.</p>
                            <span className="text-xs text-gray-500">10:15</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Zone de saisie */}
                      <div className="flex space-x-2 pt-4 border-t">
                        <Input placeholder="Tapez votre message..." className="flex-1" />
                        <Button className="bg-orange-600 hover:bg-orange-700">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="w-full h-full bg-white">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-lg text-gray-600">Toutes vos alertes et notifications importantes</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Tout marquer lu
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Préférences
                  </Button>
                </div>
              </div>

              {/* Stats des notifications */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Non lues</p>
                        <p className="text-2xl font-bold text-red-600">12</p>
                      </div>
                      <Bell className="w-8 h-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Urgentes</p>
                        <p className="text-2xl font-bold text-orange-600">4</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Aujourd'hui</p>
                        <p className="text-2xl font-bold text-blue-600">8</p>
                      </div>
                      <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Cette semaine</p>
                        <p className="text-2xl font-bold text-green-600">23</p>
                      </div>
                      <Calendar className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Onglets de notifications */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">Toutes</TabsTrigger>
                  <TabsTrigger value="urgent">Urgentes</TabsTrigger>
                  <TabsTrigger value="projects">Projets</TabsTrigger>
                  <TabsTrigger value="sales">Ventes</TabsTrigger>
                  <TabsTrigger value="system">Système</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <div className="space-y-3">
                    {[
                      {
                        id: 1,
                        type: 'urgent',
                        title: 'Retard de livraison - Résidence Les Palmiers',
                        message: 'Le chantier accuse un retard de 2 semaines sur la livraison prévue.',
                        time: '2 min',
                        icon: AlertTriangle,
                        color: 'red',
                        read: false
                      },
                      {
                        id: 2,
                        type: 'sales',
                        title: 'Nouvelle réservation confirmée',
                        message: 'Aminata FALL a confirmé sa réservation pour l\'appartement 3A-205.',
                        time: '15 min',
                        icon: CheckCircle,
                        color: 'green',
                        read: false
                      },
                      {
                        id: 3,
                        type: 'project',
                        title: 'Validation du permis de construire',
                        message: 'Le permis de construire pour le Complexe VDN a été approuvé.',
                        time: '1h',
                        icon: Building,
                        color: 'blue',
                        read: true
                      },
                      {
                        id: 4,
                        type: 'finance',
                        title: 'Paiement reçu',
                        message: 'Paiement de 15,000,000 FCFA reçu de la Banque CBAO.',
                        time: '2h',
                        icon: DollarSign,
                        color: 'green',
                        read: true
                      },
                      {
                        id: 5,
                        type: 'system',
                        title: 'Mise à jour système disponible',
                        message: 'Une nouvelle version de la plateforme est disponible.',
                        time: '1 jour',
                        icon: RefreshCw,
                        color: 'purple',
                        read: true
                      },
                      {
                        id: 6,
                        type: 'urgent',
                        title: 'Problème technique détecté',
                        message: 'Problème de synchronisation avec le système blockchain.',
                        time: '1 jour',
                        icon: AlertTriangle,
                        color: 'red',
                        read: false
                      }
                    ].map((notification) => {
                      const IconComponent = notification.icon;
                      return (
                        <Card key={notification.id} className={`hover:shadow-md transition-all cursor-pointer ${!notification.read ? 'border-l-4 border-l-orange-500 bg-orange-50' : ''}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-full ${
                                notification.color === 'red' ? 'bg-red-100' :
                                notification.color === 'green' ? 'bg-green-100' :
                                notification.color === 'blue' ? 'bg-blue-100' :
                                notification.color === 'purple' ? 'bg-purple-100' :
                                'bg-gray-100'
                              }`}>
                                <IconComponent className={`w-5 h-5 ${
                                  notification.color === 'red' ? 'text-red-600' :
                                  notification.color === 'green' ? 'text-green-600' :
                                  notification.color === 'blue' ? 'text-blue-600' :
                                  notification.color === 'purple' ? 'text-purple-600' :
                                  'text-gray-600'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {notification.title}
                                  </h4>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">{notification.time}</span>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    )}
                                  </div>
                                </div>
                                <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                                  {notification.message}
                                </p>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {notification.type}
                                  </Badge>
                                  {notification.type === 'urgent' && (
                                    <Badge className="bg-red-500 text-white text-xs">
                                      Urgent
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="urgent">
                  <div className="text-center text-gray-500 p-8">
                    Notifications urgentes uniquement
                  </div>
                </TabsContent>

                <TabsContent value="projects">
                  <div className="text-center text-gray-500 p-8">
                    Notifications liées aux projets
                  </div>
                </TabsContent>

                <TabsContent value="sales">
                  <div className="text-center text-gray-500 p-8">
                    Notifications commerciales
                  </div>
                </TabsContent>

                <TabsContent value="system">
                  <div className="text-center text-gray-500 p-8">
                    Notifications système
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="w-full h-full bg-white">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
                <p className="text-lg text-gray-600">Gérez votre profil, abonnements et préférences</p>
              </div>

              {/* Interface à onglets pour les paramètres */}
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="profile" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </TabsTrigger>
                  <TabsTrigger value="subscription" className="flex items-center">
                    <Crown className="w-4 h-4 mr-2" />
                    Abonnement
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Préférences
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Sécurité
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="flex items-center">
                    <Database className="w-4 h-4 mr-2" />
                    Avancé
                  </TabsTrigger>
                </TabsList>

                {/* Onglet Profil */}
                <TabsContent value="profile" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Profil Utilisateur
                      </CardTitle>
                      <CardDescription>
                        Gérez vos informations personnelles et professionnelles
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-20 h-20">
                          <AvatarFallback className="bg-orange-600 text-white text-xl">
                            {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold">{profile?.first_name} {profile?.last_name}</h3>
                          <p className="text-gray-600">{profile?.email}</p>
                          <p className="text-gray-600">{profile?.company}</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Upload className="w-4 h-4 mr-2" />
                            Changer la photo
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                          <Input defaultValue={profile?.first_name} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                          <Input defaultValue={profile?.last_name} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <Input defaultValue={profile?.email} type="email" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                          <Input placeholder="+221 XX XXX XX XX" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                          <Input defaultValue={profile?.company} />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                          <Input placeholder="Adresse complète de votre entreprise" />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">Annuler</Button>
                        <Button className="bg-orange-600 hover:bg-orange-700">
                          <Save className="w-4 h-4 mr-2" />
                          Sauvegarder
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Onglet Abonnement */}
                <TabsContent value="subscription" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Crown className="w-5 h-5 mr-2" />
                        Plan d'Abonnement
                      </CardTitle>
                      <CardDescription>
                        Gérez votre abonnement et vos fonctionnalités
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="border rounded-lg p-6 bg-gradient-to-r from-orange-50 to-yellow-50">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <Crown className="w-8 h-8 text-orange-600 mr-3" />
                            <div>
                              <h4 className="text-xl font-bold text-orange-800">Plan Promoteur Pro</h4>
                              <p className="text-orange-700">Abonnement actif jusqu'au 26 septembre 2026</p>
                            </div>
                          </div>
                          <Badge className="bg-orange-600 text-white px-3 py-1">Actif</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <p className="text-sm text-orange-700 flex items-center">
                              <Check className="w-4 h-4 mr-2" />
                              Gestion illimitée de projets
                            </p>
                            <p className="text-sm text-orange-700 flex items-center">
                              <Check className="w-4 h-4 mr-2" />
                              Outils avancés de construction
                            </p>
                            <p className="text-sm text-orange-700 flex items-center">
                              <Check className="w-4 h-4 mr-2" />
                              Support blockchain intégré
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-orange-700 flex items-center">
                              <Check className="w-4 h-4 mr-2" />
                              Analytics et rapports complets
                            </p>
                            <p className="text-sm text-orange-700 flex items-center">
                              <Check className="w-4 h-4 mr-2" />
                              Assistant IA avancé
                            </p>
                            <p className="text-sm text-orange-700 flex items-center">
                              <Check className="w-4 h-4 mr-2" />
                              Support prioritaire 24/7
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Onglet Préférences */}
                <TabsContent value="preferences" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="w-5 h-5 mr-2" />
                        Préférences Générales
                      </CardTitle>
                      <CardDescription>
                        Personnalisez votre expérience utilisateur
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="font-medium">Notifications par email</h4>
                            <p className="text-sm text-gray-600">Recevoir des notifications importantes par email</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="font-medium">Alertes de projet</h4>
                            <p className="text-sm text-gray-600">Notifications sur l'avancement des projets</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <h4 className="font-medium">Rappels de paiement</h4>
                            <p className="text-sm text-gray-600">Rappels pour les échéances de paiement</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 className="font-medium">Langue de l'interface</h4>
                          <select className="w-full p-2 border rounded-lg">
                            <option>Français</option>
                            <option>English</option>
                            <option>Wolof</option>
                          </select>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium">Format de devise</h4>
                          <select className="w-full p-2 border rounded-lg">
                            <option>FCFA</option>
                            <option>EUR</option>
                            <option>USD</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Onglet Sécurité */}
                <TabsContent value="security" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Sécurité du Compte
                      </CardTitle>
                      <CardDescription>
                        Protégez votre compte avec des mesures de sécurité avancées
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg bg-green-50">
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <span className="font-medium text-green-800">Compte sécurisé</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">
                            Votre compte suit toutes les meilleures pratiques de sécurité
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Button variant="outline" className="w-full justify-between">
                            <div className="flex items-center">
                              <Key className="w-4 h-4 mr-2" />
                              Changer le mot de passe
                            </div>
                            <ChevronRight className="w-4 h-4" />
                          </Button>

                          <Button variant="outline" className="w-full justify-between">
                            <div className="flex items-center">
                              <Shield className="w-4 h-4 mr-2" />
                              Authentification à deux facteurs
                            </div>
                            <div className="flex items-center">
                              <Badge className="bg-green-100 text-green-800 mr-2">Activé</Badge>
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Onglet Avancé */}
                <TabsContent value="advanced" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Database className="w-5 h-5 mr-2" />
                        Paramètres Avancés
                      </CardTitle>
                      <CardDescription>
                        Configuration avancée et gestion des données
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Exportation des données</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Téléchargez une copie de toutes vos données
                          </p>
                          <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Exporter mes données
                          </Button>
                        </div>

                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Sauvegarde automatique</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Sauvegarde automatique de vos projets et données
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Sauvegarde quotidienne</span>
                            <Switch defaultChecked />
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

      case 'analytics':
        return (
          <div className="w-full h-full bg-white">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                  <p className="text-lg text-gray-600">Analysez les performances de vos projets et investissements</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Derniers 30 jours
                  </Button>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter rapport
                  </Button>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Revenus totaux</p>
                        <p className="text-2xl font-bold text-gray-900">2.4M FCFA</p>
                        <p className="text-xs text-green-600">+12.5% ce mois</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Projets actifs</p>
                        <p className="text-2xl font-bold text-gray-900">8</p>
                        <p className="text-xs text-green-600">+2 ce mois</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Clients satisfaits</p>
                        <p className="text-2xl font-bold text-gray-900">156</p>
                        <p className="text-xs text-green-600">+8.2% ce mois</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Target className="w-8 h-8 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Taux de conversion</p>
                        <p className="text-2xl font-bold text-gray-900">68%</p>
                        <p className="text-xs text-green-600">+5.3% ce mois</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Évolution des ventes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">Graphique des ventes mensuelles</p>
                          <p className="text-sm text-gray-400">Integration avec Chart.js en cours...</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="w-5 h-5 mr-2" />
                      Répartition des projets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">Répartition par type de projet</p>
                          <p className="text-sm text-gray-400">Graphique circulaire en cours...</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Performance des projets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3">Projet</th>
                            <th className="text-left p-3">Statut</th>
                            <th className="text-left p-3">Progression</th>
                            <th className="text-left p-3">Revenus</th>
                            <th className="text-left p-3">ROI</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="p-3">
                              <div className="font-medium">Résidence Les Palmiers</div>
                              <div className="text-sm text-gray-600">Dakar Plateau</div>
                            </td>
                            <td className="p-3">
                              <Badge className="bg-green-100 text-green-800">En cours</Badge>
                            </td>
                            <td className="p-3">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-orange-600 h-2 rounded-full" style={{width: '75%'}}></div>
                              </div>
                              <span className="text-sm text-gray-600">75%</span>
                            </td>
                            <td className="p-3 font-medium">850K FCFA</td>
                            <td className="p-3 text-green-600 font-medium">+23%</td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="p-3">
                              <div className="font-medium">Villa Moderne Almadies</div>
                              <div className="text-sm text-gray-600">Almadies</div>
                            </td>
                            <td className="p-3">
                              <Badge className="bg-orange-100 text-orange-800">Planification</Badge>
                            </td>
                            <td className="p-3">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-orange-600 h-2 rounded-full" style={{width: '25%'}}></div>
                              </div>
                              <span className="text-sm text-gray-600">25%</span>
                            </td>
                            <td className="p-3 font-medium">1.2M FCFA</td>
                            <td className="p-3 text-green-600 font-medium">+18%</td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="p-3">
                              <div className="font-medium">Complexe Teranga Heights</div>
                              <div className="text-sm text-gray-600">Mermoz</div>
                            </td>
                            <td className="p-3">
                              <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>
                            </td>
                            <td className="p-3">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{width: '100%'}}></div>
                              </div>
                              <span className="text-sm text-gray-600">100%</span>
                            </td>
                            <td className="p-3 font-medium">2.1M FCFA</td>
                            <td className="p-3 text-green-600 font-medium">+31%</td>
                          </tr>
                        </tbody>
                      </table>
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
    <div className="flex h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          width: sidebarCollapsed ? 80 : 280,
          x: mobileMenuOpen ? 0 : (window.innerWidth < 1024 && !mobileMenuOpen ? -280 : 0)
        }}
        className="bg-white/80 backdrop-blur-md border-r border-orange-200/30 flex flex-col shadow-xl z-40 fixed lg:relative h-full"
      >
        {/* Header moderne */}
        <div className="p-6 border-b border-orange-200/30 bg-gradient-to-r from-orange-600 to-red-600">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-xl text-white">Promoteur Pro</h1>
                  <p className="text-sm text-orange-100">{profile?.company || 'Dashboard Avancé'}</p>
                </div>
              </motion.div>
            )}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex text-white hover:bg-white/20"  
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation moderne */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-3 px-4">
            {sidebarTabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleTabClick(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full group relative flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200' 
                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'} relative z-10 ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-orange-600'
                  }`} />
                  {!sidebarCollapsed && (
                    <div className="relative z-10 flex-1">
                      <span className="font-medium">{tab.label}</span>
                      {tab.description && (
                        <p className={`text-xs mt-0.5 ${
                          isActive ? 'text-orange-100' : 'text-gray-500 group-hover:text-orange-500'
                        }`}>
                          {tab.description}
                        </p>
                      )}
                    </div>
                  )}
                  {!sidebarCollapsed && tab.badge && (
                    <Badge 
                      className={`ml-2 relative z-10 ${
                        isActive 
                          ? 'bg-white/20 text-white border-white/30' 
                          : 'bg-orange-100 text-orange-800 group-hover:bg-orange-200'
                      }`}
                      variant={isActive ? "secondary" : "default"}
                    >
                      {tab.badge}
                    </Badge>
                  )}
                  {!sidebarCollapsed && !tab.badge && (
                    <div className={`ml-auto relative z-10 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-orange-600'
                    }`}>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* User Profile moderne */}
        <div className="border-t border-orange-200/30 p-4 bg-gradient-to-r from-orange-50 to-red-50">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 shadow-sm"
          >
            <Avatar className="w-12 h-12 ring-2 ring-orange-200">
              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {profile?.email}
                </p>
                <div className="flex items-center mt-1">
                  <Badge className="bg-orange-100 text-orange-800 text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                </div>
              </div>
            )}
            {!sidebarCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-red-100 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header moderne */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-orange-200/30 sticky top-0 z-20">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden text-gray-600"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {sidebarTabs.find(tab => tab.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-600">
                  {sidebarTabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Messages Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-orange-600 hover:bg-orange-50 relative"
                onClick={() => handleTabClick('messages')}
              >
                <MessageSquare className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  7
                </span>
              </Button>

              {/* Notifications Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-orange-600 hover:bg-orange-50 relative"
                onClick={() => handleTabClick('notifications')}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  12
                </span>
              </Button>

              {/* User Profile Dropdown */}
              <div className="flex items-center space-x-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg px-3 py-2 border border-orange-200/50">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {profile?.first_name?.charAt(0) || user?.email?.charAt(0) || 'P'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-xs text-gray-600">Promoteur Pro</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-orange-100">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {profile?.first_name} {profile?.last_name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {profile?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleTabClick('settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTabClick('settings')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          }>
            {renderMainContent()}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default PromoteurDashboard;
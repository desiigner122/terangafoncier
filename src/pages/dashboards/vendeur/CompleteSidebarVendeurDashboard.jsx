import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, Outlet, useParams } from 'react-router-dom';
import { 
  // Navigation Icons
  Home,
  Building2,
  Plus,
  Upload,
  Camera,
  Edit,
  Eye,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  User,
  
  // Content Icons
  Shield, 
  TrendingUp,
  DollarSign,
  MapPin,
  FileText,
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
  Users,
  Headphones,
  
  // AI & Blockchain Icons
  Brain,
  Zap,
  Network,
  Database,
  Rocket,
  Lightbulb,
  
  // UI Icons
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

// Import des pages spécialisées - VERSION REAL DATA
// 🆕 NOUVEAU DASHBOARD OVERVIEW MODERNISÉ
const VendeurOverview = React.lazy(() => import('./VendeurOverviewRealDataModern'));
const VendeurCRM = React.lazy(() => import('./VendeurCRMRealData'));
const VendeurPropertiesComplete = React.lazy(() => import('./VendeurPropertiesRealData'));
const VendeurPurchaseRequests = React.lazy(() => import('./VendeurPurchaseRequests'));
const VendeurAntiFraude = React.lazy(() => import('./VendeurAntiFraudeRealData'));
const VendeurGPSVerification = React.lazy(() => import('./VendeurGPSRealData'));
const VendeurServicesDigitaux = React.lazy(() => import('./VendeurServicesDigitauxRealData'));
const VendeurAddTerrain = React.lazy(() => import('./VendeurAddTerrainRealData'));
const VendeurPhotos = React.lazy(() => import('./VendeurPhotosRealData'));
const VendeurAnalytics = React.lazy(() => import('./VendeurAnalyticsRealData'));
const VendeurAI = React.lazy(() => import('./VendeurAIRealData'));
const VendeurBlockchain = React.lazy(() => import('./VendeurBlockchainRealData'));
const VendeurMessages = React.lazy(() => import('./VendeurMessagesRealData'));
const VendeurSupport = React.lazy(() => import('./VendeurSupport'));
const VendeurSettings = React.lazy(() => import('./VendeurSettingsRealData'));

// 🆕 SEMAINE 3 - Nouvelles pages workflows end-to-end
const TransactionsPage = React.lazy(() => import('./TransactionsPage'));
const MarketAnalyticsPage = React.lazy(() => import('./MarketAnalyticsPage'));

const CompleteSidebarVendeurDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extraire l'onglet actif depuis l'URL
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path === '/vendeur' || path === '/vendeur/') return 'overview';
    const match = path.match(/\/vendeur\/([^\/]+)/);
    return match ? match[1] : 'overview';
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Mettre à jour activeTab quand l'URL change
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await signOut();
      console.log('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  
  // États pour données réelles
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    totalProperties: 0,
    activeProspects: 0,
    pendingInquiries: 0,
    pendingRequests: 0, // 🆕 Demandes d'achat en attente
  });

  // Navigation Items Configuration pour Vendeur - CRM + Anti-Fraude
  const navigationItems = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: Home,
      description: 'Dashboard CRM + Anti-Fraude'
    },
    {
      id: 'crm',
      label: 'CRM Prospects',
      icon: Users,
      description: 'Gestion clients et prospects',
      badge: dashboardStats.activeProspects?.toString() || '0',
      highlight: true
    },
    {
      id: 'properties',
      label: 'Mes Biens & Annonces',
      icon: Building2,
      description: 'Gestion complète de vos propriétés',
      badge: dashboardStats.totalProperties?.toString() || '0'
    },
    {
      id: 'purchase-requests',
      label: 'Demandes d\'Achat',
      icon: FileText,
      description: 'Offres et négociations clients',
      badge: dashboardStats.pendingRequests?.toString() || '0'
    },
    {
      id: 'anti-fraud',
      label: 'Vérification Titres',
      icon: Shield,
      description: 'Scanner & validation anti-fraude',
      badge: 'SÉCURISÉ'
    },
    {
      id: 'gps-verification',
      label: 'Géolocalisation GPS',
      icon: MapPin,
      description: 'Validation GPS des parcelles',
      badge: '9'
    },
    {
      id: 'digital-services',
      label: 'Services Digitalisés',
      icon: Zap,
      description: 'Signature & visites virtuelles',
      badge: 'DIGITAL'
    },
    {
      id: 'add-property',
      label: 'Ajouter Terrain',
      icon: Plus,
      description: 'Nouveau terrain à vendre',
      highlight: true
    },
    {
      id: 'photos',
      label: 'Photos IA',
      icon: Camera,
      description: 'Optimisation photos avec IA',
      badge: 'IA'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Statistiques et performances'
    },
    {
      id: 'blockchain',
      label: 'Blockchain',
      icon: Network,
      description: 'Certification blockchain',
      badge: '10'
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: Activity,
      description: 'Historique blockchain',
      badge: 'NOUVEAU'
    },
    {
      id: 'market-analytics',
      label: 'Analyse Marché',
      icon: TrendingUp,
      description: 'Analytics & prédictions IA',
      badge: 'IA'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      description: 'Communication clients',
      badge: unreadMessagesCount > 0 ? unreadMessagesCount.toString() : undefined
    },
    {
      id: 'support',
      label: 'Support & Aide',
      icon: Headphones,
      description: 'Tickets et assistance',
      badge: 'NOUVEAU'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration du compte'
    }
  ];

  useEffect(() => {
    // Simulation du chargement des données
    const loadDashboardData = async () => {
      setLoading(true);
      // Charger données réelles depuis Supabase
      if (user) {
        await Promise.all([
          loadNotifications(),
          loadMessages(),
          loadDashboardStats()
        ]);
      }
      setLoading(false);
    };
    
    loadDashboardData();
  }, [user]);

  // Charger les notifications depuis Supabase
  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setNotifications(data);
        setUnreadNotificationsCount(data.length);
      }
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    }
  };

  // Charger les messages depuis Supabase
  const loadMessages = async () => {
    try {
      // Charger depuis la table 'messages' de notre système de messagerie
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', user.id) // Messages dans les conversations où l'utilisateur participe
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setMessages(data);
        setUnreadMessagesCount(data.filter(m => !m.read_at).length);
      }
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    }
  };

  // Charger les statistiques réelles
  const loadDashboardStats = async () => {
    try {
      // Compter les propriétés
      const { count: totalProperties } = await supabase
        .from('properties')
  .select('id', { count: 'exact' })
  .limit(0)
        .eq('owner_id', user.id);

      const { count: activeListings } = await supabase
        .from('properties')
  .select('id', { count: 'exact' })
  .limit(0)
        .eq('owner_id', user.id)
        .eq('status', 'active');

      // Compter les demandes en attente
      const { count: pendingInquiries } = await supabase
        .from('property_inquiries')
  .select('id', { count: 'exact' })
  .limit(0)
        .eq('vendor_id', user.id)
        .eq('status', 'pending');

      // 🆕 Compter les demandes d'achat en attente
      const { count: pendingRequests } = await supabase
        .from('purchase_requests')
  .select('id', { count: 'exact' })
  .limit(0)
        .eq('vendor_id', user.id)
        .eq('status', 'pending');

      setDashboardStats(prev => ({
        ...prev,
        totalProperties: totalProperties || 0,
        activeListings: activeListings || 0,
        pendingInquiries: pendingInquiries || 0,
        pendingRequests: pendingRequests || 0 // 🆕 Nombre demandes en attente
      }));
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Rendu du composant de page active
  const renderActiveComponent = () => {
    const components = {
      'overview': VendeurOverview,
      'crm': VendeurCRM,
      'properties': VendeurPropertiesComplete,
      'purchase-requests': VendeurPurchaseRequests,
      'anti-fraud': VendeurAntiFraude,
      'gps-verification': VendeurGPSVerification,
      'digital-services': VendeurServicesDigitaux,
      'add-property': VendeurAddTerrain,
      'photos': VendeurPhotos,
      'analytics': VendeurAnalytics,
      'ai-assistant': VendeurAI,
      'blockchain': VendeurBlockchain,
      'transactions': TransactionsPage, // 🆕 SEMAINE 3
      'market-analytics': MarketAnalyticsPage, // 🆕 SEMAINE 3
      'messages': VendeurMessages,
      'support': VendeurSupport,
      'settings': VendeurSettings
    };

    const ActiveComponent = components[activeTab];
    
    if (!ActiveComponent) {
      return (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Page en développement
          </h3>
          <p className="text-gray-600">
            Cette fonctionnalité sera bientôt disponible.
          </p>
        </div>
      );
    }

    return (
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      }>
        <ActiveComponent stats={dashboardStats} />
      </Suspense>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Chargement du dashboard vendeur...
          </h3>
          <p className="text-gray-600">
            Préparation de votre espace de gestion
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-80'
      } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
      fixed lg:relative lg:translate-x-0 h-full z-30`}>
        
        {/* Header Sidebar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-2 rounded-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Vendeur Pro</h2>
                  <p className="text-sm text-gray-600">Dashboard IA</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:flex hidden"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats rapides CRM + Anti-Fraude */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  {dashboardStats.activeProspects}
                </div>
                <div className="text-xs text-gray-600">Prospects</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  {dashboardStats.securityScore}%
                </div>
                <div className="text-xs text-gray-600">Sécurité</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {dashboardStats.verifiedTitles}
                </div>
                <div className="text-xs text-gray-600">Titres vérifiés</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {dashboardStats.conversionRate}%
                </div>
                <div className="text-xs text-gray-600">Conversion</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
<nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => navigate(`/vendeur/${item.id}`)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100'
                } ${item.highlight ? 'ring-2 ring-purple-300 ring-opacity-50' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                {!sidebarCollapsed && (
                  <>
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                        {item.description}
                      </div>
                    </div>
                    {item.badge && (
                      <Badge 
                        className={`text-xs ${
                          item.badge === 'NOUVEAU' ? 'bg-green-100 text-green-800' :
                          item.badge === 'IA' ? 'bg-purple-100 text-purple-800' :
                          item.badge === 'SÉCURISÉ' ? 'bg-green-100 text-green-800' :
                          item.badge === 'DIGITAL' ? 'bg-blue-100 text-blue-800' :
                          'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </motion.button>
            );
          })}
          
          {/* Bouton de déconnexion dans le sidebar */}
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 text-red-600 hover:bg-red-50 mt-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="h-5 w-5 text-red-500" />
            {!sidebarCollapsed && (
              <div className="flex-1">
                <div className="font-medium">Déconnexion</div>
                <div className="text-xs text-red-500">
                  Quitter le dashboard
                </div>
              </div>
            )}
          </motion.button>
        </nav>

        {/* Widget assistant en bas - compact */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-lg text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Brain className="h-5 w-5 text-white" />
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div className="text-white text-sm font-medium">IA + Blockchain</div>
              <div className="text-white/80 text-xs">
                {dashboardStats.aiOptimized} IA • {dashboardStats.blockchainVerified} certifiés
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard Vendeur'}
                </h1>
                <p className="text-sm text-gray-600">
                  {navigationItems.find(item => item.id === activeTab)?.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Messages */}
              <DropdownMenu open={showMessages} onOpenChange={setShowMessages}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative" onClick={() => navigate('/vendeur/messages')}>
                    <MessageSquare className="h-5 w-5" />
                    <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0">
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80">
                  <DropdownMenuLabel>Messages récents</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/vendeur/messages')}>
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Marie Diallo</p>
                        <p className="text-sm text-gray-600">Intéressée par la villa Almadies</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/vendeur/messages')}>
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Amadou Ba</p>
                        <p className="text-sm text-gray-600">Question sur le financement</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/vendeur/messages')}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Voir tous les messages</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0">
                      {dashboardStats.pendingInquiries}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Eye className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Nouvelle vue</p>
                        <p className="text-sm text-gray-600">Villa Almadies - 15 vues aujourd'hui</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">Performance IA</p>
                        <p className="text-sm text-gray-600">6 propriétés optimisées cette semaine</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'V'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.full_name || 'Vendeur'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/vendeur/settings')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/vendeur/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Suspense fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              }>
                {/* Outlet pour les routes imbriquées (comme edit-property/:id) */}
                <Outlet />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default CompleteSidebarVendeurDashboard;
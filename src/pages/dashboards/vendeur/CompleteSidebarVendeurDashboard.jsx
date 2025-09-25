import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { Link } from 'react-router-dom';

// Import des pages spécialisées (à créer)
const VendeurOverview = React.lazy(() => import('./pages/VendeurOverview'));
const VendeurProperties = React.lazy(() => import('./pages/VendeurProperties'));
const VendeurAddProperty = React.lazy(() => import('./pages/VendeurAddProperty'));
const VendeurPhotos = React.lazy(() => import('./pages/VendeurPhotos'));
const VendeurListings = React.lazy(() => import('./pages/VendeurListings'));
const VendeurAnalytics = React.lazy(() => import('./pages/VendeurAnalytics'));
const VendeurAI = React.lazy(() => import('./pages/VendeurAI'));
const VendeurBlockchain = React.lazy(() => import('./pages/VendeurBlockchain'));
const VendeurMessages = React.lazy(() => import('./pages/VendeurMessages'));
const VendeurSettings = React.lazy(() => import('./pages/VendeurSettings'));

const CompleteSidebarVendeurDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // Navigation Items Configuration pour Vendeur
  const navigationItems = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: Home,
      description: 'Dashboard principal et statistiques'
    },
    {
      id: 'properties',
      label: 'Mes Biens',
      icon: Building2,
      description: 'Gestion de vos propriétés',
      badge: '12'
    },
    {
      id: 'add-property',
      label: 'Ajouter Bien',
      icon: Plus,
      description: 'Nouveau bien immobilier',
      highlight: true
    },
    {
      id: 'photos',
      label: 'Photos',
      icon: Camera,
      description: 'Gestion des photos',
      badge: 'IA'
    },
    {
      id: 'listings',
      label: 'Annonces',
      icon: FileText,
      description: 'Gestion des annonces actives'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Statistiques et performances'
    },
    {
      id: 'ai-assistant',
      label: 'Assistant IA',
      icon: Brain,
      description: 'Intelligence artificielle',
      badge: 'NOUVEAU'
    },
    {
      id: 'blockchain',
      label: 'Blockchain',
      icon: Shield,
      description: 'Vérification et certification'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      description: 'Communication clients',
      badge: '3'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration du compte'
    }
  ];

  // Stats du tableau de bord
  const [dashboardStats, setDashboardStats] = useState({
    totalProperties: 12,
    activeListings: 8,
    totalViews: 1245,
    monthlyRevenue: 2500000,
    pendingInquiries: 5,
    aiOptimized: 6,
    blockchainVerified: 10
  });

  useEffect(() => {
    // Simulation du chargement des données
    const loadDashboardData = async () => {
      setLoading(true);
      // Simulation API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };
    
    loadDashboardData();
  }, []);

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
      'properties': VendeurProperties,
      'add-property': VendeurAddProperty,
      'photos': VendeurPhotos,
      'listings': VendeurListings,
      'analytics': VendeurAnalytics,
      'ai-assistant': VendeurAI,
      'blockchain': VendeurBlockchain,
      'messages': VendeurMessages,
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

        {/* Stats rapides */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  {dashboardStats.totalProperties}
                </div>
                <div className="text-xs text-gray-600">Biens</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(dashboardStats.monthlyRevenue)}
                </div>
                <div className="text-xs text-gray-600">Revenus</div>
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
                onClick={() => setActiveTab(item.id)}
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
        </nav>

        {/* Widgets en bas */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200 space-y-4">
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-lg">
                <Brain className="h-6 w-6 text-white mx-auto mb-2" />
                <div className="text-white text-sm font-medium">IA Assistant</div>
                <div className="text-white/80 text-xs">Optimisez vos ventes</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-white mx-auto mb-2" />
                <div className="text-white text-sm font-medium">Blockchain</div>
                <div className="text-white/80 text-xs">{dashboardStats.blockchainVerified} biens certifiés</div>
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
                      <div className="bg-green-100 p-2 rounded-full">
                        <MessageSquare className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Nouveau message</p>
                        <p className="text-sm text-gray-600">Demande d'information pour terrain Sacré-Cœur</p>
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
                  <DropdownMenuItem onClick={() => setActiveTab('settings')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('settings')}>
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
              {renderActiveComponent()}
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
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  // Navigation Icons
  Home,
  Building2,
  FileText,
  Users,
  Map,
  Shield,
  Settings,
  Bell,
  LogOut,
  User,
  
  // Content Icons
  TrendingUp,
  DollarSign,
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
  
  // AI & Blockchain Icons
  Brain,
  Zap,
  Network,
  Database,
  Rocket,
  Lightbulb,
  
  // Municipal Icons
  Landmark,
  Briefcase,
  Calendar,
  Flag,
  Archive,
  TreePine,
  Truck,
  Phone,
  Mail,
  
  // UI Icons
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { supabase } from '@/lib/supabaseClient';
// Toast import supprimé - utilisation window.safeGlobalToast

// Lazy loading des composants de pages
const MairieOverview = React.lazy(() => import('./MairieOverview'));
const MairieCommunalRequests = React.lazy(() => import('./MairieCommunalRequests'));
const MairieUrbanPlanning = React.lazy(() => import('./MairieUrbanPlanning'));
const MairieCadastre = React.lazy(() => import('./MairieCadastre'));
const MairieDisputeResolution = React.lazy(() => import('./MairieDisputeResolution'));
const MairieMessages = React.lazy(() => import('./MairieMessages'));
const MairieAnalytics = React.lazy(() => import('./MairieAnalytics'));
const MairieAI = React.lazy(() => import('./MairieAI'));
const MairieBlockchain = React.lazy(() => import('./MairieBlockchain'));
const MairieZonesCommunales = React.lazy(() => import('./MairieZonesCommunales'));
const MairieSettings = React.lazy(() => import('./MairieSettings'));

const CompleteSidebarMairieDashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    pendingRequests: 15,
    approvedRequests: 87,
    territoryArea: '12.5km²',
    activeCitizens: 8542,
    monthlyRevenue: 0, // Mairies n'ont pas de revenus directs
    totalLandManaged: 1547
  });

  // Chargement du profil utilisateur
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      window.safeGlobalToast({
        description: 'Déconnexion réussie',
        variant: 'success'
      });
    } catch (error) {
      window.safeGlobalToast({
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
      id: 'communal-requests',
      label: 'Demandes Communales',
      icon: FileText,
      description: 'Gestion des demandes foncières',
      badge: dashboardStats.pendingRequests
    },
    {
      id: 'urban-planning',
      label: 'Planification Urbaine',
      icon: Building2,
      description: 'Plans d\'urbanisme et développement'
    },
    {
      id: 'cadastre',
      label: 'Cadastre Municipal',
      icon: Map,
      description: 'Gestion cadastrale numérique'
    },
    {
      id: 'zones-communales',
      label: 'Zones Communales',
      icon: MapPin,
      description: 'Gestion des zones communales publiques'
    },
    {
      id: 'dispute-resolution',
      label: 'Résolution Conflits',
      icon: Shield,
      description: 'Médiation et arbitrage foncier'
    },
    {
      id: 'messages',
      label: 'Communications',
      icon: MessageSquare,
      description: 'Messagerie institutionnelle'
    },
    {
      id: 'analytics',
      label: 'Analyses & Rapports',
      icon: TrendingUp,
      description: 'Statistiques municipales'
    },
    {
      id: 'ai',
      label: 'Assistant IA',
      icon: Brain,
      description: 'Intelligence artificielle municipale'
    },
    {
      id: 'blockchain',
      label: 'Blockchain Municipal',
      icon: Network,
      description: 'Gestion blockchain des titres fonciers'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration du système'
    }
  ];

  const renderActiveComponent = () => {
    const commonProps = { dashboardStats };
    
    switch (activeTab) {
      case 'overview':
        return <MairieOverview {...commonProps} />;
      case 'communal-requests':
        return <MairieCommunalRequests {...commonProps} />;
      case 'urban-planning':
        return <MairieUrbanPlanning {...commonProps} />;
      case 'cadastre':
        return <MairieCadastre {...commonProps} />;
      case 'zones-communales':
        return <MairieZonesCommunales {...commonProps} />;
      case 'dispute-resolution':
        return <MairieDisputeResolution {...commonProps} />;
      case 'messages':
        return <MairieMessages {...commonProps} />;
      case 'analytics':
        return <MairieAnalytics {...commonProps} />;
      case 'ai':
        return <MairieAI {...commonProps} />;
      case 'blockchain':
        return <MairieBlockchain {...commonProps} />;
      case 'settings':
        return <MairieSettings {...commonProps} profile={profile} />;
      default:
        return <MairieOverview {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          width: sidebarCollapsed ? 80 : 280,
          x: mobileMenuOpen ? 0 : (window.innerWidth < 1024 ? -280 : 0)
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          fixed lg:relative left-0 top-0 h-screen bg-white/95 backdrop-blur-md 
          shadow-xl border-r border-teal-200/50 z-30 flex flex-col
          ${mobileMenuOpen ? 'block' : 'hidden lg:flex'}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-teal-200/30">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3"
              >
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-2 rounded-xl shadow-lg">
                  <Landmark className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Dashboard Mairie</h2>
                  <p className="text-xs text-gray-600">Gestion Municipale</p>
                </div>
              </motion.div>
            )}
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex text-gray-600 hover:text-teal-600"
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {sidebarTabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 mx-2 rounded-xl 
                transition-all duration-200 group relative
                ${activeTab === tab.id 
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className={`
                h-5 w-5 flex-shrink-0
                ${activeTab === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-teal-600'}
              `} />
              
              {!sidebarCollapsed && (
                <>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{tab.label}</div>
                    <div className={`
                      text-xs opacity-75
                      ${activeTab === tab.id ? 'text-teal-100' : 'text-gray-500'}
                    `}>
                      {tab.description}
                    </div>
                  </div>
                  
                  {tab.badge && (
                    <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                      {tab.badge}
                    </Badge>
                  )}
                </>
              )}
              
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* User Profile dans sidebar */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-t border-teal-200/30"
          >
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-10 w-10 border-2 border-teal-200">
                <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                <AvatarFallback className="bg-teal-100 text-teal-700">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'M'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name || 'Maire'}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            
            {/* Bouton de déconnexion */}
            <motion.button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 
                       hover:bg-red-50 rounded-lg transition-all duration-200 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="h-4 w-4 group-hover:text-red-700" />
              <span className="text-sm font-medium group-hover:text-red-700">
                Se déconnecter
              </span>
            </motion.button>
          </motion.div>
        )}

        {/* Bouton de déconnexion pour sidebar collapsed */}
        {sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-2 border-t border-teal-200/30"
          >
            <motion.button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-2 text-red-600 
                       hover:bg-red-50 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Se déconnecter"
            >
              <LogOut className="h-5 w-5" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-teal-200/30 sticky top-0 z-20">
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
              {/* Messages */}
              <DropdownMenu open={showMessages} onOpenChange={setShowMessages}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <MessageSquare className="h-5 w-5" />
                    <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0">
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80">
                  <DropdownMenuLabel>Messages récents</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600">CD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Conseil Départemental</p>
                        <p className="text-sm text-gray-600">Nouvelle directive foncière</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-green-100 text-green-600">AS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Association Citoyenne</p>
                        <p className="text-sm text-gray-600">Demande d'aménagement parc</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveTab('messages')}>
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
                      {dashboardStats.pendingRequests}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">Demande urgente</p>
                        <p className="text-sm text-gray-600">Attribution terrain commercial - Zone A</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Validation automatique IA</p>
                        <p className="text-sm text-gray-600">12 dossiers traités cette semaine</p>
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
                      <AvatarFallback className="bg-teal-100 text-teal-600">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'M'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.full_name || 'Maire'}
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
              <Suspense fallback={
                <div className="flex items-center justify-center h-96">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full"
                  />
                </div>
              }>
                {renderActiveComponent()}
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

export default CompleteSidebarMairieDashboard;
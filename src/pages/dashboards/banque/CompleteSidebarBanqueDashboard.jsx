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
  
  // Banking Icons
  Banknote,
  CreditCard,
  Wallet,
  Calculator,
  PiggyBank,
  TrendingDown,
  BarChart3,
  Smartphone,
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
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
// Toast import supprimé - utilisation window.safeGlobalToast

// Lazy loading des composants de pages
const BanqueOverview = React.lazy(() => import('./BanqueOverview'));
const BanqueClientManagement = React.lazy(() => import('./BanqueClients'));
const BanqueCreditManagement = React.lazy(() => import('./BanqueCreditRequests'));
const BanqueRiskAssessment = React.lazy(() => import('./BanqueRiskManagement'));
const BanquePortfolioManagement = React.lazy(() => import('./BanquePortfolio'));
const BanqueMessages = React.lazy(() => import('./BanqueMessages'));
const BanqueAnalytics = React.lazy(() => import('./BanqueAnalytics'));
const BanqueAI = React.lazy(() => import('./BanqueAI'));
const BanqueBlockchain = React.lazy(() => import('./BanqueBlockchain'));
const BanqueComplianceReporting = React.lazy(() => import('./BanqueCompliance'));
// Nouvelles pages spécialisées pour la lutte anti-fraude et digitalisation
const BanqueCRM = React.lazy(() => import('./BanqueCRM'));
const BanqueAntiFraude = React.lazy(() => import('./BanqueAntiFraude'));
const BanqueGPSVerification = React.lazy(() => import('./BanqueGPSVerification'));
const BanqueServicesDigitaux = React.lazy(() => import('./BanqueServicesDigitaux'));
const BanqueSettings = React.lazy(() => import('./BanqueSettings'));

const CompleteSidebarBanqueDashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    pendingCreditApplications: 28,
    approvedCredits: 156,
    totalCreditVolume: '2.8Md CFA',
    activeClients: 12847,
    monthlyRevenue: 485000000,
    totalGuarantees: 1875
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
      description: 'Tableau de bord bancaire principal'
    },
    {
      id: 'client-management',
      label: 'Gestion Clients',
      icon: Users,
      description: 'Portefeuille clients immobilier',
      badge: dashboardStats.activeClients > 10000 ? '10k+' : null
    },
    {
      id: 'crm',
      label: 'CRM Bancaire',
      icon: Banknote,
      description: 'Relation client et scoring crédit'
    },
    {
      id: 'anti-fraude',
      label: 'Anti-Fraude IA',
      icon: Shield,
      description: 'Détection fraude bancaire avec IA'
    },
    {
      id: 'gps-verification',
      label: 'Validation GPS',
      icon: MapPin,
      description: 'Vérification GPS des garanties'
    },
    {
      id: 'services-digitaux',
      label: 'Services Digitaux',
      icon: Smartphone,
      description: 'Banking digital et fintech'
    },
    {
      id: 'credit-management',
      label: 'Gestion Crédits',
      icon: Calculator,
      description: 'Crédit immobilier et hypothécaire',
      badge: dashboardStats.pendingCreditApplications
    },
    {
      id: 'risk-assessment',
      label: 'Analyse Risques',
      icon: TrendingDown,
      description: 'Évaluation et gestion des risques'
    },
    {
      id: 'portfolio-management',
      label: 'Gestion Portfolio',
      icon: PiggyBank,
      description: 'Portfolio crédits et investissements'
    },
    {
      id: 'compliance-reporting',
      label: 'Conformité & Rapports',
      icon: FileText,
      description: 'Compliance bancaire et reporting'
    },
    {
      id: 'messages',
      label: 'Communications',
      icon: MessageSquare,
      description: 'Messagerie bancaire sécurisée'
    },
    {
      id: 'analytics',
      label: 'Analytics Bancaire',
      icon: BarChart3,
      description: 'Analyses financières et KPI'
    },
    {
      id: 'ai',
      label: 'Assistant IA',
      icon: Brain,
      description: 'Intelligence artificielle bancaire'
    },
    {
      id: 'blockchain',
      label: 'Blockchain Finance',
      icon: Network,
      description: 'Gestion blockchain des garanties'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration système bancaire'
    }
  ];

  const renderActiveComponent = () => {
    const commonProps = { dashboardStats };
    
    switch (activeTab) {
      case 'overview':
        return <BanqueOverview {...commonProps} />;
      case 'client-management':
        return <BanqueClientManagement {...commonProps} />;
      case 'crm':
        return <BanqueCRM {...commonProps} />;
      case 'anti-fraude':
        return <BanqueAntiFraude {...commonProps} />;
      case 'gps-verification':
        return <BanqueGPSVerification {...commonProps} />;
      case 'services-digitaux':
        return <BanqueServicesDigitaux {...commonProps} />;
      case 'credit-management':
        return <BanqueCreditManagement {...commonProps} />;
      case 'risk-assessment':
        return <BanqueRiskAssessment {...commonProps} />;
      case 'portfolio-management':
        return <BanquePortfolioManagement {...commonProps} />;
      case 'compliance-reporting':
        return <BanqueComplianceReporting {...commonProps} />;
      case 'messages':
        return <BanqueMessages {...commonProps} />;
      case 'analytics':
        return <BanqueAnalytics {...commonProps} />;
      case 'ai':
        return <BanqueAI {...commonProps} />;
      case 'blockchain':
        return <BanqueBlockchain {...commonProps} />;
      case 'settings':
        return <BanqueSettings {...commonProps} profile={profile} />;
      default:
        return <BanqueOverview {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
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
          shadow-xl border-r border-blue-200/50 z-30 flex flex-col
          ${mobileMenuOpen ? 'block' : 'hidden lg:flex'}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-blue-200/30">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3"
              >
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
                  <Banknote className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Dashboard Banque</h2>
                  <p className="text-xs text-gray-600">Gestion Bancaire</p>
                </div>
              </motion.div>
            )}
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex text-gray-600 hover:text-blue-600"
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
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className={`
                h-5 w-5 flex-shrink-0
                ${activeTab === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}
              `} />
              
              {!sidebarCollapsed && (
                <>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{tab.label}</div>
                    <div className={`
                      text-xs opacity-75
                      ${activeTab === tab.id ? 'text-blue-100' : 'text-gray-500'}
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
            className="p-4 border-t border-blue-200/30"
          >
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-10 w-10 border-2 border-blue-200">
                <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'B'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name || 'Banquier'}
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
            className="p-2 border-t border-blue-200/30"
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
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-200/30 sticky top-0 z-20">
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
                      5
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80">
                  <DropdownMenuLabel>Messages récents</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600">BC</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Banque Centrale</p>
                        <p className="text-sm text-gray-600">Nouveau taux directeur</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-green-100 text-green-600">CI</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Client Investisseur</p>
                        <p className="text-sm text-gray-600">Demande crédit 50M CFA</p>
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
                      {dashboardStats.pendingCreditApplications}
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
                        <p className="font-medium">Demande crédit urgente</p>
                        <p className="text-sm text-gray-600">Crédit immobilier 75M CFA - Validation requise</p>
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
                        <p className="text-sm text-gray-600">18 dossiers de crédit traités cette semaine</p>
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
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'B'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.full_name || 'Directeur Banque'}
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
                    className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"
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

export default CompleteSidebarBanqueDashboard;
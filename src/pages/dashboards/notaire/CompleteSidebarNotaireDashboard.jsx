import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  // Navigation Icons
  Home,
  Scale,
  FileText,
  Users,
  Archive,
  Gavel,
  Settings,
  Bell,
  LogOut,
  User,
  Menu,
  
  // Content Icons
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
  
  // Notarial Icons
  Stamp,
  PenTool,
  BookOpen,
  Building2,
  Shield,
  Award,
  
  // New Features Icons
  HeadphonesIcon,
  CreditCard,
  HelpCircle,
  Video,
  GraduationCap,
  Store,
  Map,
  TrendingUp,
  
  // UI Icons
  X,
  ChevronDown,
  Plus,
  Edit,
  Eye,
  Trash2
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { createClient } from '@supabase/supabase-js';
import NotaireSupabaseService from '@/services/NotaireSupabaseService';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CompleteSidebarNotaireDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  // Extraire l'onglet actif depuis l'URL
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    // Routes directes /notaire/*
    if (path.includes('/notaire/crm') || path.includes('/solutions/notaires/dashboard/crm')) return 'crm';
    if (path.includes('/notaire/communication') || path.includes('/solutions/notaires/dashboard/communication')) return 'communication';
    if (path.includes('/notaire/transactions') || path.includes('/solutions/notaires/dashboard/transactions')) return 'transactions';
    if (path.includes('/notaire/authentication') || path.includes('/solutions/notaires/dashboard/authentication')) return 'authentication';
    if (path.includes('/notaire/cases') || path.includes('/solutions/notaires/dashboard/cases')) return 'cases';
    if (path.includes('/notaire/archives') || path.includes('/solutions/notaires/dashboard/archives')) return 'archives';
    if (path.includes('/notaire/compliance') || path.includes('/solutions/notaires/dashboard/compliance')) return 'compliance';
    if (path.includes('/notaire/analytics') || path.includes('/solutions/notaires/dashboard/analytics')) return 'analytics';
    if (path.includes('/notaire/ai') || path.includes('/solutions/notaires/dashboard/ai')) return 'ai';
    if (path.includes('/notaire/blockchain') || path.includes('/solutions/notaires/dashboard/blockchain')) return 'blockchain';
    if (path.includes('/notaire/settings') || path.includes('/solutions/notaires/dashboard/settings')) return 'settings';
    return 'overview';
  };

  const activeTab = getActiveTabFromPath();

  // Stats du dashboard notaire - chargées depuis Supabase
  const [dashboardStats, setDashboardStats] = useState({
    totalCases: 0,
    activeCases: 0,
    monthlyRevenue: 0,
    documentsAuthenticated: 0,
    complianceScore: 0,
    clientSatisfaction: 0,
    totalClients: 0,
    unreadCommunications: 0,
    pendingTickets: 0
  });

  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Chargement des stats réelles
  useEffect(() => {
    const loadDashboardStats = async () => {
      if (!user) return;
      
      setIsLoadingStats(true);
      try {
        const result = await NotaireSupabaseService.getDashboardStats(user.id);
        if (result.success) {
          setDashboardStats(result.data);
        }
      } catch (error) {
        console.error('Erreur chargement stats sidebar:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadDashboardStats();
  }, [user]);

  // Chargement du profil utilisateur
  useEffect(() => {
    // Temporairement désactivé pour éviter la récursion infinie des politiques RLS
    // const fetchProfile = async () => {
    //   if (!user) return;
    //   
    //   try {
    //     const { data, error } = await supabase
    //       .from('profiles')
    //       .select('*')
    //       .eq('id', user.id)
    //       .single();
    //     
    //     if (error) throw error;
    //     setProfile(data);
    //   } catch (error) {
    //     console.error('Erreur lors du chargement du profil:', error);
    //   }
    // };

    // fetchProfile();
    
    // Utilisation d'un profil par défaut
    if (user) {
      setProfile({
        id: user.id,
        email: user.email,
        role: 'notaire',
        first_name: 'Maître',
        last_name: 'Notaire'
      });
    }
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

  // Configuration des onglets du sidebar avec routes
  const sidebarTabs = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: Home,
      description: 'Tableau de bord principal',
      route: '/notaire'
    },
    {
      id: 'crm',
      label: 'CRM Clients & Banques',
      icon: Users,
      description: 'Gestion relation clients et partenaires bancaires',
      badge: dashboardStats.totalClients > 0 ? dashboardStats.totalClients.toString() : null,
      route: '/notaire/crm'
    },
    {
      id: 'communication',
      label: 'Communication Tripartite',
      icon: MessageSquare,
      description: 'Interface Notaire-Banque-Client',
      badge: dashboardStats.unreadCommunications > 0 ? dashboardStats.unreadCommunications.toString() : null,
      route: '/notaire/communication'
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: FileText,
      description: 'Gestion des actes et transactions',
      badge: dashboardStats.activeCases > 0 ? dashboardStats.activeCases.toString() : null,
      route: '/notaire/transactions'
    },
    {
      id: 'authentication',
      label: 'Authentification',
      icon: Stamp,
      description: 'Authentification de documents',
      route: '/notaire/authentication'
    },
    {
      id: 'cases',
      label: 'Dossiers',
      icon: BookOpen,
      description: 'Gestion des dossiers clients',
      route: '/notaire/cases'
    },
    {
      id: 'archives',
      label: 'Archives',
      icon: Archive,
      description: 'Archives notariales numériques',
      route: '/notaire/archives'
    },
    {
      id: 'compliance',
      label: 'Conformité',
      icon: Shield,
      description: 'Respect réglementaire notarial',
      route: '/notaire/compliance'
    },
    {
      id: 'analytics',
      label: 'Analyses & Rapports',
      icon: Activity,
      description: 'Statistiques et analyses',
      route: '/notaire/analytics'
    },
    {
      id: 'ai',
      label: 'Assistant IA',
      icon: PenTool,
      description: 'Intelligence artificielle notariale',
      route: '/notaire/ai'
    },
    {
      id: 'blockchain',
      label: 'Blockchain Notariale',
      icon: Scale,
      description: 'Gestion blockchain des actes',
      route: '/notaire/blockchain'
    },
    {
      id: 'support',
      label: 'Support & Tickets',
      icon: HeadphonesIcon,
      description: 'Centre de support technique',
      badge: dashboardStats.pendingTickets > 0 ? dashboardStats.pendingTickets.toString() : null,
      route: '/notaire/support'
    },
    {
      id: 'subscriptions',
      label: 'Abonnements',
      icon: CreditCard,
      description: 'Gestion des abonnements',
      route: '/notaire/subscriptions'
    },
    {
      id: 'help',
      label: 'Centre d\'Aide',
      icon: HelpCircle,
      description: 'Documentation et FAQ',
      route: '/notaire/help'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Centre de notifications',
      route: '/notaire/notifications'
    },
    {
      id: 'visio',
      label: 'Visioconférence',
      icon: Video,
      description: 'Réunions virtuelles',
      route: '/notaire/visio'
    },
    {
      id: 'elearning',
      label: 'Formation en ligne',
      icon: GraduationCap,
      description: 'Plateforme e-learning',
      route: '/notaire/elearning'
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: Store,
      description: 'Modèles et plugins',
      route: '/notaire/marketplace'
    },
    {
      id: 'cadastre',
      label: 'API Cadastre',
      icon: Map,
      description: 'Recherche cadastrale',
      route: '/notaire/cadastre'
    },
    {
      id: 'financial',
      label: 'Tableau Financier',
      icon: TrendingUp,
      description: 'Analyses financières avancées',
      route: '/notaire/financial'
    },
    {
      id: 'multi-office',
      label: 'Multi-Offices',
      icon: Building2,
      description: 'Gestion multi-bureaux',
      route: '/notaire/multi-office'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration du compte',
      route: '/notaire/settings'
    }
  ];

  // Fonction pour naviguer vers une page
  const handleNavigateToTab = (tab) => {
    navigate(tab.route);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: sidebarCollapsed ? '80px' : '320px'
        }}
        className={`
          fixed lg:relative h-full bg-white/80 backdrop-blur-md shadow-xl border-r border-amber-200/50 z-40
          flex flex-col
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
        `}
      >
        {/* Header Sidebar */}
        <div className="p-6 border-b border-amber-200/30">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center">
                  <Scale className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-gray-900">Dashboard Notaire</h1>
                  <p className="text-xs text-gray-600">Teranga Foncier</p>
                </div>
              </motion.div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-600 hover:text-gray-900"
            >
              {sidebarCollapsed ? <ChevronDown className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {sidebarTabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => handleNavigateToTab(tab)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 mx-2 rounded-xl 
                transition-all duration-200 group relative
                ${activeTab === tab.id 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className={`
                h-5 w-5 flex-shrink-0
                ${activeTab === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-amber-600'}
              `} />
              
              {!sidebarCollapsed && (
                <>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{tab.label}</div>
                    <div className={`
                      text-xs opacity-75
                      ${activeTab === tab.id ? 'text-amber-100' : 'text-gray-500'}
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
            className="p-4 border-t border-amber-200/30"
          >
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-10 w-10 border-2 border-amber-200">
                <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                <AvatarFallback className="bg-amber-100 text-amber-700">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'N'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name || 'Notaire'}
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
            className="p-2 border-t border-amber-200/30"
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
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-amber-200/30 sticky top-0 z-20">
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
                className="text-gray-600 hover:text-amber-600 hover:bg-amber-50 relative"
                onClick={() => navigate('/notaire/communication')}
              >
                <MessageSquare className="h-5 w-5" />
                {!isLoadingStats && dashboardStats.unreadCommunications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {dashboardStats.unreadCommunications}
                  </span>
                )}
              </Button>

              {/* Notifications Button - Tickets en attente */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-amber-600 hover:bg-amber-50 relative"
                onClick={() => navigate('/notaire/settings')}
                title="Paramètres & Support"
              >
                <Bell className="h-5 w-5" />
                {!isLoadingStats && dashboardStats.pendingTickets > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {dashboardStats.pendingTickets}
                  </span>
                )}
              </Button>

              {/* User Profile Dropdown */}
              <div className="flex items-center space-x-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg px-3 py-2 border border-amber-200/50">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {profile?.first_name?.charAt(0) || user?.email?.charAt(0) || 'N'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-xs text-gray-600">Notaire</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area avec Outlet */}
        <main className="flex-1 overflow-auto p-6">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
          }>
            <Outlet context={{ dashboardStats }} />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default CompleteSidebarNotaireDashboard;
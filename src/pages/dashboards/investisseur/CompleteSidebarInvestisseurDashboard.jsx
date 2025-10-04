import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Target,
  Calculator,
  Brain,
  Blocks,
  FileText,
  Settings,
  Search,
  Bell,
  User,
  Menu,
  X,
  Mail,
  Briefcase,
  BarChart3,
  Eye,
  Building2,
  Lightbulb,
  LogOut,
  UserCog,
  CreditCard,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/UnifiedAuthContext';

// Lazy loading des composants
const InvestisseurOverview = React.lazy(() => import('./InvestisseurOverview'));
const InvestisseurPortfolio = React.lazy(() => import('./InvestisseurPortfolio'));
const InvestisseurOpportunites = React.lazy(() => import('./InvestisseurOpportunites'));
const InvestisseurCalculateurs = React.lazy(() => import('./InvestisseurCalculateurs'));
const InvestisseurAI = React.lazy(() => import('./InvestisseurAI'));
const InvestisseurBlockchain = React.lazy(() => import('./InvestisseurBlockchain'));
const InvestisseurAnalytics = React.lazy(() => import('./InvestisseurAnalytics'));
const InvestisseurMessages = React.lazy(() => import('./InvestisseurMessages'));
const InvestisseurNotifications = React.lazy(() => import('./InvestisseurNotifications'));
const InvestisseurSettings = React.lazy(() => import('./InvestisseurSettings'));

const CompleteSidebarInvestisseurDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const profileDropdownRef = useRef(null);

  const [dashboardStats, setDashboardStats] = useState({
    portfolioValue: 850000000,
    activeInvestments: 12,
    monthlyReturn: 8.5,
    opportunities: 28,
    totalProfit: 125000000,
    notifications: 7
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Fermer le dropdown profil quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const menuItems = [
    {
      id: 'overview',
      name: 'Vue d\'ensemble',
      icon: BarChart3,
      path: '/investisseur',
      description: 'Tableau de bord principal'
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      icon: Briefcase,
      path: '/investisseur/portfolio',
      description: 'Gestion des investissements'
    },
    {
      id: 'opportunities',
      name: 'Opportunités',
      icon: Target,
      path: '/investisseur/opportunites',
      description: 'Nouvelles opportunités'
    },
    {
      id: 'calculators',
      name: 'Calculateurs',
      icon: Calculator,
      path: '/investisseur/calculateurs',
      description: 'Outils de calcul ROI'
    },
    {
      id: 'ai-assistant',
      name: 'Assistant IA',
      icon: Brain,
      path: '/investisseur/ia',
      description: 'Intelligence Artificielle'
    },
    {
      id: 'blockchain',
      name: 'Blockchain',
      icon: Blocks,
      path: '/investisseur/blockchain',
      description: 'Technologie blockchain'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: PieChart,
      path: '/investisseur/analytics',
      description: 'Analyse des performances'
    },
    {
      id: 'messages',
      name: 'Messages',
      icon: Mail,
      path: '/investisseur/messages',
      description: 'Messagerie sécurisée'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      path: '/investisseur/notifications',
      description: 'Alertes et notifications'
    },
    {
      id: 'settings',
      name: 'Paramètres',
      icon: Settings,
      path: '/investisseur/parametres',
      description: 'Configuration du compte'
    }
  ];

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/investisseur') return 'overview';
    if (path.includes('/portfolio')) return 'portfolio';
    if (path.includes('/opportunites')) return 'opportunities';
    if (path.includes('/calculateurs')) return 'calculators';
    if (path.includes('/ia')) return 'ai-assistant';
    if (path.includes('/blockchain')) return 'blockchain';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/messages')) return 'messages';
    if (path.includes('/notifications')) return 'notifications';
    if (path.includes('/parametres')) return 'settings';
    return 'overview';
  };

  const formatCurrency = (amount) => {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre espace investisseur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b bg-gradient-to-r from-blue-600 to-cyan-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm">Investisseur</h1>
              <p className="text-blue-100 text-xs">Dashboard Pro</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats rapides */}
        <div className="p-4 border-b">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-blue-50 p-2 rounded-lg">
              <p className="text-xs text-blue-600">Portfolio</p>
              <p className="font-bold text-sm text-blue-800">
                {(dashboardStats.portfolioValue / 1000000).toFixed(0)}M XOF
              </p>
            </div>
            <div className="bg-green-50 p-2 rounded-lg">
              <p className="text-xs text-green-600">ROI Mensuel</p>
              <p className="font-bold text-sm text-green-800">
                +{dashboardStats.monthlyReturn}%
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = getCurrentPage() === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all
                  ${isActive 
                    ? 'bg-blue-100 text-blue-900 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {item.description}
                  </p>
                </div>
                {item.id === 'overview' && dashboardStats.notifications > 0 && (
                  <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                    {dashboardStats.notifications}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* User info */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.fullName || 'Investisseur Pro'}
              </p>
              <p className="text-xs text-gray-500">Premium Member</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header principal */}
        <header className="bg-white shadow-sm border-b px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Menu mobile uniquement */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden lg:block">
                <h1 className="text-xl font-bold text-gray-900">Dashboard Investisseur</h1>
                <p className="text-sm text-gray-600">Gestion de portefeuille & Analytics</p>
              </div>
              <div className="lg:hidden">
                <h1 className="font-semibold text-gray-900">Dashboard Investisseur</h1>
              </div>
            </div>
            
            {/* Actions header */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <p className="font-bold text-blue-600">{(dashboardStats.portfolioValue / 1000000).toFixed(0)}M</p>
                  <p className="text-gray-500">Portfolio</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-green-600">+{dashboardStats.monthlyReturn}%</p>
                  <p className="text-gray-500">ROI</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => console.log('Recherche ouverte')}
                title="Rechercher"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/investisseur/messages')}
                title="Messages"
              >
                <Mail className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={() => navigate('/investisseur/notifications')}
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                {dashboardStats.notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {dashboardStats.notifications}
                  </Badge>
                )}
              </Button>
              {/* Dropdown profil */}
              <div className="relative" ref={profileDropdownRef}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-1"
                  title="Menu profil"
                >
                  <User className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
                
                {/* Menu déroulant */}
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                  >
                    {/* Info utilisateur */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user?.fullName || 'Investisseur Pro'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user?.email || 'investisseur@teranga.com'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('parametres');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Paramètres du compte
                      </button>
                      
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <UserCog className="h-4 w-4 mr-3" />
                        Modifier le profil
                      </button>
                      
                      <button
                        onClick={() => {
                          navigate('parametres');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <CreditCard className="h-4 w-4 mr-3" />
                        Facturation
                      </button>
                      
                      <button
                        onClick={() => {
                          navigate('/support');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <HelpCircle className="h-4 w-4 mr-3" />
                        Aide et support
                      </button>
                    </div>

                    {/* Séparateur et déconnexion */}
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={() => {
                          handleLogout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Se déconnecter
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Contenu des pages */}
        <main className="flex-1 bg-gray-50">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<InvestisseurOverview />} />
              <Route path="/portfolio" element={<InvestisseurPortfolio />} />
              <Route path="/opportunites" element={<InvestisseurOpportunites />} />
              <Route path="/calculateurs" element={<InvestisseurCalculateurs />} />
              <Route path="/ia" element={<InvestisseurAI />} />
              <Route path="/blockchain" element={<InvestisseurBlockchain />} />
              <Route path="/analytics" element={<InvestisseurAnalytics />} />
              <Route path="/messages" element={<InvestisseurMessages />} />
              <Route path="/notifications" element={<InvestisseurNotifications />} />
              <Route path="/parametres" element={<InvestisseurSettings />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default CompleteSidebarInvestisseurDashboard;
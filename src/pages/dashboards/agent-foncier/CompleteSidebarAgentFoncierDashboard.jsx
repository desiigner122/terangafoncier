import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin,
  FileText,
  Search,
  Users,
  Calculator,
  Brain,
  Blocks,
  Settings,
  Bell,
  User,
  Menu,
  X,
  Mail,
  BarChart3,
  Eye,
  Building2,
  Lightbulb,
  LogOut,
  UserCog,
  CreditCard,
  HelpCircle,
  ChevronDown,
  Map,
  Ruler,
  Camera,
  Shield,
  BookOpen,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';

// Lazy loading des composants
const AgentFoncierOverview = React.lazy(() => import('./AgentFoncierOverview'));
const AgentFoncierTerrains = React.lazy(() => import('./AgentFoncierTerrains'));
const AgentFoncierCadastral = React.lazy(() => import('./AgentFoncierCadastral'));
const AgentFoncierClients = React.lazy(() => import('./AgentFoncierClients'));
const AgentFoncierDocuments = React.lazy(() => import('./AgentFoncierDocuments'));
const AgentFoncierCalculateurs = React.lazy(() => import('./AgentFoncierCalculateurs'));
const AgentFoncierAI = React.lazy(() => import('./AgentFoncierAI'));
const AgentFoncierBlockchain = React.lazy(() => import('./AgentFoncierBlockchain'));
const AgentFoncierAnalytics = React.lazy(() => import('./AgentFoncierAnalytics'));
const AgentFoncierMessages = React.lazy(() => import('./AgentFoncierMessages'));
const AgentFoncierNotifications = React.lazy(() => import('./AgentFoncierNotifications'));
const AgentFoncierSettings = React.lazy(() => import('./AgentFoncierSettings'));

const CompleteSidebarAgentFoncierDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const profileDropdownRef = useRef(null);

  const [dashboardStats, setDashboardStats] = useState({
    totalTerrains: 1250,
    activeClients: 89,
    documentsTraites: 342,
    evaluationsEnCours: 23,
    revenus: 45000000,
    notifications: 12
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
      path: '/agent-foncier',
      description: 'Tableau de bord principal'
    },
    {
      id: 'terrains',
      name: 'Gestion Terrains',
      icon: Map,
      path: '/agent-foncier/terrains',
      description: 'Inventaire foncier'
    },
    {
      id: 'cadastral',
      name: 'Cadastral',
      icon: Ruler,
      path: '/agent-foncier/cadastral',
      description: 'Plans et mesures'
    },
    {
      id: 'clients',
      name: 'Clients',
      icon: Users,
      path: '/agent-foncier/clients',
      description: 'Gestion clientèle'
    },
    {
      id: 'documents',
      name: 'Documents',
      icon: FileText,
      path: '/agent-foncier/documents',
      description: 'Titres et actes'
    },
    {
      id: 'calculateurs',
      name: 'Calculateurs',
      icon: Calculator,
      path: '/agent-foncier/calculateurs',
      description: 'Outils d\'évaluation'
    },
    {
      id: 'ia',
      name: 'IA Foncière',
      icon: Brain,
      path: '/agent-foncier/ia',
      description: 'Intelligence artificielle'
    },
    {
      id: 'blockchain',
      name: 'Blockchain',
      icon: Blocks,
      path: '/agent-foncier/blockchain',
      description: 'Technologie blockchain'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      path: '/agent-foncier/analytics',
      description: 'Analyse des performances'
    },
    {
      id: 'messages',
      name: 'Messages',
      icon: Mail,
      path: '/agent-foncier/messages',
      description: 'Messagerie sécurisée'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      path: '/agent-foncier/notifications',
      description: 'Alertes et notifications'
    },
    {
      id: 'settings',
      name: 'Paramètres',
      icon: Settings,
      path: '/agent-foncier/parametres',
      description: 'Configuration du compte'
    }
  ];

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/agent-foncier') return 'overview';
    const segments = path.split('/');
    return segments[segments.length - 1];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard Agent Foncier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header sidebar */}
        <div className="flex items-center justify-between h-16 px-6 border-b bg-gradient-to-r from-green-600 to-green-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Agent Foncier</h1>
              <p className="text-green-100 text-xs">Blockchain & IA</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-green-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Stats rapides */}
        <div className="p-4 border-b bg-green-50">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-green-100 p-2 rounded-lg">
              <p className="text-xs text-green-600">Terrains</p>
              <p className="font-bold text-sm text-green-800">
                {dashboardStats.totalTerrains.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg">
              <p className="text-xs text-blue-600">Clients</p>
              <p className="font-bold text-sm text-blue-800">
                {dashboardStats.activeClients}
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
                    ? 'bg-green-100 text-green-900 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isActive ? 'text-green-900' : 'text-gray-900'}`}>
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
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.fullName || 'Agent Foncier Pro'}
              </p>
              <p className="text-xs text-gray-500">Professionnel Certifié</p>
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
                <h1 className="text-xl font-bold text-gray-900">Dashboard Agent Foncier</h1>
                <p className="text-sm text-gray-600">Gestion foncière & Analytics</p>
              </div>
              <div className="lg:hidden">
                <h1 className="font-semibold text-gray-900">Dashboard Agent Foncier</h1>
              </div>
            </div>
            
            {/* Actions header */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <p className="font-bold text-green-600">{dashboardStats.totalTerrains}</p>
                  <p className="text-gray-500">Terrains</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-blue-600">{dashboardStats.activeClients}</p>
                  <p className="text-gray-500">Clients</p>
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
                onClick={() => navigate('/agent-foncier/messages')}
                title="Messages"
              >
                <Mail className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={() => navigate('/agent-foncier/notifications')}
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
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user?.fullName || 'Agent Foncier Pro'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user?.email || 'agent@teranga.com'}
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<AgentFoncierOverview />} />
              <Route path="/terrains" element={<AgentFoncierTerrains />} />
              <Route path="/cadastral" element={<AgentFoncierCadastral />} />
              <Route path="/clients" element={<AgentFoncierClients />} />
              <Route path="/documents" element={<AgentFoncierDocuments />} />
              <Route path="/calculateurs" element={<AgentFoncierCalculateurs />} />
              <Route path="/ia" element={<AgentFoncierAI />} />
              <Route path="/blockchain" element={<AgentFoncierBlockchain />} />
              <Route path="/analytics" element={<AgentFoncierAnalytics />} />
              <Route path="/messages" element={<AgentFoncierMessages />} />
              <Route path="/notifications" element={<AgentFoncierNotifications />} />
              <Route path="/parametres" element={<AgentFoncierSettings />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default CompleteSidebarAgentFoncierDashboard;
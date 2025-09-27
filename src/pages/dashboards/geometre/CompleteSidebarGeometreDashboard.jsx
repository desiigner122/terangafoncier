import React, { useState, Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  Compass,
  Map,
  Users,
  MapPin,
  Activity,
  Settings,
  Bell,
  MessageSquare,
  Ruler,
  Calculator,
  Layers,
  Satellite,
  Navigation,
  BarChart3,
  FileText,
  Camera,
  Target,
  Grid3X3,
  TreePine,
  Building,
  Route,
  Zap,
  Database,
  Search,
  Plus,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';

// Lazy loading des composants de pages
const GeometreOverview = React.lazy(() => import('./GeometreOverview'));
const GeometreMissions = React.lazy(() => import('./GeometreMissions'));
const GeometreClients = React.lazy(() => import('./GeometreClients'));
const GeometreMesures = React.lazy(() => import('./GeometreMesures'));
const GeometrePlans = React.lazy(() => import('./GeometrePlans'));
const GeometreCadastral = React.lazy(() => import('./GeometreCadastral'));
const GeometreTopographie = React.lazy(() => import('./GeometreTopographie'));
const GeometreInstruments = React.lazy(() => import('./GeometreInstruments'));
const GeometreAnalytics = React.lazy(() => import('./GeometreAnalytics'));
const GeometreDocuments = React.lazy(() => import('./GeometreDocuments'));
const GeometreMessages = React.lazy(() => import('./GeometreMessages'));
const GeometreSettings = React.lazy(() => import('./GeometreSettings'));
const GeometreNotifications = React.lazy(() => import('./GeometreNotifications'));

const CompleteSidebarGeometreDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // Configuration des pages du dashboard
  const menuItems = [
    {
      id: 'overview',
      title: 'Vue d\'ensemble',
      icon: BarChart3,
      path: '/geometre',
      description: 'Dashboard principal et KPIs'
    },
    {
      id: 'missions',
      title: 'Missions',
      icon: Target,
      path: '/geometre/missions',
      description: 'Gestion des missions en cours',
      badge: 5
    },
    {
      id: 'clients',
      title: 'Clients',
      icon: Users,
      path: '/geometre/clients',
      description: 'Portfolio clients et prospects'
    },
    {
      id: 'mesures',
      title: 'Mesures',
      icon: Ruler,
      path: '/geometre/mesures',
      description: 'Relevés et mesures terrain'
    },
    {
      id: 'plans',
      title: 'Plans & Dessins',
      icon: Map,
      path: '/geometre/plans',
      description: 'Plans techniques et dessins'
    },
    {
      id: 'cadastral',
      title: 'Cadastral',
      icon: Grid3X3,
      path: '/geometre/cadastral',
      description: 'Travaux cadastraux et bornage'
    },
    {
      id: 'topographie',
      title: 'Topographie',
      icon: Layers,
      path: '/geometre/topographie',
      description: 'Levés topographiques'
    },
    {
      id: 'instruments',
      title: 'Instruments',
      icon: Compass,
      path: '/geometre/instruments',
      description: 'Matériel et calibrage'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: Activity,
      path: '/geometre/analytics',
      description: 'Statistiques et rapports'
    },
    {
      id: 'documents',
      title: 'Documents',
      icon: FileText,
      path: '/geometre/documents',
      description: 'Rapports et certificats'
    },
    {
      id: 'messages',
      title: 'Messages',
      icon: MessageSquare,
      path: '/geometre/messages',
      description: 'Communications clients',
      badge: 3
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      path: '/geometre/notifications',
      description: 'Alertes et notifications'
    },
    {
      id: 'settings',
      title: 'Paramètres',
      icon: Settings,
      path: '/geometre/settings',
      description: 'Configuration du compte'
    }
  ];

  const isActivePage = (path) => {
    if (path === '/geometre') {
      return location.pathname === '/geometre' || location.pathname === '/geometre/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const renderPageContent = () => {
    const path = location.pathname;
    
    if (path === '/geometre' || path === '/geometre/') {
      return <GeometreOverview />;
    } else if (path.startsWith('/geometre/missions')) {
      return <GeometreMissions />;
    } else if (path.startsWith('/geometre/clients')) {
      return <GeometreClients />;
    } else if (path.startsWith('/geometre/mesures')) {
      return <GeometreMesures />;
    } else if (path.startsWith('/geometre/plans')) {
      return <GeometrePlans />;
    } else if (path.startsWith('/geometre/cadastral')) {
      return <GeometreCadastral />;
    } else if (path.startsWith('/geometre/topographie')) {
      return <GeometreTopographie />;
    } else if (path.startsWith('/geometre/instruments')) {
      return <GeometreInstruments />;
    } else if (path.startsWith('/geometre/analytics')) {
      return <GeometreAnalytics />;
    } else if (path.startsWith('/geometre/documents')) {
      return <GeometreDocuments />;
    } else if (path.startsWith('/geometre/messages')) {
      return <GeometreMessages />;
    } else if (path.startsWith('/geometre/notifications')) {
      return <GeometreNotifications />;
    } else if (path.startsWith('/geometre/settings')) {
      return <GeometreSettings />;
    }
    
    return <GeometreOverview />;
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Sidebar Desktop */}
      <motion.div
        initial={false}
        animate={{
          width: sidebarCollapsed ? 80 : 280,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex flex-col bg-white border-r border-gray-200 shadow-sm relative z-20"
      >
        {/* Header Sidebar */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-xl">
                  <Compass className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Géomètre Pro
                  </h1>
                  <p className="text-xs text-gray-600 font-medium">Dashboard professionnel • Sénégal</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hover:bg-white/50 hover:shadow-sm rounded-lg"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-white shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {profile?.full_name?.charAt(0) || 'G'}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {profile?.full_name || 'Géomètre Expert'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {profile?.email || user?.email}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs px-2 py-0">
                    Pro
                  </Badge>
                  <Badge variant="outline" className="text-xs px-2 py-0 text-green-600 border-green-200">
                    En ligne
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePage(item.path);
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'}`} />
                  {!sidebarCollapsed && (
                    <>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold truncate ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
                            {item.title}
                          </span>
                          {item.badge && (
                            <Badge 
                              variant={isActive ? "secondary" : "outline"} 
                              className={`ml-2 px-2 py-0.5 text-xs ${
                                isActive ? 'bg-white/20 text-white border-white/30' : 'bg-blue-50 text-blue-600 border-blue-200'
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-600'}`}>
                          {item.description}
                        </p>
                      </div>
                    </>
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Footer Actions */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200 bg-gradient-to-t from-gray-50 to-transparent">
            <div className="space-y-3">
              <Button 
                size="sm" 
                className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                onClick={() => handleNavigation('/geometre/missions')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Mission
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start border-blue-200 text-blue-600 hover:bg-blue-50"
                onClick={() => handleNavigation('/geometre/analytics')}
              >
                <Activity className="h-4 w-4 mr-2" />
                Voir les Stats
              </Button>
              
              {/* Mini stats */}
              <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Missions</p>
                    <p className="text-sm font-bold text-blue-600">12</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Clients</p>
                    <p className="text-sm font-bold text-green-600">8</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden overflow-y-auto"
            >
              {/* Mobile Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-xl">
                        <Compass className="h-6 w-6 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Géomètre Pro
                      </h1>
                      <p className="text-xs text-gray-600 font-medium">Dashboard mobile • Sénégal</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:bg-white/50 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="py-4">
                <div className="space-y-1 px-4">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActivePage(item.path);
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.path)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 hover:shadow-sm'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`font-semibold ${isActive ? 'text-white' : 'text-gray-700'}`}>
                              {item.title}
                            </span>
                            {item.badge && (
                              <Badge 
                                variant={isActive ? "secondary" : "outline"} 
                                className={`text-xs ${
                                  isActive ? 'bg-white/20 text-white border-white/30' : 'bg-blue-50 text-blue-600 border-blue-200'
                                }`}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className={`text-xs mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 lg:px-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:bg-blue-50"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-4">
                <div className="hidden lg:block w-1 h-12 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                <div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                      <Compass className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                          {menuItems.find(item => isActivePage(item.path))?.title || 'Dashboard Géomètre'}
                        </h1>
                        {menuItems.find(item => isActivePage(item.path))?.badge && (
                          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm animate-pulse">
                            {menuItems.find(item => isActivePage(item.path))?.badge}
                          </Badge>
                        )}
                        <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs px-2 py-1">
                          PRO EXPERT
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mt-1 font-medium leading-relaxed">
                        {menuItems.find(item => isActivePage(item.path))?.description || 'Plateforme professionnelle de géométrie avancée'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 p-3 bg-gradient-to-r from-blue-50 via-purple-50 to-emerald-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse shadow-sm"></div>
                      <span className="text-xs font-semibold text-emerald-700">Système opérationnel</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3 text-blue-600" />
                      <span className="text-xs text-blue-700 font-medium">
                        Sync: {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-purple-600" />
                      <span className="text-xs text-purple-700 font-semibold">
                        Dashboard Pro v2.1 ✓
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Recherche rapide */}
              <div className="hidden lg:block relative group">
                <Search className="h-4 w-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                <Input
                  placeholder="Rechercher missions, clients, projets..."
                  className="pl-12 pr-4 w-80 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded group-focus-within:bg-blue-50 group-focus-within:text-blue-600 group-focus-within:border-blue-300 transition-colors duration-200">
                    ⌘K
                  </kbd>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleNavigation('/geometre/messages')}
                    className="relative hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs font-bold">3</span>
                    </span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleNavigation('/geometre/notifications')}
                    className="relative hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-all duration-200"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs font-bold">7</span>
                    </span>
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleNavigation('/geometre/analytics')}
                    className="hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-all duration-200"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>

                <Button 
                  size="sm"
                  onClick={() => handleNavigation('/geometre/missions')}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-700 hover:via-purple-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Nouvelle Mission</span>
                  <span className="md:hidden">Nouveau</span>
                </Button>
              </div>

              {/* Profile dropdown */}
              <div className="hidden md:flex items-center gap-3 bg-gradient-to-r from-slate-50 via-blue-50 to-purple-50 rounded-2xl px-4 py-3 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="relative group">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-3 ring-white shadow-lg group-hover:scale-105 transition-transform duration-200">
                    <span className="text-white font-bold text-sm">
                      {profile?.full_name?.charAt(0) || 'G'}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-gray-900 truncate">
                    {profile?.full_name || 'Géomètre Expert'}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-0.5">
                      EXPERT PRO
                    </Badge>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-emerald-600 font-medium">Actif</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleNavigation('/geometre/settings')}
                    className="hover:bg-white/70 p-2 rounded-xl transition-all duration-200"
                  >
                    <Settings className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            }
          >
            {renderPageContent()}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default CompleteSidebarGeometreDashboard;
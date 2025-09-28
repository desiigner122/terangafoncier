import React, { useState, Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  Home,
  Heart,
  FileText,
  MapPin,
  Building2,
  TrendingUp,
  Bell,
  MessageSquare,
  Settings,
  Calendar,
  Eye,
  Search,
  Plus,
  Menu,
  X,
  User,
  DollarSign,
  Shield,
  Activity,
  Zap,
  Database,
  Bot,
  Sparkles,
  Coins,
  Lock,
  Link as BlockchainIcon,
  Brain,
  Target,
  Users,
  Star,
  Filter,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';

// Lazy loading des composants de pages
const ParticulierOverview = React.lazy(() => import('./ParticulierOverview'));
const ParticulierProprietes = React.lazy(() => import('./ParticulierProprietes'));
const ParticulierFavoris = React.lazy(() => import('./ParticulierFavoris'));
const ParticulierMessages = React.lazy(() => import('./ParticulierMessages'));
const ParticulierNotifications = React.lazy(() => import('./ParticulierNotifications'));
const ParticulierCalendar = React.lazy(() => import('./ParticulierCalendar'));
const ParticulierDocuments = React.lazy(() => import('./ParticulierDocuments'));
const ParticulierAI = React.lazy(() => import('./ParticulierAI'));
const ParticulierBlockchain = React.lazy(() => import('./ParticulierBlockchain'));
const ParticulierSettings = React.lazy(() => import('./ParticulierSettings'));
const ParticulierCommunal = React.lazy(() => import('./ParticulierCommunal'));
const ParticulierPromoteurs = React.lazy(() => import('./ParticulierPromoteurs'));

const CompleteSidebarParticulierDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Menu organisé par sections logiques
  const menuSections = [
    {
      title: 'TABLEAU DE BORD',
      items: [
        {
          id: 'overview',
          path: '/acheteur',
          title: 'Vue d\'ensemble',
          description: 'Tableau de bord principal et statistiques',
          icon: Home,
          component: 'overview',
          badge: null
        }
      ]
    },
    {
      title: 'GESTION FONCIÈRE',
      items: [
        {
          id: 'terrains',
          path: '/acheteur/terrains',
          title: 'Mes Terrains',
          description: 'Gestion de votre patrimoine foncier',
          icon: MapPin,
          component: 'terrains',
          badge: null
        },
        {
          id: 'favoris',
          path: '/acheteur/favoris',
          title: 'Favoris',
          description: 'Terrains et projets sauvegardés',
          icon: Heart,
          component: 'favoris',
          badge: '12'
        },
        {
          id: 'recherche',
          path: '/acheteur/recherche',
          title: 'Recherche Terrains',
          description: 'Trouvez votre terrain idéal',
          icon: Search,
          component: 'recherche',
          badge: null
        }
      ]
    },
    {
      title: 'DÉMARCHES COMMUNALES',
      items: [
        {
          id: 'demandes',
          path: '/acheteur/demandes',
          title: 'Demandes Communales',
          description: 'Vos demandes de terrains communaux',
          icon: FileText,
          component: 'demandes',
          badge: '2'
        },
        {
          id: 'candidatures',
          path: '/acheteur/candidatures',
          title: 'Mes Candidatures',
          description: 'Candidatures sur zones communales',
          icon: Target,
          component: 'candidatures',
          badge: '1'
        }
      ]
    },
    {
      title: 'PROJETS PRIVÉS',
      items: [
        {
          id: 'projets',
          path: '/acheteur/projets',
          title: 'Projets Promoteurs',
          description: 'Villas et projets des promoteurs',
          icon: Building2,
          component: 'projets',
          badge: null
        }
      ]
    },
    {
      title: 'COMMUNICATION',
      items: [
        {
          id: 'messages',
          path: '/acheteur/messages',
          title: 'Messages',
          description: 'Communications avec les professionnels',
          icon: MessageSquare,
          component: 'messages',
          badge: '5'
        },
        {
          id: 'notifications',
          path: '/acheteur/notifications',
          title: 'Notifications',
          description: 'Alertes et mises à jour importantes',
          icon: Bell,
          component: 'notifications',
          badge: '3'
        },
        {
          id: 'calendar',
          path: '/acheteur/calendar',
          title: 'Agenda',
          description: 'Rendez-vous et visites programmées',
          icon: Calendar,
          component: 'calendar',
          badge: null
        }
      ]
    },
    {
      title: 'DOCUMENTS & OUTILS',
      items: [
        {
          id: 'documents',
          path: '/acheteur/documents',
          title: 'Documents',
          description: 'Contrats, titres fonciers et justificatives',
          icon: FileText,
          component: 'documents',
          badge: null
        },
        {
          id: 'ai',
          path: '/acheteur/ai',
          title: 'Assistant IA',
          description: 'Intelligence artificielle pour le foncier',
          icon: Brain,
          component: 'ai',
          badge: 'PRO',
          gradient: 'from-purple-500 to-pink-500'
        },
        {
          id: 'blockchain',
          path: '/acheteur/blockchain',
          title: 'Blockchain',
          description: 'Certificats fonciers et transactions sécurisées',
          icon: BlockchainIcon,
          component: 'blockchain',
          badge: 'NOUVEAU',
          gradient: 'from-blue-500 to-cyan-500'
        }
      ]
    },
    {
      title: 'CONFIGURATION',
      items: [
        {
          id: 'settings',
          path: '/acheteur/settings',
          title: 'Paramètres',
          description: 'Configuration du compte et préférences',
          icon: Settings,
          component: 'settings',
          badge: null
        }
      ]
    }
  ];

  // Liste plate pour compatibilité avec les fonctions existantes
  const menuItems = menuSections.flatMap(section => section.items);

  const isActivePage = (path) => {
    if (path === '/acheteur' && location.pathname === '/acheteur') return true;
    if (path !== '/acheteur' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const renderActiveComponent = () => {
    const path = location.pathname;
    
    if (path === '/acheteur' || path === '/acheteur/overview') {
      return <ParticulierOverview />;
    } else if (path.startsWith('/acheteur/terrains')) {
      return <ParticulierProprietes />;
    } else if (path.startsWith('/acheteur/favoris')) {
      return <ParticulierFavoris />;
    } else if (path.startsWith('/acheteur/demandes')) {
      return <ParticulierCommunal />; // Nouveau composant pour demandes communales
    } else if (path.startsWith('/acheteur/candidatures')) {
      return <ParticulierCommunal />; // Même composant avec tabs différents
    } else if (path.startsWith('/acheteur/projets')) {
      return <ParticulierPromoteurs />; // Nouveau composant pour projets promoteurs
    } else if (path.startsWith('/acheteur/messages')) {
      return <ParticulierMessages />;
    } else if (path.startsWith('/acheteur/notifications')) {
      return <ParticulierNotifications />;
    } else if (path.startsWith('/acheteur/calendar')) {
      return <ParticulierCalendar />;
    } else if (path.startsWith('/acheteur/documents')) {
      return <ParticulierDocuments />;
    } else if (path.startsWith('/acheteur/ai')) {
      return <ParticulierAI />;
    } else if (path.startsWith('/acheteur/blockchain')) {
      return <ParticulierBlockchain />;
    } else if (path.startsWith('/acheteur/settings')) {
      return <ParticulierSettings />;
    }
    
    return <ParticulierOverview />;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 80 : 320 }}
        className={`
          fixed lg:relative top-0 left-0 h-full bg-white/90 backdrop-blur-xl shadow-2xl z-40
          border-r border-slate-200/50
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
        `}
      >
        {/* Header Sidebar - Version améliorée */}
        <div className="relative p-6 border-b border-slate-200/30 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/30">
          {/* Motif de fond décoratif */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-2 right-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-2 left-4 w-24 h-24 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full blur-2xl"></div>
          </div>

          <div className="relative flex items-center justify-between">
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center space-x-4"
                >
                  <div className="relative group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                      <Home className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
                    
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        TerangaFoncier
                      </h1>
                      <Badge className="text-xs bg-gradient-to-r from-emerald-500 to-green-600 text-white px-2 py-1 shadow-sm">
                        PRO
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">Dashboard Particulier Intelligent</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        <span className="text-xs text-purple-600 font-medium">IA</span>
                      </div>
                      <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                      <div className="flex items-center gap-1">
                        <BlockchainIcon className="w-3 h-3 text-blue-500" />
                        <span className="text-xs text-blue-600 font-medium">Blockchain</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex w-9 h-9 rounded-xl hover:bg-white/60 hover:shadow-md transition-all duration-200 group"
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden w-9 h-9 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Version améliorée */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-4">
            {/* Sections organisées */}
            {menuSections.map((section, sectionIndex) => (
              <div key={section.title} className={sectionIndex > 0 ? "pt-4 border-t border-slate-200/50" : ""}>
                <h3 className={`text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ${sidebarCollapsed ? 'text-center' : 'px-3'}`}>
                  {!sidebarCollapsed && section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePage(item.path);
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        w-full flex items-center text-left transition-all duration-300 group relative overflow-hidden
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-xl' 
                          : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 text-slate-700 hover:text-slate-900 hover:shadow-md'
                        }
                        ${sidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'justify-start p-4 rounded-2xl'}
                      `}
                      whileHover={{ scale: 1.02, x: isActive ? 0 : 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Effet de brillance au survol */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 transition-all duration-500 group-hover:translate-x-full"></div>
                      
                      <div className={`
                        flex items-center justify-center transition-all duration-300 rounded-xl shadow-sm
                        ${sidebarCollapsed ? 'w-10 h-10' : 'w-10 h-10'}
                        ${isActive 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : item.gradient 
                            ? `bg-gradient-to-br ${item.gradient} text-white shadow-md` 
                            : 'bg-slate-100 group-hover:bg-white group-hover:shadow-lg'
                        }
                      `}>
                        <Icon className={`
                          transition-all duration-300
                          ${sidebarCollapsed ? 'w-5 h-5' : 'w-5 h-5'}
                          ${isActive 
                            ? 'text-white' 
                            : item.gradient 
                              ? 'text-white' 
                              : 'text-slate-600 group-hover:text-blue-600'
                          }
                        `} />
                      </div>
                      
                      {!sidebarCollapsed && (
                        <div className="ml-4 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-sm truncate leading-tight">{item.title}</p>
                              <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-white/90' : 'text-slate-500 group-hover:text-slate-600'}`}>
                                {item.description}
                              </p>
                            </div>
                            {item.badge && (
                              <Badge 
                                className={`
                                  ml-3 text-xs px-2.5 py-1 font-bold shadow-sm
                                  ${isActive 
                                    ? 'bg-white/25 text-white border border-white/30' 
                                    : item.badge === 'PRO' 
                                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                      : item.badge === 'NOUVEAU'
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg animate-pulse'
                                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                                  }
                                `}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Indicateur actif amélioré */}
                      {isActive && (
                        <>
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full shadow-lg"
                            initial={false}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                          <motion.div
                            layoutId="activeGlow"
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl"
                            initial={false}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        </>
                      )}
                      
                      {/* Tooltip pour sidebar collapsed */}
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                          {item.title}
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                      )}
                    </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        w-full flex items-center text-left transition-all duration-300 group relative overflow-hidden
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-xl' 
                          : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 text-slate-700 hover:text-slate-900 hover:shadow-md'
                        }
                        ${sidebarCollapsed ? 'justify-center p-3 rounded-2xl' : 'justify-start p-4 rounded-2xl'}
                      `}
                      whileHover={{ scale: 1.02, x: isActive ? 0 : 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 transition-all duration-500 group-hover:translate-x-full"></div>
                      
                      <div className={`
                        flex items-center justify-center transition-all duration-300 rounded-xl shadow-sm
                        ${sidebarCollapsed ? 'w-10 h-10' : 'w-10 h-10'}
                        ${isActive 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : item.gradient 
                            ? `bg-gradient-to-br ${item.gradient} text-white shadow-md` 
                            : 'bg-slate-100 group-hover:bg-white group-hover:shadow-lg'
                        }
                      `}>
                        <Icon className={`
                          transition-all duration-300
                          ${sidebarCollapsed ? 'w-5 h-5' : 'w-5 h-5'}
                          ${isActive 
                            ? 'text-white' 
                            : item.gradient 
                              ? 'text-white' 
                              : 'text-slate-600 group-hover:text-blue-600'
                          }
                        `} />
                      </div>
                      
                      {!sidebarCollapsed && (
                        <div className="ml-4 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-sm truncate leading-tight">{item.title}</p>
                              <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-white/90' : 'text-slate-500 group-hover:text-slate-600'}`}>
                                {item.description}
                              </p>
                            </div>
                            {item.badge && (
                              <Badge 
                                className={`
                                  ml-3 text-xs px-2.5 py-1 font-bold shadow-sm
                                  ${isActive 
                                    ? 'bg-white/25 text-white border border-white/30' 
                                    : item.badge === 'PRO' 
                                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                      : item.badge === 'NOUVEAU'
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg animate-pulse'
                                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                                  }
                                `}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {isActive && (
                        <>
                          <motion.div
                            layoutId="activeIndicator2"
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full shadow-lg"
                            initial={false}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                          <motion.div
                            layoutId="activeGlow2"
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl"
                            initial={false}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        </>
                      )}
                      
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                          {item.title}
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* User Profile - Version améliorée */}
        <div className="p-5 border-t border-slate-200/30 bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-purple-50/20">
          <motion.div 
            className={`
              flex items-center p-4 rounded-2xl bg-gradient-to-br from-white via-blue-50/50 to-purple-50/30 
              border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer
              ${sidebarCollapsed ? 'justify-center' : 'space-x-4'}
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !sidebarCollapsed && handleNavigation('/acheteur/settings')}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center ring-3 ring-white shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <span className="text-white font-bold text-lg">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'P'}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
              
              {/* Indicateur de statut étendu */}
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full border-2 border-white shadow-md">
                <div className="w-full h-full bg-gradient-to-br from-white/30 to-transparent rounded-full"></div>
              </div>
            </div>
            
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-sm text-slate-900 truncate">
                    {profile?.full_name || user?.email?.split('@')[0] || 'Particulier Expert'}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigation('/acheteur/settings');
                    }}
                    className="w-8 h-8 rounded-xl hover:bg-white/80 hover:shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <Settings className="w-4 h-4 text-slate-600" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs px-2 py-1 font-bold shadow-sm">
                    IMMOBILIER PRO
                  </Badge>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-emerald-600 font-medium">En ligne</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-500" />
                      <span className="text-purple-600 font-medium">IA Activée</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <div className="flex items-center gap-1">
                      <BlockchainIcon className="w-3 h-3 text-blue-500" />
                      <span className="text-blue-600 font-medium">Sécurisé</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigation('/acheteur/notifications');
                      }}
                      className="w-7 h-7 rounded-lg hover:shadow-md transition-all duration-200 relative"
                    >
                      <Bell className="w-3.5 h-3.5 text-slate-600" />
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">3</span>
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Tooltip pour version collapsed */}
            {sidebarCollapsed && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                Profil utilisateur
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </motion.div>

          {/* Raccourcis rapides en mode étendu */}
          {!sidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 grid grid-cols-3 gap-2"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation('/acheteur/messages')}
                className="flex flex-col items-center gap-1 h-12 rounded-xl hover:bg-white/80 hover:shadow-md transition-all duration-200 relative"
              >
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-slate-600">Messages</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">5</span>
                </span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation('/acheteur/ai')}
                className="flex flex-col items-center gap-1 h-12 rounded-xl hover:bg-white/80 hover:shadow-md transition-all duration-200"
              >
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-slate-600">Assistant</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation('/acheteur/favoris')}
                className="flex flex-col items-center gap-1 h-12 rounded-xl hover:bg-white/80 hover:shadow-md transition-all duration-200"
              >
                <Heart className="w-4 h-4 text-pink-600" />
                <span className="text-xs text-slate-600">Favoris</span>
              </Button>
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Simplifié */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            {/* Menu mobile */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-2"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              {/* Titre de la page */}
              <h1 className="text-xl font-bold text-slate-900">
                {menuItems.find(item => isActivePage(item.path))?.title || 'Dashboard Foncier'}
              </h1>
            </div>

            {/* Actions et Profil */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleNavigation('/acheteur/notifications')}
                className="relative p-2"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </span>
              </Button>

              {/* Messages */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleNavigation('/acheteur/messages')}
                className="relative p-2"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">5</span>
                </span>
              </Button>

              {/* Profil avec dropdown */}
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 p-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'P'}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium">
                        {profile?.full_name || user?.email?.split('@')[0] || 'Utilisateur'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {user?.email || 'utilisateur@teranga.com'}
                      </p>
                    </div>
                    <DropdownMenuItem onClick={() => handleNavigation('/acheteur/settings')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Mon Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation('/acheteur/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Se déconnecter</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-50/50">
          <Suspense 
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600">Chargement...</p>
                </div>
              </div>
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderActiveComponent()}
              </motion.div>
            </AnimatePresence>
          </Suspense>
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

export default CompleteSidebarParticulierDashboard;
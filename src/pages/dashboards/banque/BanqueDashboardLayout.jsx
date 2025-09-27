import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  LayoutDashboard, 
  CreditCard, 
  BarChart3, 
  Bot, 
  Database, 
  Settings, 
  FileText, 
  Shield, 
  Archive,
  Bell,
  Search,
  User,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Package,
  Activity,
  GraduationCap,
  DollarSign,
  PieChart,
  Receipt,
  Users,
  TrendingUp,
  Calendar,
  Globe,
  Smartphone,
  Zap,
  Target,
  BookOpen,
  Camera,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// Import des composants de sous-pages
import BanqueOverview from './BanqueOverview';
import BanqueCreditRequests from './BanqueCreditRequests';
import BanqueAnalytics from './BanqueAnalytics';
import BanqueAI from './BanqueAI';
import BanqueBlockchain from './BanqueBlockchain';
import BanqueTools from './BanqueTools';
import BanqueSettings from './BanqueSettings';
import BanqueCompliance from './BanqueCompliance';
import BanqueArchives from './BanqueArchives';
import BanqueMessages from './BanqueMessages';
import BanqueNotifications from './BanqueNotifications';
import BanqueProduits from './BanqueProduits';
import BanquePerformances from './BanquePerformances';
import BanqueFormation from './BanqueFormation';
import BanqueClients from './BanqueClients';
import BanqueTransactions from './BanqueTransactions';
import BanqueReports from './BanqueReports';

const BanqueDashboardLayout = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications] = useState(12);

  // Navigation organisée par sections logiques
  const navigationSections = [
    {
      title: 'Tableau de Bord',
      icon: LayoutDashboard,
      items: [
        {
          id: 'overview',
          label: 'Vue d\'ensemble',
          icon: LayoutDashboard,
          component: BanqueOverview,
          badge: null
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: BarChart3,
          component: BanqueAnalytics,
          badge: null
        },
        {
          id: 'performances',
          label: 'Performances',
          icon: Activity,
          component: BanquePerformances,
          badge: null
        }
      ]
    },
    {
      title: 'Opérations',
      icon: CreditCard,
      items: [
        {
          id: 'credits',
          label: 'Crédits',
          icon: CreditCard,
          component: BanqueCreditRequests,
          badge: 23
        },
        {
          id: 'clients',
          label: 'Clients',
          icon: Users,
          component: BanqueClients,
          badge: 45
        },
        {
          id: 'transactions',
          label: 'Transactions',
          icon: DollarSign,
          component: BanqueTransactions,
          badge: 156
        },
        {
          id: 'produits',
          label: 'Produits',
          icon: Package,
          component: BanqueProduits,
          badge: null
        }
      ]
    },
    {
      title: 'Technologies',
      icon: Bot,
      items: [
        {
          id: 'blockchain',
          label: 'TerangaChain',
          icon: Database,
          component: BanqueBlockchain,
          badge: null
        },
        {
          id: 'ai',
          label: 'Assistant IA',
          icon: Bot,
          component: BanqueAI,
          badge: 'BETA'
        },
        {
          id: 'tools',
          label: 'Outils',
          icon: Wrench,
          component: BanqueTools,
          badge: 'NEW'
        }
      ]
    },
    {
      title: 'Communication',
      icon: MessageSquare,
      items: [
        {
          id: 'messages',
          label: 'Messages',
          icon: MessageSquare,
          component: BanqueMessages,
          badge: 3
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: Bell,
          component: BanqueNotifications,
          badge: 12
        }
      ]
    },
    {
      title: 'Administration',
      icon: Settings,
      items: [
        {
          id: 'compliance',
          label: 'Conformité',
          icon: Shield,
          component: BanqueCompliance,
          badge: null
        },
        {
          id: 'formation',
          label: 'Formation',
          icon: GraduationCap,
          component: BanqueFormation,
          badge: 'NEW'
        },
        {
          id: 'archives',
          label: 'Archives',
          icon: Archive,
          component: BanqueArchives,
          badge: null
        },
        {
          id: 'settings',
          label: 'Paramètres',
          icon: Settings,
          component: BanqueSettings,
          badge: null
        }
      ]
    }
  ];

  // Flatten navigationItems pour compatibilité avec le code existant
  const navigationItems = navigationSections.flatMap(section => section.items);

  const currentComponent = navigationItems.find(item => item.id === activeSection)?.component || BanqueOverview;
  const CurrentComponent = currentComponent;

  const handleLogout = () => {
    // Confirmation de déconnexion
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      // Afficher un toast de confirmation
      window.safeGlobalToast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
        variant: "success"
      });
      
      // Nettoyer toutes les données de session
      localStorage.removeItem('userToken');
      localStorage.removeItem('bankingSession');
      localStorage.removeItem('userRole');
      localStorage.removeItem('bankingData');
      sessionStorage.clear();
      
      // Rediriger vers la page d'accueil
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo et titre */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              

              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Dashboard Banque</h1>
                  <p className="text-xs text-gray-500">TerangaCredit Banking</p>
                </div>
              </div>
            </div>

            {/* Barre de recherche et actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder="Rechercher un client, dossier..." 
                    className="pl-9 w-64"
                  />
                </div>
              </div>

              {/* Messages */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={() => setActiveSection('messages')}
              >
                <MessageSquare className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 px-1 min-w-[20px] h-5 flex items-center justify-center bg-blue-500 text-white text-xs">
                  3
                </Badge>
              </Button>

              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={() => setActiveSection('notifications')}
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 px-1 min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-xs">
                    {notifications}
                  </Badge>
                )}
              </Button>

              {/* Profil utilisateur */}
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">Banque Atlantique</p>
                  <p className="text-xs text-gray-500">Responsable Crédit</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveSection('settings')}
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out`}>
          
          <div className="h-full flex flex-col">
            {/* Header du sidebar avec bouton toggle */}
            <div className="p-4 pb-2 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  {!sidebarCollapsed && <span className="font-semibold text-gray-900">Banque</span>}
                </div>
                <div className="flex items-center space-x-1">
                  {/* Bouton de collapse pour desktop */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="hidden lg:flex"
                  >
                    {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Navigation organisée par sections */}
            <nav className={`flex-1 py-4 space-y-3 overflow-y-auto ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
              {sidebarCollapsed ? (
                // Mode collapsed : affichage simple
                navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-center px-2 py-3 rounded-lg text-left transition-colors relative group ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    title={item.label}
                  >
                    <item.icon className={`h-6 w-6 ${
                      activeSection === item.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    {item.badge && (
                      <Badge 
                        variant={typeof item.badge === 'number' ? 'destructive' : 'secondary'}
                        className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
                      >
                        {typeof item.badge === 'number' && item.badge > 9 ? '9+' : item.badge}
                      </Badge>
                    )}
                    
                    {/* Tooltip pour mode collapsed */}
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                      {item.label}
                      {item.badge && <span className="ml-1">({item.badge})</span>}
                    </div>
                  </button>
                ))
              ) : (
                // Mode étendu : affichage par sections
                navigationSections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-1">
                    {/* Titre de section */}
                    <div className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <section.icon className="h-3 w-3" />
                      <span>{section.title}</span>
                    </div>
                    
                    {/* Items de la section */}
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveSection(item.id);
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors relative group ${
                            activeSection === item.id
                              ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-600'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <item.icon className={`h-5 w-5 ${
                            activeSection === item.id ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <span className="font-medium">{item.label}</span>
                          {item.badge && (
                            <Badge 
                              variant={typeof item.badge === 'number' ? 'destructive' : 'secondary'}
                              className="ml-auto text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </nav>

            {/* Footer sidebar */}
            {!sidebarCollapsed && (
              <div className="p-4 border-t border-gray-200 space-y-3">
                {/* Profil utilisateur dans sidebar */}
                <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Banque Atlantique</p>
                    <p className="text-xs text-gray-500 truncate">Responsable Crédit</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-600 flex-shrink-0"
                  >
                    <LogOut className="h-3 w-3" />
                  </Button>
                </div>

                {/* Statut Abonnement */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-3 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-3 w-3" />
                    <span className="text-xs font-medium">Plan Enterprise</span>
                  </div>
                  <p className="text-xs text-green-100 mb-2">
                    {(() => {
                      const joursRestants = Math.ceil((new Date('2025-01-01') - new Date()) / (1000 * 60 * 60 * 24));
                      return `${joursRestants} jours restants`;
                    })()}
                  </p>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="w-full text-xs h-6"
                    onClick={() => setActiveSection('settings')}
                  >
                    Gérer
                  </Button>
                </div>

                {/* TerangaChain Info */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="h-3 w-3" />
                    <span className="text-xs font-medium">TerangaChain</span>
                  </div>
                  <p className="text-xs text-blue-100 mb-2">
                    Blockchain sécurisée
                  </p>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="w-full text-xs h-6"
                    onClick={() => setActiveSection('blockchain')}
                  >
                    Accéder
                  </Button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Overlay pour mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenu principal */}
        <main className="flex-1 min-w-0">
          <div className="p-6">
            {/* Alerte d'abonnement */}
            {(() => {
              const joursRestants = Math.ceil((new Date('2025-01-01') - new Date()) / (1000 * 60 * 60 * 24));
              return joursRestants <= 30 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-full">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-orange-800">
                          Renouvellement d'Abonnement Requis
                        </h4>
                        <p className="text-sm text-orange-600">
                          Votre abonnement Enterprise expire dans {joursRestants} jours. 
                          Renouvelez maintenant pour éviter toute interruption de service.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveSection('settings')}
                        className="border-orange-200 text-orange-700 hover:bg-orange-50"
                      >
                        Gérer l'abonnement
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Renouveler maintenant
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}

            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentComponent />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BanqueDashboardLayout;
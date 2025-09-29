import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TerangaLogo from '@/components/ui/TerangaLogo';
import {
  Menu,
  X,
  Home,
  Users,
  FileText,
  MapPin,
  Calculator,
  BarChart3,
  Settings,
  Bell,
  MessageSquare,
  User,
  LogOut,
  UserCog,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Search,
  Globe,
  Blocks,
  Brain,
  Shield,
  Database,
  Network,
  Smartphone,
  Eye,
  Map,
  Building,
  AlertTriangle,
  Star,
  Zap,
  TrendingUp
} from 'lucide-react';

// Lazy loading des composants
const AgentFoncierOverview = React.lazy(() => import('./AgentFoncierOverview'));
const AgentFoncierTerrains = React.lazy(() => import('./AgentFoncierTerrains'));
const AgentFoncierClients = React.lazy(() => import('./AgentFoncierClients'));
const AgentFoncierDocuments = React.lazy(() => import('./AgentFoncierDocuments'));
const AgentFoncierCadastral = React.lazy(() => import('./AgentFoncierCadastral'));
const AgentFoncierCalculateurs = React.lazy(() => import('./AgentFoncierCalculateurs'));
const AgentFoncierAnalytics = React.lazy(() => import('./AgentFoncierAnalytics'));
const AgentFoncierNotifications = React.lazy(() => import('./AgentFoncierNotifications'));
const AgentFoncierMessages = React.lazy(() => import('./AgentFoncierMessages'));
const AgentFoncierSettings = React.lazy(() => import('./AgentFoncierSettings'));
const AgentFoncierCRM = React.lazy(() => import('./AgentFoncierCRM'));
const AgentFoncierCommunication = React.lazy(() => import('./AgentFoncierCommunication'));

const AgentFoncierServicesDigitaux = React.lazy(() => import('./AgentFoncierServicesDigitaux'));
const AgentFoncierAntiFraude = React.lazy(() => import('./AgentFoncierAntiFraude'));
const AgentFoncierGPSVerification = React.lazy(() => import('./AgentFoncierGPSVerification'));
const AgentFoncierBlockchain = React.lazy(() => import('./AgentFoncierBlockchain'));
const AgentFoncierAI = React.lazy(() => import('./AgentFoncierAI'));

const CompleteSidebarAgentFoncierDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Stats du dashboard
  const dashboardStats = {
    totalTerrains: 245,
    clientsActifs: 89,
    documentsTraites: 156,
    notifications: 12,
    messages: 8,
    communicationAlerts: 3
  };

  // Configuration des onglets de la sidebar avec descriptions détaillées
  const sidebarTabs = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: Home,
      component: AgentFoncierOverview,
      description: 'Tableau de bord principal et métriques de performance',
      subtitle: 'Aperçu global de votre activité foncière avec indicateurs clés'
    },
    {
      id: 'terrains',
      label: 'Gestion Terrains',
      icon: MapPin,
      component: AgentFoncierTerrains,
      description: 'Gestion complète du portefeuille terrain',
      subtitle: 'Suivi, évaluation et commercialisation des propriétés foncières'
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: Users,
      component: AgentFoncierClients,
      description: 'Gestion de la relation clientèle',
      subtitle: 'Suivi des prospects, acheteurs et propriétaires'
    },
    {
      id: 'crm',
      label: 'CRM Avancé',
      icon: Database,
      component: AgentFoncierCRM,
      description: 'Système CRM complet et analytics',
      subtitle: 'Gestion avancée des relations clients avec IA intégrée'
    },

    {
      id: 'communication',
      label: 'Communication',
      icon: Network,
      component: AgentFoncierCommunication,
      description: 'Hub de communication multicanal',
      subtitle: 'Messagerie intégrée, notifications et suivi des interactions',
      badge: 'NEW'
    },
    {
      id: 'services-digitaux',
      label: 'Services Digitaux',
      icon: Smartphone,
      component: AgentFoncierServicesDigitaux,
      description: 'Plateforme de services numériques',
      subtitle: 'Outils digitaux pour l\'accompagnement client et la gestion'
    },
    {
      id: 'anti-fraude',
      label: 'Anti-Fraude',
      icon: Shield,
      component: AgentFoncierAntiFraude,
      description: 'Protection et sécurité des transactions',
      subtitle: 'Système avancé de détection et prévention des fraudes'
    },
    {
      id: 'gps-verification',
      label: 'GPS Vérification',
      icon: Eye,
      component: AgentFoncierGPSVerification,
      description: 'Géolocalisation et vérification terrain',
      subtitle: 'Validation GPS en temps réel des propriétés foncières'
    },
    {
      id: 'blockchain',
      label: 'Blockchain',
      icon: Blocks,
      component: AgentFoncierBlockchain,
      description: 'Registre blockchain sécurisé',
      subtitle: 'Certification et traçabilité des transactions immobilières'
    },
    {
      id: 'ai',
      label: 'Intelligence Artificielle',
      icon: Brain,
      component: AgentFoncierAI,
      description: 'IA pour l\'optimisation foncière',
      subtitle: 'Algorithmes prédictifs et automatisation intelligente'
    },
    {
      id: 'cadastral',
      label: 'Système Cadastral',
      icon: Map,
      component: AgentFoncierCadastral,
      description: 'Interface cadastrale intégrée',
      subtitle: 'Consultation et gestion des données cadastrales officielles'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      component: AgentFoncierDocuments,
      description: 'Gestion documentaire centralisée',
      subtitle: 'Stockage, organisation et traitement des actes et contrats'
    },
    {
      id: 'calculateurs',
      label: 'Calculateurs',
      icon: Calculator,
      component: AgentFoncierCalculateurs,
      description: 'Suite d\'outils de calcul',
      subtitle: 'Calculateurs fiscaux, financiers et d\'évaluation foncière'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      component: AgentFoncierAnalytics,
      description: 'Analyses et reporting avancés',
      subtitle: 'Tableaux de bord et insights pour l\'aide à la décision'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      component: AgentFoncierNotifications,
      description: 'Centre de notifications intelligent',
      subtitle: 'Alertes, rappels et notifications personnalisées',
      badge: 'LIVE'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      component: AgentFoncierSettings,
      description: 'Configuration et préférences',
      subtitle: 'Personnalisation de l\'interface et paramètres système'
    }
  ];

  // Fonction pour rendre le composant actif
  const renderActiveComponent = () => {
    const activeTabData = sidebarTabs.find(tab => tab.id === activeTab);
    if (activeTabData && activeTabData.component) {
      const Component = activeTabData.component;
      return <Component />;
    }
    return <AgentFoncierOverview />;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: sidebarCollapsed ? 80 : 280
        }}
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 
          bg-gradient-to-b from-amber-50 via-white to-amber-50 
          border-r border-amber-200 shadow-xl lg:shadow-none
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-200">
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center"
              >
                <TerangaLogo className="h-8 w-8 text-amber-600" />
                <span className="ml-3 text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Agent Foncier
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSidebarCollapsed(!sidebarCollapsed);
              setMobileMenuOpen(false);
            }}
            className="text-amber-600 hover:bg-amber-100 lg:flex hidden"
          >
            {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(false)}
            className="text-amber-600 hover:bg-amber-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Stats rapides */}
        <div className="p-4 border-b bg-green-50">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2 rounded-lg">
              <p className="text-xs text-green-600">Terrains</p>
              <p className="font-bold text-sm text-green-800">
                {dashboardStats.totalTerrains}
              </p>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg">
              <p className="text-xs text-blue-600">Clients</p>
              <p className="font-bold text-sm text-blue-800">
                {dashboardStats.clientsActifs}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            {sidebarTabs.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-amber-100 hover:text-amber-800'
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex-1 text-left"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{item.label}</span>
                          {item.subtitle && (
                            <span className="text-xs opacity-70 mt-0.5 line-clamp-1">
                              {item.subtitle}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Badge pour vue d'ensemble avec notifications */}
                  {item.id === 'overview' && dashboardStats.notifications > 0 && (
                    <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                      {dashboardStats.notifications}
                    </Badge>
                  )}
                  {/* Badge pour communication avec nombre de messages */}
                  {item.id === 'communication' && dashboardStats.messages > 0 && !sidebarCollapsed && (
                    <Badge className="bg-green-500 text-white text-xs px-1.5 py-0.5">
                      {dashboardStats.messages}
                    </Badge>
                  )}
                  {/* Badge pour notifications avec nombre d'alertes */}
                  {item.id === 'notifications' && dashboardStats.communicationAlerts > 0 && !sidebarCollapsed && (
                    <Badge className="bg-red-600 text-white text-xs px-1.5 py-0.5 animate-pulse">
                      {dashboardStats.communicationAlerts}
                    </Badge>
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Profile section */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-green-600" />
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1"
                >
                  <p className="text-sm font-medium text-gray-900">Agent Foncier</p>
                  <p className="text-xs text-gray-500">En ligne</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden text-gray-600 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden lg:block">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-1"
                >
                  <div className="flex items-center space-x-3">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 via-orange-700 to-amber-700 bg-clip-text text-transparent">
                      {sidebarTabs.find(tab => tab.id === activeTab)?.label || 'Dashboard Agent Foncier'}
                    </h1>
                    {sidebarTabs.find(tab => tab.id === activeTab)?.badge && (
                      <Badge className={`text-xs px-2 py-1 ${
                        sidebarTabs.find(tab => tab.id === activeTab)?.badge === 'NEW' ? 'bg-green-500 text-white' :
                        sidebarTabs.find(tab => tab.id === activeTab)?.badge === 'HOT' ? 'bg-red-500 text-white' :
                        sidebarTabs.find(tab => tab.id === activeTab)?.badge === 'PRO' ? 'bg-purple-500 text-white' :
                        sidebarTabs.find(tab => tab.id === activeTab)?.badge === 'BETA' ? 'bg-blue-500 text-white' :
                        sidebarTabs.find(tab => tab.id === activeTab)?.badge === 'SECURE' ? 'bg-green-600 text-white' :
                        sidebarTabs.find(tab => tab.id === activeTab)?.badge === 'LIVE' ? 'bg-red-600 text-white animate-pulse' :
                        sidebarTabs.find(tab => tab.id === activeTab)?.badge === 'PREMIUM' ? 'bg-yellow-500 text-black' :
                        sidebarTabs.find(tab => tab.id === activeTab)?.badge === 'AI' ? 'bg-indigo-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {sidebarTabs.find(tab => tab.id === activeTab)?.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {sidebarTabs.find(tab => tab.id === activeTab)?.description || 'Gestion foncière & Analytics'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {sidebarTabs.find(tab => tab.id === activeTab)?.subtitle || 'Plateforme professionnelle pour agents fonciers'}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Actions header */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <p className="font-bold text-green-600">{dashboardStats.totalTerrains}</p>
                  <p className="text-xs text-gray-500">Terrains</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-blue-600">{dashboardStats.clientsActifs}</p>
                  <p className="text-xs text-gray-500">Clients</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-purple-600">{dashboardStats.documentsTraites}</p>
                  <p className="text-xs text-gray-500">Documents</p>
                </div>
              </div>

              {/* Messages */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveTab('communication')}
                className="relative text-gray-600 hover:text-amber-600"
              >
                <MessageSquare className="h-5 w-5" />
                {dashboardStats.messages > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5">
                    {dashboardStats.messages}
                  </Badge>
                )}
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                {dashboardStats.notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5">
                    {dashboardStats.notifications}
                  </Badge>
                )}
              </Button>

              {/* Profile Dropdown */}
              <div className="relative">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-amber-600" />
                    </div>
                    <motion.div
                      animate={{ rotate: profileDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </motion.div>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-200/50 py-2 z-50"
                    >
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          setActiveTab('settings');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Paramètres
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          setActiveTab('profile');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                      >
                        <UserCog className="h-4 w-4 mr-3" />
                        Mon Profil
                      </motion.button>
                      <hr className="my-2 border-gray-200" />
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          console.log('Déconnexion...');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Déconnexion
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Zone de contenu principal */}
        <main className="flex-1 bg-gray-50">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          }>
            {renderActiveComponent()}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default CompleteSidebarAgentFoncierDashboard;
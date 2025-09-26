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
  Wrench
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

const BanqueDashboardLayout = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(12);

  // Navigation items avec les mêmes sections que Notaire
  const navigationItems = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: LayoutDashboard,
      component: BanqueOverview,
      badge: null
    },
    {
      id: 'credits',
      label: 'Demandes de Crédit',
      icon: CreditCard,
      component: BanqueCreditRequests,
      badge: 23
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      component: BanqueAnalytics,
      badge: null
    },
    {
      id: 'tools',
      label: 'Outils Bancaires',
      icon: Wrench,
      component: BanqueTools,
      badge: 'NEW'
    },
    {
      id: 'blockchain',
      label: 'TerangaChain Banking',
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
      id: 'compliance',
      label: 'Conformité',
      icon: Shield,
      component: BanqueCompliance,
      badge: null
    },
    {
      id: 'archives',
      label: 'Archives',
      icon: Archive,
      component: BanqueArchives,
      badge: null
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      component: BanqueMessages,
      badge: 3
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      component: BanqueSettings,
      badge: null
    }
  ];

  const currentComponent = navigationItems.find(item => item.id === activeSection)?.component || BanqueOverview;
  const CurrentComponent = currentComponent;

  const handleLogout = () => {
    window.safeGlobalToast({
      title: "Déconnexion réussie",
      description: "À bientôt sur Teranga Foncier",
      variant: "success"
    });
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
              <Button variant="ghost" size="sm" className="relative">
                <MessageSquare className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 px-1 min-w-[20px] h-5 flex items-center justify-center bg-blue-500 text-white text-xs">
                  3
                </Badge>
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
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
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
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
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg border-r border-gray-200 transition-transform duration-300 ease-in-out lg:transition-none`}>
          
          <div className="h-full flex flex-col">
            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
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
            </nav>

            {/* Footer sidebar */}
            <div className="p-4 border-t border-gray-200 space-y-4">
              {/* Profil utilisateur dans sidebar */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Banque Atlantique</p>
                  <p className="text-xs text-gray-500 truncate">Responsable Crédit</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>

              {/* TerangaChain Info */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Database className="h-4 w-4" />
                  <span className="text-sm font-medium">TerangaChain</span>
                </div>
                <p className="text-xs text-blue-100 mb-3">
                  Sécurisez vos transactions avec la blockchain
                </p>
                <Button size="sm" variant="secondary" className="w-full text-xs">
                  En savoir plus
                </Button>
              </div>
            </div>
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
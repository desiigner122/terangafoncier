import React, { useState, useEffect, Suspense } from 'react';
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
  
  // UI Icons
  Menu,
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
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { createClient } from '@supabase/supabase-js';

// Lazy loading des composants
const NotaireOverview = React.lazy(() => import('./NotaireOverview'));
const NotaireTransactions = React.lazy(() => import('./NotaireTransactions'));
const NotaireAuthentication = React.lazy(() => import('./NotaireAuthentication'));
const NotaireCases = React.lazy(() => import('./NotaireCases'));
const NotaireArchives = React.lazy(() => import('./NotaireArchives'));
const NotaireCompliance = React.lazy(() => import('./NotaireCompliance'));
const NotaireAnalytics = React.lazy(() => import('./NotaireAnalytics'));
const NotaireAI = React.lazy(() => import('./NotaireAI'));
const NotaireBlockchain = React.lazy(() => import('./NotaireBlockchain'));
const NotaireSettings = React.lazy(() => import('./NotaireSettings'));

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CompleteSidebarNotaireDashboard = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  // Stats du dashboard notaire
  const [dashboardStats, setDashboardStats] = useState({
    totalCases: 245,
    activeCases: 18,
    monthlyRevenue: 15400000, // 15.4M FCFA
    documentsAuthenticated: 1547,
    complianceScore: 97,
    clientSatisfaction: 98
  });

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

  // Configuration des onglets du sidebar
  const sidebarTabs = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: Home,
      description: 'Tableau de bord principal'
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: FileText,
      description: 'Gestion des actes et transactions',
      badge: dashboardStats.activeCases
    },
    {
      id: 'authentication',
      label: 'Authentification',
      icon: Stamp,
      description: 'Authentification de documents'
    },
    {
      id: 'cases',
      label: 'Dossiers',
      icon: BookOpen,
      description: 'Gestion des dossiers clients'
    },
    {
      id: 'archives',
      label: 'Archives',
      icon: Archive,
      description: 'Archives notariales numériques'
    },
    {
      id: 'compliance',
      label: 'Conformité',
      icon: Shield,
      description: 'Respect réglementaire notarial'
    },
    {
      id: 'analytics',
      label: 'Analyses & Rapports',
      icon: Activity,
      description: 'Statistiques et analyses'
    },
    {
      id: 'ai',
      label: 'Assistant IA',
      icon: PenTool,
      description: 'Intelligence artificielle notariale'
    },
    {
      id: 'blockchain',
      label: 'Blockchain Notariale',
      icon: Scale,
      description: 'Gestion blockchain des actes'
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
        return <NotaireOverview {...commonProps} />;
      case 'transactions':
        return <NotaireTransactions {...commonProps} />;
      case 'authentication':
        return <NotaireAuthentication {...commonProps} />;
      case 'cases':
        return <NotaireCases {...commonProps} />;
      case 'archives':
        return <NotaireArchives {...commonProps} />;
      case 'compliance':
        return <NotaireCompliance {...commonProps} />;
      case 'analytics':
        return <NotaireAnalytics {...commonProps} />;
      case 'ai':
        return <NotaireAI {...commonProps} />;
      case 'blockchain':
        return <NotaireBlockchain {...commonProps} />;
      case 'settings':
        return <NotaireSettings {...commonProps} />;
      default:
        return <NotaireOverview {...commonProps} />;
    }
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
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
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
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
          }>
            {renderActiveComponent()}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default CompleteSidebarNotaireDashboard;
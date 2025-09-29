import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  // Navigation Icons
  Home,
  Heart,
  FileText,
  MapPin,
  Building2,
  Settings,
  Bell,
  LogOut,
  User,
  Menu,
  
  // Content Icons
  DollarSign,
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
  
  // Particulier Icons
  Calendar,
  Eye,
  Plus,
  Shield,
  Award,
  Brain,
  Link as BlockchainIcon,
  
  // UI Icons
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Edit,
  Trash2,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { createClient } from '@supabase/supabase-js';
import TerangaLogo from '@/components/ui/TerangaLogo';

// Lazy loading des composants
const ParticulierOverview = React.lazy(() => import('./ParticulierOverview'));
const ParticulierFavoris = React.lazy(() => import('./ParticulierFavoris'));
const ParticulierTerrainsPrive = React.lazy(() => import('./ParticulierTerrainsPrive'));
const ParticulierZonesCommunales = React.lazy(() => import('./ParticulierZonesCommunales'));
const ParticulierMessages = React.lazy(() => import('./ParticulierMessages'));
const ParticulierNotifications = React.lazy(() => import('./ParticulierNotifications'));
const ParticulierCalendar = React.lazy(() => import('./ParticulierCalendar'));
const ParticulierDocuments = React.lazy(() => import('./ParticulierDocuments'));
const ParticulierAI = React.lazy(() => import('./ParticulierAI'));
const ParticulierBlockchain = React.lazy(() => import('./ParticulierBlockchain'));
const ParticulierSettings = React.lazy(() => import('./ParticulierSettings'));
const ParticulierCommunal = React.lazy(() => import('./ParticulierCommunal'));
const ParticulierPromoteurs = React.lazy(() => import('./ParticulierPromoteurs'));

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CompleteSidebarParticulierDashboard = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  // Stats du dashboard particulier - Focalisé sur les demandes et dossiers
  const [dashboardStats, setDashboardStats] = useState({
    totalDemandes: 8,
    demandesEnCours: 5,
    demandesApprouvees: 2,
    demandesEnAttente: 1,
    constructionDemandes: 2,
    zoneCommunaleDemandes: 3,
    dossiersTraites: 12,
    rdvProgrammes: 3
  });

  // Chargement du profil utilisateur
  useEffect(() => {
    // Utilisation d'un profil par défaut pour éviter les problèmes RLS
    if (user) {
      setProfile({
        id: user.id,
        email: user.email,
        role: 'particulier',
        first_name: 'Acheteur',
        last_name: 'Expert',
        full_name: 'Acheteur Expert'
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
      description: 'Dashboard principal et statistiques'
    },
    {
      id: 'communal',
      label: 'Zones Communales',
      icon: MapPin,
      description: 'Demandes de terrains communaux',
      badge: dashboardStats.zoneCommunaleDemandes
    },
    {
      id: 'demandes',
      label: 'Demandes Communales',
      icon: FileText,
      description: 'Toutes vos demandes communales',
      badge: dashboardStats.totalDemandes
    },
    {
      id: 'terrains',
      label: 'Terrains Privés',
      icon: Building2,
      description: 'Demandes d\'achat terrains privés',
      badge: '3'
    },
    {
      id: 'construction',
      label: 'Demandes Construction',
      icon: Target,
      description: 'Demandes de construction à distance',
      badge: dashboardStats.constructionDemandes
    },
    {
      id: 'favoris',
      label: 'Mes Favoris',
      icon: Heart,
      description: 'Terrains, zones et projets favoris',
      badge: '12'
    },
    {
      id: 'promoteurs',
      label: 'Projets Promoteurs',
      icon: Award,
      description: 'Villas et projets de développeurs'
    },
    {
      id: 'messages',
      label: 'Communications',
      icon: MessageSquare,
      description: 'Messages avec les services communaux',
      badge: '5'
    },
    {
      id: 'calendar',
      label: 'Agenda & RDV',
      icon: Calendar,
      description: 'Rendez-vous et démarches programmées'
    },
    {
      id: 'documents',
      label: 'Mes Documents',
      icon: FileText,
      description: 'Pièces justificatives et certificats'
    },
    {
      id: 'ai',
      label: 'Assistant IA',
      icon: Brain,
      description: 'Aide intelligente pour vos démarches'
    },
    {
      id: 'blockchain',
      label: 'Blockchain Foncier',
      icon: BlockchainIcon,
      description: 'Certificats fonciers sécurisés'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration et préférences'
    }
  ];

  const renderActiveComponent = () => {
    const commonProps = { dashboardStats };
    
    switch (activeTab) {
      case 'overview':
        return <ParticulierOverview {...commonProps} />;
      case 'communal':
        return <ParticulierZonesCommunales {...commonProps} />; // Composant spécifique zones communales
      case 'demandes':
        return <ParticulierCommunal {...commonProps} />; // Toutes les demandes communales
      case 'construction':
        return <ParticulierCommunal {...commonProps} />; // Composant pour demandes construction
      case 'favoris':
        return <ParticulierFavoris {...commonProps} />; // Page des favoris
      case 'terrains':
        return <ParticulierTerrainsPrive {...commonProps} />; // Demandes terrains privés
      case 'promoteurs':
        return <ParticulierPromoteurs {...commonProps} />;
      case 'messages':
        return <ParticulierMessages {...commonProps} />;
      case 'calendar':
        return <ParticulierCalendar {...commonProps} />;
      case 'documents':
        return <ParticulierDocuments {...commonProps} />;
      case 'ai':
        return <ParticulierAI {...commonProps} />;
      case 'blockchain':
        return <ParticulierBlockchain {...commonProps} />;
      case 'settings':
        return <ParticulierSettings {...commonProps} />;
      default:
        return <ParticulierOverview {...commonProps} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
          fixed lg:relative h-full bg-white/80 backdrop-blur-md shadow-xl border-r border-blue-200/50 z-40
          flex flex-col
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
        `}
      >
        {/* Header Sidebar */}
        <div className="p-6 border-b border-blue-200/30">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3"
              >
                <TerangaLogo className="w-10 h-10" />
                <div>
                  <h1 className="font-bold text-lg text-gray-900">Dashboard Particulier</h1>
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
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
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
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'P'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name || 'Particulier Expert'}
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
              {/* Messages Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 relative"
                onClick={() => setActiveTab('messages')}
              >
                <MessageSquare className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  5
                </span>
              </Button>

              {/* Notifications Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* User Profile Dropdown */}
              <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg px-3 py-2 border border-blue-200/50">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {profile?.first_name?.charAt(0) || user?.email?.charAt(0) || 'P'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-xs text-gray-600">Particulier</p>
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

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }>
            {renderActiveComponent()}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default CompleteSidebarParticulierDashboard;

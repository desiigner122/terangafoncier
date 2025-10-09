/**
 * DASHBOARD ADMIN MODERNISÉ - VERSION COMPLÈTE
 * 
 * ✅ Sidebar unique (pas de conflit)
 * ✅ Validation propriétés intégrée avec compteur
 * ✅ Navigation organisée par priorité
 * ✅ Notifications temps réel
 * ✅ Parité avec Notaire/Vendeur/Géomètre
 * 
 * Date: 9 octobre 2025
 */

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TerangaLogo from '../../../components/ui/TerangaLogo';
import { hybridDataService } from '../../../services/HybridDataService';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

// Import des pages spécialisées
import ModernAdminOverview from '../../../components/admin/ModernAdminOverview';
import AdminPropertyValidation from './AdminPropertyValidation';
import RevenueManagementPage from '../../admin/RevenueManagementPage';
import PropertyManagementPage from '../../admin/PropertyManagementPage';
import SupportTicketsPage from '../../admin/SupportTicketsPage';
import BulkExportPage from '../../admin/BulkExportPage';
import AdvancedSubscriptionManagementPage from '../../admin/AdvancedSubscriptionManagementPage';

// Icons
import { 
  Home, Users, Building2, DollarSign, BarChart3, Settings,
  CheckCircle, AlertTriangle, Clock, Shield, TrendingUp,
  MessageSquare, Activity, Flag, Crown, FileText,
  Bell, LogOut, Menu, X, ChevronLeft, ChevronRight,
  UserCheck, Eye, Zap, Database, Brain, Lock
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const ModernCompleteSidebarAdminDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  
  // États principaux
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  
  // Compteurs critiques
  const [pendingPropertiesCount, setPendingPropertiesCount] = useState(0);
  const [pendingVerificationsCount, setPendingVerificationsCount] = useState(0);
  const [urgentTicketsCount, setUrgentTicketsCount] = useState(0);

  // Données dashboard
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      activeUsers: 0,
      totalProperties: 0,
      verifiedProperties: 0,
      pendingProperties: 0,
      totalTransactions: 0,
      monthlyRevenue: 0,
      pendingReports: 0,
      systemHealth: 100,
      activeSubscriptions: 0
    },
    recentActivities: [],
    systemHealth: {
      server: { cpu: 45, memory: 68, disk: 72, network: 95 },
      database: { connections: 128, maxConnections: 200, queryTime: 15, uptime: 99.9 },
      apis: { supabase: 'online', payments: 'online', blockchain: 'maintenance', ai: 'online' }
    }
  });

  // 🔴 NAVIGATION MODERNISÉE - ORGANISÉE PAR PRIORITÉ
  const navigationItems = [
    // SECTION 1: DASHBOARD
    {
      section: 'dashboard',
      title: 'Tableau de Bord',
      items: [
        {
          id: 'overview',
          label: 'Vue d\'ensemble',
          icon: Home,
          description: 'Dashboard principal',
          isInternal: true
        },
        {
          id: 'analytics',
          label: 'Analytics Avancées',
          icon: BarChart3,
          description: 'Métriques détaillées',
          badge: 'IA',
          badgeColor: 'bg-indigo-500',
          isInternal: true
        }
      ]
    },
    
    // SECTION 2: VALIDATION (PRIORITÉ HAUTE) 🔴
    {
      section: 'validation',
      title: 'Validation Urgente',
      priority: 'high',
      items: [
        {
          id: 'property-validation',
          label: 'Propriétés en Attente',
          icon: CheckCircle,
          description: 'Valider les nouvelles propriétés',
          badge: pendingPropertiesCount,
          badgeColor: pendingPropertiesCount > 0 ? 'bg-red-500' : 'bg-green-500',
          isPriority: true,
          isInternal: true,
          notification: pendingPropertiesCount > 0
        },
        {
          id: 'user-verifications',
          label: 'Vérifications Utilisateurs',
          icon: UserCheck,
          description: 'Valider les comptes',
          badge: pendingVerificationsCount,
          badgeColor: 'bg-orange-500',
          isInternal: true
        }
      ]
    },
    
    // SECTION 3: GESTION
    {
      section: 'management',
      title: 'Gestion',
      items: [
        {
          id: 'users',
          label: 'Utilisateurs',
          icon: Users,
          description: 'Gestion complète',
          badge: dashboardData.stats.totalUsers > 0 ? `${(dashboardData.stats.totalUsers / 1000).toFixed(1)}k` : null,
          badgeColor: 'bg-blue-500',
          route: '/admin/users'
        },
        {
          id: 'properties',
          label: 'Propriétés',
          icon: Building2,
          description: 'Catalogue complet',
          badge: dashboardData.stats.totalProperties,
          badgeColor: 'bg-purple-500',
          route: '/admin/properties'
        },
        {
          id: 'transactions',
          label: 'Transactions',
          icon: DollarSign,
          description: 'Historique complet',
          badge: dashboardData.stats.totalTransactions,
          badgeColor: 'bg-green-500',
          route: '/admin/transactions'
        },
        {
          id: 'subscriptions',
          label: 'Abonnements',
          icon: Crown,
          description: 'Gestion abonnements',
          badge: dashboardData.stats.activeSubscriptions,
          badgeColor: 'bg-yellow-500',
          isInternal: true
        }
      ]
    },
    
    // SECTION 4: FINANCIER
    {
      section: 'financial',
      title: 'Financier',
      items: [
        {
          id: 'revenue',
          label: 'Revenus',
          icon: TrendingUp,
          description: 'Gestion financière',
          badge: `${(dashboardData.stats.monthlyRevenue / 1000000).toFixed(1)}M`,
          badgeColor: 'bg-green-600',
          isInternal: true
        }
      ]
    },
    
    // SECTION 5: SUPPORT & SYSTÈME
    {
      section: 'system',
      title: 'Support & Système',
      items: [
        {
          id: 'support',
          label: 'Support Tickets',
          icon: MessageSquare,
          description: 'Aide utilisateurs',
          badge: urgentTicketsCount,
          badgeColor: urgentTicketsCount > 0 ? 'bg-red-500' : 'bg-gray-500',
          isInternal: true
        },
        {
          id: 'reports',
          label: 'Signalements',
          icon: Flag,
          description: 'Modération',
          badge: dashboardData.stats.pendingReports,
          badgeColor: 'bg-orange-500',
          route: '/admin/reports'
        },
        {
          id: 'audit',
          label: 'Logs d\'Audit',
          icon: Activity,
          description: 'Historique activité',
          route: '/admin/audit-log'
        },
        {
          id: 'settings',
          label: 'Paramètres Système',
          icon: Settings,
          description: 'Configuration',
          route: '/admin/settings'
        }
      ]
    }
  ];

  // 🔔 CHARGEMENT DES COMPTEURS EN TEMPS RÉEL
  useEffect(() => {
    loadDashboardData();
    loadPendingCounts();
    
    // Subscription temps réel pour les propriétés en attente
    const propertiesSubscription = supabase
      .channel('property-validations')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'properties',
        filter: 'verification_status=eq.pending'
      }, (payload) => {
        console.log('🔔 Nouvelle propriété en attente:', payload);
        toast.info('Nouvelle propriété à valider', {
          description: 'Une propriété vient d\'être soumise',
          action: {
            label: 'Voir',
            onClick: () => setActiveTab('property-validation')
          }
        });
        loadPendingCounts(); // Rafraîchir le compteur
      })
      .subscribe();

    return () => {
      supabase.removeChannel(propertiesSubscription);
    };
  }, []);

  // Charger les données du dashboard
  const loadDashboardData = async () => {
    try {
      setLoadingData(true);
      const data = await hybridDataService.getAdminDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      toast.error('Erreur de chargement des données');
    } finally {
      setLoadingData(false);
      setLoading(false);
    }
  };

  // Charger les compteurs critiques
  const loadPendingCounts = async () => {
    try {
      // Propriétés en attente
      const { count: propertiesCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'pending');
      
      setPendingPropertiesCount(propertiesCount || 0);

      // Vérifications utilisateurs en attente
      const { count: verificationsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'pending');
      
      setPendingVerificationsCount(verificationsCount || 0);

      // Tickets urgents
      const { count: ticketsCount } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true })
        .eq('priority', 'urgent')
        .eq('status', 'open');
      
      setUrgentTicketsCount(ticketsCount || 0);

      // Mettre à jour dashboardData avec les nouveaux compteurs
      setDashboardData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          pendingProperties: propertiesCount || 0
        }
      }));

    } catch (error) {
      console.error('Erreur chargement compteurs:', error);
    }
  };

  // Déconnexion
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  // Navigation interne/externe
  const handleNavigation = (item) => {
    if (item.isInternal) {
      setActiveTab(item.id);
      setMobileMenuOpen(false);
    } else if (item.route) {
      navigate(item.route);
    }
  };

  // Obtenir l'item actif
  const getActiveItem = () => {
    for (const section of navigationItems) {
      const item = section.items.find(i => i.id === activeTab);
      if (item) return item;
    }
    return navigationItems[0].items[0];
  };

  // 🎨 SIDEBAR COMPONENT
  const Sidebar = () => (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg z-50
        ${sidebarCollapsed ? 'w-16' : 'w-80'}
        ${mobileMenuOpen ? 'translate-x-0' : 'lg:translate-x-0 -translate-x-full'}
        transition-all duration-300 ease-in-out
      `}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3"
              >
                <TerangaLogo className="h-12 w-12" showText={false} />
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-700 via-yellow-700 to-orange-700 bg-clip-text text-transparent">
                    Admin Panel
                  </h2>
                  <p className="text-sm font-medium text-amber-600">
                    Teranga Foncier
                  </p>
                </div>
              </motion.div>
            )}
            {sidebarCollapsed && (
              <TerangaLogo className="h-8 w-8 mx-auto" showText={false} />
            )}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex hover:bg-amber-100 text-amber-700"
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden hover:bg-amber-100 text-amber-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          {navigationItems.map((section, sectionIndex) => (
            <div key={section.section} className="mb-6">
              {!sidebarCollapsed && (
                <div className="px-6 mb-2 flex items-center justify-between">
                  <h3 className={`text-xs font-semibold uppercase tracking-wider ${
                    section.priority === 'high' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {section.title}
                  </h3>
                  {section.priority === 'high' && (
                    <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                      <AlertTriangle className="h-3 w-3" />
                    </Badge>
                  )}
                </div>
              )}
              
              <nav className="space-y-1 px-3">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigation(item)}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg
                        transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' 
                          : item.isPriority && item.badge
                            ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                            : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                        }
                        ${sidebarCollapsed ? 'justify-center' : ''}
                      `}
                    >
                      <Icon className={`h-5 w-5 flex-shrink-0 ${
                        item.notification ? 'animate-pulse' : ''
                      }`} />
                      
                      {!sidebarCollapsed && (
                        <>
                          <span className="ml-3 flex-1 text-left">{item.label}</span>
                          {item.badge !== undefined && item.badge !== null && (
                            <Badge className={`${item.badgeColor} text-white text-xs px-2 py-0.5 ml-2`}>
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Footer avec info admin */}
        <div className="p-4 border-t border-amber-200 bg-gradient-to-br from-amber-25 to-yellow-25">
          {!sidebarCollapsed && profile && (
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                  <Shield className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-amber-800 truncate">
                  {profile.full_name || 'Administrateur'}
                </p>
                <p className="text-xs text-amber-600 truncate">{user?.email}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 hover:bg-amber-100 text-amber-700"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-2">Paramètres</span>}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout} 
              className="hover:bg-red-100 text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // 📱 MAIN CONTENT
  const MainContent = () => {
    const activeItem = getActiveItem();
    
    return (
      <div className={`
        flex-1 transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'}
      `}>
        {/* Header */}
        <div className="bg-gradient-to-r from-white via-amber-50 to-yellow-50 border-b border-amber-200 px-6 py-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden hover:bg-amber-100 text-amber-700"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 via-yellow-700 to-orange-700 bg-clip-text text-transparent flex items-center">
                  <activeItem.icon className="h-7 w-7 mr-3 text-amber-600" />
                  {activeItem.label}
                </h1>
                <p className="text-sm text-gray-600 mt-1">{activeItem.description}</p>
              </motion.div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Indicateur validations urgentes */}
              {pendingPropertiesCount > 0 && activeTab !== 'property-validation' && (
                <motion.button
                  onClick={() => setActiveTab('property-validation')}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-semibold">{pendingPropertiesCount} à valider</span>
                </motion.button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    {(pendingPropertiesCount + urgentTicketsCount) > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {pendingPropertiesCount + urgentTicketsCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {pendingPropertiesCount > 0 && (
                    <DropdownMenuItem onClick={() => setActiveTab('property-validation')}>
                      <CheckCircle className="h-4 w-4 mr-2 text-red-500" />
                      <div className="flex-1">
                        <p className="font-medium">{pendingPropertiesCount} propriétés en attente</p>
                        <p className="text-xs text-gray-500">Validation requise</p>
                      </div>
                    </DropdownMenuItem>
                  )}
                  
                  {urgentTicketsCount > 0 && (
                    <DropdownMenuItem onClick={() => setActiveTab('support')}>
                      <MessageSquare className="h-4 w-4 mr-2 text-orange-500" />
                      <div className="flex-1">
                        <p className="font-medium">{urgentTicketsCount} tickets urgents</p>
                        <p className="text-xs text-gray-500">Support requis</p>
                      </div>
                    </DropdownMenuItem>
                  )}
                  
                  {(pendingPropertiesCount + urgentTicketsCount) === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p className="text-sm">Tout est à jour !</p>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                  <Shield className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  };

  // 📄 CONTENT RENDERER
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ModernAdminOverview 
            dashboardData={dashboardData} 
            loadingData={loadingData}
            pendingPropertiesCount={pendingPropertiesCount}
            pendingVerificationsCount={pendingVerificationsCount}
            urgentTicketsCount={urgentTicketsCount}
            onNavigate={setActiveTab}
          />
        );
      
      case 'property-validation':
        return (
          <div className="space-y-6">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Validation Prioritaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">
                  {pendingPropertiesCount > 0 
                    ? `${pendingPropertiesCount} propriété${pendingPropertiesCount > 1 ? 's' : ''} en attente de validation`
                    : 'Aucune propriété en attente'}
                </p>
              </CardContent>
            </Card>
            <AdminPropertyValidation />
          </div>
        );
      
      case 'subscriptions':
        return <AdvancedSubscriptionManagementPage />;
      
      case 'revenue':
        return <RevenueManagementPage />;
      
      case 'support':
        return <SupportTicketsPage />;
      
      case 'analytics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Analytics Avancées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Module analytics en cours de développement...</p>
            </CardContent>
          </Card>
        );
      
      case 'user-verifications':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Vérifications Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {pendingVerificationsCount} utilisateur{pendingVerificationsCount > 1 ? 's' : ''} à vérifier
              </p>
            </CardContent>
          </Card>
        );
      
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{getActiveItem().label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Section en cours de développement...</p>
            </CardContent>
          </Card>
        );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-amber-25 to-yellow-25">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-25 to-yellow-25">
      <Sidebar />
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <MainContent />
      
      {/* AI Assistant Widget */}
      <AIAssistantWidget />
    </div>
  );
};

export default ModernCompleteSidebarAdminDashboard;

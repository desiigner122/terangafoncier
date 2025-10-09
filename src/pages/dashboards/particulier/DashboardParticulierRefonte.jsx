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
  ChevronDown,
  LogOut,
  Ticket,
  Users,
  Star,
  Archive,
  PieChart,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Folder,
  Camera,
  Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from 'react-hot-toast';
import TerangaLogo from '@/components/ui/TerangaLogo';

const DashboardParticulierRefonte = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [unreadTicketsCount, setUnreadTicketsCount] = useState(0);

  // Charger les compteurs au chargement
  React.useEffect(() => {
    if (user) {
      loadUnreadCounts();
      
      // Souscription aux changements en temps réel
      const messagesSubscription = supabase
        .channel('messages_changes')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `recipient_id=eq.${user.id}` },
          () => loadUnreadCounts()
        )
        .subscribe();

      const notificationsSubscription = supabase
        .channel('notifications_changes')
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          () => loadUnreadCounts()
        )
        .subscribe();

      return () => {
        messagesSubscription.unsubscribe();
        notificationsSubscription.unsubscribe();
      };
    }
  }, [user]);

  const loadUnreadCounts = async () => {
    try {
      const { count: messagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .is('read_at', null);
      
      setUnreadMessagesCount(messagesCount || 0);

      const { count: notificationsCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);
      
      setUnreadNotificationsCount(notificationsCount || 0);

      // Charger compteur tickets
      const { count: ticketsCount } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .in('status', ['nouveau', 'en_cours']);
      
      setUnreadTicketsCount(ticketsCount || 0);
    } catch (error) {
      console.error('Erreur chargement compteurs:', error);
    }
  };

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Déconnexion réussie');
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  // NAVIGATION REFONTÉE - DASHBOARD PARTICULIER COMPLET
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord',
      icon: Home,
      description: 'Vue d\'ensemble de vos activités',
      path: '/acheteur',
      badge: unreadMessagesCount + unreadNotificationsCount > 0 ? (unreadMessagesCount + unreadNotificationsCount).toString() : null,
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'section-demandes',
      label: 'Mes Demandes',
      type: 'section'
    },
    {
      id: 'demandes-terrains',
      label: 'Terrains Communaux',
      icon: MapPin,
      description: 'Demandes de terrains communaux',
      path: '/acheteur/demandes-terrains',
      badge: '2',
      badgeColor: 'bg-orange-500'
    },
    {
      id: 'demandes-construction',
      label: 'Constructions',
      icon: Building2,
      description: 'Projets de construction',
      path: '/acheteur/constructions',
      badge: '1',
      badgeColor: 'bg-green-500'
    },
    {
      id: 'zone-communales',
      label: 'Zones Communales',
      icon: MapPin,
      description: 'Candidatures zones disponibles',
      path: '/acheteur/zones-communales',
      badge: '3',
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'section-gestion',
      label: 'Gestion',
      type: 'section'
    },
    {
      id: 'mes-offres',
      label: 'Offres Reçues',
      icon: Heart,
      description: 'Offres des vendeurs',
      path: '/acheteur/offres',
      badge: '0'
    },
    {
      id: 'favoris',
      label: 'Mes Favoris', 
      icon: Star,
      description: 'Propriétés favorites',
      path: '/acheteur/favoris'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      description: 'Gestion documentaire',
      path: '/acheteur/documents'
    },
    {
      id: 'financement',
      label: 'Financement',
      icon: CreditCard,
      description: 'Solutions de financement',
      path: '/acheteur/financement',
      isNew: true
    },
    {
      id: 'section-suivi',
      label: 'Suivi & Communication',
      type: 'section'
    },
    {
      id: 'tickets',
      label: 'Support & Tickets',
      icon: Ticket,
      description: 'Tickets de support technique',
      path: '/acheteur/tickets',
      badge: unreadTicketsCount > 0 ? unreadTicketsCount.toString() : null,
      badgeColor: 'bg-red-500',
      isNew: true
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      description: 'Communication administrative',
      path: '/acheteur/messages',
      badge: unreadMessagesCount > 0 ? unreadMessagesCount.toString() : null,
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Alertes et notifications',
      path: '/acheteur/notifications',
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount.toString() : null,
      badgeColor: 'bg-red-500'
    },
    {
      id: 'calendar',
      label: 'Calendrier',
      icon: Calendar,
      description: 'Rendez-vous et échéances',
      path: '/acheteur/calendar'
    },
    {
      id: 'section-outils',
      label: 'Outils Avancés',
      type: 'section'
    },
    {
      id: 'analytics',
      label: 'Statistiques',
      icon: PieChart,
      description: 'Analyse de vos activités',
      path: '/acheteur/analytics',
      isNew: true
    },
    {
      id: 'ai-assistant',
      label: 'Assistant IA',
      icon: Bot,
      description: 'Aide intelligente',
      path: '/acheteur/ai-assistant',
      isNew: true
    },
    {
      id: 'blockchain',
      label: 'Blockchain',
      icon: BlockchainIcon,
      description: 'Certification blockchain',
      path: '/acheteur/blockchain',
      isNew: true
    },
    {
      id: 'section-compte',
      label: 'Mon Compte',
      type: 'section'
    },
    {
      id: 'profile',
      label: 'Mon Profil',
      icon: User,
      description: 'Informations personnelles',
      path: '/acheteur/profile'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration du compte',
      path: '/acheteur/settings'
    }
  ];

  // Page active
  const getActiveItem = () => navigationItems.find(item => 
    item.path && (location.pathname === item.path || (item.path === '/acheteur' && location.pathname === '/acheteur'))
  );

  const isActivePage = (path) => {
    if (!path) return false;
    if (path === '/acheteur' && location.pathname === '/acheteur') return true;
    if (path !== '/acheteur' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
      setMobileMenuOpen(false);
    }
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Refonte - Version Compacte */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarCollapsed ? '64px' : '280px',
          x: mobileMenuOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024) ? '-100%' : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-white/95 backdrop-blur-xl border-r border-slate-200/50 shadow-xl z-40 flex-shrink-0 lg:translate-x-0"
      >
        {/* Header avec logo - Version Compacte */}
        <div className="p-3 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <div>
                  <h1 className="text-base font-bold text-slate-900">TerangaFoncier</h1>
                  <p className="text-xs text-slate-500">Dashboard Particulier</p>
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex w-7 h-7 text-slate-600 hover:bg-slate-100"
            >
              {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden w-7 h-7 text-slate-600"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Navigation avec sections - Version Compacte */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-2 space-y-1">
            {navigationItems.map((item) => {
              // Section headers - Version Compacte
              if (item.type === 'section') {
                if (sidebarCollapsed) return null;
                return (
                  <div key={item.id} className="pt-3 pb-1">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">
                      {item.label}
                    </h3>
                  </div>
                );
              }

              const Icon = item.icon;
              const isActive = isActivePage(item.path);
              
              return (
                <div key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center space-x-2 px-2 py-2 rounded-lg text-left transition-all duration-200 group
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm' 
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                  >
                    <div className={`
                      p-1.5 rounded-md transition-all duration-200
                      ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}
                    `}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    
                    {!sidebarCollapsed && (
                      <>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-medium truncate">{item.label}</p>
                            {item.isNew && (
                              <Badge className="text-xs bg-green-500 text-white px-1 py-0.5">
                                NEW
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-slate-500 truncate">{item.description}</p>
                          )}
                        </div>
                        
                        {item.badge && (
                          <Badge 
                            className={`text-xs ${item.badgeColor || 'bg-blue-500'} text-white shadow-sm`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Section utilisateur compacte */}
        <div className="p-3 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {profile?.full_name || user?.email?.split('@')[0] || 'Particulier'}
                </p>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Actif</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 hover:bg-white/50 text-xs"
              onClick={() => navigate('/acheteur/support')}
            >
              <Headphones className="h-3 w-3" />
              {!sidebarCollapsed && <span className="ml-1">Support</span>}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-3 w-3" />
              {!sidebarCollapsed && <span className="ml-1 text-xs">Déconnexion</span>}
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Compact */}
        <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200 px-3 py-3 lg:px-4 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Section gauche */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-1.5 hover:bg-slate-100"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  {getActiveItem()?.label || 'Dashboard Particulier'}
                </h1>
                <p className="text-xs text-slate-500">
                  {getActiveItem()?.description || 'Gestion de vos dossiers immobiliers'}
                </p>
              </div>
            </div>

            {/* Section droite - Actions */}
            <div className="flex items-center gap-3">
              {/* Quick actions */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/acheteur/tickets')}
                className="relative hover:bg-blue-50"
              >
                <Ticket className="h-4 w-4" />
                {unreadTicketsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unreadTicketsCount > 9 ? '9+' : unreadTicketsCount}
                  </span>
                )}
              </Button>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/acheteur/notifications')}
                className="relative hover:bg-yellow-50"
              >
                <Bell className="h-4 w-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                )}
              </Button>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/acheteur/messages')}
                className="relative hover:bg-blue-50"
              >
                <MessageSquare className="h-4 w-4" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                  </span>
                )}
              </Button>

              {/* Profil utilisateur */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-2 hover:bg-slate-100 px-3 py-2"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white font-semibold text-sm">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="hidden md:block text-sm font-medium">
                      {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Utilisateur'}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">
                      {profile?.full_name || user?.email?.split('@')[0] || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-slate-500">Compte Particulier</p>
                  </div>
                  
                  <DropdownMenuItem onClick={() => navigate('/acheteur/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon Profil</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => navigate('/acheteur/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => navigate('/acheteur/support')}>
                    <Headphones className="mr-2 h-4 w-4" />
                    <span>Support</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content avec animation */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Suspense 
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Chargement de la page...</p>
                    <p className="text-xs text-slate-500 mt-2">Préparation de votre dashboard</p>
                  </div>
                </div>
              }
            >
              <Outlet context={{ user, profile }} />
            </Suspense>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardParticulierRefonte;
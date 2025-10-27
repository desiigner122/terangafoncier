import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  // Navigation Icons
  Home,
  Building2,
  FileText,
  Heart,
  Bell,
  MessageSquare,
  Settings,
  Calendar,
  LogOut,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MapPin,
  Plus,
  Search,
  ShoppingCart,
  Bot,
  Blocks,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { useUnreadCounts } from '@/hooks/useUnreadCounts';
import { supabase } from '@/lib/supabaseClient';
import TerangaLogo from '@/components/ui/TerangaLogo';

// Feature flags
const ENABLE_LEGACY_PUBLIC_REQUESTS = false; // désactive les anciennes tables manquantes pour éviter le bruit console

// Typologies utilisées pour cartographier les demandes selon leur type réel en base
const TERRAIN_REQUEST_TYPES = new Set([
  'municipal_land',
  'terrain_request',
  'land_request',
  'public_land',
  'public_land_request',
  'communal_land'
]);

const CONSTRUCTION_REQUEST_TYPES = new Set([
  'construction_request',
  'construction',
  'building_permit',
  'promoter_project'
]);

const PURCHASE_REQUEST_TYPES = new Set([
  'offer',
  'purchase',
  'negotiation',
  'installments',
  'bank_financing',
  'general'
]);

const INACTIVE_REQUEST_STATUSES = new Set([
  'rejected',
  'cancelled',
  'archived',
  'closed',
  'terminated'
]);

const ACTIVE_PURCHASE_STATUSES = new Set([
  'new',
  'pending',
  'initiated',
  'waiting_response',
  'seller_reviewing',
  'in_progress'
]);

const isMissingTableError = (error) => error && ['PGRST205', '42P01'].includes(error.code);

const ModernAcheteurSidebar = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Real-time unread counts
  const { unreadMessagesCount, unreadNotificationsCount, reload: reloadUnread } = useUnreadCounts();
  
  // États pour les messages et notifications
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // États pour les compteurs de badges réels
  const [dashboardStats, setDashboardStats] = useState({
    demandesTerrains: 0,
    demandesConstruction: 0,
    purchaseRequests: 0,
    documentsEnAttente: 0
  });

  // Extraire l'onglet actif depuis l'URL
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path === '/acheteur' || path === '/acheteur/') return 'overview';
    const match = path.match(/\/acheteur\/([^\/]+)/);
    return match ? match[1] : 'overview';
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());
  
  // Mettre à jour activeTab quand l'URL change
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  // Charger les messages et notifications
  useEffect(() => {
    if (user) {
      loadMessages();
      loadNotifications();
    }

    // Setup realtime subscriptions for live updates
    if (user) {
      // Subscribe to conversations updates (new messages, status changes)
      const conversationSubscription = supabase
        .channel('public:conversations:buyer')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'conversations',
            filter: `buyer_id=eq.${user.id}`
          },
          async (payload) => {
            console.log('🔔 [REALTIME] Conversation update:', payload);
            await loadMessages();
          }
        )
        .subscribe();

      // Subscribe to conversation_messages for new messages
      const messagesSubscription = supabase
        .channel('public:conversation_messages:buyer')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'conversation_messages'
          },
          async (payload) => {
            console.log('💬 [REALTIME] New message:', payload);
            await loadMessages();
          }
        )
        .subscribe();

      // Subscribe to requests and purchase_cases for status updates
      const requestsSubscription = supabase
        .channel('public:requests:buyer')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'requests',
            filter: `user_id=eq.${user.id}`
          },
          async (payload) => {
            console.log('📋 [REALTIME] Request update:', payload);
            await loadNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(conversationSubscription);
        supabase.removeChannel(messagesSubscription);
        supabase.removeChannel(requestsSubscription);
      };
    }
  }, [user]);

  // Charger les messages depuis les conversations
  const loadMessages = async () => {
    try {
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select(`
          id,
          vendor_id,
          property_id,
          updated_at,
          unread_count_vendor
        `)
        .eq('buyer_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(20);

      if (convError || !conversations || conversations.length === 0) {
        setMessages([]);
        return;
      }

      // Charger les profils des vendeurs ET les propriétés
      const vendorIds = conversations.map(c => c.vendor_id).filter(Boolean);
      const propertyIds = conversations.map(c => c.property_id).filter(Boolean);
      let vendorMap = {};
      let propertyMap = {};
      
      if (vendorIds.length > 0) {
        const { data: vendors } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', vendorIds);
        
        if (vendors) {
          vendors.forEach(v => {
            vendorMap[v.id] = v;
          });
        }
      }

      // Charger les propriétés
      if (propertyIds.length > 0) {
        const { data: properties } = await supabase
          .from('parcels')
          .select('id, title')
          .in('id', propertyIds);
        
        if (properties) {
          properties.forEach(p => {
            propertyMap[p.id] = p;
          });
        }
      }

      // Transformer les conversations en messages
      const messagesList = conversations.map(conv => ({
        id: conv.id,
        conversation_id: conv.id,
        vendor_id: conv.vendor_id,
        vendor_name: vendorMap[conv.vendor_id] ? 
          `${vendorMap[conv.vendor_id].first_name} ${vendorMap[conv.vendor_id].last_name}`.trim() || 'Vendeur' : 
          'Vendeur',
        property_title: propertyMap[conv.property_id]?.title || 'Propriété',
        vendor_avatar: vendorMap[conv.vendor_id]?.avatar_url,
        content: 'Voir la conversation',
  // Acheteur voit ses propres non-lus: utiliser unread_count_buyer
  unread: (conv.unread_count_buyer || 0) > 0,
        created_at: conv.updated_at,
        timestamp: new Date(conv.updated_at).toLocaleDateString('fr-FR')
      }));

      console.log('✅ [MESSAGES] Chargées:', messagesList.length, messagesList.map(m => m.vendor_name));
      setMessages(messagesList);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    }
  };

  // Charger les notifications
  const loadNotifications = async () => {
    try {
      const { data: notif, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        if (!['PGRST204', '42P01'].includes(error.code)) {
          console.error('Erreur chargement notifications:', error);
        }
        setNotifications([]);
      } else {
        setNotifications(notif || []);
      }
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
      setNotifications([]);
    }
  };

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await signOut();
      console.log('Déconnexion réussie');
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Configuration de navigation - Moderne comme Vendeur
  const navigationItems = [
    {
      id: 'overview',
      label: 'Tableau de Bord',
      icon: Home,
      description: 'Vue d\'ensemble activités',
      badge: (dashboardStats.demandesTerrains + dashboardStats.demandesConstruction + dashboardStats.purchaseRequests) > 0 
        ? (dashboardStats.demandesTerrains + dashboardStats.demandesConstruction + dashboardStats.purchaseRequests).toString() 
        : undefined
    },
    {
      id: 'zones-communales',
      label: 'Zones Communales',
      icon: MapPin,
      description: 'Terrains publics disponibles'
    },
    {
      id: 'demandes-terrains',
      label: 'Demandes Terrains',
      icon: FileText,
      description: 'Mes candidatures terrains',
      badge: dashboardStats.demandesTerrains > 0 ? dashboardStats.demandesTerrains.toString() : undefined
    },
    {
      id: 'construction',
      label: 'Demandes Construction',
      icon: Building2,
      description: 'Projets promoteurs',
      badge: dashboardStats.demandesConstruction > 0 ? dashboardStats.demandesConstruction.toString() : undefined
    },
    {
      id: 'promoteurs',
      label: 'Candidatures Promoteurs',
      icon: Briefcase,
      description: 'Suivi candidatures projets'
    },
    {
      id: 'mes-achats',
      label: 'Mes Achats',
      icon: ShoppingCart,
      description: 'Suivi de mes achats',
      badge: dashboardStats.purchaseRequests > 0 ? dashboardStats.purchaseRequests.toString() : undefined
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      description: 'Communication',
      badge: unreadMessagesCount > 0 ? unreadMessagesCount.toString() : undefined
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Alertes système',
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount.toString() : undefined,
      badgeColor: 'bg-red-500'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      description: 'Mes documents',
      badge: dashboardStats.documentsEnAttente > 0 ? dashboardStats.documentsEnAttente.toString() : undefined
    },
    {
      id: 'calendar',
      label: 'Calendrier',
      icon: Calendar,
      description: 'Rendez-vous'
    },
    {
      id: 'ai',
      label: 'Assistant IA',
      icon: Bot,
      description: 'Intelligence artificielle'
    },
    {
      id: 'blockchain',
      label: 'Blockchain',
      icon: Blocks,
      description: 'Certification blockchain'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration compte'
    }
  ];

  // Charger les statistiques réelles
  useEffect(() => {
    if (user?.id) {
      loadDashboardStats();
    }
  }, [user?.id]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      // 🔄 Charger les demandes utilisateur depuis la table requests (source unique fiable)
      let userRequests = [];
      try {
        const { data, error } = await supabase
          .from('requests')
          .select('id, status, type')
          .eq('user_id', user.id);

        if (error && isMissingTableError(error)) {
          console.warn('⚠️ Table requests manquante');
        } else if (error) {
          console.error('Erreur chargement requests:', error);
        } else {
          userRequests = data || [];
        }
      } catch (err) {
        console.warn('⚠️ Erreur chargement requests:', err);
      }

      // Catégoriser les demandes selon leur type réel
      let demandesTerrains = userRequests.filter((req) => req?.type && TERRAIN_REQUEST_TYPES.has(req.type));
      let demandesConstruction = userRequests.filter((req) => req?.type && CONSTRUCTION_REQUEST_TYPES.has(req.type));

      // Legacy tables disabled - they don't exist in production
      // Skip queries to demandes_terrains_communaux and demandes_construction entirely

      // ✅ Charger demandes d'achat (purchase requests) avec fallback sur requests
      let purchaseRequests = [];
      try {
        const { data, error } = await supabase
          .from('purchase_requests')
          .select('id, status')
          .eq('buyer_id', user.id)
          .in('status', ['pending', 'in_progress', 'seller_reviewing']);

        if (error && ['PGRST200', 'PGRST205', '42P01'].includes(error.code)) {
          console.warn('⚠️ Erreur schema purchase_requests, fallback requests');
        } else if (error) {
          console.error('Erreur purchase requests:', error);
        } else {
          purchaseRequests = data || [];
        }
      } catch (err) {
        console.warn('⚠️ Erreur chargement purchase_requests:', err);
      }

      if (purchaseRequests.length === 0 && userRequests.length > 0) {
        purchaseRequests = userRequests.filter((req) =>
          (req?.type && PURCHASE_REQUEST_TYPES.has(req.type)) ||
          (req?.status && ACTIVE_PURCHASE_STATUSES.has(req.status))
        );
      }

      // ✅ Charger documents en attente (avec gestion erreur)
      let documents = [];
      try {
        const { data, error } = await supabase
          .from('documents_administratifs')
          .select('id, status')
          .eq('user_id', user.id)
          .eq('status', 'En attente');

        if (isMissingTableError(error)) {
          console.warn('⚠️ Table documents_administratifs manquante');
        } else if (error) {
          console.error('Erreur documents:', error);
        } else {
          documents = data || [];
        }
      } catch (err) {
        console.warn('⚠️ Erreur chargement documents:', err);
      }

      const terrainCount = demandesTerrains.filter((req) => !INACTIVE_REQUEST_STATUSES.has(req?.status)).length;
      const constructionCount = demandesConstruction.filter((req) => !INACTIVE_REQUEST_STATUSES.has(req?.status)).length;
      const purchaseCount = purchaseRequests.filter((req) => !req?.status || ACTIVE_PURCHASE_STATUSES.has(req.status)).length;

      setDashboardStats({
        demandesTerrains: terrainCount,
        demandesConstruction: constructionCount,
        purchaseRequests: purchaseCount,
        documentsEnAttente: documents.length
      });

    } catch (error) {
      console.error('❌ Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (itemId) => {
    const routes = {
      'overview': '/acheteur',
      'zones-communales': '/acheteur/zones-communales',
      'demandes-terrains': '/acheteur/demandes-terrains',
      'construction': '/acheteur/construction',
      'promoteurs': '/acheteur/promoteurs',
      'mes-achats': '/acheteur/mes-achats',
      'messages': '/acheteur/messages',
      'notifications': '/acheteur/notifications',
      'documents': '/acheteur/documents',
      'calendar': '/acheteur/calendar',
      'ai': '/acheteur/ai',
      'blockchain': '/acheteur/blockchain',
      'settings': '/acheteur/settings'
    };
    
    navigate(routes[itemId] || '/acheteur');
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
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

      {/* Sidebar Moderne */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarCollapsed ? '80px' : '280px',
          x: mobileMenuOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024) ? '-100%' : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-gradient-to-b from-white to-blue-50/30 backdrop-blur-xl border-r border-blue-200/50 shadow-2xl z-40 flex flex-col"
      >
        {/* Header Sidebar */}
        <div className="p-4 border-b border-blue-200/50">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h1 className="text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    TerangaFoncier
                  </h1>
                  <p className="text-xs text-slate-500">Dashboard Acheteur</p>
                </div>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex w-8 h-8 p-0"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                  }
                  ${item.highlight ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                `}
              >
                <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-600'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                {!sidebarCollapsed && (
                  <>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{item.label}</div>
                      {item.description && !isActive && (
                        <div className="text-xs text-slate-500 truncate">{item.description}</div>
                      )}
                    </div>
                    
                    {item.badge && (
                      <Badge 
                        className={`text-xs ${
                          item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700')
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-blue-200/50">
          {!sidebarCollapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-2 hover:bg-blue-50">
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-9 w-9 ring-2 ring-blue-500/20">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {profile?.full_name || user?.email?.split('@')[0] || 'Utilisateur'}
                      </p>
                      <p className="text-xs text-slate-500">Acheteur</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => handleNavigate('settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full p-2 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Moderne */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile Menu + Title */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-slate-500">
                  {navigationItems.find(item => item.id === activeTab)?.description || ''}
                </p>
              </div>
            </div>

            {/* Actions Header */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>

              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="relative"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="px-3 py-2 font-medium">Notifications</div>
                  <DropdownMenuSeparator />
                  {notifications && notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notif, idx) => {
                      const getNotificationRoute = (notification) => {
                        if (!notification) return '/acheteur/overview';
                        if (notification.type === 'message' || notification.type === 'chat') {
                          const convId = notification.conversation_id || notification?.data?.conversation_id || notification?.metadata?.conversation_id;
                          if (convId) return `/acheteur/messages?conversation=${convId}`;
                          return '/acheteur/messages';
                        }
                        if (notification.type === 'purchase_request' || notification.type === 'demand') {
                          return '/acheteur/mes-achats';
                        }
                        if (notification.type === 'case' && notification.case_id) {
                          return `/acheteur/dossier/${notification.case_id}`;
                        }
                        return '/acheteur/overview';
                      };

                      return (
                        <DropdownMenuItem
                          key={idx}
                          onClick={async () => {
                            // Mark notification as read
                            try {
                              await supabase
                                .from('notifications')
                                .update({ is_read: true, read_at: new Date().toISOString() })
                                .eq('id', notif.id);
                              
                              // Remove from local notifications list
                              setNotifications(prev => prev.filter(n => n.id !== notif.id));
                              console.log('✅ [BUYER] Notification marquée comme lue:', notif.id);
                              // Refresh header counters
                              if (typeof reloadUnread === 'function') reloadUnread();
                            } catch (error) {
                              console.error('❌ [BUYER] Erreur marquage notification:', error);
                            }
                            
                            navigate(getNotificationRoute(notif));
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2 w-full">
                            <Bell className="h-4 w-4 text-red-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{notif.title || 'Notification'}</p>
                              <p className="text-xs text-gray-600 truncate">{notif.message || 'Aucun message'}</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      );
                    })
                  ) : (
                    <DropdownMenuItem disabled>
                      <span className="text-sm text-slate-600">Aucune notification récente</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/acheteur/notifications')}>
                    Voir toutes les notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Messages Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="relative"
                  >
                    <MessageSquare className="h-4 w-4" />
                    {unreadMessagesCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="px-3 py-2 font-medium">Messages récents</div>
                  <DropdownMenuSeparator />
                  {messages && messages.length > 0 ? (
                    messages.slice(0, 5).map((msg, idx) => (
                      <DropdownMenuItem 
                        key={idx}
                        onClick={async () => {
                          // Mark conversation as read immediately for better UX
                          if (msg.conversation_id && msg.unread) {
                            try {
                              await supabase
                                .from('conversations')
                                .update({ unread_count_buyer: 0 })
                                .eq('id', msg.conversation_id);
                              
                              // Update local state immediately
                              setMessages(prev => 
                                prev.map(m => 
                                  m.conversation_id === msg.conversation_id 
                                    ? { ...m, unread: false }
                                    : m
                                )
                              );
                              console.log('✅ [BUYER] Message marqué comme lu:', msg.conversation_id);
                              // Refresh header counters
                              if (typeof reloadUnread === 'function') reloadUnread();
                            } catch (error) {
                              console.error('❌ [BUYER] Erreur marquage message lu:', error);
                            }
                          }
                          
                          navigate(`/acheteur/messages?conversation=${msg.conversation_id}`);
                        }}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={msg.vendor_avatar} alt={msg.vendor_name} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                              {msg.vendor_name?.charAt(0) || 'V'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">{msg.vendor_name}</p>
                              {msg.unread && (
                                <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 truncate">{msg.property_title || msg.content}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{msg.timestamp}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      <span className="text-sm text-slate-600">Aucun message récent</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/acheteur/messages')}>
                    Voir tous les messages
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Avatar */}
              <Avatar className="h-8 w-8 ring-2 ring-blue-500/20 cursor-pointer" onClick={() => handleNavigate('settings')}>
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white text-xs">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content Area - Outlet pour les routes imbriquées */}
        <main className="flex-1 overflow-auto">
          <Outlet context={{ user, profile }} />
        </main>
      </div>
    </div>
  );
};

export default ModernAcheteurSidebar;

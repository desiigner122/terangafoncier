import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Users,
  Building2,
  DollarSign,
  BarChart3,
  Flag,
  Settings,
  Bell,
  LogOut,
  UserCheck,
  FileText,
  Activity,
  Target,
  Database,
  MessageSquare,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const ModernAdminLayout = ({ title, subtitle, children }) => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  // Compteurs réels (Supabase)
  const [usersCount, setUsersCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);
  const [headerMessages, setHeaderMessages] = useState([]);
  const [headerNotifications, setHeaderNotifications] = useState([]);

  // Chargement des compteurs de la sidebar (utilisateurs, signalements)
  useEffect(() => {
    const loadSidebarCounts = async () => {
      try {
        const { count: totalUsers, error: usersError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true });

        if (usersError) throw usersError;
        setUsersCount(totalUsers || 0);

        const { count: totalDisputes, error: disputesError } = await supabase
          .from('disputes')
          .select('id', { count: 'exact', head: true });

        if (disputesError) throw disputesError;
        setReportsCount(totalDisputes || 0);
      } catch (error) {
        console.error('Erreur chargement compteurs sidebar admin:', error);
        setUsersCount(0);
        setReportsCount(0);
      }
    };

    loadSidebarCounts();
  }, []);

  // Chargement des messages et notifications récents pour les aperçus du header
  useEffect(() => {
    if (!user?.id) return;

    const loadHeaderMessages = async () => {
      try {
        const { data: participations, error: participationsError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', user.id);

        if (participationsError) throw participationsError;

        const conversationIds = (participations || []).map((p) => p.conversation_id);
        if (conversationIds.length === 0) {
          setHeaderMessages([]);
          return;
        }

        const { data, error } = await supabase
          .from('messages')
          .select('id, content, read, created_at, sender:sender_id(full_name, email)')
          .in('conversation_id', conversationIds)
          .neq('sender_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setHeaderMessages(data || []);
      } catch (error) {
        console.error('Erreur chargement messages admin:', error);
        setHeaderMessages([]);
      }
    };

    const loadHeaderNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('id, title, message, type, read, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setHeaderNotifications(data || []);
      } catch (error) {
        console.error('Erreur chargement notifications admin:', error);
        setHeaderNotifications([]);
      }
    };

    loadHeaderMessages();
    loadHeaderNotifications();
  }, [user?.id]);

  // Configuration du sidebar
  const sidebarItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: Home,
      description: 'Vue d\'ensemble'
    },
    {
      title: 'Utilisateurs',
      href: '/admin/users',
      icon: Users,
      description: 'Gestion des comptes',
      badge: usersCount > 0 ? usersCount.toLocaleString('fr-FR') : null
    },
    {
      title: 'Projets',
      href: '/admin/projects',
      icon: Building2,
      description: 'Gestion des projets'
    },
    {
      title: 'Transactions',
      href: '/admin/transactions',
      icon: DollarSign,
      description: 'Suivi financier'
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      description: 'Analyses et rapports'
    },
    {
      title: 'Signalements',
      href: '/admin/reports',
      icon: Flag,
      description: 'Modération',
      badge: reportsCount > 0 ? reportsCount.toLocaleString('fr-FR') : null
    },
    {
      title: 'Blog & Contenu',
      href: '/admin/blog',
      icon: FileText,
      description: 'Gestion du contenu'
    },
    {
      title: 'Audit',
      href: '/admin/audit-log',
      icon: Activity,
      description: 'Journaux d\'activité'
    },
    {
      title: 'Paramètres',
      href: '/admin/settings',
      icon: Settings,
      description: 'Configuration'
    }
  ];

  const isActiveRoute = (href) => {
    if (href === '/admin') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div 
        className={`bg-white border-r shadow-sm flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-72'
        }`}
        initial={false}
        animate={{ width: sidebarCollapsed ? 64 : 288 }}
      >
        {/* Header Sidebar */}
        <div className={`p-4 border-b ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
                <p className="text-sm text-gray-500">Teranga Foncier</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="flex items-center justify-center"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                isActiveRoute(item.href)
                  ? 'bg-red-50 text-red-700 border-l-4 border-red-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className={`h-5 w-5 ${!sidebarCollapsed ? 'mr-3' : ''}`} />
              {!sidebarCollapsed && (
                <span className="font-medium">{item.title}</span>
              )}
              {!sidebarCollapsed && item.badge && (
                <Badge className="ml-auto bg-red-500 text-white">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className={`p-4 border-t ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name || user?.email?.split('@')[0] || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 truncate">Administrateur</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600">{subtitle}</p>
              </div>
            </div>
            
            {/* Actions Header */}
            <div className="flex items-center space-x-3">
              {/* Messages avec aperçu */}
              <Popover open={showMessages} onOpenChange={setShowMessages}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative hover:bg-gray-100">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    {headerMessages.filter(m => !m.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                        {headerMessages.filter(m => !m.read).length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900">Messages récents</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {headerMessages.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500 text-center">Aucun message récent</div>
                    ) : (
                      headerMessages.map((message) => {
                        const senderName = message.sender?.full_name || message.sender?.email || 'Utilisateur';
                        const initials = senderName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                        return (
                          <div key={message.id} className={`p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${!message.read ? 'bg-blue-50' : ''}`}>
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                {initials}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${!message.read ? 'font-semibold' : 'font-medium'} text-gray-900 truncate`}>
                                  {senderName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{message.content}</p>
                              </div>
                              <span className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: fr })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="p-3 border-t">
                    <Link to="/admin/messages" className="text-sm text-blue-600 hover:text-blue-800">
                      Voir tous les messages →
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Notifications avec aperçu */}
              <Popover open={showNotifications} onOpenChange={setShowNotifications}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative hover:bg-gray-100">
                    <Bell className="h-5 w-5 text-gray-600" />
                    {headerNotifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {headerNotifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {headerNotifications.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500 text-center">Aucune notification</div>
                    ) : (
                      headerNotifications.map((notification) => (
                        <div key={notification.id} className={`p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${!notification.read ? 'bg-red-50' : ''}`}>
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 mt-2 rounded-full ${!notification.read ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mb-1">{notification.message}</p>
                              <span className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: fr })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t">
                    <Link to="/admin/notifications" className="text-sm text-blue-600 hover:text-blue-800">
                      Voir toutes les notifications →
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Menu Profil */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-gray-100">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-red-600 text-white text-xs">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-medium text-gray-900">
                        {profile?.full_name || user?.email?.split('@')[0] || 'Administrateur'}
                      </p>
                      <p className="text-xs text-gray-500">Admin</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/admin/profile" className="flex items-center">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/settings" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Paramètres
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => signOut()}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Banner de rôle admin */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Admin
              </Badge>
              <span className="text-sm font-medium">Panneau d'administration</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ModernAdminLayout;
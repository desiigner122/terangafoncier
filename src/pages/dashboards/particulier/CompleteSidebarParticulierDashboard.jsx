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
  LogOut
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
import { useUnreadCounts } from '@/hooks/useUnreadCounts';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import TerangaLogo from '@/components/ui/TerangaLogo';

// Composants rendus via Outlet - pas besoin d'imports

const CompleteSidebarParticulierDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Use the real-time unread counts hook
  const { unreadMessagesCount, unreadNotificationsCount } = useUnreadCounts();

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

  // Navigation Items Configuration - DASHBOARD SIMPLIFIÉ SELON SPÉCIFICATIONS
  const navigationItems = [
    {
      id: 'overview',
      label: 'Tableau de Bord',
      icon: Home,
      description: 'Vue d\'ensemble activités',
      path: '/acheteur',
      badge: unreadMessagesCount + unreadNotificationsCount > 0 ? (unreadMessagesCount + unreadNotificationsCount).toString() : null,
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'demandes-communales',
      label: 'Demandes Terrains',
      icon: FileText,
      description: 'Suivi demandes terrains communaux',
      path: '/acheteur/demandes-terrains',
      badge: '0'
    },
    {
      id: 'demandes-construction',
      label: 'Demandes Construction',
      icon: Building2,
      description: 'Demandes aux promoteurs',
      path: '/acheteur/construction',
      badge: '0'
    },
    {
      id: 'mes-offres',
      label: 'Offres Reçues',
      icon: Heart,
      description: 'Offres reçues des vendeurs',
      path: '/acheteur/offres',
      badge: '0'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      description: 'Messages administratifs',
      path: '/acheteur/messages',
      badge: unreadMessagesCount > 0 ? unreadMessagesCount.toString() : null
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Alertes système',
      path: '/acheteur/notifications',
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount.toString() : null,
      badgeColor: 'bg-red-500'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      description: 'Mes documents',
      path: '/acheteur/documents'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration compte',
      path: '/acheteur/settings'
    }
  ];

  // Page active
  const getActiveItem = () => navigationItems.find(item => 
    location.pathname === item.path || (item.path === '/acheteur' && location.pathname === '/acheteur')
  );

  const isActivePage = (path) => {
    if (path === '/acheteur' && location.pathname === '/acheteur') return true;
    if (path !== '/acheteur' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Plus besoin de renderActiveComponent - on utilise Outlet

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

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarCollapsed ? '80px' : '320px',
          x: mobileMenuOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024) ? '-100%' : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-white/95 backdrop-blur-xl border-r border-slate-200/50 shadow-2xl z-40 flex-shrink-0 lg:translate-x-0"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <div>
                  <h1 className="text-sm font-bold text-slate-900">TerangaFoncier</h1>
                  <p className="text-xs text-slate-500">Suivi Dossiers</p>
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex w-8 h-8 text-slate-600"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden w-8 h-8 text-slate-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path && (location.pathname === item.path || (item.path === '/acheteur' && location.pathname === '/acheteur'));
              const hasActiveChild = item.children?.some(child => location.pathname.startsWith(child.path));
              
              return (
                <div key={item.id}>
                  {/* Item principal */}
                  <button
                    onClick={() => {
                      if (item.path) {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all
                      ${isActive || hasActiveChild
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${isActive || hasActiveChild ? 'text-blue-600' : 'text-gray-500'}`} />
                    
                    {!sidebarCollapsed && (
                      <>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.label}</p>
                          {item.description && (
                            <p className="text-xs text-gray-500 truncate">{item.description}</p>
                          )}
                        </div>
                        
                        {item.badge && (
                          <Badge 
                            className={`text-xs ${item.badgeColor || 'bg-blue-500'} text-white`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </button>

                  {/* Sous-éléments */}
                  {!sidebarCollapsed && item.children && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const childIsActive = location.pathname.startsWith(child.path);
                        return (
                          <button
                            key={child.id}
                            onClick={() => {
                              navigate(child.path);
                              setMobileMenuOpen(false);
                            }}
                            className={`
                              w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all
                              ${childIsActive
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                              }
                            `}
                          >
                            <span className="truncate">{child.label}</span>
                            {child.badge && (
                              <Badge className="text-xs bg-orange-500 text-white ml-2">
                                {child.badge}
                              </Badge>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name || user?.email?.split('@')[0] || 'Particulier'}
                </p>
                <p className="text-xs text-gray-500 truncate">Compte Particulier</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="flex-1">
              <Bell className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-2">Notifications</span>}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
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
              <h1 className="text-lg font-semibold text-slate-900">
                {getActiveItem()?.label || 'Mes Dossiers'}
              </h1>
            </div>

            {/* Actions et Profil */}
            <div className="flex items-center gap-2">
              {/* Notifications dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="relative"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                        {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="px-3 py-2 font-medium">Notifications</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    <span className="text-sm text-slate-600">Aucune notification récente</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/acheteur/notifications')}>
                    Voir toutes les notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Messages dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="relative"
                  >
                    <MessageSquare className="h-4 w-4" />
                    {unreadMessagesCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center">
                        {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="px-3 py-2 font-medium">Messages récents</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    <span className="text-sm text-slate-600">Aucun message récent</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/acheteur/messages')}>
                    Voir tous les messages
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Calendrier */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/acheteur/calendar')}
                className="relative"
              >
                <Calendar className="h-4 w-4" />
              </Button>

              {/* Profil simple */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-xs">
                        {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">
                      {profile?.full_name || user?.email?.split('@')[0] || 'Utilisateur'}
                    </p>
                  </div>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
  <main className="flex-1 overflow-auto bg-slate-50/50 p-3 sm:p-4 lg:p-6">
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
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default CompleteSidebarParticulierDashboard;
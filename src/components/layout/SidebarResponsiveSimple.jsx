import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  LogOut, 
  Users, 
  Menu, 
  X, 
  Home,
  Heart,
  Bell,
  MessageSquare,
  FileText,
  Calendar as CalendarIcon,
  Banknote,
  Search
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MobileDrawer from '@/components/ui/mobile-drawer';
import { supabase } from '@/lib/supabaseClient';

const logoUrl = "/images/logo.png";

// Configuration sidebar simplifiée
const getSimpleSidebarConfig = (role) => {
  const isAcheteur = role && role.toLowerCase && (role.toLowerCase() === 'particulier' || role.toLowerCase() === 'acheteur');

  if (role === 'admin') {
    return [
      { href: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard, end: true },
      { href: '/admin/users', label: 'Utilisateurs', icon: Users },
      { href: '/admin/settings', label: 'Configuration', icon: Settings },
      { href: isAcheteur ? '/acheteur' : '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { href: '/settings', label: 'Paramètres', icon: Settings }
    ];
  }

  if (isAcheteur) {
    return [
      { href: '/acheteur', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { href: '/favorites', label: 'Mes Favoris', icon: Heart },
      { href: '/saved-searches', label: 'Recherches', icon: Search },
      { href: '/my-requests', label: 'Mes Demandes', icon: FileText },
      { href: '/transactions', label: 'Transactions', icon: Banknote },
      { href: '/messaging', label: 'Messagerie', icon: MessageSquare },
      { href: '/notifications', label: 'Notifications', icon: Bell },
      { href: '/documents', label: 'Documents', icon: FileText },
      { href: '/calendar', label: 'Calendrier', icon: CalendarIcon },
      { href: '/settings', label: 'Paramètres', icon: Settings }
    ];
  }

  // Configuration pour les vendeurs
  if (role && (role.toLowerCase().includes('vendeur'))) {
    return [
      { href: '/vendeur', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { href: '/my-listings', label: 'Mes Annonces', icon: Home },
      { href: '/add-parcel', label: 'Ajouter Terrain', icon: Search },
      { href: '/my-requests', label: 'Demandes Reçues', icon: FileText },
      { href: '/transactions', label: 'Mes Ventes', icon: Banknote },
      { href: '/messaging', label: 'Messagerie', icon: MessageSquare },
      { href: '/notifications', label: 'Notifications', icon: Bell },
      { href: '/documents', label: 'Documents', icon: FileText },
      { href: '/calendar', label: 'Calendrier', icon: CalendarIcon },
      { href: '/settings', label: 'Paramètres', icon: Settings }
    ];
  }

  return [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { href: '/settings', label: 'Paramètres', icon: Settings }
  ];
};

const NavItem = ({ item, active, onClick, hasNotification }) => (
  <div 
    className={cn(
      "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-150 group relative cursor-pointer",
      active
        ? "bg-blue-500 text-white shadow-lg"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    )}
    onClick={onClick}
  >
    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
    <span className="truncate">{item.label}</span>
    {hasNotification && (
      <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
      </span>
    )}
  </div>
);

const SimpleNavItem = ({ item, onNavigate, hasNotification }) => {
  return (
    <NavLink to={item.href} end={item.end} onClick={onNavigate}>
      {({ isActive }) => <NavItem item={item} active={isActive} hasNotification={hasNotification} />}
    </NavLink>
  );
};

// Composant Sidebar principal
const SidebarContent = ({ onNavigate }) => {
  const { user, profile, signOut } = useAuth();
  const [sidebarConfig, setSidebarConfig] = useState([]);
  const [badges, setBadges] = useState({ notifications: 0, requests: 0 });

  useEffect(() => {
    if (profile?.role) {
      setSidebarConfig(getSimpleSidebarConfig(profile.role));
    } else {
      setSidebarConfig(getSimpleSidebarConfig('particulier'));
    }
  }, [profile]);

  useEffect(() => {
    const loadCounts = async () => {
      if (!user) return;
      try {
        const { count: notifCount } = await supabase
          .from('notifications')
          .select('id', { count: 'exact' })
          .limit(0)
          .eq('user_id', user.id)
          .eq('is_read', false);

        const { count: reqCount } = await supabase
          .from('requests')
          .select('id', { count: 'exact' })
          .limit(0)
          .eq('user_id', user.id)
          .in('status', ['pending', 'nouvelle', 'Nouvelle', 'en cours', 'En cours']);

        setBadges({ notifications: notifCount || 0, requests: reqCount || 0 });
      } catch (e) {
        console.warn('SidebarSimple: count load failed', e);
      }
    };
    loadCounts();
  }, [user]);

  const handleSignOut = () => {
    signOut();
    if (onNavigate) onNavigate();
  };

  return (
    <div className="flex flex-col h-full bg-white text-gray-900 border-r">
      {/* Header */}
      <div className="flex items-center justify-center h-16 md:h-20 border-b px-4">
        <Link to="/" className="flex items-center space-x-2 group" onClick={onNavigate}>
          <img src={logoUrl} alt="Logo Teranga Foncier" className="h-8 md:h-12 w-auto" />
        </Link>
      </div>
      
      {/* Profile Section */}
      {profile && (
        <div className="p-3 md:p-4 text-center border-b">
          <Avatar className="mx-auto h-12 md:h-16 w-12 md:w-16 mb-2 border-2 border-blue-500">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-sm md:text-base">
              {profile.full_name ? profile.full_name.charAt(0) : 'U'}
            </AvatarFallback>
          </Avatar>
          <p className="font-semibold text-gray-900 text-sm md:text-base truncate">
            {profile.full_name || 'Utilisateur'}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user?.email}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 md:p-3 space-y-1 overflow-y-auto">
        {sidebarConfig.map((item, index) => {
          let hasNotification = false;
          if (item.href === '/notifications') hasNotification = badges.notifications > 0;
          if (item.href === '/my-requests') hasNotification = badges.requests > 0;
          return (
            <SimpleNavItem key={item.href || index} item={item} onNavigate={onNavigate} hasNotification={hasNotification} />
          );
        })}
      </nav>

      {/* Footer Actions */}
      {user && (
        <div className="p-2 md:p-3 mt-auto border-t space-y-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-start text-red-400 hover:bg-red-50 hover:text-red-500 text-xs md:text-sm" 
            onClick={handleSignOut}
          >
            <LogOut className="mr-3 h-4 w-4 flex-shrink-0" />
            Déconnexion
          </Button>
        </div>
      )}
    </div>
  );
};

// Sidebar Desktop
const DesktopSidebar = () => {
  return (
    <aside className="hidden md:flex w-64 lg:w-72 flex-col h-full">
      <SidebarContent />
    </aside>
  );
};

// Mobile Sidebar avec MobileDrawer
const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="ghost" size="sm" className="md:hidden p-2" onClick={() => setIsOpen(true)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Ouvrir le menu</span>
      </Button>
      
      <MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <SidebarContent onNavigate={handleNavigate} />
      </MobileDrawer>
    </>
  );
};

// Composant principal Sidebar
const SidebarResponsive = () => {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default SidebarResponsive;
export { MobileSidebar };
